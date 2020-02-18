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

  /**
   * given an array of teams and 
   * the name of a searched team as a string, 
   * it returns the searched team as an object
   */
  _nameFormat(name) {
    return name.toLowerCase().split(' ').join('')
  }

  _findTheTeam(arrayOfTeams, searchedTeam) {
    const result = arrayOfTeams.filter(team => {
      return this._nameFormat(team.name) === this._nameFormat(searchedTeam)
    })
    const [ team ] = result
    return team
  }

  /**
   * given a team name as an object,
   * it returns its ID
   */
  _fromTeamNameToTeamId(teamName) {
    return teamName.team_id
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
   * it return the last X matches of that team
   */
  getLastMatches(teamName, numberOfMatches) {
    return new Promise((resolve, reject) => {
      this.getTeamByName(teamName)
        .then(teams => {
          const searchedTeam = this._findTheTeam(teams, teamName)
          const teamId = this._fromTeamNameToTeamId(searchedTeam)

          return this.http.get(`/v2/fixtures/team/${teamId}/last/${numberOfMatches}`)
            .then(match => resolve(match.data))
            .catch(err => reject(err))
        })
    })
  }

  /**
   * given a team name and X number of matches,
   * it return the next X matches of that team
   */
  getNextMatches(teamName, numberOfMatches) {
    return new Promise((resolve, reject) => {
      this.getTeamByName(teamName)
        .then(teams => {
          const searchedTeam = this._findTheTeam(teams, teamName)
          const teamId = this._fromTeamNameToTeamId(searchedTeam)

          return this.http.get(`/v2/fixtures/team/${teamId}/next/${numberOfMatches}`)
            .then(match => resolve(match.data))
            .catch(err => reject(err))
        })
    })
  }
  
}

module.exports = new ApiFootball