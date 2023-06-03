import { useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Game from './game/Game.jsx';
import Landing from './landing/Landing.jsx';
import TopMenu from './TopMenu.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route
            exact
            path="/"
            element={
              <>
                <TopMenu /> {/* Add TopMenu component inside the route */}
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
