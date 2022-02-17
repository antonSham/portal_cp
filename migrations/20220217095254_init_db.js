exports.up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.boolean("email_is_confirmed").notNullable().defaultTo(false);
    table.string("email_confirmation_code", 6);
    table.string("password");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table
      .enu("role", ["user", "editor", "admin"])
      .notNullable()
      .defaultTo("user");
  });

  await knex.schema.createTable("issues", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.integer("author_id").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table
      .enu("status", ["solving", "solved"])
      .notNullable()
      .defaultTo("solving");
    table.boolean("published").notNullable().defaultTo(false);
    table.double("latitude").notNullable();
    table.double("longitude").notNullable();
    table.enu("category", ["road", "infrastructure"]).notNullable();

    table
      .foreign("author_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("issues");
  await knex.schema.dropTableIfExists("users");
};
