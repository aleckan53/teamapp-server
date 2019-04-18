const app = require('../src/app')
const jwt = require('jsonwebtoken')
const knex = require('knex')
const helpers = require('./helperes/test-helpers')

describe.only('Auth Endpoints', ()=> {
  let db

  const testUsers = helpers.makeFixtures().users
  const testUser = testUsers[0]

  before('make knex instance', ()=> {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })
  after('disconnect from db', ()=> db.destroy())
  before('cleanup', ()=> helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/auth/login`, ()=> {
    beforeEach('inser users', ()=> helpers.seedUsers(db, testUsers))

    const requiredFields = ['email', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        email: testUser.email,
        password: testUser.password,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })

      it(`responds with 400 'invalid email or password' when bad email`, ()=> {
        const userInvalidEmail = { email: 'invalid-user', password: 'wrong password' }
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidEmail)
          .expect(400, {error: `Incorrect email or password`})
      })

      it(`responds with 400 'Invalid email or password'`, ()=> {
        const userInvalidPass = { email: testUser.email, password: 'wrong password' }
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidPass)
          .expect(400, {error: `Incorrect email or password`})
      })

      it('responds with 200 and JWT auth token using secret when valid credentials', ()=> {
        const userValidCreds = {
          email: testUser.email,
          password: testUser.password
        }
        const expectedToken = jwt.sign(
          {user_id: 1},
          process.env.JWT_SECRET,
          {
            subject: testUser.email,
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: 'HS256'
          }
        )
        return supertest(app)
          .post('/api/auth/login')
          .send(userValidCreds)
          .expect(200, {
            authToken: expectedToken
          })
      })

    })
  })

})