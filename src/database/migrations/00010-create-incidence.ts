import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('incidence', table => {
        table.increments('id').primary();
        table.integer('count').notNullable();
        table.string('month', 2).notNullable();
        table.integer('iteraction_type', 1).notNullable();
        table.integer('word_id').notNullable().unsigned();
        table.bigInteger('journalist_id').notNullable().unsigned();
        
        table.foreign('word_id').references('word.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('journalist_id').references('journalist.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        
        table.unique(['word_id', 'journalist_id', 'iteraction_type', 'month'], { indexName: 'unique_incidence_of_word_journalist_iteractiontype_month', deferrable: 'deferred' });
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('incidence');
}