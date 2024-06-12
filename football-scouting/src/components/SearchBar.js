import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jugadoresData from '../data/jugadoresDatos.json';
import { styled } from '@mui/system';

const SearchResult = styled(Paper)({
  position: 'absolute',
  width: '100%',
  maxHeight: '300px',
  overflowY: 'auto',
  zIndex: 1,
});

const Flag = styled('img')({
  width: '20px',
  height: '15px',
  marginLeft: '5px',
  border: '1px solid #ddd',
  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
  backgroundColor: '#fff',
});

const TeamLogo = styled('img')({
  width: '20px',
  height: '20px',
  marginLeft: '5px',
  marginRight: '5px',
  border: '1px solid #ddd',
  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
  backgroundColor: '#fff',
});

const SearchBar = ({ onPlayerSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      const results = jugadoresData.filter(player =>
        player.nombre.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 15); 
      setFilteredPlayers(results);
    } else {
      setFilteredPlayers([]);
    }
  }, [query]);

  const handlePlayerClick = (player) => {
    onPlayerSelect(player);
    onClose();
    navigate('/players', { state: { selectedPlayer: player } });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        label="Search Players"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredPlayers.length > 0 && (
        <SearchResult>
          <List>
            {filteredPlayers.map(player => (
              <ListItem button key={player.id} onClick={() => handlePlayerClick(player)}>
                <ListItemAvatar>
                  <Avatar src={`/images/players/${player.nombre.toLowerCase().replace(/\s+/g, '_')}_${player.equipo.toLowerCase().replace(/\s+/g, '_')}.png`} />
                </ListItemAvatar>
                <ListItemText
                  primary={player.nombre}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Flag src={`/images/flags/${player.pais.toLowerCase().replace(/\s+/g, '_')}.png`} alt={player.pais} />
                      <TeamLogo src={`/images/teams/${player.equipo.toLowerCase().replace(/\s+/g, '_')}.png`} alt={player.equipo} />
                    </Box>
                  }
                />
                <Typography variant="body2" sx={{ ml: 'auto', backgroundColor: 'yellow', padding: '0 4px' }}>
                  {player.rating}
                </Typography>
              </ListItem>
            ))}
          </List>
        </SearchResult>
      )}
    </Box>
  );
};

export default SearchBar;
