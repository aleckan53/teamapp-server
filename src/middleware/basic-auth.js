const bcrypt = require('bcrypt')
const AuthService = require('../Auth/Auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken

  if(!authToken.toLowerCase().startsWith('bearer ')){
    return res.status(401).json({error: 'Missing bearer token'})
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }


  const [tokenEmail, tokenPassword] = bearerToken
    .toString()
    .split(':')

  if(!tokenEmail || !tokenPassword) {
    return res.status(401).json({error: 'Unauthorized request'})
  }

  AuthService.getUserByEmail(req.app.get('db'), tokenEmail)
    .then(user=> {
      if(!user) {
        return res.status(401).json({error: 'Unauthorized request'})
      }
      AuthService.comparePasswords(tokenPassword, user.password)
        .then(passwordsMatch=> {
          if (!passwordsMatch) {
            return res.status(401).json({error: 'Unauthorized request'})
          }
        
          res.user = user
          next()
          return null    
        })
    })
    .catch(next)
}

module.exports = {
  requireAuth,
}