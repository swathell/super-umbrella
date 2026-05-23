const COOKIE_NAME = "its_ala_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function getPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return new TextDecoder().decode(base64ToBytes(padded));
}

async function signPayload(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
  return bytesToBase64(signature).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function isAdminAuthConfigured() {
  return Boolean(getPassword() && getSecret());
}

export function shouldBypassAdminAuth() {
  return process.env.NODE_ENV !== "production" && !isAdminAuthConfigured();
}

export function verifyAdminPassword(password: string) {
  const expected = getPassword();
  if (!expected) {
    return false;
  }
  return password === expected;
}

export async function createAdminSessionValue() {
  const secret = getSecret();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  const payload = JSON.stringify({ role: "admin", expiresAt });
  const encodedPayload = base64UrlEncode(payload);
  const signature = await signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function readAdminSessionValue(value: string | undefined) {
  if (!value || !getSecret()) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await signPayload(encodedPayload, getSecret());

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as {
      role: string;
      expiresAt: number;
    };

    if (payload.role !== "admin" || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
