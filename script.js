let API = "https://pokeapi.co/api/v2/";

// fetch by 'pokemon'
function mainFetch() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // fetching the pokemon json that contains most of the information we need
      let pokeURL = data.pokemon;
      let pokeName = document
        .getElementById("pokemon-search")
        .value.toLowerCase();
      pokeToFetch = pokeURL + pokeName;
      fetch(pokeToFetch)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // grabbing sprite
          let spriteArray = data.sprites;
          let sprite = spriteArray["front_default"];
          let shinySprite = spriteArray["front_shiny"];
          document.getElementById("sprite-target").setAttribute("src", sprite);
          // grabbing name
          let name = data.name;
          document.getElementById("name-target").innerText = name.capitalize();
          // grabbing moves
          let movesArray = data.moves;
          let length = movesArray.length;
          let amountToDisplay;
          if (pokeName === "ditto") {
            amountToDisplay = 1;
          } else {
            amountToDisplay = 4;
          }

          let movesToDisplay = [];
          for (let i = 0; i < amountToDisplay; i++) {
            let randomNr = Math.floor(Math.random() * length);
            console.log(randomNr);
            movesToDisplay.push(
              movesArray[randomNr].move.name.split("-").join(" ")
            );
          }
          console.log(movesToDisplay);

          // fetch types
          let typeArray = [];
          let typeLength = data.types.length;
          for (let i = 0; i < typeLength; i++) {
            typeArray.push(data.types[i].type.name);
          }
          console.log(typeArray);

          //
        });

      // fetching pokemon flavor text

      let flavorURL = "https://pokeapi.co/api/v2/pokemon-species/" + pokeName;
      fetch(flavorURL)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // get random flavor text
          flavorArray = data["flavor_text_entries"];
          englishFlavorTexts = [];
          flavorArray.forEach((entry) => {
            if (entry.language.name === "en") {
              englishFlavorTexts.push(entry["flavor_text"]);
            }
          });
          let randomFlavortext;
          let randomTextNr = Math.floor(
            Math.random() * englishFlavorTexts.length
          );
          randomFlavortext = englishFlavorTexts[randomTextNr];
          console.log(randomFlavortext);
          // get pokemon genus
          let genusArray = data.genera;
          let englishGenus;
          genusArray.forEach((genus) => {
            if (genus.language.name === "en") {
              englishGenus = genus.genus;
            }
          });
          console.log(englishGenus);
        });
    });
}

let form = document.querySelector("#my-form");
function handleForm(event) {
  event.preventDefault();
  mainFetch();
}
form.addEventListener("submit", handleForm);

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
