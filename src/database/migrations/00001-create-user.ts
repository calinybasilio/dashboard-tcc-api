import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('user', table => {
        table.increments('id').primary();
        table.string('name', 50).notNullable();
        table.string('email', 70).notNullable();
        table.string('password', 70);
        table.boolean('active').notNullable().defaultTo('false');
        table.timestamp('create_time').defaultTo(Knex.fn.now());
        table.timestamp('update_time').defaultTo(Knex.fn.now());
        table.unique(['email'], { indexName: 'unique_email_users', deferrable: 'deferred' });
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('user');
}