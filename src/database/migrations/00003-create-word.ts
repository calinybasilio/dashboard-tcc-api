import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('word', table => {
        table.increments('id').primary();
        table.string('word', 70).notNullable();
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('word');
}