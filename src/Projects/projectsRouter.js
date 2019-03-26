const express = require('express')
const projectsService = require('./projectsService')
const { requireAuth } = require('../middleware/basic-auth')

const projectsRouter = express.Router()
const jsonParser = express.json()

projectsRouter  
  .route('/')
  .all(requireAuth)
  .get((req,res)=>{
    const limit = 5
    const { term='', page } = req.query
    const offset = (page-1)*limit
    projectsService.getProjectsList(
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

    projectsService.getUserProjects(
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
    const { title, description, img, user_id } = req.body
    const newProject = { title, description, img }
    for (const [key, value] of Object.entries(newProject))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      })

    projectsService.addProject(
      req.app.get('db'),
      newProject,
      user_id
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
    projectsService.updateProject(
      req.app.get('db'),
      updatedProject,
      req.params.project_id
    )
      .then((data)=> res.status(200).json(data[0]))
      .catch(next)
  })
  .delete((req,res,next)=>{
    projectsService.deleteProject(
      req.app.get('db'),
      req.params.project_id
    )
      .then(()=> res.status(204).end())
      .catch(next)
  })


function checkProjectExists(req,res,next) {
  projectsService.getProjectById(
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