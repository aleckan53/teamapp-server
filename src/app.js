require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const sse = express()

global.sse = sse

const authRouter = require('./auth/authRouter')
const usersRouter = require('./users/usersRouter')
const projectsRouter = require('./projects/projectsRouter')

const requestsSocket = require('./socket/requestsSocket')
const requestsSse = require('./Requests/requestsSse')

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/auth', authRouter)
app.use('/api/requests', requestsSocket)
app.use('/api/sse', requestsSse)


/* handles internal errors */
app.use(function errorHandler (error, req, res, next){
  let response 
  if (NODE_ENV === 'production'){
    response = {error: {message: 'server error'}}
  } else {
    console.error(error)
    response = {message: error.message, error}
  }

  res.status(500).json(response)
})

module.exports = app