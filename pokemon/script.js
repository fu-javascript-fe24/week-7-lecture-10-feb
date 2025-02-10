const log = (msg) => console.log(msg);

if(window.location.pathname === '/') {
    pageSetup();
} else {
    singlePageSetup();
}

async function singlePageSetup() {
    log(window.location);
    let params = new URLSearchParams(window.location.search);
    let value = params.get('pokemon');
    log(value);
    let pokemon = await fetchPokemonDetails(value);
    const card = createCard(pokemon);
    card.style.margin = '2rem';
    document.querySelector('.wrapper').appendChild(card);    

}

async function pageSetup() {

    const generateSectionRef = document.querySelector('#generate');
    const searchSectionRef = document.querySelector('#search');
    generateSectionRef.classList.add('d-none');
    searchSectionRef.classList.add('d-none');

    const listItemRefs = document.querySelectorAll('.header__list-item');
    for(let ref of listItemRefs) {
        ref.addEventListener('click', displayActiveSection);
    }
    let pokemons = await fetchPokemons();   

    setupPokedex(pokemons);

    let allPokemons = await fetchAllPokemons();
    setupSearchForm(allPokemons);
}

async function fetchPokemons() {
    let pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')
        .then(response => response.json())
        .then(data => { return data.results })
        .catch(error => {
            console.log(error.message);
        });
    return pokemons;
}

async function fetchAllPokemons() {
    let pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1304&offset=0')
        .then(response => response.json())
        .then(data => { return data.results })
        .catch(error => {
            console.log(error.message);
        });
    return pokemons;
}

async function fetchPokemonDetails(pokemon) {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        let data = await response.json();
        return data;
    } catch(error) {
        console.log(error.message);
    }
}

function setupSearchForm(pokemons) {
    const formRef = document.querySelector('#searchForm');
    const inputRef = document.querySelector('#searchInput');

    inputRef.addEventListener('input', (event) => {
        updateAutocompleteList(event.target.value.toLowerCase(), pokemons);
    });

    formRef.addEventListener('submit', (event) => {
        event.preventDefault();
        window.location.href = `./single.html?pokemon=${inputRef.value}`;
    });
}

function updateAutocompleteList(input, pokemons) {
    const matchingPokemons = pokemons.filter(p => p.name.includes(input));
    const listRef = document.querySelector('#autocompleteList');
    listRef.innerHTML = '';
    for(let i = 0; i < matchingPokemons.length; i++) {
        if(i === 10) break;
        const listItemRef = document.createElement('li');
        listItemRef.textContent = firstCaseToUpper(matchingPokemons[i].name);
        listItemRef.addEventListener('click', (event) => {
            document.querySelector('#searchInput').value = event.target.textContent;
            listRef.innerHTML = '';
        });

        listRef.appendChild(listItemRef);
    }

}

function displayActiveSection(event) {

    const pokedexSectionRef = document.querySelector('#pokedex');
    const generateSectionRef = document.querySelector('#generate');
    const searchSectionRef = document.querySelector('#search');

    let activeSection = event.target.id;
    if(activeSection === 'pokedexLink') {
        pokedexSectionRef.classList.remove('d-none');
        generateSectionRef.classList.add('d-none');
        searchSectionRef.classList.add('d-none');
    } else if(activeSection === 'generateLink') {
        pokedexSectionRef.classList.add('d-none');
        generateSectionRef.classList.remove('d-none');
        searchSectionRef.classList.add('d-none');
    } else if(activeSection === 'searchLink') {
        pokedexSectionRef.classList.add('d-none');
        generateSectionRef.classList.add('d-none');
        searchSectionRef.classList.remove('d-none');
    }
}

async function setupPokedex(pokemons) {

    const pokedexSectionRef = document.querySelector('#pokedexSection');

    for(let pokemon of pokemons) {
        let data = await fetchPokemonDetails(pokemon.name);
        let card = createCard(data);
        pokedexSectionRef.appendChild(card)
    }
}

function createCard(pokemon) {
    const cardRef = document.createElement('article');
    cardRef.classList.add('card');
    const cardTemp = `
        <a href="./single.html?pokemon=${pokemon.name}">
            <div class="card__top">
                <img
                src="${pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default}"
                alt="Picture of ${pokemon.name}"
                style="background-color: ${getTypeColor(pokemon.types[0].type.name)};"
                class="card__img"
                />
                <span class="card__index">#${pokemon.id}</span>
            </div>
            <div class="card__middle">
                <h3 class="card__pokemon-name">${firstCaseToUpper(pokemon.name)}</h3>
                <h4>${buildTypeString(pokemon.types)}</h4>
            </div>
            <div class="card__bottom">
                <p class="card__stat">Attack: ${pokemon.stats[1].base_stat}</p>
                <p class="card__stat">Defense: ${pokemon.stats[2].base_stat}</p>
                <p class="card__stat">Sp. Attack: ${pokemon.stats[3].base_stat}</p>
                <p class="card__stat">Sp. Defense: ${pokemon.stats[4].base_stat}</p>
                <p class="card__stat">HP: ${pokemon.stats[0].base_stat}</p>
                <p class="card__stat">Speed: ${pokemon.stats[5].base_stat}</p>
                <p class="card__stat card__stat--span-two">Total: ${getStatsTotal(pokemon.stats)}</p>
            </div>
        </a>
    `;
    cardRef.innerHTML = cardTemp;

    return cardRef;
}

function buildTypeString(types) {
    let typeString = '';
    if(types.length === 1) {
        typeString = firstCaseToUpper(types[0].type.name);
    } else {
        typeString = `${firstCaseToUpper(types[0].type.name)} / ${firstCaseToUpper(types[1].type.name)}`;
    }
    return typeString;
}

function firstCaseToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTypeColor(type) {
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        grass: "#7AC74C",
        electric: "#F7D02C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };
    
    return typeColors[type] || "#000000"; // Returnerar svart om typen inte finns
}

function getStatsTotal(stats) {
    let total = 0;
    for(let stat of stats) {
        total += stat.base_stat;
    }
    return total;
}

// let divRef = document.createElement('div');
//     divRef.classList.add('card__top');
//     divRef.appendChild(createImg(pokemon));
//     divRef.appendChild(createSpan(pokemon));
//     cardRef.appendChild(divRef);

//     divRef = document.createElement('div');
//     divRef.classList.add('card__middle');
//     divRef.appendChild(createHeading(pokemon));
//     divRef.appendChild(createSubHeading(pokemon));
//     cardRef.appendChild(divRef);

//     divRef = document.createElement('div');
//     divRef.classList.add('card__bottom');
//     for(let stat in pokemon.stats) {
//         divRef.appendChild(createCardStat(stat, pokemon));
//     }