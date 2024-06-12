import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, Box, TextField, MenuItem, Button, IconButton } from '@mui/material';
import PlayerModal from './PlayerModal';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import jugadoresData from '../data/jugadoresDatos.json';
import leaguesData from '../data/leaguesData.json';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom';

const positions = ['POR', 'DF(C)', 'DF(I)', 'DF(D)', 'MC', 'ME(C)', 'ME(I)', 'ME(D)', 'MP(C)', 'MP(I)', 'MP(D)', 'DL'];
const nations = ['España', 'Francia', 'Alemania', 'Italia', 'Inglaterra', 'Argentina', 'Brasil', 'Países Bajos', 'Portugal'];

const allFeatures = [
  'edad', 'entradas', 'intercepciones', 'despejes', 'balones_perdidos', 'controles_malos', 
  'pases_clave', 'pases_por_partido', 'acierto_pases%', 'centros_por_partido', 'goles', 
  'asistencias', 'tiros_por_partido', 'regates', 'balones_largos_por_partido', 
  'pases_al_hueco_por_partido', 'fueras_de_juego'
];

const Flag = styled('img')({
  width: '20px',
  height: '15px',
  marginLeft: '5px',
  border: '1px solid #ddd',
  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
  backgroundColor: '#fff',
});

const LOAD_MORE_COUNT = 20;

