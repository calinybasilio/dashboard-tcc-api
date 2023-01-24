import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('tweet', table => {
        table.bigInteger('journalist_id').notNullable().unsigned().alter();
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('tweet');
}