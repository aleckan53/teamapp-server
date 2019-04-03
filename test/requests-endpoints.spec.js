const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')


describe('Requests endpoints', ()=> {
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

  describe('POST /api/requests/project/:project_id', ()=> {
    beforeEach('insert users in the db', () => {
      return helpers.seedUsers(db, users)
        .then(()=>helpers.seedProjects(db, projects))
    })

    const testRequest = {
      recipient_id: 1,
    }

    it('responds with 201 and creates a request', ()=> {

      return supertest(app)
        .post('/api/requests/projects/1')
        .set('Authorization', helpers.makeAuthHeader(users[1]))
        .send(testRequest)
        .expect(201)
        .then(()=> supertest(app)
          .get('/api/requests/projects/1')
          .set('Authorization', helpers.makeAuthHeader(users[1]))
          .expect(200)
          .expect(res=> {
            expect(res.body[0].recipient_id).to.eql(testRequest.recipient_id)
            expect(res.body[0]).to.have.property('status')
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0]).to.have.property('text')
            expect(res.body[0]).to.have.property('created_at')
          })
        )
    })

    const statusChanges = ['accepted', 'declined']

    statusChanges.forEach(status=> 
      it('responds with 200 and updates the request', ()=> {
        return supertest(app)
          .post('/api/requests/projects/1')
          .set('Authorization', helpers.makeAuthHeader(users[1]))
          .send(testRequest)
          .then(res=> supertest(app)
            .patch('/api/requests/projects/1')
            .set('Authorization', helpers.makeAuthHeader(users[1]))
            .send({
              ...res.body,
              recipient_id: 1,
              sender_id: 3,
              status,
            })
            .expect(200)
            .expect(res=> {
              expect(res.body[0].status).to.eql(status)
            })
          )
      })
    )

  })

})