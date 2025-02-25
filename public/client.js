const socket = io();

let playerId = null;
let players = {};
let lastDirection = null; // Pour suivre la dernière direction
let playerName = "";
const attackSound = new Audio('/assets/sound/attack.m4a');

document.getElementById("submit-name").addEventListener("click", () => {
    const nameInput = document.getElementById("player-name").value.trim();
    if (nameInput) {
        playerName = nameInput;
        document.getElementById("name-input").style.display = "none"; // Masquer le formulaire
        document.getElementById("game").style.display = "block"; // Afficher le jeu
        socket.emit("setPlayerName", playerName); // Envoyer le nom au serveur

        // Afficher les joueurs après la soumission du nom
        const player1 = document.getElementById("player1");
        const player2 = document.getElementById("player2");
        if (player1) player1.style.display = "block";
        if (player2) player2.style.display = "block";
        œ
    } else {
        alert("Veuillez entrer un nom valide.");
    }
});



socket.on("init", (data) => {
    /*playerId = data.id;
    players = data.players;
    console.log("Données initiales reçues :", data); // Ajoutez ce log
    drawPlayers();*/
    playerId = data.id;
    players = data.players;
    MAP_WIDTH = data.mapWidth; // Récupérer la largeur de la carte
    console.log("Données initiales reçues :", data);
    drawPlayers();
});

socket.on("updatePlayers", (data) => {
    players = data;
    console.log("Mise à jour des joueurs reçue :", data); // Ajoutez ce log
    drawPlayers();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        console.log("Déplacement vers la gauche");
        socket.emit("move", "left");
        lastDirection = "left";
    }
    if (e.key === "ArrowRight") {
        console.log("Déplacement vers la droite");
        socket.emit("move", "right");
        lastDirection = "right";
    }
    if (e.key === " ") {
        console.log("Attaque");
        attackSound.play(); 
        socket.emit("attack");
    }
    if (e.key === "ArrowUp") {
        console.log("Saut");
        socket.emit("jump");
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        lastDirection = null; // Réinitialiser la direction lorsque la touche est relâchée

        const player1 = document.getElementById("player1");
        const player2 = document.getElementById("player2");
        if (player1) {
            player1.classList.remove("classique1", "classique2");
            player1.classList.add("idle");
        }
        if (player2) {
            player2.classList.remove("classique1", "classique2");
            player2.classList.add("idle");
        }
    }
});


function updatePlayerAnimation(playerId, playerData) {
    const player = document.getElementById(playerId);

    if (!player) return;

    if (playerData.animation === "walking") {
        if (lastDirection === "left") {
            player.classList.remove("classique2");
            player.classList.add("classique1"); // Marche vers la gauche
        } else if (lastDirection === "right") {
            player.classList.remove("classique1");
            player.classList.add("classique2"); // Marche vers la droite
        }
    } else {
        player.classList.remove("classique1", "classique2");
        player.classList.add("idle"); // Animation par défaut
    }
}

function playAttackAnimation(playerId) {
    const player = document.getElementById(playerId);

    if (!player) return;

    player.classList.remove("attacking1", "attacking2", "attacking3");

    player.classList.add("attacking1");
    setTimeout(() => {
        player.classList.remove("attacking1");
        player.classList.add("attacking2");
    }, 100);
    setTimeout(() => {
        player.classList.remove("attacking2");
        player.classList.add("attacking3");
    }, 200);
    setTimeout(() => {
        player.classList.remove("attacking3");
    }, 300);
}


function drawPlayers() {
    const p1 = document.getElementById("player1");
    const p2 = document.getElementById("player2");
    const status = document.getElementById("status");
    if (!playerName) return;

    let p1Data = players[playerId]; // Utilise l'ID du joueur actuel
    let p2Data = Object.values(players).find(player => player !== p1Data); // Données du deuxième joueur

    if (p1Data) {
        console.log(`Position du joueur 1 : x = ${p1Data.x}, y = ${p1Data.y}`);
        p1.style.left = `${p1Data.x}px`;
        p1.style.top = `${p1Data.y}px`;
        p1.style.display = "block";

        // Mettre à jour l'animation du joueur 1
        if (p1Data.animation === "walking") {
            updatePlayerAnimation("player1", p1Data);
        } else if (p1Data.animation === "attacking") {
            playAttackAnimation("player1");
        } else {
            p1.classList.remove("classique1", "classique2", "attacking1", "attacking2", "attacking3");
            p1.classList.add("idle");
        }
    } else {
        p1.style.display = "none";
    }

    if (p2Data) {
        // Inverser uniquement la position horizontale du joueur adverse
        const invertedX = MAP_WIDTH - p2Data.x - 300; // 300 = largeur du joueur
        console.log(`Position du joueur 2 (inversée) : x = ${invertedX}, y = ${p2Data.y}`);
        p2.style.left = `${invertedX}px`;
        p2.style.top = `${p2Data.y}px`;
        p2.style.display = "block";

        // Mettre à jour l'animation du joueur 2 (sans inversion de direction)
        if (p2Data.animation === "walking") {
            updatePlayerAnimation("player2", p2Data);
        } else if (p2Data.animation === "attacking") {
            playAttackAnimation("player2");
        } else {
            p2.classList.remove("classique1", "classique2", "attacking1", "attacking2", "attacking3");
            p2.classList.add("idle");
        }
    } else {
        p2.style.display = "none";
    }

    if (p1Data && p2Data) {
        // Afficher les points de vie avec les noms des joueurs
        if (playerId === p1Data.id) {
            status.innerHTML = `<span class="player1-status">${p1Data.name}: ${p1Data.hp} HP</span> | <span class="player2-status">${p2Data.name}: ${p2Data.hp} HP</span>`;
        } else {
            status.innerHTML = `<span class="player2-status">${p2Data.name}: ${p2Data.hp} HP</span> | <span class="player1-status">${p1Data.name}: ${p1Data.hp} HP</span>`;
        }
    } else {
        status.innerHTML = `En attente du deuxième joueur...`;
    }
}


function showVictoryMessage(winner) {
    const gameContainer = document.getElementById("game");
    const victoryMessage = document.createElement("div");
    victoryMessage.id = "victory-message";
    victoryMessage.innerHTML = `<p>Le ${winner} a gagné !</p>`;
    gameContainer.appendChild(victoryMessage); // Ajouter le message dans #game

    // Recharger la page après 5 secondes
    setTimeout(() => {
        location.reload(); // Recharger la page
    }, 5000); // 5000 ms = 5 secondes
}

