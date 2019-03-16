
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_projects').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_projects').insert([
        {
          user_id: "1",
          role: "owner",
          project_id: "1"
        },
        {
          user_id: "1",
          role: "owner",
          project_id: "2"
        },
        {
          user_id: "2",
          role: "contributor",
          project_id: "1"
        },
        {
          user_id: "2",
          role: "contributor",
          project_id: "2"
        },
        {
          user_id: "2",
          role: "owner",
          project_id: "3"
        },
      ]);
    });
};
