import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { adminRoutes } from "./admin.routes.js";
import { publicRoutes } from "./public.routes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok", database: "ok" });
});

apiRoutes.use("/", publicRoutes);
apiRoutes.use("/admin", adminRoutes);
