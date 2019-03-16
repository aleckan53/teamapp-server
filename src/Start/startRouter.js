const express = require('express')
const MainService = require('./MainService')

const startRouter = express.Router()

startRouter
  .route('/')
  .get((req,res)=>{
    MainService.getStartData(
      req.app.get('db'),
      1
    )
      .then(data=> res.json(data))
  })

module.exports = startRouter