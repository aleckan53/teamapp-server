const express = require('express')
const AuthService = require('./Auth-service')

const authRouter = express.Router()
const jsonParser = express.json()

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

module.exports = authRouter