import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, TextField, Card, CardContent, Button, Avatar } from '@mui/material';
import PlayerModal from './PlayerModal'; 
import playersData from '../data/jugadoresDatos.json';
import axios from 'axios';

const TeamPlayers = () => {
  const { teamName } = useParams();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null); 
  const [predictedRatings, setPredictedRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const teamPlayers = playersData.filter(player => player.equipo === teamName);
    setPlayers(teamPlayers);
  }, [teamName]);

  const replaceHyphensWithZero = (value) => {
    return value === '-' ? 0 : value;
  };

  useEffect(() => {
    if (players.length > 0) {
      getPredictions(players);
    }
  }, [players]);

  const getPredictions = async (players) => {
    const featuresList = players.map(player => ({
      id: player.id,
      position: player.posiciones,
      features: getFeatures(player)
    }));

    const response = await axios.post('http://localhost:5000/predict', {
      players: featuresList
    });

    const predictions = response.data.predicted_ratings;
    const newPredictedRatings = {};
    players.forEach((player, index) => {
      newPredictedRatings[player.id] = predictions[index];
    });

    setPredictedRatings(newPredictedRatings);
  };

  const getFeatures = (player) => {
    const allFeatures = [
      'edad', 'entradas', 'intercepciones', 'despejes', 'balones_perdidos', 'controles_malos', 
      'pases_clave', 'pases_por_partido', 'acierto_pases%', 'centros_por_partido', 'goles', 
      'asistencias', 'tiros_por_partido', 'regates', 'balones_largos_por_partido', 
      'pases_al_hueco_por_partido', 'fueras_de_juego'
    ];
    const features = {};
    allFeatures.forEach(feature => {
      features[feature] = replaceHyphensWithZero(player[feature] !== undefined ? player[feature] : 0);
    });
    return features;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player); 
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null); 
  };

  const filteredPlayers = players.filter((player) =>
    player.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={`/images/teams/${teamName.toLowerCase().replace(/ /g, '_')}.png`}
          alt={teamName}
          style={{ width: '200px', height: '200px', objectFit: 'contain', mb: 2 }}
        />
        <Typography variant="h4" sx={{ mb: 2 }}>{teamName}</Typography>
      </Box>
      <TextField
        label="Search a player..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filteredPlayers.map((player) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
            <Card onClick={() => handlePlayerClick(player)} style={{ cursor: 'pointer', height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', height: '150px' }}>
                <Avatar
                  src={`/images/players/${player.nombre.toLowerCase().replace(/ /g, '_')}_${player.equipo.toLowerCase().replace(/ /g, '_')}.png`}
                  alt={player.nombre}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{player.nombre}</Typography>
                  <Typography variant="body2">Age: {player.edad}</Typography>
                  <Typography variant="body2">Position: {player.posiciones}</Typography>
                  <Typography variant="body2">Rating: {player.rating}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedPlayer && (
        <PlayerModal
          open={!!selectedPlayer}
          handleClose={handleCloseModal}
          player={selectedPlayer}
          predictedRating={predictedRatings[selectedPlayer.id]}
        />
      )}
    </Box>
  );
};

export default TeamPlayers;
