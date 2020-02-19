const axios = require('axios')
const createError = require('http-errors')


class ApiFootball {
  
  constructor() {
    this.http = axios.create({
      baseURL: 'https://api-football-v1.p.rapidapi.com',
      headers: {
       "content-type": "application/json",
       "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
       "x-rapidapi-key": process.env.RAPIDAPI_KEY
      }
    })
  }

  _nameFormat(name) {
    return name.toLowerCase().split(' ').join('')
  }

  /**
   * given an array of teams and 
   * the name of a searched team as a string, 
   * it returns the searched team as an object
   */
  _findTheTeam(arrayOfTeams, searchedTeam) {
    const result = arrayOfTeams.filter(team => {
      return this._nameFormat(team.name) === this._nameFormat(searchedTeam)
    })
    const [ team ] = result
    return team
  }

  _findTheLeague(arrayOfLeague, searchedLeague, countryName) {
    const result = arrayOfLeague.filter(league => {
      return this._nameFormat(league.name) === this._nameFormat(searchedLeague) &&
        this._nameFormat(league.country) === this._nameFormat(countryName)
    })
    const [ league ] = result

    return league
  }

  /**
   * given a name and its type (team or league),
   * it returns its ID
   */
  _fromNameToId(name, type) {
    return type === 'team' ? name.team_id : name.league_id
  }
   
  _getCurrentSeasonForAllLeagues() {
    return new Promise((resolve, reject) => {
      this.http.get('v2/leagues/current/')
      .then(res => resolve(res.data.api.leagues))
      .catch(err => reject(err))
    })
  }
  
  getTeamByName(teamName) {
    return new Promise((resolve, reject) => {
      return this.http.get(`v2/teams/search/${teamName}`)
        .then(res =>
          res.data.api.results ? resolve(res.data.api.teams) : 
            resolve(res.data.api.results)
        )
        .catch(err => reject(err))
    })
  }

  getLeagueByName(leagueName) {
    return new Promise((resolve, reject) => {
      return this.http.get(`/v2/leagues/search/${leagueName}`)
        .then(res =>
          res.data.api.results ? resolve(res.data.api.leagues) : 
            resolve(res.data.api.results)
        )
        .catch(err => reject(err))
    })
  }

  /**
   * given a team name and X number of matches,
   * it returns the last X matches of that team
   */
  getLastMatches(teamName, numberOfMatches) {
    return new Promise((resolve, reject) => {
      this.getTeamByName(teamName)
        .then(teams => {
          const searchedTeam = this._findTheTeam(teams, teamName)
          if (!searchedTeam) {
            throw createError(404, 'team not found')
          }
          const teamId = this._fromNameToId(searchedTeam, 'team')

          return this.http.get(`/v2/fixtures/team/${teamId}/last/${numberOfMatches}`)
            .then(match => resolve(match.data))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  /**
   * given a team name and X number of matches,
   * it returns the next X matches of that team
   */
  getNextMatches(teamName, numberOfMatches) {
    return new Promise((resolve, reject) => {
      this.getTeamByName(teamName)
        .then(teams => {
          const searchedTeam = this._findTheTeam(teams, teamName)
          if (!searchedTeam) {
            throw createError(404, 'team not found')
          }
          const teamId = this._fromNameToId(searchedTeam, 'team')

          return this.http.get(`/v2/fixtures/team/${teamId}/next/${numberOfMatches}`)
            .then(match => resolve(match.data))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  /**
   * given a league name and the country to which it belongs,
   * it returns the league table of that league
   */
  getLeagueTable(leagueName, countryName) {
    return new Promise((resolve, reject) => {
      this._getCurrentSeasonForAllLeagues()
        .then(leagues => {
          const searchedLeague = this._findTheLeague(leagues, leagueName, countryName)
          if (!searchedLeague) {
            throw createError(404, 'league table not found')
          }
          const leagueId = this._fromNameToId(searchedLeague, 'league')
          
          return this.http.get(`/v2/leagueTable/${leagueId}`)
            .then(leagueTable => resolve(leagueTable.data))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = new ApiFootball