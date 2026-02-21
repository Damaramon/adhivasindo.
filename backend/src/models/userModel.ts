import { Knex } from "knex";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export async function findUserByEmail(db: Knex, email: string) {
  return db<UserRow>("users").where({ email }).first();
}

export async function findUserById(db: Knex, id: number) {
  return db<UserRow>("users").where({ id }).first();
}

export async function listUsers(db: Knex) {
  return db<UserRow>("users")
    .select("id", "name", "email", "role", "is_active", "created_at", "updated_at")
    .orderBy("id", "asc");
}

export async function createUser(db: Knex, data: { name: string; email: string; password_hash: string; role?: string; is_active?: boolean }) {
  const [row] = await db<UserRow>("users")
    .insert({
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? "user",
      is_active: data.is_active ?? true
    })
    .returning(["id"]);
 
  const id = typeof row === "object" && row !== null ? (row as any).id : (row as any);
  return id;
}

export async function updateUser(db: Knex, id: number, patch: Partial<{ name: string; email: string; password_hash: string; role: string; is_active: boolean }>) {
  await db<UserRow>("users").where({ id }).update({ ...patch, updated_at: db.fn.now() });
}

export async function deleteUser(db: Knex, id: number) {
  await db<UserRow>("users").where({ id }).del();
}
