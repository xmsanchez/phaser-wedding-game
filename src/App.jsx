import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import Game from './components/game/Game.jsx';
import Landing from './components/landing/Landing.jsx';
import TopMenu from './components/main/TopMenu.jsx';
import KillingGame from './components/killingGame/Landing.jsx';
import { getInviteParams } from './utils/params.js';

// The invitation never changes during a visit, so decode it once
const invite = getInviteParams();

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<TopMenu invite={invite} />
							<Game invite={invite} />
						</>
					}
				/>
				<Route path="/landing" element={<Landing invite={invite} />} />
				<Route path="/killingGame" element={<KillingGame />} />
			</Routes>
		</Router>
	);
}

export default App;
