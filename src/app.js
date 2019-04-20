require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const sse = express()

global.sse = sse

const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const projectsRouter = require('./projects/projects-router')
const requestsRouter = require('./requests/requests-router')

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}))
app.use(helmet())

// TODO: Photo uploads
app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/auth', authRouter)
app.use('/api/sse', requestsRouter)


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