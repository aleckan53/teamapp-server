const users = [
  {
    firstName: "Oleg",
    lastName: "Kan",
    email: "olegakan5326@gmail.com",
    img: "https://www.telegraph.co.uk/content/dam/health-fitness/2018/10/10/TELEMMGLPICT000137602298_trans_NvBQzQNjv4Bq6L3Bx11x18zbsv4k04trOLQwDzZ7lnsLeYSCKv0SGGE.jpeg?imwidth=450",
  }
]

const notifications = [
  {
    user_id: "user-0f018d38-f445-4d15-94d9-0b9fc7db79a6",
    text: "You have a new message!",
    date: "3/12/19"
  },
  {
    user_id: "user-0f018d38-f445-4d15-94d9-0b9fc7db79a6",
    text: "You have a new request!",
    date: "1/12/19"
  },
  {
    user_id: "user-0f018d38-f445-4d15-94d9-0b9fc7db79a6",
    text: "You have a new message!",
    date: "4/12/19"
  },
]

const projects = [
  {
    id: "project-861b5536-7282-43f3-89fb-91353ae12bd7",
    title: "React + Node | FullStack App",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: "https://facebook.github.io/create-react-app/img/logo-og.png"
  },
  {
    id: "project-4df16993-b18f-4a57-af48-b5c310caa2e9",
    title: "React Native app",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: "https://instabug.com/blog/wp-content/uploads/2018/03/Featured.jpg"
  },
  {
    id: "project-129c7fdf-0ba1-4a67-9d07-cfba20ae4372",
    title: "Wordpress website design",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: "https://udemy-images.udemy.com/course/750x422/1400228_f27e.jpg"
  },
    {
    id: "project-e5f2cdd3-3153-4d16-9e5b-6453cd07d502",
    title: "iOS game on Unity",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: "https://cdnp2.stackassets.com/04865d24b8e51cb69f980ac85f82671d15b911fe/store/opt/596/298/9b1800573b3eca4e65c1b9311f8606e1c1077a94303959f3cba47b4bd4b2/f346a5ad04ca3ad293b162724ddeed7a5ab8074c_main_hero_image.jpg"
  },

]

const user_projects = [
  {
    user_id: "user-0f018d38-f445-4d15-94d9-0b9fc7db79a6",
    role_id: "Host",
    project_id: "project-861b5536-7282-43f3-89fb-91353ae12bd7"
  },
  {
    user_id: "user-0f018d38-f445-4d15-94d9-0b9fc7db79a6",
    role_id: "Host",
    project_id: "project-4df16993-b18f-4a57-af48-b5c310caa2e9"
  },
]

module.exports = {
  users, notifications, projects, user_projects
}