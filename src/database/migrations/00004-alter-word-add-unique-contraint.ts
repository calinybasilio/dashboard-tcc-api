import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('word', table => {
        table.unique(['word'], { indexName: 'unique_word', deferrable: 'deferred' });
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('word');
}