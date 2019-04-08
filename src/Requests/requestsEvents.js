const express = require('express')
const { requireAuth } = require('../middleware/jwt-auth')
const { getRequestsCount, getUserRequests } = require('./RequestsService')

const requestsEvents = express.Router()

requestsEvents
  .route('/users')
  .all(requireAuth)
  .get((req,res,next) => {
    res.writeHead(200, {
      'connection': 'keep-alive',
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream'
    })
    console.log('connected')

    let check
    clearInterval(check)

    const prev = {
      count: 0,
      outgoing: [],
      incoming: [],
    }

    res.write(`data: ${JSON.stringify(prev)}\n\n`)

    check = setInterval(()=>{

      // getRequestsCount(req.app.get('db'), res.user.id)
      //   .then(count => {
      //     if (count !== prev.count) {
      //       // loadRequests(req,res,prev)
            
      //       return prev.count = count
      //     }
      //     console.log('alive')
      //   })
    }, 1000)

    req.on('error', (e)=> {
    })

    req.on('close', ()=> {
      clearInterval(check)
      res.end()
      console.log('clear')
    })

  })

  function loadRequests(req, res, prev) {
    getUserRequests(req.app.get('db'), res.user.id)
      .then(data => (
        prev.outgoing = data.outgoing,
        prev.incoming = data.incoming
      ))
      .then(()=> res.write(`data: ${JSON.stringify(prev)}\n\n`))
  }

module.exports = requestsEvents