import { Router } from "express";
import { Knex } from "knex";
import { createAuthController } from "../controllers/authController.js";

export function authRoutes(db: Knex) {
  const router = Router();
  const ctrl = createAuthController(db);

  router.post("/login", ctrl.login);

  return router;
}
