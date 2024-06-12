import React from 'react';
import { Modal, Box, Typography, Avatar, Grid } from '@mui/material';
import { styled } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700, 
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Field = styled('div')({
  width: '200px',
  height: '300px',
  background: 'url(/images/field.png) no-repeat center center',
  backgroundSize: 'contain',
  position: 'relative',
  borderRadius: '10px',
  margin: '0 auto',
});

const PositionMarker = styled('div')(({ top, left }) => ({
  width: '30px',
  height: '30px',
  backgroundColor: 'red',
  borderRadius: '50%',
  position: 'absolute',
  top: top,
  left: left,
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '12px', 
  fontWeight: 'bold'
}));

const positionMapping = {
  'POR': { top: '90%', left: '50%' },
  'DF(C)': { top: '75%', left: '50%' },
  'DF(I)': { top: '75%', left: '15%' },
  'DF(D)': { top: '75%', left: '85%' },
  'MC': { top: '55%', left: '50%' },
  'ME(C)': { top: '45%', left: '50%' },
  'ME(I)': { top: '45%', left: '20%' },
  'ME(D)': { top: '45%', left: '80%' },
  'MP(C)': { top: '30%', left: '50%' },
  'MP(I)': { top: '25%', left: '20%' },
  'MP(D)': { top: '25%', left: '80%' },
  'DL': { top: '15%', left: '50%' },
};

const splitPositions = (position) => {
  const parts = position.match(/[A-Z]+|\([CID]+\)/g);
  if (parts.length === 2) {
    const base = parts[0];
    const details = parts[1].replace('(', '').replace(')', '').split('');
    return details.map(detail => `${base}(${detail})`);
  }
  return [position];
};

const Flag = styled('img')({
  width: '30px',
  height: '20px',
  marginLeft: '10px',
  border: '1px solid #ddd',
  boxShadow: '0 0 2px rgba(0,0,0,0.3)',
  backgroundColor: '#fff',
});

const TeamLogo = styled('img')({
  width: '60px',
  height: 'auto', 
  marginLeft: '10px',
  border: 'none', 
  boxShadow: 'none', 
  maxWidth: '60px', 
  maxHeight: '60px' 
});

const PlayerModal = ({ open, handleClose, player, predictedRating }) => {
  const positions = player.posiciones.split(',').flatMap(pos => splitPositions(pos.trim()));

  const getPositionMarkers = (position) => {
    const mappedPosition = positionMapping[position];
    return (
      <PositionMarker key={position} top={mappedPosition.top} left={mappedPosition.left}>
        {position}
      </PositionMarker>
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={`/images/players/${player.nombre.toLowerCase().replace(/ /g, '_')}_${player.equipo.toLowerCase().replace(/ /g, '_')}.png`}
              alt={player.nombre}
              sx={{ width: 100, height: 100 }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">{player.nombre}</Typography>
              <Typography variant="body2">{player.equipo}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">{player.pais}</Typography>
                <Flag src={`/images/flags/${player.pais.toLowerCase().replace(/ /g, '_')}.png`} alt={player.pais} />
              </Box>
            </Box>
            <TeamLogo src={`/images/teams/${player.equipo.toLowerCase().replace(/ /g, '_')}.png`} alt={player.equipo} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Edad: {player.edad}</Typography>
            <Typography variant="subtitle1">Posiciones: {positions.join(', ')}</Typography>
            <Typography variant="subtitle1">Goles: {player.goles}</Typography>
            <Typography variant="subtitle1">Asistencias: {player.asistencias}</Typography>
            <Typography variant="subtitle1">Rating: {player.rating}</Typography>
            <Typography variant="subtitle1">Minutos Jugados: {player.mins}</Typography>
            <Typography variant="subtitle1">Intercepciones: {player.intercepciones}</Typography>
            <Typography variant="subtitle1">Entradas: {player.entradas}</Typography>
            <Typography variant="subtitle1">Regates: {player.regates}</Typography>
            <Typography variant="subtitle1">Pases Clave: {player.pases_clave}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field>
              {positions.map(pos => getPositionMarkers(pos))}
            </Field>
          </Grid>
          <Box sx={{ position: 'absolute', top: '50px', right: '26%', transform: 'translateX(50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Predicted Rating</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green' }}>{predictedRating !== undefined ? predictedRating.toFixed(2) : 'N/A'}</Typography>
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
};

export default PlayerModal;
