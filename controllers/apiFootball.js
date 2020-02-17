const ApiFootball = require('../lib/services/apiFootball')

module.exports.getLeagues = (_, res, next) => {

  ApiFootball.getLeagues()
    .then(leagues => {
      res.status(200).json(leagues)
    })
    .catch(next)
}

module.exports.getOneLeague = (req, res, next) => {
  const { leagueName } = req.params

  ApiFootball.getOneLeague(leagueName)
    .then(league => {
      res.status(200).json(league)
    })
    .catch(next)
}

module.exports.getTeams = (req, res, next) => {
  const { leagueName } = req.params

  ApiFootball.getTeams(leagueName)
    .then(teams => {
      res.status(200).json(teams)
    })
    .catch(next)
}