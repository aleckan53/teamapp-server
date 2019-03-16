
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          firstName: "Oleg",
          lastName: "Kan",
          email: "olegakan5326@gmail.com",
          avatar: "https://www.telegraph.co.uk/content/dam/health-fitness/2018/10/10/TELEMMGLPICT000137602298_trans_NvBQzQNjv4Bq6L3Bx11x18zbsv4k04trOLQwDzZ7lnsLeYSCKv0SGGE.jpeg?imwidth=450",
        },
        {
          firstName: "Leonardo",
          lastName: "DiCaprio",
          email: "johndoe@gmail.com",
          avatar: "https://media.guestofaguest.com/t_article_content/gofg-media/2017/07/1/49297/screen_shot_2017-07-25_at_12.02.16_pm.png",
        },
      ]);
    });
};
