const express = require('express')
const SearchService = require('./SearchService')

const searchRouter = express.Router()

searchRouter
  .route('/featured')
  .get((req,res)=>{
    const offset = (req.query.page - 1)*7

    SearchService.getFeatured(req.app.get('db'), offset)
      .then(data=> res.json(data))
  })

searchRouter  
  .route('/')
  .get((req,res)=>{
    SearchService.getProjectsByTerm(
      req.app.get('db'),
      req.query.searchTerm
    )
      .then(data=> res.json(data))

  })

searchRouter
    .route('/project/:project_id')
    .get((req,res)=>{
      SearchService.getProjectById(
        req.app.get('db'),
        req.params.project_id
      )
        .then(data=> res.json(data))
    })



module.exports = searchRouter