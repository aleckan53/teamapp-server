const express = require('express');
const sse = express()
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
    RequestService.createRequest(req.app.get('db'), res.newRequest)
      .then(request => {
        sse.emit('newRequest')
        res.send(request)
      })
      .catch(next)
  })
  .patch()
  .delete()


requestsSse.post('/message', jsonParser, (req, res, next) => {
  const message = req.body.message;
  console.log(message)
	// ...
	// Some code here to handle the message, 
	// by saving it in a database for instance
	// ...
	sse.emit('newRequest', {
		title: 'New message!',
		message,
		timestamp: new Date()
  });
  res.end()
})

requestsSse.get('/eventstream', (req, res, next) => {
	res.set({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
  });
  console.log('connected')
  res.setTimeout(0)
  
	sse.on('message', data => {
		res.write(`event: message\n`);
		res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  
  sse.on('close', () => {
    res.end()
  })
});

module.exports = requestsSse