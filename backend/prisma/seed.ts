import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";
import { seedDemo } from "./seed-data/demo.js";
import { seedLocations } from "./seed-data/locations.js";

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env");
  }

  // Creates the admin, or resets its password to the one in .env
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`Admin "${username}" ready`);

  // Demo content (6 restaurants, menus, dishes, reviews) only when explicitly asked,
  // so it never comes back in production after the admin deletes it.
  if (process.env.SEED_DEMO !== "true") return;

  console.log("SEED_DEMO=true: adding demo content");
  await seedLocations();
  await seedDemo();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
