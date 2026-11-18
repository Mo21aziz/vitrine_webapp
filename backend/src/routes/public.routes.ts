import { Router } from "express";
import { articleController } from "../controllers/article.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { avisController } from "../controllers/avis.controller.js";
import { menuController } from "../controllers/menu.controller.js";
import { pointDeVenteController } from "../controllers/pointDeVente.controller.js";
import { reclamationController } from "../controllers/reclamation.controller.js";

export const publicRoutes = Router();

publicRoutes.get("/articles", articleController.list);
publicRoutes.get("/articles/:id", articleController.get);
publicRoutes.get("/articles/:id/avis", avisController.listPublic);
publicRoutes.post("/articles/:id/avis", avisController.create);
publicRoutes.get("/menus", menuController.list);
publicRoutes.get("/menus/:id", menuController.get);
publicRoutes.get("/points-de-vente", pointDeVenteController.list);
publicRoutes.post("/reclamations", reclamationController.create);
publicRoutes.post("/auth/login", authController.login);
