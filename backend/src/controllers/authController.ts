import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import { Knex } from "knex";
import { HttpError } from "../utils/httpError.js";
import { isEmail, requireString } from "../utils/validators.js";
import { findUserByEmail } from "../models/userModel.js";

export function createAuthController(db: Knex) {
  return {
    login: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const email = requireString(req.body?.email, "email");
        const password = requireString(req.body?.password, "password");

        if (!isEmail(email)) throw new HttpError(400, "Invalid email format");

        const user = await findUserByEmail(db, email);
        if (!user || !user.is_active) throw new HttpError(401, "Invalid credentials");

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) throw new HttpError(401, "Invalid credentials");

    const secret: Secret = (process.env.JWT_SECRET || "change_this_in_production") as Secret;
    const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as any;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

        return res.json({
          success: true,
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
      } catch (err) {
        return next(err);
      }
    }
  };
}
