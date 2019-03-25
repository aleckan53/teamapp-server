const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

describe('Users Endpoints', () => {
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
  beforeEach('insert users in the db', () => helpers.seedUsers(db, users))

  describe('POST /api/users/create', ()=> {
    it('responds with 400 if email is taken', ()=> {
      const newUser = {
        ...users[0],
        first_name: 'Other name'
      }
      return supertest(app)
        .post('/api/users/create')
        .send(newUser)
        .expect(400, {
          error: `Email ${newUser.email} is already taken`
        })
    })

    it('responds with 201 and user info', ()=> {
      const newUser = {
        ...users[0],
        email: 'unique@email',
        id: 4
      }
      return supertest(app)
        .post('/api/users/create')
        .send(newUser)
        .expect(201)
        .expect(res=> {
          expect(res.body.email).to.be.eql(newUser.email)
          expect(res.body.first_name).to.be.eql(newUser.first_name)
          expect(res.body.last_name).to.be.eql(newUser.last_name)
        })
    })
  })

  describe('GET /api/users', () => {

    it('responds with 200 and user info', ()=> {
      return supertest(app)
        .get('/api/users')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .expect(200)
        .expect(res=> {
          expect(res.body.id).to.be.a('number')
          expect(res.body.first_name).to.eql(users[0].first_name)
          expect(res.body.last_name).to.eql(users[0].last_name)
          expect(res.body.email).to.eql(users[0].email)
        })
    })
  })

  describe('PATCH /api/users', ()=> {
    it('responds with 200 and updated info', ()=> {
      return supertest(app)
        .patch('/api/users')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .send({
          ...users[0],
          email: 'updated_email'
        })
        .expect(200)
        .expect(res=> {
          expect(res.body.email).to.eql('updated_email')
        })
    })
  })

  describe('DELETE /api/users', ()=> {
    it('responds with 204 and removes specified user', ()=> {
      return supertest(app)
        .delete('/api/users')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .expect(204)
        .then(()=> supertest(app)
          .get('/api/users')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .expect(401, {
            error: `Unauthorized request`
          })
        )
    })
  })
})