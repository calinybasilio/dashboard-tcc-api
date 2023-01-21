import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('incidence_of_words', table => {
        table.increments('id').primary();
        table.integer('count').notNullable();
        table.integer('word_id').notNullable().unsigned();
        table.integer('journalist_id').notNullable().unsigned();
        
        table.foreign('word_id').references('word.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('journalist_id').references('journalist.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        
        table.unique(['word_id', 'journalist_id'], { indexName: 'unique_incidence_of_word_journalist', deferrable: 'deferred' });
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('incidence_of_words');
}