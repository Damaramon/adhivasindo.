const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  await knex("users").del();

  const passwordHash = await bcrypt.hash("Admin12345!", 12);

  await knex("users").insert([
    {
      name: "Admin",
      email: "admin@example.com",
      password_hash: passwordHash,
      role: "admin",
      is_active: true
    }
  ]);
};