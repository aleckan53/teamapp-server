const app = require('../src/app')
const knex = require('knex')
const helpers = require('./helperes/test-helpers')

describe('Requests endpoints', () => {
  let db

  const {
    users, projects, notifications, user_projects
  } = helpers.makeFixtures()

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

  describe.only('POST /api/sse/requests', () => {
    beforeEach('insert users and projects in the db', () => {
      return helpers.seedUsers(db, users)
        .then(()=>helpers.seedProjects(db, projects))
    })

    const testRequest = {
      recipient_id: 2,
      project_id: 2,
    }

    it('responds with 201 and creates a request', () => {
      return supertest(app)
        .post('/api/sse/requests')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .send(testRequest)
        .expect(201)
    })

    it('responds with 400 if request was already sent by the user', () => {
      return supertest(app)
        .post('/api/sse/requests')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .send(testRequest)
        .expect(201)
        .then(() => supertest(app)
          .post('/api/sse/requests')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .send(testRequest)
          .expect(400, {error: 'Request already exists'})  
        )
    })

  })


})
