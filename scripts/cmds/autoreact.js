module.exports = {
    config: {
        name: "autoreact",
        version: "1.0",
        author: "Loid Butter",
        countDown: 5,
        role: 0,
        shortDescription: "",
        longDescription: "",
        category: "dont know",
    },

    onStart: async function () {},

    // Dictionnaire des lettres et des emojis d'émotions
    alphabetEmotions: {
        "a": ["😊", "😁", "🤗"], // A : Heureux, Sourire, Câlin
        "b": ["😎", "🤩", "😏"], // B : Cool, Émerveillé, Narquois
        "c": ["😜", "😝", "🤪"], // C : Taquin, Fou
        "d": ["😠", "🤬", "😤"], // D : En colère, Furieux
        "e": ["😃", "😂", "🤣"], // E : Rire, Rire fort
        "f": ["🥺", "😢", "😭"], // F : Suppliant, Triste
        "g": ["😇", "😎", "😍"], // G : Innocent, Cool, Amoureux
        "h": ["🤔", "🧐", "😕"], // H : Pensif, Curieux
        "i": ["😢", "😔", "😭"], // I : Triste, Déprimé
        "j": ["😝", "😂", "😜"], // J : Amusé, Taquin
        "k": ["😳", "🥺", "😬"], // K : Timide, Embarrassé
        "l": ["😂", "🤣", "😆"], // L : Rire fort, Amusé
        "m": ["😋", "🤩", "💋"], // M : Mignon, Émerveillé
        "n": ["🤪", "😜", "😏"], // N : Fou, Coquin
        "o": ["🥳", "🎉", "😎"], // O : Fête, Cool
        "p": ["🤩", "😲", "🤗"], // P : Émerveillé, Câlin
        "q": ["😱", "😨", "🥶"], // Q : Effrayé, Terrifié
        "r": ["😤", "🤬", "😡"], // R : Frustré, Furieux
        "s": ["😈", "👹", "👿"], // S : Méchant, Diabolique
        "t": ["🤗", "💖", "🫶"], // T : Câlin, Amour
        "u": ["😜", "😉", "💋"], // U : Coquin, Séduisant
        "v": ["🤐", "😶", "🤫"], // V : Silencieux, Secret
        "w": ["😤", "💪", "🥇"], // W : Déterminé, Fort
        "x": ["😑", "😬", "🙄"], // X : Neutre, Ennuyeux
        "y": ["🙃", "😜", "😝"], // Y : Renversé, Amusé
        "z": ["😶", "😐", "😌"], // Z : Calme, Sérénité
    },

    onChat: async function ({ event, api }) {
        const message = event.body.toLowerCase(); // Transforme le message en minuscule pour faciliter la recherche

        // Vérifie chaque lettre de l'alphabet dans le message
        for (const letter in this.alphabetEmotions) {
            if (message.indexOf(letter) !== -1) {
                // Sélectionne un emoji aléatoire parmi ceux associés à la lettre
                const emojis = this.alphabetEmotions[letter];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                return api.setMessageReaction(randomEmoji, event.messageID, event.threadID);
            }
        }
    }
};
