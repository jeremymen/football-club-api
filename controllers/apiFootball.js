const ApiFootball = require('../lib/services/apiFootball')

module.exports.getTeam = (req, res, next) => {
  const { teamName } = req.params

  ApiFootball.getTeamByName(teamName)
    .then(team => res.status(200).json(team))
    .catch(next)
}

module.exports.getLeague = (req, res, next) => {
  const { leagueName } = req.params

  ApiFootball.getLeagueByName(leagueName)
    .then(league => res.status(200).json(league))
    .catch(next)
}

module.exports.getLastMatches = (req, res, next) => {
  const { teamName, numberOfMatches } = req.params

  ApiFootball.getLastMatches(teamName, numberOfMatches)
    .then(matches => res.status(200).json(matches))
    .catch(next)
}

module.exports.getNextMatches = (req, res, next) => {
  const { teamName, numberOfMatches } = req.params

  ApiFootball.getNextMatches(teamName, numberOfMatches)
    .then(matches => res.status(200).json(matches))
    .catch(next)
}

module.exports.getLeagueTable = (req, res, next) => {
  const { leagueName, countryName } = req.params

  ApiFootball.getLeagueTable(leagueName, countryName)
    .then(leagueTable => res.status(200).json(leagueTable))
    .catch(next)
}

module.exports.getCountries = (req, res, next) => {

  ApiFootball.getCountries()
    .then(countries => res.status(200).json(countries))
    .catch(next)
}

module.exports.getLeagueFromCountry = (req, res, next) => {
  const { countryName } = req.params

  ApiFootball.getLeagueFromCountry(countryName)
    .then(countries => res.status(200).json(countries))
    .catch(next)
}

module.exports.getTeamsByLeagueId = (req, res, next) => {
  const { leagueId } = req.params

  ApiFootball.getTeamsByLeagueId(leagueId)
    .then(teams => res.status(200).json(teams))
    .catch(next)
}

