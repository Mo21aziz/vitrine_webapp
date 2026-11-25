/**
 * Demo content for presentations: the real Di Napoli menu (menus, dishes, prices, ingredients),
 * a few photos and published customer reviews.
 *
 * Safe to run several times and never destructive: menus, dishes and reviews that already exist
 * (same name) are left exactly as they are — only what is missing is added.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../../src/config/prisma.js";

const IMAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "demo-images");

/** Fixed ids so re-running the seed reuses the same stored photo instead of duplicating it */
const IMAGES = {
  pizzas: { id: "d1a90001-0000-4000-8000-000000000001.png", file: "menu-pizzas.png", mimeType: "image/png" },
  burger: { id: "d1a90001-0000-4000-8000-000000000002.png", file: "menu-burger.png", mimeType: "image/png" },
} as const;

type ImageKey = keyof typeof IMAGES;

interface DemoArticle {
  nom: string;
  prix: number; // TND
  composition: string;
  remise?: number;
  image?: ImageKey;
}

interface DemoMenu {
  nom: string;
  description: string;
  image?: ImageKey;
  articles: DemoArticle[];
}

const FRITES = "laitue, tomate, oignon et frites";

const MENUS: DemoMenu[] = [
  {
    nom: "Pizzas",
    description: "Pizza en plaque. Prix à la part (1/8) — aussi en 1/4, 1/2 ou plaque entière.",
    image: "pizzas",
    articles: [
      { nom: "Thon", prix: 10.8, composition: "Sauce tomate, mozzarella, thon, olives, oignons" },
      { nom: "Fruits de mer", prix: 15, composition: "Sauce tomate, mozzarella, fruits de mer, ail, persil" },
      { nom: "Pepperoni", prix: 10.8, composition: "Sauce tomate, mozzarella, pepperoni" },
      { nom: "Viande hachée", prix: 10.8, composition: "Sauce tomate, mozzarella, viande hachée, poivrons, oignons" },
      { nom: "4 Fromages", prix: 12, composition: "Crème, mozzarella, gouda, cheddar, parmesan" },
      { nom: "Poulet", prix: 10.8, composition: "Sauce tomate, mozzarella, poulet, champignons, poivrons" },
      {
        nom: "Crevettes",
        prix: 13.8,
        composition: "Crème, mozzarella, crevettes, pesto, roquette, tomates cerises, noix",
        image: "pizzas",
      },
      { nom: "Végétarienne", prix: 10, composition: "Sauce tomate, mozzarella, poivrons, champignons, olives, oignons" },
    ],
  },
  {
    nom: "Ciabatta",
    description: "Pain ciabatta croustillant, garni et servi avec des frites.",
    articles: [
      {
        nom: "Fried Chicken",
        prix: 12.4,
        composition: `Poulet crispy, sauce cheddar ou gouda, sauce tartare, sauce aïoli, harissa, ${FRITES}`,
      },
      {
        nom: "Cordon Bleu",
        prix: 14.4,
        composition: `Cordon bleu fait maison, sauce cheddar ou gouda, sauce tartare, sauce aïoli, harissa, ${FRITES}`,
      },
      {
        nom: "Spicy",
        prix: 11.66,
        composition: `Poulet spicy, sauce cheddar, pesto, sauce tartare, sauce aïoli, harissa, ${FRITES}`,
      },
      {
        nom: "Steak Cheese",
        prix: 14.4,
        composition: `Viande hachée, sauce cheddar ou gouda, sauce tartare, sauce aïoli, harissa, ${FRITES}`,
      },
    ],
  },
  {
    nom: "Burger",
    description: "Pain brioché toasté, fromage raclette et frites.",
    image: "burger",
    articles: [
      {
        nom: "Cheesy Crispy",
        prix: 12.4,
        composition: "Poulet crispy, fromage raclette, sauce tartare, ketchup, laitue, tomate et frites",
        image: "burger",
      },
      {
        nom: "Grill Chicken Cheesy",
        prix: 12.4,
        composition: "Poulet grillé, fromage raclette, sauce aïoli, ketchup, laitue, oignon caramélisé, tomate et frites",
      },
      {
        nom: "Steak Cheese",
        prix: 14.9,
        composition: "Steak, fromage raclette, sauce burger, barbecue, oignon caramélisé, laitue, tomate et frites",
      },
      {
        nom: "California",
        prix: 16,
        composition: "Steak, œuf, fromage raclette, sauce burger, barbecue, oignon caramélisé, laitue, tomate et frites",
      },
      {
        nom: "New York",
        prix: 17.4,
        composition:
          "Steak, bacon, fromage raclette, sauce burger, barbecue, oignon caramélisé, laitue, tomate et frites",
      },
      {
        nom: "Combo",
        prix: 18.4,
        composition:
          "Steak, suprême de poulet, fromage raclette, sauce burger, barbecue, oignon caramélisé, laitue, tomate et frites",
      },
      {
        nom: "Crunchy Shrimp",
        prix: 14.8,
        composition: "Crevettes panées, sauce aïoli, pesto, laitue, tomate et frites",
      },
    ],
  },
  {
    nom: "Club Sandwich",
    description: "Le club généreux, servi avec des frites.",
    articles: [
      {
        nom: "Foie",
        prix: 13.8,
        composition: "Foie, sauce aïoli, harissa, laitue, tomate, poivrons et oignon caramélisé, persil et frites",
      },
      {
        nom: "Chich Taouk",
        prix: 11.4,
        composition: "Chich taouk, sauce aïoli, harissa, persil, laitue, tomate, oignon et frites",
      },
      {
        nom: "Oriental (kebab)",
        prix: 13.8,
        composition: "Kebab, sauce aïoli, harissa, aubergine, courgettes, laitue, tomate et frites",
      },
      {
        nom: "Merguez",
        prix: 12.4,
        composition: "Merguez, œuf, sauce aïoli, harissa, aubergine, citrouille, poivrons, persil, oignon et frites",
      },
      {
        nom: "Crevettes Panées",
        prix: 14.8,
        composition: "Crevettes panées, sauce tartare, pesto, harissa, laitue, tomate et frites",
      },
    ],
  },
  {
    nom: "Snacks",
    description: "À partager… ou pas.",
    articles: [
      { nom: "Wings 5 pièces", prix: 9.5, composition: "5 ailes de poulet marinées, sauce au choix" },
      { nom: "Wings 9 pièces", prix: 16.4, composition: "9 ailes de poulet marinées, sauce au choix" },
      { nom: "Wings 12 pièces", prix: 21.4, composition: "12 ailes de poulet marinées, sauce au choix" },
      { nom: "Crispy 5 pièces", prix: 9.8, composition: "5 tenders de poulet croustillants, sauce au choix" },
      { nom: "Crispy 9 pièces", prix: 17.4, composition: "9 tenders de poulet croustillants, sauce au choix" },
      { nom: "Crispy 12 pièces", prix: 22.8, composition: "12 tenders de poulet croustillants, sauce au choix" },
      { nom: "Crevettes 9 pièces", prix: 18.4, composition: "9 crevettes panées, sauce au choix" },
    ],
  },
  {
    nom: "Suppléments",
    description: "Pour personnaliser votre plat.",
    articles: [
      { nom: "Sauce Cheddar", prix: 2.5, composition: "Supplément sauce cheddar" },
      { nom: "Fromage Gouda", prix: 2.5, composition: "Supplément gouda" },
      { nom: "Fromage Raclette", prix: 2.5, composition: "Supplément raclette" },
      { nom: "Fromage Cheddar", prix: 2.5, composition: "Supplément cheddar" },
      { nom: "Steak", prix: 5, composition: "Supplément steak" },
      { nom: "Œuf", prix: 1.5, composition: "Supplément œuf" },
      { nom: "Bacon", prix: 3, composition: "Supplément bacon" },
    ],
  },
];

