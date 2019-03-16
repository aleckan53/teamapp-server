
exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', function(table){
    table.increments('id');
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.text('img').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects')
};
