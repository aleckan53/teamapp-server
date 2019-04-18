const express = require('express')
const jsonParser = express.json()
const authRouter = express.Router()
const AuthService = require('./authService')
const { requireAuth } = require('../middleware/jwt-auth')

authRouter
  .post('/login', jsonParser, (req, res, next) => {
    const { email, password } = req.body
    const loginUser = { email, password }

    for(const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
  
    AuthService.getUserByEmail(
      req.app.get('db'),
      email
    )
      .then(dbUser=> {
        if(!dbUser) {
          return res.status(400).json({
            error: 'Incorrect email or password'
          })
        }
        AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch) {
              return res.status(400).json({
                error: 'Incorrect email or password'
              })
            }

            const sub = dbUser.email
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(payload, sub)
            })
          })
          .catch(next)
      })
  })

authRouter
  .post('/refresh', requireAuth, (req,res) => {
    const sub = res.user.email
    const payload = { id: res.user.id }

    res.send({
      authToken: AuthService.createJwt(sub, payload)
    })

  })

module.exports = authRouter