const express = require('express')
const UsersService = require('./UsersService')
const { requireAuth } = require('../middleware/jwt-auth') 
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, './uploads/')
  },
  filename: (req,file,cb)=> {
    cb(null, file.originalname)
  }
})
const upload = multer({storage})

const UsersRouter = express.Router()
const jsonParser = express.json()

UsersRouter
  .route('/create')
  .post(jsonParser, (req,res,next)=> {
    const userRequest = UsersService.serializeUser(req.body) // serialize data

    for(const field of ['email', 'first_name', 'last_name', 'password']){  // checks missing fields
      if(!userRequest[field]) {
        return res.status(400).json({error: `Missing ${field} in request body`})
      }
    }

    const passwordError = UsersService.validatePassword(userRequest.password) // validates pasword 

    if(passwordError)
      return res.status(400).json(passwordError)

    UsersService.validateEmail(req.app.get('db'), userRequest.email)  // vlaidates email
      .then(emailMatch => {
        if(emailMatch) {
          return res.status(400).json({error: `Email ${userRequest.email} is already taken`})
        }
        const { password } = userRequest

        UsersService.hashPassword(password)  // hashes the password
          .then(hashedPassword => {
            const userRdy = {
              ...userRequest,
              password: hashedPassword
            }
            UsersService.createUser( // inserts in db
              req.app.get('db'),
              userRdy
            )
              .then(user=> res.status(201).json(user))    
          })
      })
      .catch(next)
  })

UsersRouter 
  .route('/upload')
  .post(upload.single('image'), (req,res,next)=> {
    console.log(req.file)
  })

UsersRouter
  .route('/')
  .all(requireAuth)
  .get((req,res, next)=> {
    UsersService.getUsersRequests(req.app.get('db'), res.user.id)
      .then(data => {
        if(!data) {
          return res.status(404).json({error: 'Something went wrong'})
        }
        return res.status(200).json({
          ...res.user,
          ...data
        })
      })
      .catch(next)
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