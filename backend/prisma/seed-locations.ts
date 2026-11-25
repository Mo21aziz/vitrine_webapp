/**
 * Adds the 6 Di Napoli restaurants (name, address, map position). Existing ones are never modified.
 *
 *   npm run seed:locations                       (uses DATABASE_URL from .env)
 */
import "dotenv/config";
import { prisma } from "../src/config/prisma.js";
import { seedLocations } from "./seed-data/locations.js";

seedLocations()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
