import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import teamsData from '../data/teamsData.json';
import jugadoresData from '../data/jugadoresDatos.json';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const loadMoreTeams = () => {
    setVisibleCount(visibleCount + 20);
  };

  const calculateAverageRating = (teamName) => {
    const teamPlayers = jugadoresData.filter(player => player.equipo === teamName);
    const totalRating = teamPlayers.reduce((sum, player) => sum + parseFloat(player.rating), 0);
    return teamPlayers.length ? (totalRating / teamPlayers.length).toFixed(2) : 'N/A';
  };

  const teamsWithRatings = teamsData.map((team) => ({
    ...team,
    avgRating: calculateAverageRating(team.name),
  }));

  const filteredTeams = teamsWithRatings.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.avgRating - a.avgRating).slice(0, visibleCount);

  const handleTeamClick = (teamName) => {
    navigate(`/teams/${teamName}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Search a team..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filteredTeams.map((team) => (
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
      {visibleCount < teamsWithRatings.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={loadMoreTeams}>Load More</Button>
        </Box>
      )}
    </Box>
  );
};

export default Teams;
