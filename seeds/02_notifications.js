
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('notifications').del()
    .then(function () {
      // Inserts seed entries
      return knex('notifications').insert([
        {
          user_id: 1,
          text: "Lorem ipsum dolor sit amet"
        },
        {
          user_id: 1,
          text: "Ut enim ad minim veniam"
        },
        {
          user_id: 1,
          text: "Lorem ipsum dolor sit amet"
        },
      ]);
    });
};
