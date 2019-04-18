const app = require('../src/app')
const knex = require('knex')
const helpers = require('./helperes/test-helpers')

describe('Requests endpoints', () => {
  let db

  const {
    users, projects, requests
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

  describe('POST /api/sse/requests', () => {
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

  describe('PATCH /api/sse/requests', () => {
    beforeEach('insert users and projects in the db', () => {
      return helpers.seedUsers(db, users)
        .then(()=>helpers.seedProjects(db, projects)
        .then(()=>helpers.seedRequests(db, requests)))
    })

    it('responds with 200 and request status "Accepted"', () => {
      return supertest(app)
        .patch('/api/sse/requests')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .send({id: 1, status: 'Accepted'})
        .expect(200)
    })
  })

  describe('DELETE /api/sse/requests/:id', () => {
    beforeEach('insert data', () => {
      return helpers.seedUsers(db, users)
        .then(()=>helpers.seedProjects(db, projects)
        .then(()=>helpers.seedRequests(db, requests)))
    })

    it('repsonds with 204 and removes specified request', () => {
      return supertest(app)
        .delete('/api/sse/requests/1')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .expect(204) // check db if request is gone
    })  
  })
})
