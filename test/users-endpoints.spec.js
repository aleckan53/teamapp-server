const app = require('../src/app')
const knex = require('knex')
const helpers = require('./helperes/test-helpers')

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

    it('responds with 201, serialized user, strong bcrypted password', ()=> {
      const userValid = {
        email: 'unique@unique.com',
        first_name: 'unique_first',
        last_name: 'unique_last',
        password: 'Password123',
      }

      return supertest(app)
        .post('/api/users/create')
        .send(userValid)
        .expect(201)
        .expect(res=> {
          expect(res.body).to.have.property('id')
          expect(res.body.email).to.eql(userValid.email)
          expect(res.body.first_name).to.eql(userValid.first_name)
          expect(res.body.last_name).to.eql(userValid.last_name)
          expect(res.body).to.have.property('created_at')
          expect(res.body).to.have.property('avatar')
        })
        .expect(res=> {
          db.from('users')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(row=> {
              expect(row.email).to.eql(userValid.email)
              expect(row.first_name).to.eql(userValid.first_name)
              expect(row.last_name).to.eql(userValid.last_name)
              expect(row).to.have.property('created_at')
              expect(row).to.have.property('avatar')
            })
        })
    })

    const requiredFields = ['email', 'password', 'first_name', 'last_name']

    requiredFields.forEach(field=> {
      const testUser = {
        email: 'test',
        password: 'test',
        first_name: 'test',
        last_name: 'test',
      }
  
      it(`responds with 400 when ${field} is missing`, ()=> {
        delete testUser[field]
  
        return supertest(app)
          .post('/api/users/create')
          .send(testUser)
          .expect(400, {error: `Missing ${field} in request body`})
      })
  
    })

    it('responds with 400 when password < 8 characters', ()=> {
      const userShortPassword = {
        ...users[0],
        password: '*'.repeat(5)
      }
      return supertest(app)
        .post('/api/users/create')
        .send(userShortPassword)
        .expect(400, {error: 'Password must be longer than 8 characters'})
    })

    it('responds with 400 when password > 72 characters', ()=> {
      const userLongPassword = {
        ...users[0],
        password: '*'.repeat(79)
      }
      return supertest(app)
        .post('/api/users/create')
        .send(userLongPassword)
        .expect(400, {error: 'Password must be less than 72 characters'})
    })

    it('responds with 400 when password with white space', ()=> {
      const userPassSpaces = {
        ...users[0],
        password: '**te st '
      }
      return supertest(app)
        .post('/api/users/create')
        .send(userPassSpaces)
        .expect(400, {error: `Password can't have spaces`})

    })

    it('responds with 400 when password doesn\'t have a numbers', ()=> {
      const userPasswordNoNum = {
        ...users[0],
        password: 'testtesttest'
      }
      return supertest(app)
        .post('/api/users/create')
        .send(userPasswordNoNum)
        .expect(400, {error: 'Password must include at least 1 number'})
    })

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