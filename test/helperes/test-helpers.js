const fixtures = require('./fixtures')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function makeFixtures () {
  const users = fixtures.makeUsersArray()
  const projects = fixtures.makeProjectsArray()
  const notifications = fixtures.makeNotificationsArray(users)
  const user_projects = fixtures.makeUserProjectsArray(users, projects)
  const requests = fixtures.makeRequestsArray()

  return {
    users, projects, notifications, user_projects, requests
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
  const preppedUsers = users.map(user=> ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))

  return db.into('users').insert(preppedUsers)
}

function seedProjects(db, projects) {
  return db.into('projects').insert(projects)
}

function seedUserProjects(db, user_projects) {
  return db.into('user_projects').insert(user_projects)
}

function seedRequests(db, requests) {
  return db.into('requests').insert(requests)
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({user_id: user.id}, secret, {
    subject: user.email,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  cleanTables,
  makeFixtures,
  seedData,
  seedUsers,
  seedProjects,
  seedUserProjects,
  seedRequests,
  makeAuthHeader,
}