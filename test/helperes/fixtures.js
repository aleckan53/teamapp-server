function makeUsersArray() {
  return [
    { 
      first_name: 'test user 1',
      last_name: 'TU1',
      email: 'test1@test.com',
      avatar: 'link',
      password: 'password1',
    },
    {
      first_name: 'test-user-2',
      last_name: 'TU2',
      email: 'test2@test.com',
      avatar: 'link',
      password: 'password2',
    },
    {
      first_name: 'test-user-3',
      last_name: 'TU3',
      email: 'test3@test.com',
      avatar: 'link',
      password: 'password3',
    },
  ]
}

function makeNotificationsArray(users) {
  return [
    { 
      id: 1,
      text: "Lorem ipsum dolor sit amet",
      user_id: users[0].id,
    },
    {
      id: 2,
      text: "Ut enim ad minim veniam",
      user_id: users[1].id,
    },
    {
      id: 3,
      text: "Loremq ipsum dolorw sit amet",
      user_id: users[2].id,
    },

  ]
}

function makeProjectsArray() {
  return [
    { 
      id: 1,
      title: 'Test-title1',
      description: 'text-text1',
      img: 'link_to_img',
      leader_id: 1,
    },
    {
      id: 2,
      title: 'Test-title2',
      description: 'text-text2',
      img: 'link_to_img',
      leader_id: 2,
    },
    {
      id: 3,
      title: 'Test-title3',
      description: 'text-text3',
      img: 'link_to_img',
      leader_id: 3,
    },
  ]
}

function makeUserProjectsArray(users, projects) {
  return [
    {
      user_id: 1,
      role: "leader",
      project_id: projects[0].id
    },
    {
      user_id: 1,
      role: "leader",
      project_id: projects[1].id
    },
    {
      user_id: 2,
      role: "contributor",
      project_id: projects[0].id
    },
  ]
}

module.exports = {
  makeUsersArray,
  makeProjectsArray,
  makeNotificationsArray,
  makeUserProjectsArray,
}