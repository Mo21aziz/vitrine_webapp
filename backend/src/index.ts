import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { uploadController } from "./controllers/upload.controller.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { apiRoutes } from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: "100kb" }));

app.use("/api", apiRoutes);

// Photos uploaded from the admin (stored in the database)
app.get("/uploads/:file", uploadController.serve);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API running on port ${env.port} — allowed origins: ${env.corsOrigins.join(", ")}`);
});
