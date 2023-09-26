import { useLayoutEffect, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import { Element } from 'react-scroll';
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

function handleBackToHomeClick() {
  
}

function KillingGame() {
  // Enforce background color
  useLayoutEffect(() => {
      document.body.style.backgroundColor = "#330c43";
      document.body.style.width = 100 + "%";
  });

  return (
    <div className="bodyLanding">
      <Section>
        {<div id="header" className="headerSection">
          {/* <img src="wedding-logo.png" className="headerSectionImage"></img> */}
          <h1>Benvinguts als jocs de la fam!</h1>
          <h2>De què va això?</h2>
          <p><b>Llegeix les instruccions a continuació</b></p>
          <p>L'objectiu d'aquest joc és "matar" a la persona que apareix a la teva targeta.</p>
          <p><b>I com sé qui és??</b></p>
          <p>Molt fàcil! Hauràs de parlar amb tothom per intentar-ho esbrinar!</p>
          <p>Però compte! Has de ser dissimulat i intentar evitar que ningú vegi venir les teves intencions!</p>
          <br />
          <p><b>D'acord, he matat a algú. I ara què?</b></p>
          <p>Doncs ara la persona a la que has matat t'ha de donar la seva targeta.</p>
          <p>Sobretot recorda a demanar-li! La persona que hi apareix serà el teu següent objectiu!!</p>
          <br />
          <p><b>I si m'han matat a mi?</b></p>
          <p>Oh, quina llàstima! En aquest cas, recorda donar la teva targeta a la persona que t'ha matat</p>
          <br />
          <p><b>Però què guanyo jo amb aquest joc?</b></p>
          <p>És una sorpresa!!</p>
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

export default KillingGame