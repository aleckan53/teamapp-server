
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_projects', function(table){
    table.integer('user_id').references('id').inTable('users');
    table.enu('role', ['owner', 'contributor'], {useNative: true, enumName: 'role_type'}).notNullable()
    table.integer('project_id').references('id').inTable('projects');
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.raw(`
      DROP TABLE user_projects;
      DROP TYPE IF EXISTS role_type;
    `)
};
