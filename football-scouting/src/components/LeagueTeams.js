import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import teamsData from '../data/teamsData.json';
import jugadoresData from '../data/jugadoresDatos.json';

const LeagueTeams = () => {
  const { leagueName } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const leagueTeams = teamsData.filter(team => team.league === leagueName);
    setTeams(leagueTeams);
  }, [leagueName]);

  const loadMoreTeams = () => {
    setVisibleCount(visibleCount + 20);
  };

  const calculateAverageRating = (teamName) => {
    const teamPlayers = jugadoresData.filter(player => player.equipo === teamName);
    const totalRating = teamPlayers.reduce((sum, player) => sum + parseFloat(player.rating), 0);
    return teamPlayers.length ? (totalRating / teamPlayers.length).toFixed(2) : 'N/A';
  };

  const teamsWithRatings = teams.map((team) => ({
    ...team,
    avgRating: calculateAverageRating(team.name),
  }));

  const handleTeamClick = (teamName) => {
    navigate(`/teams/${teamName}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" onClick={handleBackClick} sx={{ mb: 2 }}>
        Back
      </Button>
      <Grid container spacing={2}>
        {teamsWithRatings.slice(0, visibleCount).map((team) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
            <Card onClick={() => handleTeamClick(team.name)} style={{ cursor: 'pointer', height: '100%' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <img src={`/images/teams/${team.name.toLowerCase().replace(/ /g, '_')}.png`} alt={team.name} style={{ width: '100px', height: '100px', objectFit: 'contain', margin: '0 auto' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>{team.name}</Typography>
                <Typography variant="body2">Value: {team.value}</Typography>
                <Typography variant="body2">Stadium: {team.stadium}</Typography>
                <Typography variant="body2">Average Rating: {team.avgRating}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {visibleCount < teams.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={loadMoreTeams}>Load More</Button>
        </Box>
      )}
    </Box>
  );
};

export default LeagueTeams;
