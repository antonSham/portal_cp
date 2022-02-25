exports.up = async (knex) => {
    await knex.schema.alterTable("users", (table) => {
        table.string("email").unique().alter();
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable("users", (table) => {
        table.string("email").dropUnique().alter();
    });
};
