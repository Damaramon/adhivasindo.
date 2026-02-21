require("dotenv").config();

/** @type {import('knex').Knex.Config} */
const client = process.env.DB_CLIENT || "mysql2";

module.exports = {
  client,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || (client === "pg" ? 5432 : 3306)),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  migrations: { directory: "./migrations" },
  seeds: { directory: "./seeds" }
};