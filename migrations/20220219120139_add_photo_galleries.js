exports.up = async (knex) => {
  await knex.schema.createTable("photo_galleries", (table) => {
    table.increments("id");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("photos", (table) => {
    table.increments("id");
    table.integer("photo_gallery_id").notNullable();
    table.string("photo_path").notNullable();

    table
      .foreign("photo_gallery_id")
      .references("photo_galleries.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("issues", (table) => {
    table.integer("photo_gallery_id");

    table
      .foreign("photo_gallery_id")
      .references("photo_galleries.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  const issuesIds = await knex("issues").select("id");
  const photoGalleriesIds = await knex("photo_galleries")
    .insert([...Array(issuesIds.length)].map(() => ({})))
    .returning("id");

  await Promise.all(
    issuesIds.map(({ id }, index) =>
      knex("issues")
        .where("id", id)
        .update("photo_gallery_id", photoGalleriesIds[index].id)
    )
  );

  await knex.schema.alterTable("issues", (table) => {
    table.integer("photo_gallery_id").notNullable().alter();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("issues", (table) => {
    table.dropColumn("photo_gallery_id");
  });

  await knex.schema.dropTableIfExists("photos");
  await knex.schema.dropTableIfExists("photo_galleries");
};
