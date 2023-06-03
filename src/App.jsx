import { useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Game from './components/game/Game.jsx';
import Landing from './components/landing/Landing.jsx';
import TopMenu from './components/main/TopMenu.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route
            exact
            path="/"
            element={
              <>
                <TopMenu />
                <Game />
              </>
            }
          />
          <Route exact path="/landing" element={ <Landing /> } />
      </Routes>
    </Router>
  );
}

export default App;
