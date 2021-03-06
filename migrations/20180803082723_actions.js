exports.up = function (knex, Promise) {
    return knex.schema.createTable('actions', function (actions) {
        actions.increments();

        actions
            .integer('project_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('projects')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

        actions.text('description').notNullable();
        actions.text('notes').notNullable();
        actions.boolean('completed').defaultTo(false);
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('actions');
};
