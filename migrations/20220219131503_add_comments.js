exports.up = async (knex) => {
  await knex.schema.createTable("comments", (table) => {
    table.increments("id");
    table.text("text").notNullable();
    table.integer("photo_gallery_id").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.integer("author_id").notNullable();
    table.boolean("published").notNullable().defaultTo(true);
    table.integer("issue_id").notNullable();

    table
      .foreign("photo_gallery_id")
      .references("photo_galleries.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .foreign("author_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .foreign("issue_id")
      .references("issues.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("comments");
};
