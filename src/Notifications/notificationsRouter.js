const express = require('express')
const NotificationsService = require('./NotificationsService')

const notificationsRouter = express.Router()

notificationsRouter
  .route('/')
  .get((req,res)=>{
    if(!req.query.id) {
      res.status(400).json({
        error: {message: 'Something went wrong'}
      })
    }

    NotificationsService.getAllNotifications(
      req.app.get('db'),
      req.query.id
    )
      .then(nots=> res.json(nots))
  })

  module.exports = notificationsRouter