function Players() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    nation: '',
    league: '',
    position: '',
    minAge: '',
    maxAge: '',
    minRating: '',
    maxRating: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [visibleCount, setVisibleCount] = useState(LOAD_MORE_COUNT);
  const [teamToLeagueMap, setTeamToLeagueMap] = useState({});
  const [predictedRatings, setPredictedRatings] = useState({});
  const location = useLocation();

  useEffect(() => {
    const map = {};
    leaguesData.forEach(league => {
      league.teams.forEach(team => {
        map[team] = league.name;
      });
    });
    setTeamToLeagueMap(map);

    if (location.state && location.state.selectedPlayer) {
      setSelectedPlayer(location.state.selectedPlayer);
      setOpen(true);
    }

    // Obtener las predicciones para los jugadores visibles inicialmente
    updateVisiblePlayers();
  }, [location]);

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

    setPredictedRatings(prevRatings => ({
      ...prevRatings,
      ...newPredictedRatings
    }));
  };

  const replaceHyphensWithZero = (value) => {
    return value === '-' ? 0 : value;
  };

  const getFeatures = (player) => {
    const features = {};
    allFeatures.forEach(feature => {
      features[feature] = replaceHyphensWithZero(player[feature] || 0);
    });
    return features;
  };

  const handleOpen = (player) => {
    setSelectedPlayer(player);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPlayer(null);
    setOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setVisibleCount(LOAD_MORE_COUNT);
    updateVisiblePlayers();
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const updateVisiblePlayers = () => {
    const filteredPlayers = jugadoresData.filter(player => {
      const playerLeague = teamToLeagueMap[player.equipo];
      return (
        (filters.nation === '' || player.pais === filters.nation) &&
        (filters.league === '' || playerLeague === filters.league) &&
        (filters.position === '' || player.posiciones.includes(filters.position)) &&
        (filters.minAge === '' || player.edad >= parseInt(filters.minAge)) &&
        (filters.maxAge === '' || player.edad <= parseInt(filters.maxAge)) &&
        (filters.minRating === '' || player.rating >= parseInt(filters.minRating)) &&
        (filters.maxRating === '' || player.rating <= parseInt(filters.maxRating))
      );
    });

    const playersToShow = filteredPlayers.slice(0, LOAD_MORE_COUNT);
    getPredictions(playersToShow);
    setVisiblePlayers(playersToShow);
  };

  const [visiblePlayers, setVisiblePlayers] = useState([]);

  useEffect(() => {
    updateVisiblePlayers();
  }, [filters]);

  const loadMorePlayers = () => {
    const newVisibleCount = visibleCount + LOAD_MORE_COUNT;
    setVisibleCount(newVisibleCount);
    const filteredPlayers = jugadoresData.filter(player => {
      const playerLeague = teamToLeagueMap[player.equipo];
      return (
        (filters.nation === '' || player.pais === filters.nation) &&
        (filters.league === '' || playerLeague === filters.league) &&
        (filters.position === '' || player.posiciones.includes(filters.position)) &&
        (filters.minAge === '' || player.edad >= parseInt(filters.minAge)) &&
        (filters.maxAge === '' || player.edad <= parseInt(filters.maxAge)) &&
        (filters.minRating === '' || player.rating >= parseInt(filters.minRating)) &&
        (filters.maxRating === '' || player.rating <= parseInt(filters.maxRating))
      );
    });
    const playersToShow = filteredPlayers.slice(0, newVisibleCount);
    getPredictions(playersToShow);
    setVisiblePlayers(playersToShow);
  };

  const sortedPlayers = [...visiblePlayers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const formatString = (str) => {
    return str.toLowerCase().replace(/\s+/g, '_');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '100%', maxWidth: 1200 }}>
        <TextField
          select
          label="Nation"
          name="nation"
          value={filters.nation}
          onChange={handleFilterChange}
          fullWidth
        >
          {nations.map((nation) => (
            <MenuItem key={nation} value={nation}>
              {nation}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="League"
          name="league"
          value={filters.league}
          onChange={handleFilterChange}
          fullWidth
        >
          {leaguesData.map((league) => (
            <MenuItem key={league.id} value={league.name}>
              {league.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Position"
          name="position"
          value={filters.position}
          onChange={handleFilterChange}
          fullWidth
        >
          {positions.map((position) => (
            <MenuItem key={position} value={position}>
              {position}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Min Age"
          name="minAge"
          value={filters.minAge}
          onChange={handleFilterChange}
          type="number"
          fullWidth
        />
        <TextField
          label="Max Age"
          name="maxAge"
          value={filters.maxAge}
          onChange={handleFilterChange}
          type="number"
          fullWidth
        />
        <TextField
          label="Min Rating"
          name="minRating"
          value={filters.minRating}
          onChange={handleFilterChange}
          type="number"
          fullWidth
        />
        <TextField
          label="Max Rating"
          name="maxRating"
          value={filters.maxRating}
          onChange={handleFilterChange}
          type="number"
          fullWidth
        />
        <Button variant="outlined" onClick={() => {
          setFilters({
            nation: '',
            league: '',
            position: '',
            minAge: '',
            maxAge: '',
            minRating: '',
            maxRating: ''
          });
          updateVisiblePlayers();
        }}>
          Reset
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 1200, marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Rating
                  <IconButton size="small" onClick={() => requestSort('rating')}>
                    {sortConfig.key === 'rating' && sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Age
                  <IconButton size="small" onClick={() => requestSort('edad')}>
                    {sortConfig.key === 'edad' && sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Predicted Rating
                  <IconButton size="small" onClick={() => requestSort('predicted_rating')}>
                    {sortConfig.key === 'predicted_rating' && sortConfig.direction === 'ascending'}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map(player => (
              <TableRow key={player.id} onClick={() => handleOpen(player)} style={{ cursor: 'pointer' }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={`/images/players/${formatString(player.nombre)}_${formatString(player.equipo)}.png`} alt={player.nombre} onError={(e) => e.target.src = '/images/placeholder.png'} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6">
                        {player.nombre}
                        <Flag src={`/images/flags/${formatString(player.pais)}.png`} alt={player.pais} />
                      </Typography>
                      <Typography variant="body2">{player.equipo}</Typography>
                      <Typography variant="body2">{player.posiciones}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{player.rating}</TableCell>
                <TableCell>{player.edad}</TableCell>
                <TableCell>{predictedRatings[player.id] !== undefined ? predictedRatings[player.id].toFixed(2) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {visibleCount < jugadoresData.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={loadMorePlayers}>Load More</Button>
        </Box>
      )}
      {selectedPlayer && <PlayerModal open={open} handleClose={handleClose} player={selectedPlayer} predictedRating={predictedRatings[selectedPlayer.id]} />}
    </Box>
  );
}

export default Players;
