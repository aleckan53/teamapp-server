const express = require('express')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')
const projectsRouter = express.Router()
const ProjectsService = require('./projectsService')

projectsRouter  
  .route('/')
  .all(requireAuth)
  .get((req,res)=>{
    const limit = 15
    const { term='', page } = req.query
    const offset = (page-1)*limit
    ProjectsService.getProjectsList(
      req.app.get('db'),
      term,
      limit,
      offset,
    )
      .then(data=> res.json(data))
  })

projectsRouter
  .route('/user')
  .all(requireAuth)
  .get((req,res, next)=> {
    ProjectsService.getUserProjects(
      req.app.get('db'),
      res.user.id
    )
      .then(data=> res.json(data))
      .catch(next)
  })

projectsRouter
  .route('/add')
  .all(requireAuth)
  .post(jsonParser, (req,res,next)=>{
    const { title, description, img } = req.body
    const newProject = { title, description, img, leader_id: res.user.id }
    for (const [key, value] of Object.entries(newProject))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    
    ProjectsService.addProject(
      req.app.get('db'),
      newProject,
      res.user.id
    )
      .then(data=> res.status(201).json(data))
      .catch(next)
  })

projectsRouter
  .route('/:project_id')
  .all(requireAuth)
  .all(checkProjectExists)
  .get((req,res)=>{
    res.status(200).json(res.project)
  })
  .patch(jsonParser, (req,res,next)=>{
    const { title, description, img } = req.body
    const updatedProject = { title, description, img }
    ProjectsService.updateProject(
      req.app.get('db'),
      updatedProject,
      req.params.project_id
    )
      .then((data)=> res.status(200).json(data[0]))
      .catch(next)
  })
  .delete((req,res,next)=>{
    ProjectsService.deleteProject(
      req.app.get('db'),
      req.params.project_id
    )
      .then(()=> res.status(204).end())
      .catch(next)
  })

projectsRouter
  .route('/:project_id/contributors')
  .all(requireAuth)
  .all(checkProjectExists)
  .get((req,res, next)=> {
    ProjectsService.getContributorsList(req.app.get('db'), req.params.project_id)
      .then(list=> {
        if(!list) {
          return res.status(404).json({error: 'Something went wrong'})
        }

        return res.status(200).json(list)

      })
      .catch(next)
  })


function checkProjectExists(req,res,next) {
  ProjectsService.getProjectById(
    req.app.get('db'),
    req.params.project_id
  )
   .then(project=> {
    if(!project) {
      return res.status(404).json({
        error: `Project with id ${req.params.project_id} doesn't exist`
      })
    }  
    res.project = project
    next()
    return null
   })
   .catch(next)
}

module.exports = projectsRouter