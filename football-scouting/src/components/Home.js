import React from 'react';
import { Box } from '@mui/material';
import SearchBar from './SearchBar';

function Home({ onPlayerSelect }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '200px' }} />
      </Box>
      <Box sx={{ width: '50%', marginTop: '20px' }}>
        <SearchBar onPlayerSelect={onPlayerSelect} />
      </Box>
    </Box>
  );
}

export default Home;
