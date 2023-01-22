import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('incidence_of_words', table => {
        table.integer('iteraction_type', 1).notNullable();
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('incidence_of_words');
}