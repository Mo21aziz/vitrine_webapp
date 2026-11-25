/**
 * Fills the database for a demo: the 6 restaurants, menus, dishes with photos and customer reviews.
 * Only adds what is missing — never modifies or deletes existing data.
 *
 *   npm run seed:demo                            (uses DATABASE_URL from .env)
 */
import "dotenv/config";
import { prisma } from "../src/config/prisma.js";
import { seedDemo } from "./seed-data/demo.js";
import { seedLocations } from "./seed-data/locations.js";

async function main() {
  console.log("Restaurants");
  await seedLocations();
  console.log("Menus, articles, avis");
  await seedDemo();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
