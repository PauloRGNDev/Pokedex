function capitalizeFirstLetter(text) {
    if (!text) return ''; // Verifica se o texto não está vazio
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  //Pokemons que não tem seus dados acessíveis pela URL comum
const pokemonExceptions = ['aegislash']
let response;
async function getPokemon(pokemonName){
    const pokemonData = {};
    try{
        pokemonName = pokemonName.toLowerCase();
        if(!pokemonExceptions.includes(pokemonName)){
            response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = response.data;
            pokemonData.name = data.species.name
            pokemonData.image = data.sprites.front_default
            pokemonData.pokedexNumber = data.id
        } else{
            //url for pokemons where has infos in an alternative version
            response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
            const data = response.data;
            const variantVersion = await axios.get(data.varieties[0].pokemon.url);
            const variantData = variantVersion.data;
            pokemonData.name = data.name;
            pokemonData.image = variantData.sprites.front_default;
            pokemonData.pokedexNumber = data.id;
        }
        return pokemonData;
    } catch(err){
        console.log(err)
    }

}

function fillPokemonInfos(pokemon){
    const pokeName = document.querySelector('.pokedex .name');
    const pokeNumber = document.querySelector('.pokedex .number');
    const pokeImg = document.querySelector('img.pokemon');
    pokeName.textContent = capitalizeFirstLetter(pokemon.name);
    pokeNumber.textContent = `Nº ${pokemon.pokedexNumber}`;
    pokeImg.setAttribute('src', `${pokemon.image}`)
}

const searchField = document.querySelector('input')
searchField.addEventListener('change', async (e) => {
    try{
        const pokemon = await getPokemon(e.target.value);
        fillPokemonInfos(pokemon);
    } catch(err){
        const pokeName = document.querySelector('.pokedex .name');
        const pokeNumber = document.querySelector('.pokedex .number');
        const pokeImg = document.querySelector('img.pokemon');

        //set values
        pokeNumber.textContent= "";
        pokeImg.setAttribute('src', ``);
        pokeName.textContent = e.target.value == '' ?"" : "POKEMON INVÁLIDO, DIGITE UM NOME VÁLIDO";
    }
})