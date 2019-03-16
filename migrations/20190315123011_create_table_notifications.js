
exports.up = function(knex, Promise) {
  return knex.schema.createTable('notifications', function(table){
    table.increments('id');
    table.text('text').notNullable();
    table.timestamp('date_created').defaultTo(knex.fn.now())
    table.integer('user_id').references('id').inTable('users')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('notifications')
};
