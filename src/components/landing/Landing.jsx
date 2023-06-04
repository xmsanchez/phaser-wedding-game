import { useLayoutEffect } from 'react'
import Chatbox from './chat/Chatbox.jsx';
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
      
  useLayoutEffect(() => {
      document.body.style.backgroundColor = "white";
      document.body.style.width = 100 + "%";
  });

  const handleConfirmarClick = () => {
    window.open('https://forms.gle/xV9TNTx9WoqfVgJs9', '_blank');
  };

  const handleBackToHomeClick = () => {
    window.location = '/';
  };

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
                <h2>Detalls</h2>
                <p><b>El lloc:</b> La Vinyassa</p>
                <p><b>La data:</b> 30/09/2023</p>
                <p><b>L'hora:</b> Les 16h</p>
                <p><b>El dresscode:</b> Formal. Les noies no podeu anar de blanc!</p>
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