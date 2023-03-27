import crypto from "crypto";

export function generateObjectIdFromString(str) {
  const hash = crypto.createHash("md5").update(str).digest("hex");
  return hash.slice(0, 24);
}