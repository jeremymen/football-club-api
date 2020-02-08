const express = require('express')
const router = express.Router()
const baseController = require('../controllers/base')
const usersController = require('../controllers/users')
const clubsController = require('../controllers/clubs')
const authenticationMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const upload = require('./cloudinary')

//base
router.post('/create', authenticationMiddleware.isNotAuthenticated, baseController.create)
router.post('/login', authenticationMiddleware.isNotAuthenticated, baseController.login)
router.post('/logout', authenticationMiddleware.isAuthenticated, baseController.logout)

//user
router.get('/users', authenticationMiddleware.isAuthenticated, usersController.getUsers)
router.get('/users/:username', authenticationMiddleware.isAuthenticated, usersController.getUser)

//club
router.post('/clubs', authenticationMiddleware.isAuthenticated, clubsController.create)
router.get('/clubs', authenticationMiddleware.isAuthenticated, clubsController.getClubs)
router.get('/clubs/:username', authenticationMiddleware.isAuthenticated, clubsController.getClub)
router.patch(
  '/clubs/:username', 
  authenticationMiddleware.isAuthenticated, 
  adminMiddleware.isAdmin,
  clubsController.updateClub
)


module.exports = router
