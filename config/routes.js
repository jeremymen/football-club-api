const express = require('express')
const router = express.Router()
const baseController = require('../controllers/base')
const usersController = require('../controllers/users')
const clubsController = require('../controllers/clubs')
const authenticationMiddleware = require('../middlewares/authentication')
const upload = require('./cloudinary')

//user
router.post('/create', authenticationMiddleware.isNotAuthenticated, usersController.create)
router.post('/login', authenticationMiddleware.isNotAuthenticated, usersController.login)
router.post('/logout', authenticationMiddleware.isAuthenticated, usersController.logout)

module.exports = router
