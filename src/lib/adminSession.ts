// Admin session cookie. The cookie holds an HMAC of a fixed label keyed by
// ADMIN_TOKEN, so it can't be forged without the token and rotating the token
// logs every session out. Web Crypto only, so it runs in middleware too.

export const ADMIN_COOKIE = "fz_admin";

async function hmacHex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function adminSessionValue(token: string) {
  return hmacHex(token, "fozzies-admin-session-v1");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidAdminSession(value: string | undefined | null) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || !value) return false;
  return safeEqual(value, await adminSessionValue(token));
}
