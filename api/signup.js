import { createHmac } from "node:crypto";

const SUCCESS_MESSAGE = "Thank you for joining FC 27 Meta Score. Hope you enjoy it.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respond(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(payload);
}

async function redisCommand(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) throw new Error("Signup storage request failed");
  const result = await response.json();
  if (!result || typeof result !== "object" || result.error || !Object.hasOwn(result, "result")) {
    throw new Error("Signup storage request failed");
  }
  return result.result;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { message: "Method not allowed." });
  }

  if (!req.headers?.["content-type"]?.toLowerCase().includes("application/json")) {
    return respond(res, 415, { message: "Please submit the signup form again." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return respond(res, 400, { message: "Please enter a valid name and email." });
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return respond(res, 400, { message: "Please enter a valid name and email." });
  }

  const keys = Object.keys(body);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (
    keys.some((key) => key !== "name" && key !== "email") ||
    !name ||
    name.length > 100 ||
    Array.from(name).some((character) => {
      const codePoint = character.codePointAt(0);
      return codePoint <= 0x1f || codePoint === 0x7f;
    }) ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return respond(res, 400, { message: "Please enter a valid name and email." });
  }

  const requiredEnvironment = [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "SIGNUP_HASH_SECRET",
  ];
  if (
    requiredEnvironment.some((key) => !process.env[key]) ||
    Buffer.byteLength(process.env.SIGNUP_HASH_SECRET) < 32
  ) {
    return respond(res, 503, { message: "Signup is temporarily unavailable. Please try again later." });
  }

  const emailHash = createHmac("sha256", process.env.SIGNUP_HASH_SECRET)
    .update(email.toLowerCase())
    .digest("hex");
  let reserved = false;

  try {
    const reservation = await redisCommand(["SET", `fc27:signup:${emailHash}`, "1", "NX"]);
    if (reservation === null) {
      return respond(res, 200, {
        duplicate: true,
        message: "You're already part of FC 27 Meta Score. Thanks for being here.",
      });
    }
    if (reservation !== "OK") throw new Error("Signup reservation failed");
    reserved = true;

    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "Welcome to FC 27 Meta Score",
        text: SUCCESS_MESSAGE,
      }),
    });
    if (!delivery.ok) throw new Error("Welcome email delivery failed");

    return respond(res, 200, { message: SUCCESS_MESSAGE });
  } catch {
    if (reserved) {
      try {
        await redisCommand(["DEL", `fc27:signup:${emailHash}`]);
      } catch {
        console.error("FC27 signup reservation cleanup failed.");
      }
    }
    return respond(res, 503, { message: "Signup is temporarily unavailable. Please try again later." });
  }
}
