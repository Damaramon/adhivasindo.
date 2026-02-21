exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 120).notNullable();
    table.string("email", 190).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("role", 50).notNullable().defaultTo("user"); // admin | user
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("users");
};