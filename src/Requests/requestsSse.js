const express = require('express');
const requestsSse = express.Router()
const { requireAuth } = require('../middleware/jwt-auth')
const RequestService = require('./RequestsService')
const jsonParser = express.json()

requestsSse
  .route('/')
  .all(requireAuth)
  .get((req,res,next) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',  
    })
    res.setTimeout(0)

    RequestService.getUsersRequests(req.app.get('db'), res.user.id)
      .then(requests => {
        res.write(`data: ${JSON.stringify(requests)}\n\n`)
      })

    sse.on('newRequest', () => {
      RequestService.getUsersRequests(req.app.get('db'), res.user.id)
        .then(requests => {
          res.write(`data: ${JSON.stringify(requests)}\n\n`)
        })
    });
  
    sse.on('close', () => {
      res.end()
    })
  })

requestsSse 
  .route('/requests')
  .all(requireAuth)
  .all(jsonParser, (req,res,next) => {
    const newRequest = {
      ...req.body,
      sender_id: res.user.id
    }
    for(const [key,value] of Object.entries(newRequest)) {
      if (value == null) {
        return res.status(400).json({error: `Missing ${key} in request body`})
      }
    }
    res.newRequest = newRequest
    next()
    return null
  })
  .post((req,res,next) => {
    RequestService.getRequestsByProject(req.app.get('db'), res.newRequest.project_id)
      .then(list => {
        if(list.some(r => r.sender_id === res.user.id)) {
          return res.status(400).json({error: 'Request already exists'})
        } 

        return RequestService.createRequest(req.app.get('db'), res.newRequest)
          .then(() => {
            sse.emit('newRequest')
            return res.status(201).json({message: 'Success!'}).end()
          })    
      })
      .catch(next)
  })
  .patch((req,res,next) => {
    const { status, id } = res.newRequest
    RequestService.updateRequest(req.app.get('db'), status, id)
      .then(() => {
        sse.emit('newRequest')
        return res.status(200).json({message: 'Success!'}).end()
      })
      .catch(next)
  })


module.exports = requestsSse