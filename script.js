let API = 'https://pokeapi.co/api/v2/'

let pokeID;

// fetch by 'pokemon'
function mainFetch() {

    fetch(API).then(res => res.json()).then(data => {
        console.log(data.pokemon);
        // fetching the pokemon json that contains most of the information we need
        let pokeURL = data.pokemon;
        let pokeName = (document.getElementById('pokemon-search').value).toLowerCase();
        pokeToFetch = pokeURL + pokeName;
        let checkBox = document.getElementById('shiny-check');

        fetch(pokeToFetch).then(res => res.json()).then(data => {
                console.log(data);
                // assign ID variable
                console.log(data.id);
                pokeID = data.id;
                document.getElementById('id-display').innerText = pokeID;
                // grabbing sprite
                let spriteArray = data.sprites;
                let frontSprite;
                let backSprite;
                if (checkBox.checked == true){
                    frontSprite = spriteArray['front_shiny'];
                    backSprite = spriteArray['back_shiny'];
                } else {
                    frontSprite = spriteArray['front_default'];
                    backSprite = spriteArray['back_default'];
                }
            document.getElementById('sprite-target-front').setAttribute('src', frontSprite);
            document.getElementById('sprite-target-back').setAttribute('src', backSprite);
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
                document.getElementById('moves').innerText = '';
                document.getElementById('moves').innerHTML += `<ul>`
                movesToDisplay.forEach(move => {
                    document.getElementById('moves').innerHTML += `<li>` + move + `</li>` + '\n';
                })
                document.getElementById('moves').innerHTML +=`</ul>`

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
            let randomTextNr = Math.floor(Math.random() * englishFlavorTexts.length);
            let randomFlavortext = englishFlavorTexts[randomTextNr]
            document.getElementById('flavour-text').innerText = randomFlavortext;

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

            fetch(evolutionURL).then(res => res.json()).then(data => {


                spriteArray = [];

                function getSprites(array) {
                    baseURL = 'https://pokeapi.co/api/v2/pokemon/';
                    array.forEach((pokemon,index) => {
                        fetchURL = baseURL + pokemon;
                        console.log(array);
                        fetch(fetchURL).then(res => res.json()).then(data =>
                            {
                                console.log(data);
                                if (checkBox.checked === true) {
                                    let spriteURL = data.sprites.front_shiny;
                                    let targetID = 'sprite-evolution-' + (index+1);
                                    document.getElementById(targetID).setAttribute('src', spriteURL);
                                } else {
                                    let spriteURL = data.sprites.front_default;
                                    let targetID = 'sprite-evolution-' + (index+1);
                                    document.getElementById(targetID).setAttribute('src', spriteURL);
                                }



                            }
                        )

                    })

                }

                let evolutionLineArray = [];
                let dataArray = data.chain;
                let evolutionLength = dataArray.evolves_to.length;
                if (evolutionLength === 0) {
                    return
                } else if (evolutionLength > 1) {
                    dataArray.evolves_to.forEach((evolution) => {
                        evolutionLineArray.push(evolution.species.name)
                    })
                    // normal pokemon evolutions
                } else {
                    let pokemon1, pokemon2, pokemon3;
                    if (pokeName === dataArray.species.name && dataArray.evolves_to[0] !== undefined) {
                        pokemon1 = pokeName;
                        evolutionLineArray.push(pokemon1)
                        if (dataArray.evolves_to !== undefined) {
                            pokemon2 = dataArray.evolves_to[0].species.name;
                            evolutionLineArray.push(pokemon2)
                        }
                        dataArray = dataArray.evolves_to[0];
                        if (dataArray.evolves_to[0] !== undefined && dataArray.evolves_to.length === 1) {

                            pokemon3 = dataArray.evolves_to[0].species.name;
                            evolutionLineArray.push(pokemon3)
                        }
                    } else if (pokeName === dataArray.evolves_to[0].species.name && dataArray.evolves_to[0] !== undefined) {
                        pokemon2 = pokeName
                        pokemon1 = dataArray.species.name;
                        evolutionLineArray.push(pokemon1, pokemon2)
                        console.log(dataArray.evolves_to[0]);
                        if (dataArray.evolves_to[0].evolves_to[0] !== undefined) {
                            pokemon3 = dataArray.evolves_to[0].evolves_to[0].species.name;
                            evolutionLineArray.push(pokemon3);
                        }

                    } else {
                        pokemon3 = pokeName;
                        pokemon2 = dataArray.evolves_to[0].species.name;
                        pokemon1 = dataArray.species.name;
                        evolutionLineArray.push(pokemon1, pokemon2, pokemon3)
                    }
                }
                console.log(evolutionLineArray);
                getSprites(evolutionLineArray);
                console.log('this',spriteArray);

                for (let i = 0; i < evolutionSpritesArray.length ; i++) {
                    console.log(evolutionSpritesArray);

                }

            });

        })
    })
}


// let form = document.querySelector('#my-form');

function handleForm(event) {
    event.preventDefault();
    mainFetch();
}

// form.addEventListener('submit', handleForm);
document.getElementById('submit').addEventListener('click', handleForm);

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
