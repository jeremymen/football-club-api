const axios = require('axios')

class ApiFootball {
  
  constructor() {
    this.http = axios.create({
      baseURL: 'https://api-football-v1.p.rapidapi.com',
      headers: {
       "content-type": "application/json",
       "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
       "x-rapidapi-key": process.env.RAPIDAPI_KEY
      }
    }),
    this.EN = 524
    this.FR = 525
    this.ES = 775
    this.IT = 891
  }

  getLeagues() {
    return this.http.get('/v2/leagues')
      .then(res => {
        return res.data.api.leagues.filter(league => {
          return league.league_id === this.EN ||
            league.league_id === this.FR ||
            league.league_id === this.ES ||
            league.league_id === this.IT
        })
      })
  }

  getOneLeague(leagueName) {

    switch(leagueName.toLowerCase()) {
      case 'seriea':
         return this.http.get(`/v2/leagues/league/${this.IT}`)
          .then(res => res.data.api.leagues)
      case 'premierleague':
        return this.http.get(`/v2/leagues/league/${this.EN}`)
          .then(res => res.data.api.leagues)
      case 'leagueone':
        return this.http.get(`/v2/leagues/league/${this.FR}`)
          .then(res => res.data.api.leagues)
      case 'laliga':
        return this.http.get(`/v2/leagues/league/${this.ES}`)
          .then(res => res.data.api.leagues)
    }
  }

  getTeams(leagueName) {
    
    switch(leagueName.toLowerCase()) {
      case 'seriea':
         return this.http.get(`/v2/teams/league/${this.IT}`)
          .then(res => res.data.api.teams)
      case 'premierleague':
        return this.http.get(`/v2/teams/league/${this.EN}`)
          .then(res => res.data.api.teams)
      case 'leagueone':
        return this.http.get(`/v2/teams/league/${this.FR}`)
          .then(res => res.data.api.teams)
      case 'laliga':
        return this.http.get(`/v2/teams/league/${this.ES}`)
          .then(res => res.data.api.teams)
    }
  }
  
}

module.exports = new ApiFootball