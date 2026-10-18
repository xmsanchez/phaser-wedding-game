import { Footer, Section } from '../common/Section.jsx';
import useLandingBackground from '../common/useLandingBackground.js';

// Instructions for the "Killing Game" played during the wedding party
function KillingGame() {
	useLandingBackground();

	return (
		<div className="bodyLanding">
			<Section>
				<div id="header" className="headerSection">
					<h1>Benvingut al &quot;Killing Game&quot;!</h1>
					<h2>ATENCIÓ: El nom de la targeta que tens, és confidencial!</h2>
					<p><b>Llegeix les instruccions a continuació</b></p>
					<p>L&apos;objectiu d&apos;aquest joc és &quot;matar&quot; a la persona que apareix a la teva targeta.</p>
					<p><b>I com sé qui és??</b></p>
					<p>Molt fàcil! Hauràs de parlar amb tothom per intentar-ho esbrinar!</p>
					<p>Però compte! Has de ser dissimulat i intentar evitar que ningú vegi venir les teves intencions!</p>
					<br />
					<p><b>Aleshores, com he de matar al meu objectiu?</b></p>
					<p>Quan estiguis amb el teu objectiu, i hi hagis parlat una mica, digue-li &quot;estàs mort&quot;</p>
					<p><b>D&apos;acord, he matat a algú. I ara què?</b></p>
					<p>Doncs ara la persona a la que has matat t&apos;ha de donar la seva targeta.</p>
					<p>Atenció! Que et doni la SEVA targeta, però NO les targetes de qui ha matat</p>
					<p>Sobretot recorda a demanar-li! La persona que hi apareix serà el teu següent objectiu!!</p>
					<br />
					<p><b>I si m&apos;han matat a mi?</b></p>
					<p>Oh, quina llàstima! En aquest cas, recorda donar la teva targeta a la persona que t&apos;ha matat</p>
					<br />
					<p><b>Però què guanyo jo amb aquest joc?</b></p>
					<p>És una sorpresa!!</p>
				</div>
			</Section>
			<Footer />
		</div>
	);
}

export default KillingGame;
