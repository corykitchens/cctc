const queries = require('./queries.js');
const { query } = require('../db');
const jwt = require('jsonwebtoken');


const userCache = {
  team_id: null,
  flagsFound: {},
  maxFlag: 6,
};

const contestCache = {
  contest_id: 1,
  teams: [],
  flags: [],
  winner_id: null
};


const tokenIsValid = (givenToken) => {
  if (givenToken && userCache.hasOwnProperty('token')) {
    return givenToken === userCache['token'];
  } else {
    return false;
  }
};

async function isValidFlag (flag_id) {
  const results = await query(queries.attemptFlag, [flag_id]);
  if (results.rows.length > 0) {
    return results.rows[0];
  }
  return {};
};

const addFlagToUserCache = (flag_id, timeStamp) => {
  userCache.flagsFound[flag_id] = timeStamp;
};

async function persistAttemptToDb(flag_id, timeStamp) {
  const results = await query(queries.insertFoundFlag, [userCache['team_id'], flag_id, timeStamp]);
  return results;
};

async function isGameOver() {
  const results = await query(queries.getTeamFlagCount, [userCache.team_id])
  return results.rows[0].count == userCache.maxFlag;
};

async function instantiateTeamCache(contest_id = 1) {
  const results = await query(queries.getTeamsByContest, [contest_id]);
  return results.rows;
}

async function instantiateFlagCache(contest_id = 1) {
  const results = await query(queries.getFlagsByContest, [contest_id]);
  return results.rows;
}

async function getTeamsFlags(team_id) {
  const results = await query(queries.getTeamsFlags, [team_id]);
  return results.rows;
}

async function instantiateTeamFlags() {
  const results = await query(queries.flagsByTeam, [contestCache.contest_id])
  return results.rows;
}

const prepareResponse = (res) => {
  isGameOver()
  .then((results) => {
    return res.send({message: "correct", gameOver: results});
  })
  .catch((err) => {
    return res.send({message: "correct", gameOver: err});
  })
};

module.exports = {
  
  attemptPassword: (req, res) => {
    return res.status(200).json({message: "Get team by id"});
  },

  auth: (req, res) => {
    const { user } = req;
    if (user) {
      userCache['team_id'] = user.team_id;
      let expire_date = new Date();
      expire_date.setDate(expire_date.getDate() + 7);
      const token = jwt.sign({
        team_id: user.team_id,
        name: user.team,
        exp: parseInt(expire_date.getTime() / 1000)
      }, "Polygondwanaland");
      userCache['token'] = token;
      return res.status(200).json({token});
    } else {
      return res.status(401).json({error: 'Bad Request'});
    }
  },
  getContests: (req, res) => {
    query(queries.getContests, [])
    .then(results => res.status(200).send(results.rows))
    .catch(err => res.send(err));
  },

  getContestById: (req, res) => {
    const data = contestCache;
    if (!contestCache.teams.length || !contestCache.flags.length) {
      instantiateTeamCache()
      .then((teams) => {
        teams.forEach((team) => {
          team.flags = {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
          };
        });
        contestCache.teams = teams;
        return instantiateFlagCache();
      })
      .then((flags) => {
        contestCache.flags = flags;
        return instantiateTeamFlags();
      })
      .then((flagsByTeam) => {
        contestCache.teamFlags = flagsByTeam;
        flagsByTeam.forEach((flag) => {
          contestCache.teams[flag.team_id-1].flags[flag.flag_id] = 1;
        });
        res.send(contestCache.teams);
      })
      .catch((err) => res.send(err));
    } else {
      instantiateTeamFlags()
      .then((flagsByTeam) => {
        contestCache.teamFlags = flagsByTeam;
        flagsByTeam.forEach((flag) => {
          contestCache.teams[flag.team_id-1].flags[flag.flag_id] = 1;
        });
        res.send(contestCache.teams);
      })
      .catch((err) => {
        res.send(err);
      })
    }
  },

  endGameLoop: (req, res) => {
    res.send({game_complete: true});
  },

  tokenIsValid: (givenToken) => {
    return givenToken === userCache['token'];
  },

  failedToken: (req, res) => {
    return res.status(401).json({message: 'Invalid Token'});
  },

  attemptFlag: (req, res) => {
    let timeStamp = new Date();
    if (tokenIsValid(req.body.token)) {
      isValidFlag(req.body.flag)
      .then((flag) => {
        if (flag.hasOwnProperty('flag_id')) {
          if (userCache.flagsFound[flag.flag_id]) {
            return res.send({message: "Password already found"});
          } else {
            addFlagToUserCache(flag.flag_id, timeStamp.toUTCString());
            persistAttemptToDb(flag.flag_id, timeStamp.toUTCString())
            .then((results) => {
              prepareResponse(res);
            })
            .catch((err) => {
              prepareResponse(res);
            })
            
          }
        } else {
          res.send({message: "Invalid Attempt"});
        }
      })
      .catch((err) => res.status(401).send(err));
    } else {
      res.status(401).send({message: "Error Token Not Found"});
    }
  }
}
