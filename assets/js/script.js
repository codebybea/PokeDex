const pokemonName = document.querySelector(".pokemon__name");
const pokemonNumber = document.querySelector(".pokemon__number");
const pokemonImage = document.querySelector(".pokemon__image");

const form = document.querySelector(".form");
const input = document.querySelector(".input__search");
const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");
const alertContainer = document.querySelector("#alert-container");

let searchPokemon = 1;
const MAX_POKEMON_ID = 1025; // Total de espécies únicas na PokeAPI

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  );

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
  return null;
};

// Função para exibir alerta Bootstrap
const showAlert = (message) => {
  // Criar elemento de alerta
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-danger alert-dismissible fade show";
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Adicionar ao contêiner
  alertContainer.appendChild(alertDiv);

  // Remover após 5 segundos
  setTimeout(() => {
    alertDiv.classList.remove("show");
    alertDiv.classList.add("fade");
    setTimeout(() => alertDiv.remove(), 150); // Tempo para animação de fade
  }, 5000);
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = "Loading...";
  pokemonNumber.innerHTML = "";
  pokemonImage.style.display = "none";

  // Validar entrada se for um número
  const pokemonId = parseInt(pokemon);
  if (!isNaN(pokemonId)) {
    if (pokemonId < 1 || pokemonId > MAX_POKEMON_ID) {
      showAlert("Pokémon ID must be between 1 and 1025");
      input.value = "";
      // Restaurar o Pokémon atual ou estado inicial
      if (searchPokemon) {
        renderPokemon(searchPokemon);
      } else {
        pokemonName.innerHTML = "";
        pokemonNumber.innerHTML = "";
      }
      return;
    }
  }

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = "block";
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src =
      data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ];
    input.value = "";
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = "none";
    pokemonName.innerHTML = "Not found :c";
    pokemonNumber.innerHTML = "";
    input.value = "";
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener("click", () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener("click", () => {
  if (searchPokemon < MAX_POKEMON_ID) {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
  }
});

renderPokemon(searchPokemon);
