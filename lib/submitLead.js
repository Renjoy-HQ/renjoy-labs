export async function submitLead({ type, email, name, topic, message, source }) {
  try {
    await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, email, name, topic, message, source }),
    });
  } catch (err) {
    console.error("submitLead error:", err);
  }
}
