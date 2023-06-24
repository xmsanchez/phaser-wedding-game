import { useLayoutEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import Chatbox from './chat/Chatbox.jsx';
import './Landing.css'

function LocationMarker() {
  return <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'red' }} />;
}
// function LocationMarker() {
//   const markerImageSrc = '/wedding-logo.png';
//   return (
//     <img
//       src={markerImageSrc}
//       style={{
//         width: '70px',
//         height: '70px',
//       }}
//     />
//   );
// }

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

  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  const googleMapsApiKey = "AIzaSyBw_KUdhwvd6XDfusjhr7fBWiqzAdVJ9_U";
  const defaultProps = {
    center: {
      lat: 41.8162803,
      lng: 2.508809
    },
    zoom: 15
  };

  function renderMarkers(map, maps) {
    let marker = new maps.Marker({
      position: defaultProps.center,
      map,
      title: 'Hello World!'
    });
  };

  function createMapOptions(maps) {
    // next props are exposed at maps
    // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
    // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
    // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
    // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
    // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_CENTER,
        style: maps.ZoomControlStyle.SMALL
      },
      mapTypeControlOptions: {
        position: maps.ControlPosition.TOP_LEFT
      },
      streetViewControl: true,
      mapTypeControl: true
    };
  }

  return (
    <div className="bodyLanding">
        <div id="headerSection" className="section">
            <img src="wedding-logo.png" className="headerSectionImage"></img>
        </div>
        <div id="returnSection" className="section">
            <button onClick={handleBackToHomeClick}>Vull tornar al joc!</button>
        </div>
        <div id="bodySection" className="section">
            <div className="container">
                <h2>La Vinyassa</h2>
                <p className="textCentered">Mapa complet <a href="https://www.google.com/maps/dir//41.8162803,2.508809">aquí</a></p>
                <div style={{ height: '40vh', width: '100%' }}>
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
                <h2>Quan?</h2>
                <p><b>Data:</b> 30/09/2023</p>
                <p><b>Recepció de convidats:</b> A les 16:30</p>
                <h2>Dresscode</h2>
                <p><b>Formal.</b> Les noies no podeu anar de blanc! Aquest color està reservat a la núvia.</p>
            </div>
        </div>
        <div id="googleFormsSection" className="section">
            <h2>Confirma la teva assistència</h2>
            <button id="confirmarButton" className="btn" onClick={handleConfirmarClick}>Confirmar</button>
        </div>
        <footer id="footerSection" className="section">
          <div className="container">
              <h2>Tens alguna pregunta?</h2>
              <p><i><b>*responem al moment!</b> pot ser que la resposta trigui <b>fins a 30 segons</b> en arribar, tingues paciència!! (también hablo castellano ;-D)</i></p>
              <p>Prova a dir: "En què em pots ajudar?" o "Es posible que llegue sobre las 18 horas"</p>
              <Chatbox />
          </div>
      </footer>
    </div>
  )
}

export default Landing