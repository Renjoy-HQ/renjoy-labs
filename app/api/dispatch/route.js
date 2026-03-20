import { NextResponse } from "next/server";

export async function POST(request) {
  // Auth
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || token !== process.env.DISPATCH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content_type, content_title, content_url } = body;

    if (!content_type || !content_title || !content_url) {
      return NextResponse.json({ error: "Missing required fields: content_type, content_title, content_url" }, { status: 400 });
    }

    if (content_type === "essay") {
      if (!body.pull_quote || !body.content_connector || !body.read_time) {
        return NextResponse.json({ error: "Missing essay fields: pull_quote, content_connector, read_time" }, { status: 400 });
      }
    } else if (content_type === "project") {
      if (!body.content_how || !body.content_result || !body.tech_stack) {
        return NextResponse.json({ error: "Missing project fields: content_how, content_result, tech_stack" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid content_type. Must be 'essay' or 'project'" }, { status: 400 });
    }

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    const fromEmail = process.env.GHL_FROM_EMAIL;
    const fromName = process.env.GHL_FROM_NAME || "Jacob Mueller";

    if (!apiKey || !locationId || !fromEmail) {
      return NextResponse.json({ error: "GHL env vars not configured" }, { status: 500 });
    }

    // Fetch contact directly by ID for testing
    const testContactRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/l0fAH3V1yZWStrMlBSUn`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
        },
      }
    );

    if (!testContactRes.ok) {
      const err = await testContactRes.text();
      return NextResponse.json({ error: "Failed to fetch test contact", detail: err }, { status: 502 });
    }

    const testContactData = await testContactRes.json();
    const contacts = [testContactData.contact].filter(Boolean);
    const contacts = allContacts.filter(c => Array.isArray(c.tags) && c.tags.includes("mining-report"));

    if (contacts.length === 0) {
      return NextResponse.json({ error: "No subscribers found with tag 'mining-report'" }, { status: 404 });
    }

    const subject = `New from The Mining Report: ${content_type === "essay" ? "📄" : "🔧"} ${content_title}`;
    const html = buildEmailHTML(body);

    // Send to each contact
    const results = await Promise.allSettled(
      contacts.map(contact =>
        sendEmail({ contact, subject, html, body, fromEmail, fromName, apiKey })
      )
    );

    const sent = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    const debug = results.map(r => r.status === "fulfilled" ? r.value : r.reason?.message);

    return NextResponse.json({ success: true, sent, failed, total: contacts.length, debug });
  } catch (err) {
    console.error("dispatch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function sendEmail({ contact, subject, html, body, fromEmail, fromName, apiKey }) {
  const res = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: JSON.stringify({
      type: "Email",
      contactId: contact.id,
      subject,
      html,
      emailFrom: fromEmail,
      emailFromName: fromName,
      emailTo: contact.email,
    }),
  });

  const responseText = await res.text();
  if (!res.ok) {
    throw new Error(`Failed for ${contact.email}: ${responseText}`);
  }
  try {
    return JSON.parse(responseText);
  } catch {
    return { raw: responseText };
  }
}

function esc(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildEmailHTML(b) {
  const isEssay = b.content_type === "essay";
  const preheader = esc(b.content_preheader);
  const category = esc(b.content_category);
  const title = esc(b.content_title);
  const subtitle = esc(b.content_subtitle);
  const summary = esc(b.content_summary);
  const url = esc(b.content_url);

  const cardFooter = isEssay
    ? `<span style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:400;color:#6b6760;">&mdash; ${esc(b.read_time)} min read</span>`
    : `<span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;font-weight:400;color:#6b6760;">${esc(b.tech_stack)}</span>`;

  const bodyContent = isEssay
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
        <tr>
          <td width="3" style="background-color:#d4897a;border-radius:2px;">&nbsp;</td>
          <td style="padding:16px 0 16px 20px;">
            <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:16px;font-weight:300;font-style:italic;line-height:1.7;color:#e8e4df;margin:0;">${esc(b.pull_quote)}</p>
          </td>
        </tr>
      </table>
      <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 32px 0;">${esc(b.content_connector)}</p>
    `
    : `
      <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:17px;font-weight:600;line-height:1.5;color:#e8e4df;margin:0 0 10px 0;">What it does:</p>
      <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 24px 0;">${esc(b.content_how)}</p>
      <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:17px;font-weight:600;line-height:1.5;color:#e8e4df;margin:0 0 10px 0;">What changed:</p>
      <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 24px 0;">${esc(b.content_result)}</p>
      <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 32px 0;">We documented the full architecture, logic, and lessons learned.</p>
    `;

  const ctaLabel = isEssay ? "Read the Full Essay &rarr;" : "See the Full Project Writeup &rarr;";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#1e0f16;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&#8199;&#65279;&#847;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1e0f16;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding:0 0 28px 0;">
            <span style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:18px;font-weight:900;color:#e8e4df;letter-spacing:0.5px;">renjoy</span>&nbsp;&nbsp;<span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;font-weight:600;color:#d4897a;letter-spacing:2.5px;text-transform:uppercase;border:1px solid #3a2a30;border-radius:6px;padding:5px 10px;display:inline-block;line-height:1;">LABS</span>
            <br>
            <span style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:12px;font-weight:300;color:#6b6760;letter-spacing:0.5px;font-style:italic;">The Mining Report</span>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 0 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-bottom:1px solid #3a2a30;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td>

            <!-- Card -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #3a2a30;border-radius:12px;overflow:hidden;margin:0 0 28px 0;">
              <tr>
                <td style="padding:28px 28px 24px 28px;">

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
                    <tr>
                      <td><span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#d4897a;">${category}</span></td>
                      <td align="right"><span style="font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#6b6760;border:1px solid #3a2a30;border-radius:20px;padding:4px 12px;display:inline-block;line-height:1;">&#x25CF;&nbsp;<span style="color:#4ade80;">PUBLISHED</span></span></td>
                    </tr>
                  </table>

                  <h1 style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;line-height:1.3;color:#e8e4df;margin:0 0 8px 0;">${title}</h1>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:14px;font-weight:400;line-height:1.6;color:#9a958e;font-style:italic;margin:0 0 16px 0;">${subtitle}</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:14px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 20px 0;">${summary}</p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td style="border-top:1px solid #d4897a;padding-top:12px;">${cardFooter}</td></tr>
                  </table>

                </td>
              </tr>
            </table>

            ${bodyContent}

            <!-- CTA -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 36px 0;">
              <tr>
                <td align="center" style="border-radius:8px;background:linear-gradient(135deg,#e05a3a,#c94a30);">
                  <a href="${url}" style="display:inline-block;padding:14px 36px;font-family:Figtree,Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;border-radius:8px;">${ctaLabel}</a>
                </td>
              </tr>
            </table>

            <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;line-height:1.6;color:#e8e4df;margin:0 0 4px 0;">&mdash; Jacob Mueller</p>
            <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:300;line-height:1.5;color:#6b6760;margin:0;">CEO, Renjoy</p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:40px 0 0 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-bottom:1px solid #3a2a30;">&nbsp;</td></tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:24px;">
              <tr>
                <td align="center">
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:16px;color:#d4897a;margin:0 0 10px 0;">&#x26CF;</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:11px;font-weight:400;color:#6b6760;margin:0 0 6px 0;line-height:1.5;letter-spacing:0.3px;">Colorado Springs &middot; Buena Vista &middot; Woodland Park</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:11px;font-weight:300;font-style:italic;color:#4a4640;margin:0 0 14px 0;">No spam. We respect your inbox like we respect the claim.</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:11px;font-weight:400;color:#4a4640;margin:0;">
                    <a href="{{unsubscribe_link}}" style="color:#6b6760;text-decoration:underline;">Unsubscribe</a>
                    &nbsp;&middot;&nbsp;
                    <a href="https://labs.renjoy.com" style="color:#6b6760;text-decoration:underline;">Renjoy Labs</a>
                    &nbsp;&middot;&nbsp;
                    <a href="https://renjoy.com" style="color:#6b6760;text-decoration:underline;">Renjoy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}
