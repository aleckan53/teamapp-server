const express = require('express')
const requestsRouter = express.Router()
const { getUsersRequests } = require('./RequestsService')
const { requireAuth } = require('../middleware/jwt-auth')

requestsRouter
  .route('/events')
  .all(requireAuth)
  .get((req,res,next) => {
    res.status(200).set({
      'connection': 'keep-alive',
      'cache-control': 'no-cache',
      'content-type': 'text/event-stream'
    })
    console.log(res.user)
    setInterval(()=> {
      console.log('alive')
    }, 4000)
  })


// requestsRouter.use((req,res,next)=> {
//   console.log('Authentication')
//   return next()
// })

// requestsRouter.ws('/', (ws,req)=> {
//   ws.on('message', msg=> {
//     console.log(msg)
//     getUsersRequests(req.app.get('db'), msg)
//       .then(data => {
//         console.log(data)
//         ws.send(JSON.stringify(data))
//       })
//   })

  

//   ws.on('close', ()=> {
//     console.log('good bye!')
//     ws.terminate()
//   })
// })




// requestsRouter.ws('/ws', (ws,req)=> {
//   ws.on('message', msg=> {
//     console.log(msg)
//     ws.send(msg)
//   })
// })

module.exports = requestsRouter