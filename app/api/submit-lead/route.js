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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("submit-lead error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
