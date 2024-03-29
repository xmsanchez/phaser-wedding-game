import { useLayoutEffect, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import { Element } from 'react-scroll';
import GoogleMapReact from 'google-map-react';
import Chatbox from './chat/Chatbox.jsx';
import Countdown from './Countdown.jsx';
import './Landing.css'

function Section({ id, children, style }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  const springStyle = useSpring({
    delay: inView ? 200 : 0,
    opacity: inView ? 1 : 0,
    transform: inView ? `translateY(0px)` : `translateX(0px)`,
    config: {duration: 1200},
  });
  
  return (
    <Element name={id}>
      <animated.div ref={ref} style={{ ...springStyle, ...style }}>
        {children}
      </animated.div>
    </Element>
  );
}

function Landing({raw_params, playerName}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'event',
    'eventCategory': 'User',
    'eventAction': 'User who accessed LANDING: ' + playerName
  })
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ZH68BVB2WF');


  // Enforce background color
  useLayoutEffect(() => {
      document.body.style.backgroundColor = "#330c43";
      document.body.style.width = 100 + "%";
  });

  const handleConfirmarClick = () => {
    window.open('https://forms.gle/xV9TNTx9WoqfVgJs9', '_blank');
  };

  const handleBackToHomeClick = () => {
    window.location = '/?parameters=' + raw_params;
  };
  
  // From here on, Google Maps code
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  let googleMapsApiKey = '';
  try {
    googleMapsApiKey = import.meta.env.VITE_MAPS_API_KEY; 
  } catch (error) {
    console.log('Error getting API key: ' + error);
  }
  
  const defaultProps = {
    center: {
      lat: 41.8162803,
      lng: 2.508809
    },
    zoom: 17
  };

  // This allows us to add the marker (I sweat a lot for this one...)
  function renderMarkers(map, maps) {
    const image = "/marker-red.png";
    const imageDelorean = "/marker-delorean.png";
  
    let marker = new maps.Marker({
      position: {lat: defaultProps.center.lat, lng: defaultProps.center.lng},
      map,
      icon: image,
    });

    let markerAparcament = new maps.Marker({
      position: {lat: defaultProps.center.lat - 0.0007, lng: defaultProps.center.lng + 0.0008},
      map,
      icon: imageDelorean,
      text: 'Aparcament'
    });
  };

  // Custom properties
  function createMapOptions(maps) {
    return {
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_CENTER,
        style: maps.ZoomControlStyle.SMALL
      },
      mapTypeControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT,
        style: maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      streetViewControl: true,
      mapTypeControl: true,
      disableDefaultUI: false,
    };
  }

  console.log('Show the player name in the landing: ' + playerName);

  return (
    <div className="bodyLanding">
      <Section>
        {<div id="headerSection" className="headerSection">
            <img src="wedding-logo.png" className="headerSectionImage"></img>
            <h2>Hola {playerName}!</h2>
            <button onClick={handleBackToHomeClick}>Vull tornar al joc!</button>
        </div>}
      </Section>
      <Section>
        {<div id="ubicacioSection" className="section2">
          <h2>On?</h2>
          <h1>La Vinyassa</h1>
          <div className="mapsContainer" style={{ height: '60vh', width: '70%' }}>
          {
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleMapsApiKey }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                onGoogleApiLoaded={({map, maps}) => renderMarkers(map, maps)}
                yesIWantToUseGoogleMapApiInternals
                options={createMapOptions}
              >
              <AnyReactComponent
                lat={defaultProps.center.lat}
                lng={defaultProps.center.lng}
                text="LA VINYASSA"
              />
            </GoogleMapReact>
          }
          </div>
          <p className="textCentered">Mapa complet <a href="https://www.google.com/maps/dir//41.8162803,2.508809">aquí</a></p>
        </div>}
      </Section>
      <Section>
        {<div id="dataSection" className="section">
          <h2>Quan?</h2>
          <p><b>Data:</b> 30/09/2023</p>
          <p><b>Recepció de convidats:</b> A les 16:30</p>
          <Countdown />
        </div>}
      </Section>
      <Section>
        {<div id="dresscodeSection" className="section2">
          <h2>Dresscode</h2>
          <p><b>Formal.</b> Les noies no podeu anar de blanc! Aquest color està reservat a la núvia.</p>
        </div>}
      </Section>
      <Section>
        {<div id="sleepSection" className="section">
          <h2>On dormir</h2>
          <p>No haureu d'agafar el cotxe,<br/><b>És possible arribar-hi a peu!</b></p>
          <a className="hotelLink" href="https://www.booking.com/hotel/es/hostal-montsoliu.es.html?label=gog235jc-1DCAMoRkIIYXJidWNpYXNIClgDaEaIAQGYAQq4ARnIAQzYAQPoAQH4AQOIAgGoAgO4Avbp4KQGwAIB0gIkZDU4ZDRiM2EtODZmNS00ODMxLWE0Y2MtZDQ2Zjg2Y2JlYjg12AIE4AIB&sid=2bf263d99eea306589a921ef8a40660f&aid=356980&ucfs=1&arphpl=1&checkin=2023-09-30&checkout=2023-10-01&dest_id=-371087&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&hpos=1&hapos=1&sr_order=popularity&srpvid=c14358c714de00ae&srepoch=1687696657&all_sr_blocks=110062504_351654206_2_0_0&highlighted_blocks=110062504_351654206_2_0_0&matching_block_id=110062504_351654206_2_0_0&sr_pri_blocks=110062504_351654206_2_0_0__7032&from=searchresults#hotelTmpl">
              Veure Hostal Montsoliu
          </a>
          <br/>
          <a className="hotelLink" href="https://www.booking.com/hotel/es/torresgirona.es.html?aid=356980&label=gog235jc-1FCAMoRkIIYXJidWNpYXNIClgDaEaIAQGYAQq4ARnIAQzYAQHoAQH4AQOIAgGoAgO4Avbp4KQGwAIB0gIkZDU4ZDRiM2EtODZmNS00ODMxLWE0Y2MtZDQ2Zjg2Y2JlYjg12AIF4AIB&sid=2bf263d99eea306589a921ef8a40660f&all_sr_blocks=9148503_333091019_0_2_0;checkin=2023-09-30;checkout=2023-10-01;dest_id=-371087;dest_type=city;dist=0;group_adults=2;group_children=0;hapos=2;highlighted_blocks=9148503_333091019_0_2_0;hpos=2;matching_block_id=9148503_333091019_0_2_0;no_rooms=1;req_adults=2;req_children=0;room1=A%2CA;sb_price_type=total;sr_order=popularity;sr_pri_blocks=9148503_333091019_0_2_0__9432;srepoch=1687696657;srpvid=c14358c714de00ae;type=total;ucfs=1&#hotelTmpl">
              Veure Hotel Torres
          </a>
          <p><i>Voleu altres opcions?</i></p>
          <p><a href="https://www.booking.com/searchresults.es.html?aid=356980&label=gog235jc-1DCAMoRkIIYXJidWNpYXNIClgDaEaIAQGYAQq4ARnIAQzYAQPoAQH4AQOIAgGoAgO4Avbp4KQGwAIB0gIkZDU4ZDRiM2EtODZmNS00ODMxLWE0Y2MtZDQ2Zjg2Y2JlYjg12AIE4AIB&lang=es&sid=2bf263d99eea306589a921ef8a40660f&sb=1&sb_lp=1&src=city&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Fcity%2Fes%2Farbucias.es.html%3Faid%3D356980%26label%3Dgog235jc-1DCAMoRkIIYXJidWNpYXNIClgDaEaIAQGYAQq4ARnIAQzYAQPoAQH4AQOIAgGoAgO4Avbp4KQGwAIB0gIkZDU4ZDRiM2EtODZmNS00ODMxLWE0Y2MtZDQ2Zjg2Y2JlYjg12AIE4AIB%26sid%3D2bf263d99eea306589a921ef8a40660f%26inac%3D0%26%26&ss=Arb%C3%BAcies&is_ski_area=0&ssne=Arb%C3%BAcies&ssne_untouched=Arb%C3%BAcies&city=-371087&checkin_year=2023&checkin_month=9&checkin_monthday=30&checkout_year=2023&checkout_month=10&checkout_monthday=1&efdco=1&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1">Feu click aquí</a> </p>
        </div>}
      </Section>
      <Section>
        {<div id="regalSection" className="section2">
          <h2>El millor regal que ens pots fer és venir! Però si ens vols ajudar a fer la millor festa, t'ho agraïm molt!</h2>
          <h2 className="regalSectionIban">ES30 1465 0120 3517 5585 1875</h2>
        </div>}
      </Section>
      <Section>
        {<div id="chatbotSection" className="section">
            <h2>Tens alguna pregunta abans de confirmar assistència?</h2>
            <p>La nostra <b>IA</b> t'aclarirà tots els dubtes que tinguis</p>
            {/* <p><i><b>*responem al moment!</b> pot ser que la resposta trigui <b>fins a 30 segons</b> en arribar, tingues paciència!! (también hablo castellano ;-D)</i></p> */}
            <p>Prova a dir: "En què em pots ajudar?" o "Es posible que llegue sobre las 18 horas"</p>
            <Chatbox playerName={playerName} />

            <p>Vols veure el codi font per saber com està feta la implementació d'aquesta invitació?</p>
            <a href="https://github.com/xmsanchez/phaser-wedding-game/">
              FES CLICK AQUÍ
            </a>
        </div>}
      </Section>
      <Section>
        {<div id="googleFormsSection" className="section2">
          <h2>Confirma la teva assistència</h2>
          {/* <button id="confirmarButton" className="btn" onClick={handleConfirmarClick}>Confirmar</button> */}
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSclSjSkfrUHTZslpKcBdnK0e5sA7r4nwDMsZIuDL0pHJIlkFQ/viewform?embedded=true"
            width="640" height="1500" frameborder="0">S&#39;Carregant…</iframe>
        </div>}
      </Section>
      <Section>
        {<div className="section">
          <p><i>@Xavier Miranda Sánchez @Miriam Garcia Sala</i></p>
          <p><i>Tots els drets reservats - {(new Date().getFullYear())}</i></p>
        </div>}
      </Section>
    </div>
  )
}

export default Landing