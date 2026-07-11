import bcrypt from "bcryptjs";

const plain = process.argv[2];
if (!plain) {
  console.error("Usage: npx ts-node scripts/hash-password.ts <password>");
  process.exit(1);
}
const hash = await bcrypt.hash(plain, 10);
console.log("\nBcrypt hash (paste into .env.local as ADMIN_PASSWORD_HASH):\n");
console.log(hash);