const express = require('express')
const router = express.Router()
const baseController = require('../controllers/base')
const usersController = require('../controllers/users')
const clubsController = require('../controllers/clubs')
const authenticationMiddleware = require('../middlewares/authentication')
const upload = require('./cloudinary')

//base
router.post('/create', authenticationMiddleware.isNotAuthenticated, baseController.create)
router.post('/login', authenticationMiddleware.isNotAuthenticated, baseController.login)
router.post('/logout', authenticationMiddleware.isAuthenticated, baseController.logout)

module.exports = router
