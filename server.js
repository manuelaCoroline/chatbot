const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Importer le middleware cors

const app = express();
const PORT = 3000;

// Utiliser le middleware cors
app.use(cors());

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Charger les intents
const loadIntents = () => {
  const filePath = path.join(__dirname, "intents.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur de chargement des intentions:", error);
    return null;
  }
};

// Fonction pour obtenir une réponse basée sur les intents
const getResponse = (intents, userInput) => {
  if (!intents) {
    return "Erreur : Les intentions n'ont pas pu être chargées.";
  }

  // Expressions régulières pour détecter la présentation
  const namePatterns = [
    /je m'appelle\s+([a-zA-Z]+)/i,
    /je suis\s+([a-zA-Z]+)/i,
    /je me nomme\s+([a-zA-Z]+)/i,
    /mon nom est\s+([a-zA-Z]+)/i,
  ];

  // Vérification des patterns de nom
  for (let i = 0; i < namePatterns.length; i++) {
    const match = userInput.match(namePatterns[i]);
    if (match) {
      const name = match[i];
      return `Nice to meet you, ${name}!`;
    }
  }

  for (const intent of intents.intents) {
    for (const pattern of intent.patterns) {
      const regex = new RegExp(pattern, "i"); // 'i' pour insensible à la casse
      if (regex.test(userInput)) {
        const response =
          intent.responses[Math.floor(Math.random() * intent.responses.length)];
        return response;
      }
    }
  }

  for (const intent of intents.intents) {
    for (const pattern of intent.patterns) {
      const regex = new RegExp(pattern, "i");        if (regex.test(userInput)) {
        const response =
          intent.responses[Math.floor(Math.random() * intent.responses.length)];
        // Ajouter ici la logique pour afficher la réponse
        return response;
      }
    }
  }
  return "Je suis désolé, je ne comprends pas votre question.";
};

// Route pour gérer les requêtes de chat
app.post("/chat", (req, res) => {
  const userInput = req.body.message;
  const intents = loadIntents();
  const response = getResponse(intents, userInput);
  console.log("User Input:", userInput);
  console.log("Response:", response);
  res.json({ response });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
