import { useLayoutEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import Chatbox from './chat/Chatbox.jsx';
import Countdown from './Countdown.jsx';
import HeaderFooter from './HeaderFooter.jsx';
import './Landing.css'

function Landing() {
  // useLayoutEffect(() => {
  //     if ('visualViewport' in window) {
  //       window.visualViewport.onresize = () => {
  //         if (window.visualViewport.scale !== 1) {
  //           const scale = 1 / window.visualViewport.scale;
  //           document.body.style.transform = `scale(${scale})`;
  //         } else {
  //           document.body.style.transform = 'none';
  //         }
  //       }
  //     }
  
  //     document.body.style.backgroundColor = "white";
  //     document.body.style.width = 100 + "%";
  //   }, []);
      
  // Enforce background color
  useLayoutEffect(() => {
      document.body.style.backgroundColor = "#330c43";
      document.body.style.width = 100 + "%";
  });

  const handleConfirmarClick = () => {
    window.open('https://forms.gle/xV9TNTx9WoqfVgJs9', '_blank');
  };

  const handleBackToHomeClick = () => {
    window.location = '/';
  };
  
  // From here on, Google Maps code
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  let googleMapsApiKey = '';
  try {
    googleMapsApiKey = import.meta.env.VITE_MAPS_API_KEY; 
  } catch (error) {
    console.log('Error getting API key: ' + error);
  }
  // console.log('Api key: ' + googleMapsApiKey);
  
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

  return (
    <div className="bodyLanding">
        <div id="headerSection" className="section">
            <img src="wedding-logo.png" className="headerSectionImage"></img>
        </div>
        {/* <div>
          <HeaderFooter />
        </div> */}
        <div id="returnSection" className="section">
            <button onClick={handleBackToHomeClick}>Vull tornar al joc!</button>
        </div>
        <div id="ubicacioSection" className="section2">
            <h2>La Vinyassa</h2>
            <div className="mapsContainer" style={{ height: '40vh', width: '70%' }}>
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
          </div>
        <div id="dataSection" className="section">
          <h2>Quan?</h2>
          <p><b>Data:</b> 30/09/2023</p>
          <p><b>Recepció de convidats:</b> A les 16:30</p>
          <Countdown />
        </div>
        <div id="dresscodeSection" className="section2">
          <h2>Dresscode</h2>
          <p><b>Formal.</b> Les noies no podeu anar de blanc! Aquest color està reservat a la núvia.</p>
        </div>
        <div id="sleepSection" className="section">
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
        </div>
        <div id="regalSection" className="section2">
          <h2>Ens ajudes a fer la millor festa?</h2>
          <h2 className="regalSectionIban">ES45 1465 0120 3717 3372 2703</h2>
        </div>
        <div id="googleFormsSection" className="section">
          <h2>Confirma la teva assistència</h2>
          {/* <button id="confirmarButton" className="btn" onClick={handleConfirmarClick}>Confirmar</button> */}
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSclSjSkfrUHTZslpKcBdnK0e5sA7r4nwDMsZIuDL0pHJIlkFQ/viewform?embedded=true"
            width="640" height="498" frameborder="0" marginheight="0" marginwidth="0">S&#39;Carregant…</iframe>
        </div>
        <div id="footerSection" className="section2">
          <div className="container">
            <h2>Tens alguna pregunta?</h2>
            <p>La nostra <b>IA</b> t'aclarirà tots els dubtes que tinguis</p>
            {/* <p><i><b>*responem al moment!</b> pot ser que la resposta trigui <b>fins a 30 segons</b> en arribar, tingues paciència!! (también hablo castellano ;-D)</i></p> */}
            <p>Prova a dir: "En què em pots ajudar?" o "Es posible que llegue sobre las 18 horas"</p>
            <Chatbox />
          </div>
      </div>
      <div className="section">
        <p><i>@Xavier Miranda Sánchez @Miriam Garcia Sala</i></p>
        <p><i>Tots els drets reservats - {(new Date().getFullYear())}</i></p>
      </div>
    </div>
  )
}

export default Landing