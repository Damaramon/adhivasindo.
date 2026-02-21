import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { searchController } from "../controllers/searchController.js";

export function searchRoutes() {
  const router = Router();

  router.use(requireAuth);
  router.get("/name/:nama", searchController.byName);
  router.get("/nim/:nim", searchController.byNim);
  router.get("/ymd/:ymd", searchController.byYmd);

  return router;
}
