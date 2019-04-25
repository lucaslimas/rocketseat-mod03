const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')

const {
  UserController,
  SessionController,
  AdController,
  PurchaseController,
  SalespersonController
} = require('./app/controllers')

const validators = require('./app/validators')

const authMiddleware = require('./app/middlewares/auth')

const routes = express.Router()

routes.get('/', (req, res) => res.send('Módulo 03'))

routes.post('/users', validate(validators.User), handle(UserController.store))

routes.post(
  '/sessions',
  validate(validators.Session),
  handle(SessionController.store)
)

routes.use(authMiddleware)

// Ads routes
routes.get('/ads', handle(AdController.index))
routes.get('/ads/:id', handle(AdController.show))
routes.post('/ads', validate(validators.Ad), handle(AdController.store))
routes.put('/ads/:id', validate(validators.Ad), handle(AdController.update))
routes.delete('/ads/:id', handle(AdController.destroy))

// Purchase routes
routes.post(
  '/purchases',
  validate(validators.Purchase),
  handle(PurchaseController.store)
)

// Salesperson routes
routes.get('/purchases/requests/:user', handle(PurchaseController.requests))

routes.post(
  '/purchases/requests/accept/:purchase',
  handle(PurchaseController.accept)
)

module.exports = routes
