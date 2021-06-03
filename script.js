const apiKEY = "e79a2ecc6cb6882fcc7c380f55ef2454"; // clé fournie pour utiliser l'API
let resultAPI;

const temps = document.querySelector(".temps"); // variables utilisées pour afficher les informations dans le bloc info
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const tempsDemain = document.querySelector(".tempsDemain");
const temperatureDemain = document.querySelector(".temperatureDemain");
const imgIcon = document.querySelector(".logoMeteo");
const imgIconMini = document.querySelector(".logoMeteoMini");
const background = document.querySelector(".bloc-info");

if (navigator.geolocation) {
  // pour que l'utilisateur puisse activer la géolocalisation via le browser
  navigator.geolocation.getCurrentPosition(
    (position) => {
      //console.log(position);
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      AppelAPI(long, lat); // on récupére les coordonnées
    },
    () => {
      // dans le cas où il la refuse
      alert(`Veuillez accepter la géolocalisaiton pour afficher la météo`);
    }
  );
}

function AppelAPI(long, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${apiKEY}`
  )
    .then((reponse) => {
      return reponse.json();
    })

    .then((data) => {
      // nous retourne le data de l'API, en fonction des données demandées via l'URL
      //console.log(data);
      resultAPI = data; // on va afficher dans le bloc info les données récupérées

      temps.innerText = resultAPI.current.weather[0].description;
      temperature.innerText = `${Math.trunc(resultAPI.current.temp)}°`; // Math.trunc pour afficher la température sans la virgule
      localisation.innerText = resultAPI.timezone;
      tempsDemain.innerText = resultAPI.daily[1].weather[0].description; // affichage des conditions à J+1
      temperatureDemain.innerText = `${Math.trunc(
        resultAPI.daily[1].temp.day
      )}°`; // affichage des températures à J+1

      // Mise en place de l'icône dynamique
      let heureActuelle = new Date().getHours(); // récupération de l'heure actuelle

      if (heureActuelle >= 6 && heureActuelle < 21) {
        // afficher les icônes jour entre 6h et 21h
        imgIcon.src = `icons/jour/${resultAPI.current.weather[0].icon}.svg`;
      } else {
        // sinon les icônes nuit
        imgIcon.src = `icons/nuit/${resultAPI.current.weather[0].icon}.svg`;
        background.style.background =
          "linear-gradient(176deg, rgb(6, 15, 51) 12%, rgb(33, 45, 78) 100%)"; // et un background pour la nuit ! 
      }
      imgIconMini.src = `icons/jour/${resultAPI.daily[1].weather[0].icon}.svg`; // afficher une icône en fonction du temps à J +1
    });
}
