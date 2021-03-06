
module.exports = {
  
  getContests: 'select contest_id, event_date, winner_id from contest',
  
  getContestById: 'select contest_id, event_date, winner_id from contest where contest_id = $1',

  setTeamAsContestWinner: 'update contest set winner_id = case when winner_id is null then $1 else winner_id end where contest_id = $2;',
  
  getFlagByValue: 'select flag_id from flag where value=$1',
  
  getAllTeams: 'select team_id, name, admin from team',
  
  getTeamById: 'select name from team where team_id=$1',

  getUserLevel: 'select admin from team where team_id=$1',
  
  getTeamsFlags: 'select distinct team.team_id, team.name, flag.flag_id, flag.value from team \
                 join team_flag on team.team_id = team_flag.team_id \
                 join flag on team_flag.flag_id = flag.flag_id \
                 WHERE team.team_id = $1',

  getTeamsFlagById: 'select * from team_flag where team_id=$1 and flag_id=$2',


  getTeamFlagCount: 'select distinct count(team.team_id) from team \
                 join team_flag on team.team_id = team_flag.team_id \
                 join flag on team_flag.flag_id = flag.flag_id \
                 WHERE team.team_id = $1',

  getMaxFlagCount: 'select count(flag.flag_id) from flag',

  auth: 'select team_id, name, password, admin from team where name=$1',

  insertFoundFlag: 'insert into team_flag values ($1, $2, $3)',

  getTeamsByContest: 'select team.team_id, team.name from team \
                      inner join contest_team on team.team_id = contest_team.team_id \
                      where contest_team.contest_id = $1;',
  
  getFlagsByContest: 'select flag.flag_id, value from flag \
                      inner join contest_flag on contest_flag.flag_id = flag.flag_id \
                      where contest_flag.contest_id = $1;',

  flagsByTeam: 'select distinct * from team_flag \
                inner join contest_team on contest_team.team_id = team_flag.team_id \
                where contest_team.contest_id = $1;',

  deleteFoundFlagsInContest: 'delete from team_flag \
                              where team_flag.flag_id in \
                              (select flag_id from contest_flag \
                              where contest_flag.contest_id = $1)',

  getFoundFlagsByAllTeams: 'select team.team_id, team_flag.flag_id from team \
                            join team_flag on team_flag.team_id = team.team_id ORDER BY team.team_id;'
}