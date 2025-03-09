/*console.log("✅ gameplay.js chargé !");
//Initialiser le socket uniquement sur la page de gameplay, où la communication en temps réel est nécessaire.
const socket = io();

// Récupérer les données stockées
const selectedCharacter = JSON.parse(localStorage.getItem("player1"));
const selectedMap = localStorage.getItem("selectedMap");

if (!selectedCharacter || !selectedMap) {
    console.error("❌ ERREUR : Données manquantes !");
    window.location.href = "/";
}

// Appliquer la map en fond
document.getElementById("game-background").style.backgroundImage = `url(${selectedMap})`;

// Envoyer les données au serveur
socket.emit("setPlayerData", { character: selectedCharacter.avatar, map: selectedMap });

console.log("🚀 Envoi des données du joueur :", { character: selectedCharacter.avatar, map: selectedMap });

// Attendre la mise à jour des joueurs
socket.on("updatePlayers", (players) => {
    console.log("🎮 Mise à jour des joueurs :", players);

    Object.keys(players).forEach((id) => {
        let playerDiv = document.getElementById(id) || document.createElement("div");
        playerDiv.id = id;
        playerDiv.classList.add("player");
        playerDiv.style.left = players[id].x + "px";
        playerDiv.style.top = players[id].y + "px";
        playerDiv.style.backgroundImage = `url(${players[id].character})`;
        document.getElementById("game-container").appendChild(playerDiv);
    });
});

// Gérer le déplacement du joueur
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") socket.emit("move", "left");
    if (event.key === "ArrowRight") socket.emit("move", "right");
});*/


