import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { Knex } from "knex";
import { HttpError } from "../utils/httpError.js";
import { isEmail, requireString } from "../utils/validators.js";
import { createUser, deleteUser, findUserById, listUsers, updateUser } from "../models/userModel.js";

export function createUserController(db: Knex) {
  return {
    list: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await listUsers(db);
        return res.json({ success: true, data: users });
      } catch (err) {
        return next(err);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) throw new HttpError(400, "Invalid id");
        const user = await findUserById(db, id);
        if (!user) throw new HttpError(404, "User not found");
        const safe = { id: user.id, name: user.name, email: user.email, role: user.role, is_active: user.is_active, created_at: user.created_at, updated_at: user.updated_at };
        return res.json({ success: true, data: safe });
      } catch (err) {
        return next(err);
      }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const name = requireString(req.body?.name, "name");
        const email = requireString(req.body?.email, "email");
        const password = requireString(req.body?.password, "password");
        const role = typeof req.body?.role === "string" ? req.body.role : "user";
        const is_active = typeof req.body?.is_active === "boolean" ? req.body.is_active : true;

        if (!isEmail(email)) throw new HttpError(400, "Invalid email format");
        if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters");

        const hash = await bcrypt.hash(password, 12);
        const id = await createUser(db, { name, email, password_hash: hash, role, is_active });

        return res.status(201).json({ success: true, message: "User created", data: { id } });
      } catch (err: any) {
       
        const msg = String(err?.message ?? "");
        if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
          return next(new HttpError(409, "Email already exists"));
        }
        return next(err);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) throw new HttpError(400, "Invalid id");

        const patch: any = {};
        if (typeof req.body?.name === "string" && req.body.name.trim()) patch.name = req.body.name.trim();
        if (typeof req.body?.email === "string" && req.body.email.trim()) {
          if (!isEmail(req.body.email)) throw new HttpError(400, "Invalid email format");
          patch.email = req.body.email.trim();
        }
        if (typeof req.body?.role === "string" && req.body.role.trim()) patch.role = req.body.role.trim();
        if (typeof req.body?.is_active === "boolean") patch.is_active = req.body.is_active;

        if (typeof req.body?.password === "string" && req.body.password.length) {
          if (req.body.password.length < 8) throw new HttpError(400, "Password must be at least 8 characters");
          patch.password_hash = await bcrypt.hash(req.body.password, 12);
        }

        const existing = await findUserById(db, id);
        if (!existing) throw new HttpError(404, "User not found");

        await updateUser(db, id, patch);
        return res.json({ success: true, message: "User updated" });
      } catch (err: any) {
        const msg = String(err?.message ?? "");
        if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
          return next(new HttpError(409, "Email already exists"));
        }
        return next(err);
      }
    },

    remove: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) throw new HttpError(400, "Invalid id");

        const existing = await findUserById(db, id);
        if (!existing) throw new HttpError(404, "User not found");

        await deleteUser(db, id);
        return res.json({ success: true, message: "User deleted" });
      } catch (err) {
        return next(err);
      }
    }
  };
}
