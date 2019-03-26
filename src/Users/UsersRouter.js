const express = require('express')
const UsersService = require('./UsersService')
const { requireAuth } = require('../middleware/basic-auth') 

const UsersRouter = express.Router()
const jsonParser = express.json()

UsersRouter
  .route('/create')
  .post(jsonParser, (req,res,next)=> {
    const newUser = req.body

    UsersService.getAllUsers(req.app.get('db'))
      .then(users=> {
        const emailExists = users.some(user=> user.email === newUser.email)
  
        if(emailExists) {
          return res.status(400).json({
            error: `Email ${newUser.email} is already taken`
          })
        }

        UsersService.createUser(
          req.app.get('db'),
          req.body
        )
          .then(user=> res.status(201).json(user))
          .catch(next)    
      })
  })

UsersRouter
  .route('/')
  .all(requireAuth)
  .get((req,res)=> {
    res.status(200).json(res.user)
  })
  .patch(jsonParser, (req,res,next)=> {
    UsersService.updateUser(
      req.app.get('db'),
      res.user.email,
      req.body
    )
      .then(user=> res.status(200).json(user[0]))
      .catch(next)
  })
  .delete((req,res,next)=> {
    UsersService.deleteUser(
      req.app.get('db'),
      res.user.email
    )
      .then(()=> res.status(204).end())
      .catch(next)
  })

module.exports = UsersRouter