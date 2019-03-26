const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

describe('Protected endpoints', ()=> {
  let db

  const { users } = helpers.makeFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))
  beforeEach('insert date in the db', () => 
    helpers.seedUsers(db, users)
  )

  const protectedEndpoints = [
    {
      name: 'GET /api/projects/user',
      path: '/api/projects/user'
    },
    {
      name: 'GET /api/users',
      path: '/api/users'
    },
    {
      name: 'GET /api/projects',
      path: '/api/projects'
    }
  ]

  protectedEndpoints.forEach(endpoint=> {
    describe(`${endpoint.name}`, ()=> {
      it(`responds with 401 'Missing bearer token' when no bearer token`, ()=> {
        return supertest(app)
          .get(`${endpoint.path}`)
          .expect(401, {
            error: 'Missing bearer token'
          })
      })

      it(`responds with 401 'Unauthorized request' when no credentials in token`, ()=> {
        const userNoCreds = { email: '', password: '' }
        return supertest(app)
          .get(`${endpoint.path}`)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(401, {error: 'Unauthorized request'})
      })

      it(`responds with 401 'Unauthorized request' when invalid user`, ()=> {
        const userInvalidCreds = {email: 'user-not', password: 'existed'}
        return supertest(app)
          .get(`${endpoint.path}`)
          .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
          .expect(401, {error: 'Unauthorized request'})
      })

      it(`responds with 401 'Unauthorized request' when invalid password`, ()=> {
        const userInvalidPass = {email: users[0].email, password: 'wrong password'}
        return supertest(app)
          .get(`${endpoint.path}`)
          .set('Authorization', helpers.makeAuthHeader(userInvalidPass))
          .expect(401, {error: 'Unauthorized request'})
      })
    })
  })
})