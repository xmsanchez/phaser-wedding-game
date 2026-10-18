import GoogleMapReact from 'google-map-react';
import { Footer, Section } from '../common/Section.jsx';
import useLandingBackground from '../common/useLandingBackground.js';
import { inviteQuery } from '../../utils/params.js';

// Build-time configuration (see README): without it only a link to the map is shown
const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const VENUE = { lat: 41.8162803, lng: 2.508809 };
const PARKING = { lat: VENUE.lat - 0.0007, lng: VENUE.lng + 0.0008 };
const DIRECTIONS_URL = `https://www.google.com/maps/dir//${VENUE.lat},${VENUE.lng}`;

const VenueLabel = ({ text }) => <div>{text}</div>;

// Custom markers for the venue and the parking (I sweat a lot for this one...)
function renderMarkers(map, maps) {
	new maps.Marker({ position: VENUE, map, icon: '/marker-red.png' });
	new maps.Marker({ position: PARKING, map, icon: '/marker-delorean.png' });
}

function mapOptions(maps) {
	return {
		zoomControlOptions: { position: maps.ControlPosition.RIGHT_CENTER, style: maps.ZoomControlStyle.SMALL },
		mapTypeControlOptions: { position: maps.ControlPosition.TOP_RIGHT, style: maps.MapTypeControlStyle.DROPDOWN_MENU },
		streetViewControl: true,
		mapTypeControl: true,
	};
}

function Landing({ invite }) {
	useLandingBackground();
	const { playerName, raw } = invite;

	return (
		<div className="bodyLanding">
			<Section>
				<div id="headerSection" className="headerSection">
					<img src="wedding-logo.png" className="headerSectionImage" alt="Miriam + Xavi" />
					<h2>{playerName ? `Hola ${playerName}!` : 'Hola!'}</h2>
					<button onClick={() => { window.location = '/' + inviteQuery(raw); }}>Vull tornar al joc!</button>
				</div>
			</Section>
			<Section>
				<div className="section2">
					<h2>On?</h2>
					<h1>La Vinyassa</h1>
					{MAPS_API_KEY && (
						<div className="mapsContainer">
							<GoogleMapReact
								bootstrapURLKeys={{ key: MAPS_API_KEY }}
								defaultCenter={VENUE}
								defaultZoom={17}
								onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
								yesIWantToUseGoogleMapApiInternals
								options={mapOptions}
							>
								<VenueLabel lat={VENUE.lat} lng={VENUE.lng} text="LA VINYASSA" />
							</GoogleMapReact>
						</div>
					)}
					<p className="textCentered">Mapa complet <a href={DIRECTIONS_URL}>aquí</a></p>
				</div>
			</Section>
			<Section>
				<div className="section">
					<h2>Quan?</h2>
					<p><b>El 30 de setembre de 2023</b>, a les 16:30.</p>
					<p>Ens vam casar! Gràcies a tots els que ens vau acompanyar en un dia tan especial.</p>
				</div>
			</Section>
			<Section>
				<div className="section2">
					<h2>Dresscode</h2>
					<p><b>Formal.</b> Les noies no podeu anar de blanc! Aquest color està reservat a la núvia.</p>
				</div>
			</Section>
			<Section>
				<div className="section">
					<p>Vols veure el codi font per saber com està feta la implementació d&apos;aquesta invitació?</p>
					<a className="bigLink" href="https://github.com/xmsanchez/phaser-wedding-game/">FES CLICK AQUÍ</a>
				</div>
			</Section>
			<Footer />
		</div>
	);
}

export default Landing;
