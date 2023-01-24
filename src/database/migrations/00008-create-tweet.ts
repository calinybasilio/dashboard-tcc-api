import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('tweet', table => {
        table.string('id', 19).primary();
        table.text('tweet').notNullable();
        table.integer('likes').notNullable();
        table.integer('replys').notNullable();
        table.integer('retweets').notNullable();
        table.date('date_tweet')
        table.integer('journalist_id').notNullable().unsigned();

        table.foreign('journalist_id').references('journalist.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('tweet');
}