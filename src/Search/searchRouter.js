const express = require('express')
const SearchService = require('./SearchService')

const searchRouter = express.Router()

searchRouter
  .route('/featured')
  .get((req,res)=>{
    const offset = (req.query.page - 1)*5

    SearchService.getFeatured(req.app.get('db'), offset)
      .then(data=> res.json(data))
  })



module.exports = searchRouter