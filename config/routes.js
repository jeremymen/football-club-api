const express = require('express')
const router = express.Router()
const upload = require('./cloudinary')

const baseController = require('../controllers/base')
const usersController = require('../controllers/users')
const clubsController = require('../controllers/clubs')
const eventController = require('../controllers/events')

const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const userMiddleware = require('../middlewares/user')
const clubMiddleware = require('../middlewares/club')
const membershipMiddleware = require('../middlewares/membership')


/** 
 * base's routes
 */
router.post(
  '/create', 
  authMiddleware.isNotAuthenticated, 
  baseController.create
)
router.post(
  '/login', 
  authMiddleware.isNotAuthenticated, 
  baseController.login
)
router.post(
  '/logout', 
  authMiddleware.isAuthenticated, 
  baseController.logout
)

/** 
 * user's routes
 */
router.get(
  '/users', 
  authMiddleware.isAuthenticated, 
  usersController.getUsers
)
router.get(
  '/users/:userUsername', 
  authMiddleware.isAuthenticated, 
  userMiddleware.exist, 
  usersController.getUser
)
router.delete(
  '/users/:userUsername', 
  authMiddleware.isAuthenticated,
  userMiddleware.exist,
  userMiddleware.isCurrentUser,
  adminMiddleware.isNotTheLastAdmin,
  usersController.deleteUser
)

/** 
 * club's routes
 */
router.post(
  '/clubs', 
  authMiddleware.isAuthenticated, 
  membershipMiddleware.notAMemberOfAnyClub, 
  clubsController.create
)
router.get(
  '/clubs', 
  authMiddleware.isAuthenticated, 
  clubsController.getClubs
)
router.get(
  '/clubs/:clubUsername', 
  authMiddleware.isAuthenticated, 
  clubMiddleware.exist,
  clubsController.getClub
)
router.patch(
  '/clubs/:clubUsername', 
  authMiddleware.isAuthenticated, 
  clubMiddleware.exist,
  adminMiddleware.isAdmin, 
  clubsController.updateClub
)
router.get(
  '/clubs/:clubUsername/users',
  authMiddleware.isAuthenticated, 
  clubMiddleware.exist,
  clubsController.getUsers
)
router.post(
  '/clubs/:clubUsername/users/:userUsername/subscription',
  authMiddleware.isAuthenticated, 
  clubMiddleware.exist,
  userMiddleware.isCurrentUser,
  membershipMiddleware.notAMemberOfAnyClub,
  clubsController.subscribe
)
router.delete(
  '/clubs/:clubUsername/users/:userUsername/unsubscription',
  authMiddleware.isAuthenticated, 
  userMiddleware.exist,
  membershipMiddleware.isMemberOfThisClub,
  clubsController.unsubscribe
)

/** 
 * club's routes
 */
router.post(
  '/clubs/:clubUsername/event',
  authMiddleware.isAuthenticated,
  clubMiddleware.exist,
  membershipMiddleware.isMemberOfThisClub,
  adminMiddleware.isAdmin,
  eventController.create
)


module.exports = router