//chat 
/*
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ gameplay.js chargé !");
    const socket = io();
    const gameContainer = document.getElementById("game-container");

    // Message indiquant que le deuxième joueur est attendu
    const waitingMessage = document.createElement("div");
    waitingMessage.id = "waiting-message";
    waitingMessage.innerText = "Le ops arrive...";
    waitingMessage.style.position = "absolute";
    waitingMessage.style.top = "50%";
    waitingMessage.style.left = "50%";
    waitingMessage.style.transform = "translate(-50%, -50%)";
    waitingMessage.style.color = "#fff";
    waitingMessage.style.fontSize = "24px";
    waitingMessage.style.fontWeight = "bold";
    waitingMessage.style.animation = "blink 1s infinite alternate"; // Animation clignotante
    gameContainer.appendChild(waitingMessage);

    // Animation CSS pour le message clignotant
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes blink {
            from { opacity: 1; }
            to { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);

    // Récupérer les données stockées
    const selectedCharacter = JSON.parse(localStorage.getItem("player1"));
    const selectedMap = localStorage.getItem("selectedMap");

    if (!selectedCharacter || !selectedMap) {
        console.error("❌ ERREUR : Données manquantes !");
        window.location.href = "/";
    }

    // Appliquer la map en fond
    document.getElementById("game-background").style.backgroundImage = `url(${selectedMap})`;

    // Envoyer les données du joueur au serveur
    socket.emit("setPlayerData", { character: selectedCharacter.avatar, map: selectedMap });

    console.log("🚀 Envoi des données du joueur :", { character: selectedCharacter.avatar, map: selectedMap });

    // Attendre la mise à jour des joueurs
    socket.on("updatePlayers", (players) => {
        console.log("🎮 Mise à jour des joueurs :", players);

        let firstPlayerId = Object.keys(players)[0]; // Récupérer le premier joueur connecté
        let firstPlayerCharacter = players[firstPlayerId].character;
    
        // Vérifier combien de joueurs sont connectés
        if (Object.keys(players).length === 2) {
            waitingMessage.remove(); // Supprime le message "Le ops arrive..."
        }

        Object.keys(players).forEach((id) => {
            let playerDiv = document.getElementById(id) || document.createElement("div");
            playerDiv.id = id;
            playerDiv.classList.add("player");
    
            // Empêcher le joueur de sortir du cadre
            let newX = Math.max(0, Math.min(players[id].x, window.innerWidth - 100)); // Largeur du joueur = 100px
            let newY = Math.max(0, Math.min(players[id].y, window.innerHeight - 150)); // Hauteur max
    
            playerDiv.style.left = newX + "px";
            playerDiv.style.top = newY + "px";
            playerDiv.style.backgroundImage = `url(${players[id].character})`;
            document.getElementById("game-container").appendChild(playerDiv);
            
        });
    });

    // Gérer le déplacement du joueur
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") socket.emit("move", "left");
        if (event.key === "ArrowRight") socket.emit("move", "right");
    });
});*/
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ gameplay.js chargé !");
    const socket = io();
    const gameContainer = document.getElementById("game-container");

    // Message indiquant que le deuxième joueur est attendu
    const waitingMessage = document.createElement("div");
    waitingMessage.id = "waiting-message";
    waitingMessage.innerText = "Le ops arrive...";
    waitingMessage.style.position = "absolute";
    waitingMessage.style.top = "50%";
    waitingMessage.style.left = "50%";
    waitingMessage.style.transform = "translate(-50%, -50%)";
    waitingMessage.style.color = "#fff";
    waitingMessage.style.fontSize = "24px";
    waitingMessage.style.fontWeight = "bold";
    waitingMessage.style.animation = "blink 1s infinite alternate";
    gameContainer.appendChild(waitingMessage);

    // Animation CSS pour le message clignotant
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes blink {
            from { opacity: 1; }
            to { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);

    // 🔹 Récupérer les données stockées
    const selectedCharacter = JSON.parse(localStorage.getItem("player1"));
    const selectedMap = localStorage.getItem("selectedMap");

    if (!selectedCharacter || !selectedMap) {
        console.error("❌ ERREUR : Données manquantes !");
        window.location.href = "/";
    }

    console.log("🗺️ Map sélectionnée : ", selectedMap);
    console.log("🦸‍♂️ Personnage sélectionné : ", selectedCharacter);

    // 🔹 Appliquer la map en fond
    const gameBackground = document.getElementById("game-background");
    gameBackground.style.backgroundImage = `url(${selectedMap})`;

    // Vérifier si la map s'affiche bien
    if (!gameBackground.style.backgroundImage) {
        console.error("❌ ERREUR : Impossible de charger la carte !");
    }

    // 🔹 Envoyer les données du joueur au serveur
    socket.emit("setPlayerData", { character: selectedCharacter.avatar, map: selectedMap });

    console.log("🚀 Envoi des données du joueur :", { character: selectedCharacter.avatar, map: selectedMap });

    // 🔹 Attendre la mise à jour des joueurs
    socket.on("updatePlayers", (players) => {
        console.log("🎮 Mise à jour des joueurs :", players);

        let firstPlayerId = Object.keys(players)[0]; 
        let firstPlayerCharacter = players[firstPlayerId].character;

        // Vérifier combien de joueurs sont connectés
        if (Object.keys(players).length === 2) {
            waitingMessage.remove(); // Supprime le message "Le ops arrive..."
        }

        Object.keys(players).forEach((id) => {
            let playerDiv = document.getElementById(id);
            if (!playerDiv) {
                playerDiv = document.createElement("div");
                playerDiv.id = id;
                playerDiv.classList.add("player");
                gameContainer.appendChild(playerDiv);
                console.log(`🕹️ Joueur ${id} ajouté au DOM.`);
            }
            console.log(`📍 Position mise à jour pour ${id} : x=${players[id].x}`);

            playerDiv.style.left = players[id].x + "px";
            playerDiv.style.top = players[id].y + "px";

            // 🔹 Changer l'avatar si c'est "smehlee"
            if (id === firstPlayerId && firstPlayerCharacter.includes("smehlee")) {
                console.log("🎭 Le premier joueur a choisi Smehlee ! Changement de l'avatar...");
                playerDiv.style.backgroundImage = `url('/assets/img/fond/toleft-smehlee.png')`;
            } else {
                playerDiv.style.backgroundImage = `url(${players[id].character})`;
            }
        });
    });

    // 🔹 Gérer les déplacements avec les limites
    document.addEventListener("keydown", (event) => {
        console.log(`🎮 Touche pressée : ${event.key}`); 
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            socket.emit("move", event.key);
        }
    });
});
