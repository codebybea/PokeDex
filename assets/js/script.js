// Seleção dos elementos HTML que serão manipulados para exibir as informações do Pokémon
const pokemonName = document.querySelector(".pokemon__name"); // Elemento que exibe o nome do Pokémon
const pokemonNumber = document.querySelector(".pokemon__number"); // Elemento que exibe o número (ID) do Pokémon
const pokemonImage = document.querySelector(".pokemon__image"); // Elemento que exibe a imagem animada do Pokémon

// Seleção dos elementos de interação do usuário (formulário e botões)
const form = document.querySelector(".form"); // Formulário de pesquisa
const input = document.querySelector(".input__search"); // Campo de texto onde o usuário digita o nome ou número do Pokémon
const buttonPrev = document.querySelector(".btn-prev"); // Botão "Prev" para navegar ao Pokémon anterior
const buttonNext = document.querySelector(".btn-next"); // Botão "Next" para navegar ao próximo Pokémon
const alertContainer = document.querySelector("#alert-container"); // Contêiner onde os alertas serão exibidos

// Variáveis de controle
let searchPokemon = 1; // ID do Pokémon atual (começa com 1)
const MAX_POKEMON_ID = 1025; // Limite máximo de IDs na PokeAPI (total de espécies únicas)

// Função assíncrona para buscar dados de um Pokémon na PokeAPI
const fetchPokemon = async (pokemon) => {
  // Faz uma requisição HTTP para a PokeAPI com o nome ou ID do Pokémon
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  );

  // Verifica se a resposta da API foi bem-sucedida (status 200)
  if (APIResponse.status === 200) {
    const data = await APIResponse.json(); // Converte a resposta para JSON
    return data; // Retorna os dados do Pokémon (nome, ID, sprites, etc.)
  } else {
    // Caso a requisição falhe
    if (isNaN(pokemon)) {
      // Verifica se o input é um nome (não é número)
      showAlert("Pokémon name not found, please check spelling"); // Exibe alerta para nome inválido
    } else if (parseInt(pokemon) > MAX_POKEMON_ID) {
      // Verifica se o ID é maior que o limite
      showAlert("Pokémon ID must be between 1 and 1025"); // Exibe alerta para ID inválido
    }
    return null; // Retorna null se não encontrar o Pokémon
  }
};

// Função para criar e exibir alertas visuais usando Bootstrap
const showAlert = (message) => {
  // Cria um elemento <div> para o alerta
  const alertDiv = document.createElement("div");
  // Define as classes Bootstrap para estilizar o alerta (vermelho, com botão de fechar)
  alertDiv.className = "alert alert-danger alert-dismissible fade show";
  alertDiv.role = "alert";
  // Define o HTML interno do alerta com a mensagem e um botão de fechar
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Adiciona o alerta ao contêiner na página
  alertContainer.appendChild(alertDiv);

  // Define um temporizador para remover o alerta após 5 segundos
  setTimeout(() => {
    alertDiv.classList.remove("show"); // Remove a classe "show" para iniciar o efeito de fade
    alertDiv.classList.add("fade"); // Adiciona a classe "fade" para a animação
    setTimeout(() => alertDiv.remove(), 150); // Remove o elemento após a animação
  }, 5000);
};

// Função para renderizar os dados de um Pokémon na interface
const renderPokemon = async (pokemon) => {
  // Exibe mensagem de carregamento enquanto busca os dados
  pokemonName.innerHTML = "Loading...";
  pokemonNumber.innerHTML = "";
  pokemonImage.style.display = "none"; // Esconde a imagem até os dados serem carregados

  // Verifica se o input é um número (ID) e se está fora do intervalo permitido
  const pokemonId = parseInt(pokemon);
  if (!isNaN(pokemonId)) {
    // Se for um número
    if (pokemonId < 1 || pokemonId > MAX_POKEMON_ID) {
      // Verifica se o ID é inválido
      showAlert("Pokémon ID must be between 1 and 1025"); // Exibe alerta
      input.value = ""; // Limpa o campo de pesquisa
      // Tenta recarregar o Pokémon atual (se existir), ou limpa a interface
      if (searchPokemon) {
        renderPokemon(searchPokemon);
      } else {
        pokemonName.innerHTML = "";
        pokemonNumber.innerHTML = "";
      }
      return; // Sai da função para evitar continuar a busca
    }
  }

  // Busca os dados do Pokémon na API
  const data = await fetchPokemon(pokemon);

  // Verifica se os dados foram encontrados
  if (data) {
    pokemonImage.style.display = "block"; // Exibe a imagem
    pokemonName.innerHTML = data.name; // Atualiza o nome do Pokémon na interface
    pokemonNumber.innerHTML = data.id; // Atualiza o número (ID) do Pokémon

    // Define a URL da imagem animada do Pokémon (usando sprites da geração V)
    pokemonImage.src =
      data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ];
    input.value = ""; // Limpa o campo de pesquisa
    searchPokemon = data.id; // Atualiza o ID do Pokémon atual
  } else {
    // Caso o Pokémon não seja encontrado
    pokemonImage.style.display = "none"; // Esconde a imagem
    pokemonName.innerHTML = "Not found :c"; // Exibe mensagem de erro
    pokemonNumber.innerHTML = ""; // Limpa o número
    input.value = ""; // Limpa o campo de pesquisa
  }
};

// Adiciona um ouvinte de evento para o formulário de pesquisa
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)
  renderPokemon(input.value.toLowerCase()); // Busca o Pokémon digitado, convertendo para minúsculas
});

// Adiciona um ouvinte de evento para o botão "Prev"
buttonPrev.addEventListener("click", () => {
  if (searchPokemon > 1) {
    // Verifica se não é o primeiro Pokémon
    searchPokemon -= 1; // Decrementa o ID
    renderPokemon(searchPokemon); // Carrega o Pokémon anterior
  }
});

// Adiciona um ouvinte de evento para o botão "Next"
buttonNext.addEventListener("click", () => {
  if (searchPokemon < MAX_POKEMON_ID) {
    // Verifica se não é o último Pokémon
    searchPokemon += 1; // Incrementa o ID
    renderPokemon(searchPokemon); // Carrega o próximo Pokémon
  }
});

renderPokemon(searchPokemon);
