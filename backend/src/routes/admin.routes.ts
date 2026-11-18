import { Router } from "express";
import { articleController } from "../controllers/article.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { avisController } from "../controllers/avis.controller.js";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { geocodeController } from "../controllers/geocode.controller.js";
import { menuController } from "../controllers/menu.controller.js";
import { pointDeVenteController } from "../controllers/pointDeVente.controller.js";
import { reclamationController } from "../controllers/reclamation.controller.js";
import { uploadController } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth);

adminRoutes.post("/uploads", imageUpload, uploadController.image);

adminRoutes.get("/me", authController.me);
adminRoutes.get("/stats", dashboardController.stats);

adminRoutes.get("/reclamations", reclamationController.list);
adminRoutes.patch("/reclamations/:id", reclamationController.updateStatut);

adminRoutes.get("/avis", avisController.list);
adminRoutes.patch("/avis/:id", avisController.update);
adminRoutes.delete("/avis/:id", avisController.remove);

adminRoutes.post("/articles", articleController.create);
adminRoutes.put("/articles/:id", articleController.update);
adminRoutes.delete("/articles/:id", articleController.remove);

adminRoutes.post("/menus", menuController.create);
adminRoutes.put("/menus/:id", menuController.update);
adminRoutes.delete("/menus/:id", menuController.remove);

adminRoutes.get("/geocode/search", geocodeController.search);
adminRoutes.get("/geocode/reverse", geocodeController.reverse);

adminRoutes.post("/points-de-vente", pointDeVenteController.create);
adminRoutes.put("/points-de-vente/:id", pointDeVenteController.update);
adminRoutes.delete("/points-de-vente/:id", pointDeVenteController.remove);
