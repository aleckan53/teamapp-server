const express = require('express')
const requestsSocket = express.Router()
const expressWs = require('express-ws')(requestsSocket);
requestsSocket.ws('/', (req,res,next) => {
  ws.on('message', msg => {
    console.log(msg)
    ws.send(msg)
  })
})

module.exports = requestsSocket