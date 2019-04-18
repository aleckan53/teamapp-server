const AuthService = require('../Auth/authService')
const { PORT } = require('../config')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''
  let bearerToken
  if(!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({error: 'Missing bearer token'})
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }
  try {
    const payload = AuthService.verifyJwt(bearerToken)
    AuthService.getUserByEmail(
      req.app.get('db'),
      payload.sub
    )
      .then(user=> {
        if(!user) {
          return res.status(401).json({error: 'Unauthorized request'})
        }
        delete user.password
        res.user = {
          ...user,
        }
        next()
        return null
      })
      .catch(err=> {
        console.log(err)
        next(err)
      })
  } catch(error) {
    res.status(401).json({error: 'Unauthorized request'})
  }
}

module.exports = {
  requireAuth,
}