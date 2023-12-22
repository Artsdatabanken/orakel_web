import React from "react";
import "../App.css";

function About() {
  
  return (
    
    <>

      <p className="intro">
        Artsorakelet er utviklet av Artsdatabanken i samarbeid med Naturalis
        Biodiversity Center. Appen prøver å artsbestemme bilder ved hjelp av
        maskinlæring.
      </p>

      <img
        src="Artsorakel_logo_trans.svg"
        alt="Artsorakelet"
        className="aboutHeader"
      />

      <p>
        Gjenkjenningsmodellen trenes hos Naturalis Biodiversity Center, med
        bilder som er offentlig tilgjengelig på artsobservasjoner.no. Når appen
        brukes sier modellen hva det ligner mest på av artene den har blitt
        trent med. Dette innebærer at den kun kan foreslå arter som finnes i
        Norsk natur og som har blitt rapportert med bilder. Den kjenner altså
        kun viltlevende arter (ingen mennesker, husdyr, rene hageplanter, osv.)
        og gir svar på artsnivå (og noen underarter).
      </p>

      <p>
      Bilder sendes til serveren til gjenkjenning. Bilder og brukerinformasjon
        blir ikke tilgjengelige for Artsdatabanken eller andre.
      </p>

      <p>
        Du kan lese mer om Artsorakelet på{" "}
        <a href="https://www.artsdatabanken.no/Pages/299643">
          Artsdatabankens nettsider
        </a>
        . Spørsmål og tilbakemelding kan sendes til{" "}
        <a href="mailto:support@artsobservasjoner.no">
          support@artsobservasjoner.no
        </a>
        .
      </p>

      <p>
        <img
          src="Artsdatabanken_Logo_Colour.png"
          alt="Artsdatabanken"
          className="aboutLogo light"
        />
        <img
          src="Artsdatabanken_Logo_White.svg"
          alt="Artsdatabanken"
          className="aboutLogo dark"
        />
        <img src="Naturalis.svg" className="aboutLogo" alt="Naturalis" />
      </p>
    </>
  );
}

export default About;
