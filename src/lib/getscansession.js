import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

// Encrypt
async function encrypt(payload, expiresIn) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn) // e.g. "30m"
    .sign(key);
}

// Decrypt
async function decrypt(token) {
  const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
  return payload;
}

// ✅ Create scan session after OTP verification
export async function createScanSession(email) {
  const token = await encrypt({ email }, "30m"); // expires in 30 minutes
  const cookieStore = await cookies();
  cookieStore.set({
    name: "scan_session",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 30, // 30 min
  });
}

// ✅ Get scan session (like getSession but separate)
export async function getScanSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("scan_session")?.value;
    if (!token) return null;
    return await decrypt(token);
  } catch (err) {
    return null;
  }
}

// ✅ Destroy scan session (on logout/expiry)
export async function logoutScan() {
  const cookieStore = await cookies();
  cookieStore.set("scan_session", "", { expires: new Date(0) });
}
