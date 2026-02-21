import { Router } from "express";
import { Knex } from "knex";
import { createUserController } from "../controllers/userController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export function userRoutes(db: Knex) {
  const router = Router();
  const ctrl = createUserController(db);


  router.use(requireAuth, requireAdmin);

  router.get("/", ctrl.list);
  router.get("/:id", ctrl.getById);
  router.post("/", ctrl.create);
  router.put("/:id", ctrl.update);
  router.delete("/:id", ctrl.remove);

  return router;
}
