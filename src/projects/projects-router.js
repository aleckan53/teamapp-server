const express = require('express')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')
const projectsRouter = express.Router()
const ProjectsService = require('./projects-service')

projectsRouter  
  .route('/')
  .all(requireAuth)
  .get((req,res)=>{
    const limit = 8
    const { term='', page } = req.query
    const offset = (page-1)*limit
    ProjectsService.getProjectsList(
      req.app.get('db'),
      term,
      limit,
      offset,
    )
      .then(data=> {
        data.projects.map(project => {
          if (project.leader_id === res.user.id) {
            return project.userCanEdit = true
          }
        })
        return res.status(200).json(data)
      })
  })

projectsRouter
  .route('/user')
  .all(requireAuth)
  .get((req,res, next)=> {
    ProjectsService.getUserProjects(
      req.app.get('db'),
      res.user.id
    )
      .then(data=> res.status(200).json(data))
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

    // sets default project image if no link supplied
    try {
      new URL(img)
    } catch {
      newProject.img = 'https://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/4/11/1397210130748/Spring-Lamb.-Image-shot-2-011.jpg'
    }
    
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
      .then((data)=> {
        sse.emit('newRequest')
        return res.status(200).json({...data[0], userCanEdit: true})
      })
      .catch(next)
  })
  .delete((req,res,next)=>{
    ProjectsService.deleteProject(
      req.app.get('db'),
      req.params.project_id
    )
      .then(()=> {
        sse.emit('newRequest')
        return res.status(204).end()
      })
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
        return res.status(200).json({
          list,
          userJoined: list.some(u => u.user_id === res.user.id)
        })

      })
      .catch(next)
  })


function checkProjectExists(req,res,next) {
  ProjectsService.getProjectById(
    req.app.get('db'),
    req.params.project_id,
    res.user.id
  )
   .then(project=> {
    if(!project) {
      return res.status(404).json({
        error: `Project with id ${req.params.project_id} doesn't exist`
      })
    }  
    res.project = {
      ...project,
      userCanEdit: res.user.id === project.leader_id
    }
    next()
    return null
   })
   .catch(next)
}

module.exports = projectsRouter