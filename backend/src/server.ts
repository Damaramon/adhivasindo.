import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import { createDb } from "./config/db.js";
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { searchRoutes } from "./routes/searchRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const db = createDb();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin, credentials: false }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes(db));
app.use("/api/users", userRoutes(db));
app.use("/api/search", searchRoutes());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
