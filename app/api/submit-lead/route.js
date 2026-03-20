import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  try {
    const body = await request.json();
    const { type, email, name, topic, message, source } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbError } = await supabase.from("Lead_labs").insert([
      { type, email, name: name || null, topic: topic || null, message: message || null, source },
    ]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Slack notification
    const slackWebhook = process.env.SLACK_WEBHOOK_LABS;
    if (slackWebhook) {
      const isContact = type === "contact";
      const slackBody = {
        text: isContact
          ? `:speech_balloon: *New contact form submission* on Renjoy Labs`
          : `:envelope: *New newsletter signup* on Renjoy Labs`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: isContact
                ? `:speech_balloon: *New contact form* — <https://labs.renjoy.com|labs.renjoy.com>`
                : `:envelope: *New newsletter signup* — <https://labs.renjoy.com|labs.renjoy.com>`,
            },
          },
          {
            type: "section",
            fields: [
              ...(name ? [{ type: "mrkdwn", text: `*Name:*\n${name}` }] : []),
              { type: "mrkdwn", text: `*Email:*\n${email}` },
              ...(topic ? [{ type: "mrkdwn", text: `*Topic:*\n${topic}` }] : []),
              { type: "mrkdwn", text: `*Source:*\n${source}` },
            ],
          },
          ...(message
            ? [
                {
                  type: "section",
                  text: { type: "mrkdwn", text: `*Message:*\n${message}` },
                },
              ]
            : []),
        ],
      };

      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackBody),
      });
    }

    // Welcome email for newsletter signups
    if (type === "newsletter") {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const welcomeRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Jacob Mueller <jacob@labs.renjoy.com>",
            reply_to: "jacob@renjoy.com",
            to: [email],
            subject: "You're in. Welcome to The Mining Report.",
            text: buildWelcomePlainText(name),
            html: buildWelcomeHTML(name),
            headers: {
              "List-Unsubscribe": `<mailto:unsubscribe@labs.renjoy.com?subject=Unsubscribe&body=${encodeURIComponent(email)}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          }),
        });
        if (!welcomeRes.ok) {
          const welcomeErr = await welcomeRes.text();
          console.error("Welcome email error:", welcomeRes.status, welcomeErr);
        }
      } else {
        console.error("Welcome email skipped: RESEND_API_KEY not set");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("submit-lead error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function buildWelcomePlainText(name) {
  const greeting = name ? `${name},` : "Hey,";
  return `${greeting}

You're on the list.

The Mining Report goes out whenever we publish something worth your time — essays on how AI is reshaping the vacation rental industry, and project writeups from the systems we've actually built at Renjoy.

No cadence, no filler. Just signal.

While you're here, start with the three essays in our Gold Rush series:

1. Stake Your Claim — https://labs.renjoy.com/essays/stake-your-claim
2. The Mulrooney Play — https://labs.renjoy.com/essays/the-mulrooney-play
3. The Sutter Trap — https://labs.renjoy.com/essays/the-sutter-trap

Good to have you.

— Jacob Mueller
CEO, Renjoy

──────────────────────────
Renjoy Labs · labs.renjoy.com
Colorado Springs · Buena Vista · Woodland Park
To unsubscribe, reply with "unsubscribe" in the subject line.`;
}

function buildWelcomeHTML(name) {
  const greeting = name ? `${name},` : "Hey,";
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#1e0f16;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">You're on the list. Here's where to start.&#8199;&#65279;&#847;</div>

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

            <!-- Welcome line -->
            <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;line-height:1.3;color:#e8e4df;margin:0 0 20px 0;">${greeting}<br>You're on the list.</p>

            <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 16px 0;">
              The Mining Report goes out whenever we publish something worth your time — essays on how AI is reshaping the vacation rental industry, and project writeups from the systems we've actually built at Renjoy.
            </p>

            <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:#b5b0a8;margin:0 0 32px 0;">
              No cadence, no filler. Just signal.
            </p>

            <!-- Divider -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
              <tr><td style="border-bottom:1px solid #3a2a30;">&nbsp;</td></tr>
            </table>

            <!-- Start here label -->
            <p style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;font-weight:600;color:#d4897a;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 20px 0;">Start here</p>

            <!-- Essay 1 -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #3a2a30;border-radius:10px;margin:0 0 12px 0;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#d4897a;margin:0 0 6px 0;">Essay 01 · Gold Rush Series</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#e8e4df;margin:0 0 4px 0;">Stake Your Claim</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:400;color:#9a958e;font-style:italic;margin:0 0 12px 0;">What the gold rushes actually teach us about AI</p>
                  <a href="https://labs.renjoy.com/essays/stake-your-claim" style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#d4897a;text-decoration:none;">Read the essay &rarr;</a>
                </td>
              </tr>
            </table>

            <!-- Essay 2 -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #3a2a30;border-radius:10px;margin:0 0 12px 0;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#d4897a;margin:0 0 6px 0;">Essay 02 · Gold Rush Series</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#e8e4df;margin:0 0 4px 0;">The Mulrooney Play</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:400;color:#9a958e;font-style:italic;margin:0 0 12px 0;">How the most successful gold rush operator built the real business</p>
                  <a href="https://labs.renjoy.com/essays/the-mulrooney-play" style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#d4897a;text-decoration:none;">Read the essay &rarr;</a>
                </td>
              </tr>
            </table>

            <!-- Essay 3 -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #3a2a30;border-radius:10px;margin:0 0 32px 0;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#d4897a;margin:0 0 6px 0;">Essay 03 · Gold Rush Series</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#e8e4df;margin:0 0 4px 0;">The Sutter Trap</p>
                  <p style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:400;color:#9a958e;font-style:italic;margin:0 0 12px 0;">Why the man who started it all ended up with nothing</p>
                  <a href="https://labs.renjoy.com/essays/the-sutter-trap" style="font-family:Figtree,Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#d4897a;text-decoration:none;">Read the essay &rarr;</a>
                </td>
              </tr>
            </table>

            <!-- Sign off -->
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
                    <a href="mailto:unsubscribe@labs.renjoy.com?subject=Unsubscribe" style="color:#6b6760;text-decoration:underline;">Unsubscribe</a>
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
