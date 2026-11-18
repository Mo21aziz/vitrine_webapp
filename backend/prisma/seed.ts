import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

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

  // Demo content (restaurants, a "Pizzas" menu, 2 dishes) only when explicitly asked,
  // so it never comes back in production after the admin deletes it.
  if (process.env.SEED_DEMO !== "true") return;

  for (const nom of ["Di Napoli Centre-ville", "Di Napoli La Marsa"]) {
    await prisma.pointDeVente.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }

  const pizzas = await prisma.menu.upsert({
    where: { nom: "Pizzas" },
    update: {},
    create: { nom: "Pizzas", description: "Pâte maturée, cuisson au four à bois." },
  });

  if ((await prisma.article.count()) === 0) {
    await prisma.article.createMany({
      data: [
        { nom: "Margherita", prix: 12.5, composition: "Tomate, mozzarella, basilic", remise: 0, menuId: pizzas.id },
        { nom: "Diavola", prix: 15, composition: "Tomate, mozzarella, salami piquant", remise: 10, menuId: pizzas.id },
      ],
    });
  }

  // Articles created before menus existed go into "Pizzas"
  await prisma.article.updateMany({ where: { menuId: null }, data: { menuId: pizzas.id } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());