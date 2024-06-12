import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Button } from '@mui/material';
import { AccountCircle, Language, MonetizationOn, Group, SportsSoccer, FormatListBulleted, Build, Search, Euro, CurrencyPound } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import WorldFlag from 'react-world-flags';
import SearchBar from './SearchBar';

function Navbar({ onPlayerSelect }) {
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [anchorElCurr, setAnchorElCurr] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [selectedCurr, setSelectedCurr] = useState('USD');

  const handleLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCurrMenu = (event) => {
    setAnchorElCurr(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElLang(null);
    setAnchorElCurr(null);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    handleClose();
  };

  const handleCurrChange = (curr) => {
    setSelectedCurr(curr);
    handleClose();
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
        </Link>
        <IconButton color="inherit" onClick={handleSearchToggle}>
          <Search />
        </IconButton>
        {searchOpen && (
          <Box sx={{ marginLeft: '10px', marginRight: '20px', width: '300px' }}>
            <SearchBar onPlayerSelect={onPlayerSelect} onClose={handleSearchClose} />
          </Box>
        )}
        <Button color="inherit" component={Link} to="/players" startIcon={<Group />}>Players</Button>
        <Button color="inherit" component={Link} to="/leagues" startIcon={<SportsSoccer />}>Leagues</Button>
        <Button color="inherit" component={Link} to="/teams" startIcon={<FormatListBulleted />}>Teams</Button>
        <Button color="inherit" component={Link} to="/squad-builder" startIcon={<Build />}>Builder</Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={handleLangMenu}>
          {selectedLang === 'EN' && <WorldFlag code="GB" style={{ width: 24, height: 24 }} />}
          {selectedLang === 'ES' && <WorldFlag code="ES" style={{ width: 24, height: 24 }} />}
        </IconButton>
        <Menu
          anchorEl={anchorElLang}
          open={Boolean(anchorElLang)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleLangChange('EN')}>English</MenuItem>
          <MenuItem onClick={() => handleLangChange('ES')}>Español</MenuItem>
        </Menu>
        <IconButton color="inherit" onClick={handleCurrMenu}>
          {selectedCurr === 'USD' && <MonetizationOn style={{ width: 24, height: 24 }} />}
          {selectedCurr === 'EUR' && <Euro style={{ width: 24, height: 24 }} />}
          {selectedCurr === 'GBP' && <CurrencyPound style={{ width: 24, height: 24 }} />}
        </IconButton>
        <Menu
          anchorEl={anchorElCurr}
          open={Boolean(anchorElCurr)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleCurrChange('USD')}>USD</MenuItem>
          <MenuItem onClick={() => handleCurrChange('EUR')}>EUR</MenuItem>
          <MenuItem onClick={() => handleCurrChange('GBP')}>GBP</MenuItem>
        </Menu>
        <IconButton color="inherit" component={Link} to="/login">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
