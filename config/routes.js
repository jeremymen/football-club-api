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
router.patch(
  '/users/:userUsername',
  authMiddleware.isAuthenticated, 
  userMiddleware.exist, 
  userMiddleware.isCurrentUser,
  usersController.update
)
router.get(
  '/users', 
  authMiddleware.isAuthenticated, 
  usersController.getAll
)
router.get(
  '/users/:userUsername', 
  authMiddleware.isAuthenticated, 
  userMiddleware.exist, 
  usersController.getOne
)
router.delete(
  '/users/:userUsername', 
  authMiddleware.isAuthenticated,
  userMiddleware.exist,
  userMiddleware.isCurrentUser,
  adminMiddleware.isNotTheLastAdmin,
  usersController.delete
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
  clubsController.getAll
)
router.get(
  '/clubs/:clubUsername', 
  authMiddleware.isAuthenticated, 
  clubMiddleware.exist,
  clubsController.getOne
)
router.patch(
  '/clubs/:clubUsername', 
  authMiddleware.isAuthenticated, 
  clubMiddleware.exist,
  adminMiddleware.isAdmin, 
  clubsController.update
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
 * event's routes
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
