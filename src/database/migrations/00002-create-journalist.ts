import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('journalist', table => {
        table.integer('id').primary();
        table.string('name', 50).notNullable();
        table.string('user', 70).notNullable();
        table.integer('locality_id').notNullable();
        table.timestamp('create_time').defaultTo(Knex.fn.now());
        table.timestamp('update_time').defaultTo(Knex.fn.now());
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('journalist');
}