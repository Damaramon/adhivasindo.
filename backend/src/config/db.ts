import knex, { Knex } from "knex";
import "dotenv/config";

export function createDb(): Knex {
  const client = process.env.DB_CLIENT ?? "mysql2";

  return knex({
    client,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || (client === "pg" ? 5432 : 3306)),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: { min: 0, max: 10 }
  });
}
