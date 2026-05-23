const COOKIE_NAME = "its_ala_client_session";

function getSecret() {
  return process.env.CLIENT_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "";
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

export function getClientCookieName() {
  return COOKIE_NAME;
}

export function isClientAuthConfigured() {
  return Boolean(getSecret());
}

export function shouldBypassClientAuth() {
  return process.env.NODE_ENV !== "production" && !getSecret();
}

export async function createClientSessionValue(workspaceId: string, slug: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 14;
  const payload = JSON.stringify({ workspaceId, slug, expiresAt });
  const encoded = base64UrlEncode(payload);
  const signature = await signPayload(encoded, getSecret());
  return `${encoded}.${signature}`;
}

export async function readClientSessionValue(value: string | undefined) {
  if (!value || !getSecret()) {
    return null;
  }
  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return null;
  }
  const expected = await signPayload(payload, getSecret());
  if (expected !== signature) {
    return null;
  }
  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as {
      workspaceId: string;
      slug: string;
      expiresAt: number;
    };
    if (!decoded.workspaceId || !decoded.slug || decoded.expiresAt < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
