const express = require('express')
const router = express.Router()
const upload = require('./cloudinary')

const baseController = require('../controllers/base')
const usersController = require('../controllers/users')
const clubsController = require('../controllers/clubs')
const eventController = require('../controllers/events')
const apiFootballController = require('../controllers/apiFootball')

const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const membershipMiddleware = require('../middlewares/membership')
const existMiddleware = require('../middlewares/exist')


/** 
 * base's routes
 */
router.post(
  '/create', 
  authMiddleware.isNotAuthenticated, 
  upload.single('profilePictures'),
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
  existMiddleware.userExist, 
  authMiddleware.isCurrentUser,
  upload.single('profilePictures'),
  usersController.update
)
router.get(
  '/users/:validationToken/validate',
  authMiddleware.isNotAuthenticated,
  usersController.validate
)
router.get(
  '/users', 
  authMiddleware.isAuthenticated, 
  usersController.getAll
)
router.get(
  '/users/:userUsername', 
  authMiddleware.isAuthenticated, 
  existMiddleware.userExist, 
  usersController.getOne
)
router.delete(
  '/users/:userUsername', 
  authMiddleware.isAuthenticated,
  existMiddleware.userExist,
  authMiddleware.isCurrentUser,
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
  upload.single('emblem'),
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
  existMiddleware.clubExist,
  clubsController.getOne
)
router.patch(
  '/clubs/:clubUsername', 
  authMiddleware.isAuthenticated, 
  existMiddleware.clubExist,
  adminMiddleware.isAdmin, 
  upload.single('emblem'),
  clubsController.update
)
router.delete(
  '/clubs/:clubUsername',
  authMiddleware.isAuthenticated, 
  existMiddleware.clubExist,
  adminMiddleware.isAdmin, 
  clubsController.delete
)
router.get(
  '/clubs/:clubUsername/users',
  authMiddleware.isAuthenticated, 
  existMiddleware.clubExist,
  clubsController.getUsers
)
router.post(
  '/clubs/:clubUsername/users/:userUsername/subscription',
  authMiddleware.isAuthenticated, 
  existMiddleware.clubExist,
  existMiddleware.userExist,
  authMiddleware.isCurrentUser,
  membershipMiddleware.notAMemberOfAnyClub,
  clubsController.subscribe
)
router.delete(
  '/clubs/:clubUsername/users/:userUsername/unsubscription',
  authMiddleware.isAuthenticated, 
  existMiddleware.userExist,
  existMiddleware.clubExist,
  membershipMiddleware.isMemberOfThisClub,
  clubsController.unsubscribe
)

/** 
 * event's routes
 */
router.get(
  '/events',
  authMiddleware.isAuthenticated,
  eventController.getAll
)
router.get(
  '/events/:eventId',
  authMiddleware.isAuthenticated,
  existMiddleware.eventExist,
  eventController.getOne
)
router.delete(
  '/events/:eventId/clubs/:clubUsername',
  authMiddleware.isAuthenticated,
  existMiddleware.eventExist,
  adminMiddleware.isAdmin,
  eventController.delete
)
router.post(
  '/events/clubs/:clubUsername',
  authMiddleware.isAuthenticated,
  existMiddleware.clubExist,
  adminMiddleware.isAdmin,
  eventController.create
)
router.get(
  '/events/clubs/:clubUsername',
  authMiddleware.isAuthenticated,
  existMiddleware.clubExist,
  eventController.getClubEvents
)
router.post(
  '/events/:eventId/users/:userUsername/participation',
  authMiddleware.isAuthenticated,
  existMiddleware.userExist,
  existMiddleware.eventExist,
  authMiddleware.isCurrentUser,
  eventController.participate
)

/** 
 * team's routes
 */

router.get(
  '/teams/:teamName',
  authMiddleware.isAuthenticated,
  apiFootballController.getTeam
)
router.get(
  '/league/:leagueName',
  authMiddleware.isAuthenticated,
  apiFootballController.getLeague
)
router.get(
  '/matches/team/:teamName/last/:numberOfMatches',
  authMiddleware.isAuthenticated,
  apiFootballController.getLastMatches
)
router.get(
  '/matches/team/:teamName/next/:numberOfMatches',
  authMiddleware.isAuthenticated,
  apiFootballController.getNextMatches
)
router.get(
  '/leagueTable/:leagueName/country/:countryName',
  authMiddleware.isAuthenticated,
  apiFootballController.getLeagueTable
)

module.exports = router