interface DemoAvis {
  menu: string;
  article: string;
  nom: string;
  note: number;
  commentaire: string;
  /** how many days ago the review was left */
  daysAgo: number;
}

const AVIS: DemoAvis[] = [
  {
    menu: "Pizzas",
    article: "Crevettes",
    nom: "Yasmine B.",
    note: 5,
    commentaire: "La pizza crevettes pesto est une tuerie ! Pâte légère, bien garnie, on sent que tout est frais.",
    daysAgo: 1,
  },
  {
    menu: "Burger",
    article: "Cheesy Crispy",
    nom: "Mehdi T.",
    note: 5,
    commentaire: "Poulet bien croustillant, raclette fondante et frites maison. Mon burger préféré à Tunis.",
    daysAgo: 2,
  },
  {
    menu: "Club Sandwich",
    article: "Chich Taouk",
    nom: "Sarra K.",
    note: 5,
    commentaire: "Copieux et plein de goût, la sauce aïoli maison fait toute la différence. Rapport qualité-prix top.",
    daysAgo: 3,
  },
  {
    menu: "Burger",
    article: "California",
    nom: "Amine H.",
    note: 4,
    commentaire: "Très bon burger avec l'œuf et l'oignon caramélisé. Service rapide et équipe souriante.",
    daysAgo: 4,
  },
  {
    menu: "Pizzas",
    article: "4 Fromages",
    nom: "Ines M.",
    note: 5,
    commentaire: "Généreuse en fromage, cuisson parfaite. On prend toujours une demi-plaque pour toute la famille.",
    daysAgo: 5,
  },
  {
    menu: "Snacks",
    article: "Wings 9 pièces",
    nom: "Karim B.",
    note: 5,
    commentaire: "Les wings sont bien marinées et croustillantes. Parfait pour regarder le match entre amis !",
    daysAgo: 7,
  },
  {
    menu: "Burger",
    article: "Combo",
    nom: "Omar S.",
    note: 4,
    commentaire: "Steak et poulet dans le même burger, énorme ! Un peu d'attente le vendredi soir mais ça valait le coup.",
    daysAgo: 8,
  },
  {
    menu: "Ciabatta",
    article: "Fried Chicken",
    nom: "Nour J.",
    note: 5,
    commentaire: "La ciabatta est croustillante et le poulet crispy délicieux. Je recommande avec la sauce gouda.",
    daysAgo: 10,
  },
  {
    menu: "Pizzas",
    article: "Thon",
    nom: "Rania L.",
    note: 4,
    commentaire: "Très bonne pizza au thon, bien garnie. Le cadre à la Corniche est super agréable en soirée.",
    daysAgo: 12,
  },
  {
    menu: "Snacks",
    article: "Crispy 9 pièces",
    nom: "Skander D.",
    note: 5,
    commentaire: "Tenders bien dorés et tendres à l'intérieur. Les enfants adorent.",
    daysAgo: 14,
  },
  {
    menu: "Burger",
    article: "New York",
    nom: "Mariem A.",
    note: 5,
    commentaire: "Le bacon avec la sauce barbecue, un régal. Le meilleur burger que j'ai mangé cette année.",
    daysAgo: 16,
  },
  {
    menu: "Pizzas",
    article: "Fruits de mer",
    nom: "Youssef G.",
    note: 4,
    commentaire: "Beaucoup de fruits de mer et une pâte bien cuite. Une adresse à retenir à Bizerte.",
    daysAgo: 19,
  },
];

