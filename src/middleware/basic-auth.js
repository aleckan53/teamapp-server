function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken

  if(!authToken.toLowerCase().startsWith('bearer ')){
    return res.status(401).json({error: 'Missing bearer token'})
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  console.log(authToken)

  const [tokenEmail, tokenPassword] = Buffer
    .from(bearerToken, 'base64')
    .toString()
    .split(':')
  
  console.log(tokenEmail, tokenPassword)

  if(!tokenEmail || !tokenPassword) {
    return res.status(401).json({error: 'Unauthorized request'})
  }

  req.app.get('db')('users')
    .where({email: tokenEmail})
    .first()
    .then(user=> {
      if(!user || user.password !== tokenPassword) {
        return res.status(401).json({error: 'Unauthorized request'})
      }
      res.tokenEmail = tokenEmail
      next()
      return null
    })
    .catch(next)
}

module.exports = {
  requireAuth,
}