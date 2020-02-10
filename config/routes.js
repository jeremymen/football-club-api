const express = require('express')
const router = express.Router()
const baseController = require('../controllers/base')
const usersController = require('../controllers/users')
const clubsController = require('../controllers/clubs')
const authenticationMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const membershipMiddleware = require('../middlewares/membership')
const upload = require('./cloudinary')

//base
router.post('/create', authenticationMiddleware.isNotAuthenticated, baseController.create)
router.post('/login', authenticationMiddleware.isNotAuthenticated, baseController.login)
router.post('/logout', authenticationMiddleware.isAuthenticated, baseController.logout)

//user
router.get('/users', authenticationMiddleware.isAuthenticated, usersController.getUsers)
router.get('/users/:username', authenticationMiddleware.isAuthenticated, usersController.getUser)
router.delete('/users/:username', authenticationMiddleware.isAuthenticated, usersController.deleteUser)

//club
router.post(
  '/clubs', 
  authenticationMiddleware.isAuthenticated, 
  membershipMiddleware.notAMemberOfAnyClub, 
  clubsController.create
)
router.get('/clubs', authenticationMiddleware.isAuthenticated, clubsController.getClubs)
router.get('/clubs/:username', authenticationMiddleware.isAuthenticated, clubsController.getClub)
router.patch(
  '/clubs/:username', 
  authenticationMiddleware.isAuthenticated, 
  adminMiddleware.isAdmin, 
  clubsController.updateClub
)
router.post(
  '/clubs/:clubUsername/users/:userUsername/subscription',
  authenticationMiddleware.isAuthenticated, 
  membershipMiddleware.notAMemberOfAnyClub,
  clubsController.subscribe
)
router.delete(
  '/clubs/:clubUsername/users/:userUsername/unsubscription',
  authenticationMiddleware.isAuthenticated, 
  adminMiddleware.isNotTheLastAdmin,
  membershipMiddleware.isFromThisClub,
  clubsController.unsubscribe
)


module.exports = router
