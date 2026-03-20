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

    // Validate common required fields
    if (!content_type || !content_title || !content_url) {
      return NextResponse.json({ error: "Missing required fields: content_type, content_title, content_url" }, { status: 400 });
    }

    // Validate type-specific fields
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

    const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
    if (!ghlWebhookUrl) {
      return NextResponse.json({ error: "GHL_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const ghlResponse = await fetch(ghlWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!ghlResponse.ok) {
      console.error("GHL webhook error:", ghlResponse.status, await ghlResponse.text());
      return NextResponse.json({ error: "GHL webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("dispatch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
