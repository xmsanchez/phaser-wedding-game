import { useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Game from './components/game/Game.jsx';
import Landing from './components/landing/Landing.jsx';
import TopMenu from './components/main/TopMenu.jsx';
import KillingGame from './components/killingGame/Landing.jsx';

import ReactGA from "react-ga";
const TRACKING_ID = "G-ZH68BVB2WF";
ReactGA.initialize(TRACKING_ID);

// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'G-ZH68BVB2WF');

const RouteChangeTracker = ({ history }) => {
  history.listen((location, action) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
  });
  return <div></div>;
};

function GetParameters(decode) {
  const searchParams = new URLSearchParams(window.location.search);
	const groupedParams = Object.fromEntries(searchParams);

  if(decode){
    let decodedParameters = {};
    try {
      const decodedString = atob(groupedParams.parameters);
      decodedParameters = JSON.parse(decodedString);
    } catch (error) {
      decodedParameters = JSON.parse(JSON.stringify({playerName: '', sex: 'man'}));
    }
    return decodedParameters;
  }else{
    return groupedParams.parameters;
  }
}

function App() {
  let params = GetParameters(true);
  let raw_params = GetParameters(false);
  console.log('Player name is: ' + params.playerName);
  console.log('Raw parameters are: ' + JSON.stringify(raw_params));

  ReactGA.event({
    category: 'User',
    action: 'User who accessed root: ' + params.playerName
  });

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
          <Route exact path="/landing" element={ <Landing raw_params={raw_params} playerName={ params.playerName } /> } />
          <Route exact path="/killingGame" element={ <KillingGame /> } />
      </Routes>
    </Router>
  );
}

export default App;
