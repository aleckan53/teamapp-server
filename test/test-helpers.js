const fixtures = require('./fixtures')

function makeFixtures () {
  const users = fixtures.makeUsersArray()
  const projects = fixtures.makeProjectsArray()
  const notifications = fixtures.makeNotificationsArray(users)
  const user_projects = fixtures.makeUserProjectsArray(users, projects)

  return {
    users, projects, notifications, user_projects
  }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      user_projects,
      projects,
      notifications,
      users
      RESTART IDENTITY CASCADE;`
  )
}

function seedData(db, projects, users, user_projects) {
  return db.into('projects').insert(projects)
    .then(()=> db.into('users').insert(users))
    .then(()=> db.into('user_projects').insert(user_projects))
}

function seedUsers(db, users) {
  return db.into('users').insert(users)
}

function seedProjects(db, projects) {
  return db.into('projects').insert(projects)
}

function seedUserProjects(db, user_projects) {
  return db.into('user_projects').insert(user_projects)
}

function makeAuthHeader(user) {
  const token = Buffer.from(`${user.email}:${user.password}`).toString('base64')
  return `Bearer ${token}`
}

module.exports = {
  cleanTables,
  makeFixtures,
  seedData,
  seedUsers,
  seedProjects,
  seedUserProjects,
  makeAuthHeader,
}