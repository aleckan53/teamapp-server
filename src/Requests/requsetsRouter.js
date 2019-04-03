const express = require('express')
const { requireAuth } = require('../middleware/jwt-auth')
const RequestService = require('./RequestsService')
const requestsRouter = express.Router()
const jsonParser = express.json()
const UsersService = require('../Users/UsersService')

requestsRouter
  .route('/:request_id')
  .all(requireAuth)
  .patch(jsonParser, (req,res,next)=> {
    const { status, request_id } = req.body
    // changes request status => if 'Accepted' add the user to user_projects table
    RequestService.updateRequest(req.app.get('db'), req.body, request_id)
      .then(data=> {
        console.log(data)
        if(!data) {
          return res.status(404).json({error: 'Not Found'})
        } 
      })
  })


requestsRouter
  .route('/users')
  .all(requireAuth)
  .get((req,res,next)=> {
    // sets up an open connection
    res.status(200).set({
      'connection': 'keep-alive',
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream'
    })

    const prevData = {
      outgoing: [],
      incoming: [],
    }

    UsersService.getUsersRequests(req.app.get('db'), res.user.id)
      .then(data=> (
        prevData.outgoing = data.outgoing,
        prevData.incoming = data.incoming
      ))
      .then(()=> res.write(`data: ${JSON.stringify(prevData)}\n\n`))

    let check = setInterval(()=> {
      UsersService.getUsersRequests(req.app.get('db'), res.user.id)
        .then(nextData=> {
          if((nextData.incoming.length > prevData.incoming.length) === true) {
            prevData.incoming = nextData.incoming,
            prevData.outgoing = nextData.outgoing
            return res.write(`data: ${JSON.stringify(prevData)}\n\n`)
          }
          console.log('no change')
        })
    }, 4000)


    req.on("close", function () {
      console.log('Bye!')
      clearInterval(check)
      res.end()
    });
  })


requestsRouter
  .route('/projects/:project_id')
  .all(requireAuth)
  .get((req,res,next)=> {
    RequestService.getRequestsByProject(req.app.get('db'), req.params.project_id)
      .then(request=> {
        if(!request) {
          return res.status(404).json({error: 'Doesn\'t exist'})
        }

        return res.status(200).json(request)
      })
      .catch(next)
  })
  .all(jsonParser, (req,res,next)=> {
    const newRequest = {
      ...req.body,
      project_id: req.params.project_id,
      sender_id: res.user.id
    }

    for(const [key,value] of Object.entries(newRequest)) {
      if (value == null) {
        return res.status(400).json({error: `Missing ${key} in request body`})
      }
    }
    res.newRequest = newRequest
    next()
  })
  .post(jsonParser, (req,res,next)=> {
    RequestService.createRequest(req.app.get('db'), res.newRequest)
      .then(request=> res.status(201).json(request))
      .catch(next)
  })

  module.exports = requestsRouter