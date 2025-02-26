import axios from "axios";

const API_URL = "https://swapi.dev/api/people/?page=1";

export const fetchAllCharacters = async (onProgress) => {
  let nextPageUrl = API_URL;
  let totalLoaded = 0;

  try {
    while (nextPageUrl) {
      const response = await axios.get(nextPageUrl);
      const newCharacters = response.data.results;

      totalLoaded += newCharacters.length;

      // Chama o callback passando os personagens carregados e o total até agora
      if (onProgress) {
        onProgress(newCharacters, totalLoaded);
      }

      nextPageUrl = response.data.next;

      // Pequeno delay entre requisições para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return { error: null };
  } catch (error) {
    console.error("API Error:", error);
    return { error: "❌ Failed to load characters. Try again." };
  }
};
