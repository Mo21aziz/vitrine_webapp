import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.get("/api/db-test", async (_req, res) => {
  const [rows] = await pool.query("SELECT 1 + 1 AS result");
  res.json(rows);
});
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});