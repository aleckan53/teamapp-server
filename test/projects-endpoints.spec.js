const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

describe('Projects Endpoints', () => {
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

  describe('GET /api/projects', () => {
    beforeEach('insert users in the db', () => helpers.seedUsers(db, users))

    context('Given no projects', () => {
      it('responds with 200 and {projects: [], count: 0}', () => {
        return supertest(app)
          .get('/api/projects')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .expect(200, {projects: [], count: "0"})
      })
    })

    context('Given there are projects in the db', () => {
      beforeEach('insert projects in the db', ()=> helpers.seedProjects(db, projects))

      it('responds with 200 and {projects: {...}, count: {n>0}}', () => {
        return supertest(app)
          .get('/api/projects')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.an('object')
            expect(res.body.projects).to.be.an('array')
            expect(res.body.projects).to.not.be.empty
            expect(Number(res.body.count)).to.be.above(0)
          })
      })
    })
  })

  describe('GET /api/projects/:project_id', () => {
    beforeEach('insert users in the db', () => helpers.seedUsers(db, users))

    context('Given no projects', ()=> {
      it('responds with 404', ()=> {
        return supertest(app)
        .get('/api/projects/999')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .expect(404, {
          error: `Project with id 999 doesn't exist`
        })
      })
    })

    context('Given there are projects in the db', ()=> {
      before('insert projects in the db', () => helpers.seedProjects(db, projects))

      it('responds with 200 and project if valid project_id', ()=> {
        const expected = projects[0]
        return supertest(app)
          .get(`/api/projects/1`)
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.an('object')
            expect(res.body.title).to.eql(expected.title)
            expect(res.body.description).to.eql(expected.description)
            expect(res.body.img).to.eql(expected.img)
            expect(new Date(res.body.created_at)).to.be.an.instanceof(Date)
          })
      })
    })
  })

  describe('GET /api/projects/user', ()=> {
    beforeEach('insert users', ()=> helpers.seedUsers(db, users)) 
    beforeEach('insert projects', ()=> helpers.seedProjects(db, projects))
    beforeEach('insert user_projects', ()=> helpers.seedUserProjects(db, user_projects))

    context('Given user has projects', ()=> {
      it('responds with 200 and an array of projects', ()=> {
        return supertest(app)
          .get('/api/projects/user')
          .expect(200)
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .expect(res=> {
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.not.empty
          })
      })
    })
  })

  describe('POST /api/projects/add', ()=> {
    beforeEach('insert projects', ()=> helpers.seedUsers(db, users))

    it('responds with 400 if no title || description in req.body', ()=> {
      return supertest(app)
        .post('/api/projects/add')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .send({img: 'link', description: 'test'})
        .expect(400, {
          error: "Missing 'title' in request body"
        })
    })

    it('responds with 201 and creates a project', ()=> {
      const newProject = {
        title: 'New test project',
        img: 'img_link',
        description: 'description',
        user_id: 2
      }
      return supertest(app)
        .post('/api/projects/add')
        .set('Authorization', helpers.makeAuthHeader(users[0]))
        .send(newProject)
        .expect(201)
        .expect(res=> {
          expect(res.body.id).to.be.a('number')
          expect(res.body.title).to.eql(newProject.title)
          expect(res.body.img).to.eql(newProject.img)
          expect(res.body.description).to.eql(newProject.description)
        })
    })
  })

  describe('PATCH /api/project/:project_id', ()=> {
    const updatedProject = {
      ...projects[0],
      title: 'Updated title'
    }

    beforeEach('insert users in the db', () => helpers.seedUsers(db, users))

    context('Given no projects in the db', ()=> {
      it('responds with 404', ()=> {
        return supertest(app)
          .patch('/api/projects/1')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .send(updatedProject)
          .expect(404, {error: 'Project with id 1 doesn\'t exist'})
      })
    })

    context('Given there are projects in the db', ()=> {
      beforeEach('insert projects in the db', () => helpers.seedProjects(db, projects))

      it('responds with 200 and updated project', ()=> {
        return supertest(app)
          .patch('/api/projects/1')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .send(updatedProject)
          .expect(200, {
            ...updatedProject,
            id: 1
          })
      })
    })
  })

  describe('DELETE /api/project/:project_id', ()=> {
    beforeEach('insert users in the db', () => helpers.seedUsers(db, users))

    context('Given there are projects in the db', ()=> {
      beforeEach('insert projects in the db', () => helpers.seedProjects(db, projects))

      it('responds with 204 and removes specified project', ()=> {
        return supertest(app)
          .delete('/api/projects/1')
          .set('Authorization', helpers.makeAuthHeader(users[0]))
          .expect(204)
          .then(()=> supertest(app)
            .get('/api/projects/1')
            .set('Authorization', helpers.makeAuthHeader(users[0]))
            .expect(404, {
              error: 'Project with id 1 doesn\'t exist'
            })
          )
      })
    })
  })
})