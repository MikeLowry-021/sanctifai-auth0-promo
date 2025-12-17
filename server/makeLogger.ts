import { config } from "./config";

export async function logToMake(payload: any) {
  if (!config.makeWebhookUrl) {
    return;
  }

  try {
    await fetch(config.makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("✅ Logged to Make.com");
  } catch (err) {
    console.error("❌ Make.com webhook failed:", err);
  }
}
