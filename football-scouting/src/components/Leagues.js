import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import leaguesData from '../data/leaguesData.json';
import teamsData from '../data/teamsData.json';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    setLeagues(leaguesData);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const loadMoreLeagues = () => {
    setVisibleCount(visibleCount + 20);
  };

  const handleLeagueClick = (leagueName) => {
    navigate(`/leagues/${leagueName}/teams`);
  };

  const filteredLeagues = leagues.filter((league) =>
    league.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, visibleCount);

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Search a league..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filteredLeagues.map((league) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={league.id}>
            <Card 
              onClick={() => handleLeagueClick(league.name)} 
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '300px' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                  <img src={`/images/leagues/${league.name.toLowerCase().replace(/ /g, '_')}.png`} alt={league.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Box>
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>{league.name}</Typography>
                <Typography variant="body2" align="center">Country: {league.country}</Typography>
                <Typography variant="body2" align="center">Teams: {teamsData.filter(team => team.league === league.name).length}</Typography>
                <Typography variant="body2" align="center">Founded: {league.founded}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {visibleCount < leagues.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={loadMoreLeagues}>Load More</Button>
        </Box>
      )}
    </Box>
  );
};

export default Leagues;
