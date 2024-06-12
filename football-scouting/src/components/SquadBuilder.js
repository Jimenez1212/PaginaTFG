import React, { useState } from 'react';
import { Box, MenuItem, Select, Typography, Modal, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField } from '@mui/material';
import { styled } from '@mui/system';
import jugadoresDatos from '../data/jugadoresDatos.json';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto'
};

const formations = {
  '4-3-3': [
    { position: 'POR', top: '90%', left: '50%' },
    { position: 'DF(I)', top: '75%', left: '15%' },
    { position: 'DF(C1)', top: '75%', left: '40%' },
    { position: 'DF(C2)', top: '75%', left: '60%' },
    { position: 'DF(D)', top: '75%', left: '85%' },
    { position: 'MC', top: '55%', left: '50%' },
    { position: 'ME(I)', top: '43%', left: '30%' },
    { position: 'ME(D)', top: '43%', left: '70%' },
    { position: 'MP(I)', top: '25%', left: '15%' },
    { position: 'DL', top: '20%', left: '50%' },
    { position: 'MP(D)', top: '25%', left: '85%' },
  ],
  '4-4-2': [
    { position: 'POR', top: '85%', left: '50%' },
    { position: 'DF(I)', top: '65%', left: '20%' },
    { position: 'DF(C1)', top: '65%', left: '35%' },
    { position: 'DF(C2)', top: '65%', left: '65%' },
    { position: 'DF(D)', top: '65%', left: '80%' },
    { position: 'ME(I)', top: '50%', left: '20%' },
    { position: 'MC1', top: '50%', left: '40%' },
    { position: 'MC2', top: '50%', left: '60%' },
    { position: 'ME(D)', top: '50%', left: '80%' },
    { position: 'DL1', top: '30%', left: '35%' },
    { position: 'DL2', top: '30%', left: '65%' },
  ],
};

const Field = styled('div')({
  width: '400px',
  height: '600px',
  background: 'url(/images/field.png) no-repeat center center',
  backgroundSize: 'contain',
  position: 'relative',
  margin: '0 auto',
});

const PositionMarker = styled('div')(({ top, left }) => ({
  width: '40px',
  height: '40px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '50%',
  position: 'absolute',
  top: top,
  left: left,
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const SquadBuilder = () => {
  const [formation, setFormation] = useState('4-3-3');
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [open, setOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState('');
  const [suggestedPlayers, setSuggestedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = (position) => {
    setCurrentPosition(position);
    const playersInPosition = jugadoresDatos.filter((player) =>
      player.posiciones.split(',').includes(position)
    ).slice(0, 5); 
    setSuggestedPlayers(playersInPosition);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
    setSuggestedPlayers([]);
  };

  const handleFormationChange = (event) => {
    setFormation(event.target.value);
    setSelectedPlayers({});
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayers((prev) => ({ ...prev, [currentPosition]: player }));
    handleClose();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const playersInPosition = jugadoresDatos.filter((player) =>
      player.nombre.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSuggestedPlayers(playersInPosition);
  };

  const avgRating = (
    Object.values(selectedPlayers).reduce((acc, player) => acc + parseFloat(player.rating), 0) /
    Object.values(selectedPlayers).length
  ).toFixed(2);

  const avgAge = (
    Object.values(selectedPlayers).reduce((acc, player) => acc + parseInt(player.edad), 0) /
    Object.values(selectedPlayers).length
  ).toFixed(2);

  const nationalities = {};
  const teams = {};

  Object.values(selectedPlayers).forEach((player) => {
    if (player.pais in nationalities) {
      nationalities[player.pais]++;
    } else {
      nationalities[player.pais] = 1;
    }

    if (player.equipo in teams) {
      teams[player.equipo]++;
    } else {
      teams[player.equipo] = 1;
    }
  });

  return (
    <Box display="flex" justifyContent="center">
      <Box>
        <Typography variant="h4" align="center">Squad Builder</Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <Typography variant="h6">Formation</Typography>
          <Select value={formation} onChange={handleFormationChange} sx={{ ml: 2 }}>
            <MenuItem value="4-3-3">4-3-3</MenuItem>
            <MenuItem value="4-4-2">4-4-2</MenuItem>
          </Select>
          <Typography variant="h6" sx={{ ml: 2 }}>Avg Rating: {isNaN(avgRating) ? '-' : avgRating}</Typography>
          <Typography variant="h6" sx={{ ml: 2 }}>Avg Age: {isNaN(avgAge) ? '-' : avgAge}</Typography>
          <Button variant="contained" color="secondary" onClick={() => setSelectedPlayers({})} sx={{ ml: 2 }}>CLEAR</Button>
        </Box>
        <Box display="flex">
          <Field>
            {formations[formation].map(({ position, top, left }) => (
              <PositionMarker key={position} top={top} left={left} onClick={() => handleOpen(position)}>
                {selectedPlayers[position] ? (
                  <img
                    src={`/images/players/${selectedPlayers[position].nombre.toLowerCase().replace(/ /g, '_')}_${selectedPlayers[position].equipo.toLowerCase().replace(/ /g, '_')}.png`}
                    alt={selectedPlayers[position].nombre}
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  '+'
                )}
              </PositionMarker>
            ))}
          </Field>
          <Box sx={{ marginLeft: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Statistics</Typography>
            <Typography variant="subtitle1">Nationalities:</Typography>
            {Object.keys(nationalities).map((country) => (
              <Box key={country} display="flex" alignItems="center">
                <img
                  src={`/images/flags/${country.toLowerCase().replace(/ /g, '_')}.png`}
                  alt={country}
                  style={{ width: '30px', height: '20px', marginRight: '8px' }}
                />
                <Typography variant="body2">{country}: {nationalities[country]}</Typography>
              </Box>
            ))}
            <Typography variant="subtitle1">Teams:</Typography>
            {Object.keys(teams).map((team) => (
              <Box key={team} display="flex" alignItems="center">
                <img
                  src={`/images/teams/${team.toLowerCase().replace(/ /g, '_')}.png`}
                  alt={team}
                  style={{ width: '30px', height: '30px', marginRight: '8px' }}
                />
                <Typography variant="body2">{team}: {teams[team]}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Select a Player for {currentPosition}</Typography>
          <TextField
            fullWidth
            placeholder="Search for a player"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
          />
          <List>
            {suggestedPlayers.map((player) => (
              <ListItem key={player.id} button onClick={() => handlePlayerSelect(player)}>
                <ListItemAvatar>
                  <Avatar src={`/images/players/${player.nombre.toLowerCase().replace(/ /g, '_')}_${player.equipo.toLowerCase().replace(/ /g, '_')}.png`} />
                </ListItemAvatar>
                <ListItemText primary={player.nombre} />
                <img src={`/images/flags/${player.pais.toLowerCase().replace(/ /g, '_')}.png`} alt={player.pais} style={{ width: '30px', height: '20px', marginRight: '8px' }} />
                <img src={`/images/teams/${player.equipo.toLowerCase().replace(/ /g, '_')}.png`} alt={player.equipo} style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                <Typography variant="body2">{player.rating}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Box>
  );
};

export default SquadBuilder;