async function ensureImage(key: ImageKey) {
  const img = IMAGES[key];
  const exists = await prisma.image.findUnique({ where: { id: img.id }, select: { id: true } });
  if (!exists) {
    const data = readFileSync(join(IMAGES_DIR, img.file));
    await prisma.image.create({ data: { id: img.id, mimeType: img.mimeType, size: data.length, data } });
  }
  return `/uploads/${img.id}`;
}

export async function seedDemo() {
  let createdMenus = 0;
  let createdArticles = 0;
  let createdAvis = 0;

  for (const m of MENUS) {
    let menu = await prisma.menu.findUnique({ where: { nom: m.nom } });
    if (!menu) {
      menu = await prisma.menu.create({
        data: { nom: m.nom, description: m.description, imageUrl: m.image ? await ensureImage(m.image) : null },
      });
      createdMenus++;
    } else if (!menu.imageUrl && m.image) {
      // existing menu without a photo: give it the demo one (nothing else is touched)
      menu = await prisma.menu.update({ where: { id: menu.id }, data: { imageUrl: await ensureImage(m.image) } });
    }

    for (const a of m.articles) {
      // same name can exist in two menus (e.g. "Steak Cheese" ciabatta and burger)
      const exists = await prisma.article.findFirst({ where: { nom: a.nom, menuId: menu.id }, select: { id: true } });
      if (exists) continue;
      await prisma.article.create({
        data: {
          nom: a.nom,
          prix: a.prix,
          composition: a.composition,
          remise: a.remise ?? 0,
          menuId: menu.id,
          imageUrl: a.image ? await ensureImage(a.image) : null,
        },
      });
      createdArticles++;
    }
  }

  for (const r of AVIS) {
    const article = await prisma.article.findFirst({
      where: { nom: r.article, menu: { nom: r.menu } },
      select: { id: true },
    });
    if (!article) continue;
    const exists = await prisma.avis.findFirst({
      where: { nom: r.nom, commentaire: r.commentaire },
      select: { id: true },
    });
    if (exists) continue;
    await prisma.avis.create({
      data: {
        articleId: article.id,
        nom: r.nom,
        note: r.note,
        commentaire: r.commentaire,
        publie: true,
        createdAt: new Date(Date.now() - r.daysAgo * 24 * 60 * 60 * 1000),
      },
    });
    createdAvis++;
  }

  console.log(`  ${createdMenus} menus, ${createdArticles} articles, ${createdAvis} avis added`);
}
