let API = 'https://pokeapi.co/api/v2/'

let pokeID;

// fetch by 'pokemon'
function mainFetch() {

    fetch(API).then(res => res.json()).then(data => {
        // fetching the pokemon json that contains most of the information we need
        let pokeURL = data.pokemon;
        let pokeName = (document.getElementById('pokemon-search').value).toLowerCase();
        pokeToFetch = pokeURL + pokeName;
        fetch(pokeToFetch).then(res => res.json()).then(data => {
                console.log(data);
                // assign ID variable
                console.log(data.id);
                pokeID = data.id;
                // grabbing sprite
                let spriteArray = data.sprites;
                let checkBox = document.getElementById('shiny-check');
                if (checkBox.checked == true){
                    let frontSprite = spriteArray['front_shiny'];
                    let backSprite = spriteArray['back_shiny'];
                } else {
                    let frontSprite = spriteArray['front_default'];
                    let backSprite = spriteArray['back_default'];
                }


                document.getElementById('sprite-target').setAttribute('src', sprite);
                // grabbing name
                let name = data.name;
                document.getElementById('name-target').innerText = name.capitalize();
                // grabbing moves
                let movesArray = data.moves;
                let length = movesArray.length;
                let amountToDisplay;

                amountToDisplay = Math.min(4, length);

                let movesToDisplay = []
                for (let i = 0; i < amountToDisplay; i++) {
                    let randomNr = Math.floor(Math.random() * length);
                    movesToDisplay.push((movesArray[randomNr].move.name).split('-').join(' '));
                }

                // fetch types
                let typeArray = []
                let typeLength = data.types.length;
                for (let i = 0; i < typeLength; i++) {
                    typeArray.push(data.types[i].type.name);
                }
            }
        )
        // fetching pokemon flavor text

        let flavorURL = 'https://pokeapi.co/api/v2/pokemon-species/' + pokeName;
        fetch(flavorURL).then(res => res.json()).then(data => {

            console.log(data);
            // get random flavor text
            flavorArray = data['flavor_text_entries'];
            englishFlavorTexts = [];
            flavorArray.forEach(entry => {
                if (entry.language.name === "en") {
                    englishFlavorTexts.push(entry['flavor_text']);
                }
            })
            let randomFlavortext;
            let randomTextNr = Math.floor(Math.random() * englishFlavorTexts.length);
            randomFlavortext = englishFlavorTexts[randomTextNr]
            // get pokemon genus
            let genusArray = data.genera;
            let englishGenus;
            genusArray.forEach(genus => {
                if (genus.language.name === 'en') {
                    englishGenus = genus.genus
                }
            })
            let evolutionURL = data['evolution_chain'].url
            // fetching evolution line
            function getSprites(array) {
                baseURL = 'https://pokeapi.co/api/v2/pokemon/';
                spriteArray = [];
                array.forEach(pokemon => {
                    fetchURL = baseURL + pokemon;
                    fetch(fetchURL).then(res => res.json()).then(data =>
                        {
                            spriteArray.push(data.sprites.front_default);
                        }
                    )
                })
                return spriteArray
            }
            fetch(evolutionURL).then(res => res.json()).then(data => {

                evolutionArray = [];
                console.log(data);
                let dataArray = data.chain;
                let evolutionLength = dataArray.evolves_to.length;
                if (evolutionLength === 0) {
                    return
                } else if (evolutionLength > 1) {
                    multiEvoArray = [];
                    dataArray.evolves_to.forEach((evolution) => {
                        multiEvoArray.push(evolution.species.name)
                    })
                    let evolutionLineSprites = getSprites(multiEvoArray);
                    console.log(multiEvoArray);
                    console.log(evolutionLineSprites);
                    // normal pokemon evolutions
                } else {
                    let pokemon1, pokemon2, pokemon3;
                    let evolutionLineArray = [];
                    if (pokeName === dataArray.species.name && dataArray.evolves_to[0] !== undefined) {
                        pokemon1 = pokeName;
                        evolutionLineArray.push(pokemon1)
                        if (dataArray.evolves_to !== undefined) {
                            pokemon2 = dataArray.evolves_to[0].species.name;
                            evolutionLineArray.push(pokemon2)
                        }
                        dataArray = dataArray.evolves_to[0];
                        if (dataArray.evolves_to[0] !== undefined) {

                            pokemon3 = dataArray.evolves_to[0].species.name;
                            evolutionLineArray.push(pokemon3)
                        }
                        evolutionLineSprites =  getSprites(evolutionLineArray);
                        console.log(evolutionLineArray);
                        console.log(evolutionLineSprites);
                    } else if (pokeName === dataArray.evolves_to[0].species.name && dataArray.evolves_to[0] !== undefined) {
                        pokemon2 = pokeName
                        pokemon1 = dataArray.species.name;
                        evolutionLineArray.push(pokemon1, pokemon2)
                        console.log(dataArray.evolves_to[0]);
                        if (dataArray.evolves_to[0].evolves_to[0] !== undefined) {
                            pokemon3 = dataArray.evolves_to[0].evolves_to[0].species.name;
                            evolutionLineArray.push(pokemon3);
                        }
                        evolutionLineSprites =  getSprites(evolutionLineArray);
                        console.log(evolutionLineArray);
                        console.log(evolutionLineSprites);

                    } else {
                        pokemon3 = pokeName;
                        pokemon2 = dataArray.evolves_to[0].species.name;
                        pokemon1 = dataArray.species.name;
                        evolutionLineArray.push(pokemon1, pokemon2, pokemon3)
                        evolutionLineSprites =  getSprites(evolutionLineArray);
                        console.log(evolutionLineArray);
                        console.log(evolutionLineSprites);
                    }
                }


            });

        })
    })
}

let form = document.querySelector('#my-form');

function handleForm(event) {
    event.preventDefault();
    mainFetch();
}

form.addEventListener('submit', handleForm);

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
