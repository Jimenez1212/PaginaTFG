import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Players from './components/Players';
import Leagues from './components/Leagues';
import Teams from './components/Teams';
import LeagueTeams from './components/LeagueTeams';
import TeamPlayers from './components/TeamPlayers';
import Navbar from './components/Navbar';
import SquadBuilder from './components/SquadBuilder';

const App = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
  };

  return (
    <Router>
      <Navbar onPlayerSelect={handlePlayerSelect} />
      <Routes>
        <Route path="/" element={<Home onPlayerSelect={handlePlayerSelect} />} />
        <Route path="/players" element={<Players selectedPlayer={selectedPlayer} />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/leagues/:leagueName/teams" element={<LeagueTeams />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamName" element={<TeamPlayers />} />
        <Route path="/squad-builder" element={<SquadBuilder />} />
      </Routes>
    </Router>
  );
};

export default App;

//npm start
