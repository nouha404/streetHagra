const socket = io();

let playerId = null;
let players = {};
let lastDirection = null; // Pour suivre la dernière direction
let playerName = "";
let isGameOver = false; // Variable pour vérifier si la partie est terminée
const attackSound = new Audio('/assets/sound/attack.m4a');

// Tableau des maps disponibles
const maps = [
    '/assets/img/foudubus/fond/Map1.png',
    '/assets/img/foudubus/fond/Map2.png',
];

let currentMapIndex = 0; // Index de la map actuelle
const mapImage = document.getElementById('map-image');
const prevMapButton = document.getElementById('prev-map');
const nextMapButton = document.getElementById('next-map');
const confirmMapButton = document.getElementById('confirm-map');

// Afficher la map initiale
mapImage.src = maps[currentMapIndex];

// Gestion des clics sur les boutons précédent/suivant
// Gestion de la navigation entre les maps
prevMapButton.addEventListener('click', () => {
    currentMapIndex = (currentMapIndex - 1 + maps.length) % maps.length;
    mapImage.src = maps[currentMapIndex];
});

nextMapButton.addEventListener('click', () => {
    currentMapIndex = (currentMapIndex + 1) % maps.length;
    mapImage.src = maps[currentMapIndex];
});

// Gestion de la confirmation de la map
confirmMapButton.addEventListener('click', () => {
    const selectedMap = maps[currentMapIndex];
    socket.emit('selectMap', selectedMap);
    
    document.getElementById('map-selection').style.display = 'none';
    document.getElementById('sound-selection').style.display = 'block'; // Afficher la sélection du son
});

const sounds = [
    { name: "Jotaro Song", file: "/assets/sound/music1.mp3" },
    { name: "Overtaken", file: "/assets/sound/music2.mp3" },
    { name: "Shinji Song", file: "/assets/sound/music3.mp3" },
    { name: "Pillier Theme song", file: "/assets/sound/music4.mp3" }
];

let currentSoundIndex = 0;
const soundName = document.getElementById("sound-name");
const audioPlayer = document.getElementById("audio-player");
const audioSource = audioPlayer.querySelector("source");
const prevSoundBtn = document.getElementById("prev-sound");
const nextSoundBtn = document.getElementById("next-sound");
const confirmSoundBtn = document.getElementById("confirm-sound");

// Régler le volume à 25% par défaut
audioPlayer.volume = 0.20;

function updateSound() {
    soundName.textContent = sounds[currentSoundIndex].name;
    audioSource.src = sounds[currentSoundIndex].file;
    audioPlayer.load();
}

prevSoundBtn.addEventListener("click", () => {
    currentSoundIndex = (currentSoundIndex - 1 + sounds.length) % sounds.length;
    updateSound();
});

nextSoundBtn.addEventListener("click", () => {
    currentSoundIndex = (currentSoundIndex + 1) % sounds.length;
    updateSound();
});

confirmSoundBtn.addEventListener("click", () => {
    const selectedSound = sounds[currentSoundIndex].file;
    socket.emit('selectSound', selectedSound);

    // Lecture de la musique dès qu'on appuie sur "Confirmer"
    audioPlayer.play();

    // Masquer la sélection de son et passer à l'écran de jeu
    document.getElementById('sound-selection').style.display = 'none';
    document.getElementById('game').style.display = 'block'; // Passer au jeu
});

updateSound(); // Initialisation du son affiché
// Ajout des styles CSS pour les barres de vie, les noms des joueurs et les images de victoire/défaite
const style = document.createElement('style');
style.innerHTML = `
    .health-bar-container {
        position: fixed;
        top: 20px;
        width: 300px;
        height: 30px;
        background-color: #333;
        border: 2px solid #000;
        border-radius: 5px;
        overflow: hidden;
        margin-top:5%;
    }
    .health-bar {
        height: 100%;
        background-color: green;
        transition: width 0.3s ease, background-color 0.3s ease;
    }
    .player-name {
        position: absolute;
        top: -20px;
        left: 0;
        color: white;
        font-size: 16px;
        font-weight: bold;
    }
    #player1-health {
        left: 20px;
    }
    #player2-health {
        right: 20px;
    }
    .victory-image, .defeat-image {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 25%;
        height: auto;
        z-index: 1000;
        display: none;
    }
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Fonction pour créer les barres de vie et les noms des joueurs
function createHealthBars() {
    const gameContainer = document.getElementById("game");

    // Barre de vie du joueur 1
    const player1HealthContainer = document.createElement('div');
    player1HealthContainer.id = "player1-health";
    player1HealthContainer.classList.add("health-bar-container");
    const player1HealthBar = document.createElement('div');
    player1HealthBar.classList.add("health-bar");
    const player1Name = document.createElement('div');
    player1Name.classList.add("player-name");
    player1Name.textContent = "Joueur 1";
    player1HealthContainer.appendChild(player1Name);
    player1HealthContainer.appendChild(player1HealthBar);
    gameContainer.appendChild(player1HealthContainer);

    // Barre de vie du joueur 2
    const player2HealthContainer = document.createElement('div');
    player2HealthContainer.id = "player2-health";
    player2HealthContainer.classList.add("health-bar-container");
    const player2HealthBar = document.createElement('div');
    player2HealthBar.classList.add("health-bar");
    const player2Name = document.createElement('div');
    player2Name.classList.add("player-name");
    player2Name.textContent = "Joueur 2";
    player2HealthContainer.appendChild(player2Name);
    player2HealthContainer.appendChild(player2HealthBar);
    gameContainer.appendChild(player2HealthContainer);
}

// Fonction pour afficher l'image "KO"
function showKOImage(playerId) {
    const player = document.getElementById(playerId);
    const koImage = document.getElementById(`${playerId}-ko`);

    if (player && koImage) {
        player.style.display = "none"; // Masquer l'image normale
        koImage.style.display = "block"; // Afficher l'image "KO"
        koImage.style.left = player.style.left; // Positionner l'image "KO"
        koImage.style.top = player.style.top;
    }
}

// Fonction pour mettre à jour les barres de vie
function updateHealthBars() {
    const player1HealthBar = document.querySelector("#player1-health .health-bar");
    const player2HealthBar = document.querySelector("#player2-health .health-bar");
    const player1Name = document.querySelector("#player1-health .player-name");
    const player2Name = document.querySelector("#player2-health .player-name");

    if (players[playerId]) {
        const p1Data = players[playerId];
        const p2Data = Object.values(players).find(player => player !== p1Data);

        if (p1Data) {
            const healthPercentage1 = (p1Data.hp / 100) * 100;
            player1HealthBar.style.width = `${healthPercentage1}%`;
            player1HealthBar.style.backgroundColor = healthPercentage1 > 50 ? "green" : healthPercentage1 > 20 ? "orange" : "red";
            player1Name.textContent = p1Data.name;

            // Afficher l'image "KO" si le joueur 1 n'a plus de vie
            if (p1Data.hp <= 0) {
                showKOImage("player1");
            }
        }

        if (p2Data) {
            const healthPercentage2 = (p2Data.hp / 100) * 100;
            player2HealthBar.style.width = `${healthPercentage2}%`;
            player2HealthBar.style.backgroundColor = healthPercentage2 > 50 ? "green" : healthPercentage2 > 20 ? "orange" : "red";
            player2Name.textContent = p2Data.name;

            // Afficher l'image "KO" si le joueur 2 n'a plus de vie
            if (p2Data.hp <= 0) {
                showKOImage("player2");
            }
        }
    }
}

// Fonction pour afficher l'image de victoire ou de défaite
function showResultImage(playerId, isWinner) {
    const gameContainer = document.getElementById("game");
    const image = document.createElement('img');
    image.src = isWinner ? '/assets/img/victory.png' : '/assets/img/defeat.png'; // Chemins des images
    image.classList.add(isWinner ? 'victory-image' : 'defeat-image');
    image.style.display = 'block';
    gameContainer.appendChild(image);
}

// Appeler la fonction pour créer les barres de vie au chargement
createHealthBars();

// Gestion du choix du personnage
let selectedCharacter = "foudubus"; // Par défaut, Foudubus est sélectionné

document.getElementById("submit-name").addEventListener("click", () => {
    const nameInput = document.getElementById("player-name").value.trim();
    if (nameInput) {
        playerName = nameInput;
        document.getElementById("name-input").style.display = "none"; // Masquer le formulaire
        document.getElementById("character-selection").style.display = "block"; // Afficher le sélecteur de personnage
        socket.emit("setPlayerName", playerName); // Envoyer le nom au serveur
    } else {
        alert("Veuillez entrer un nom valide.");
    }
});

// Gestion du choix du personnage
document.querySelectorAll(".character-option").forEach(option => {
    option.addEventListener("click", () => {
        // Retirer la sélection précédente
        document.querySelectorAll(".character-option").forEach(opt => {
            opt.style.borderColor = "transparent";
        });

        // Sélectionner le personnage
        selectedCharacter = option.getAttribute("data-character");
        option.style.borderColor = "#007BFF"; // Mettre en évidence la sélection
    });
});

// Confirmer le choix du personnage
document.getElementById("confirm-character").addEventListener("click", () => {
    if (selectedCharacter) {
        document.getElementById("character-selection").style.display = "none"; // Masquer le sélecteur
        document.getElementById("map-selection").style.display = "block"; // Afficher le carrousel de maps
    } else {
        alert("Veuillez choisir un personnage.");
    }
});

socket.on("init", (data) => {
    playerId = data.id;
    players = data.players;
    MAP_WIDTH = data.mapWidth; // Récupérer la largeur de la carte
    console.log("Données initiales reçues :", data);
    drawPlayers();
    updateHealthBars(); // Mettre à jour les barres de vie
});

socket.on("updatePlayers", (data) => {
    players = data;
    console.log("Mise à jour des joueurs reçue :", data);
    drawPlayers();
    updateHealthBars(); // Mettre à jour les barres de vie
});

socket.on("gameOver", (data) => {
    isGameOver = true; // Bloquer les mouvements
    if (playerId === data.winner) {
        showResultImage(playerId, true); // Afficher l'image de victoire
    } else if (playerId === data.loser) {
        showResultImage(playerId, false); // Afficher l'image de défaite
        showKOImage(`player${data.loser === playerId ? "1" : "2"}`); // Afficher l'image "KO" pour le perdant
    }
});

document.addEventListener("keydown", (e) => {
    if (isGameOver) return; // Bloquer les mouvements si la partie est terminée

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
        player.classList.add("idle"); // Animation par défaut (inactif)
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
    const p1KO = document.getElementById("player1-ko");
    const p2KO = document.getElementById("player2-ko");

    if (!playerName) return;

    let p1Data = players[playerId]; // Utilise l'ID du joueur actuel
    let p2Data = Object.values(players).find(player => player !== p1Data); // Données du deuxième joueur

    if (p1Data) {
        console.log(`Position du joueur 1 : x = ${p1Data.x}, y = ${p1Data.y}`);
        p1.style.left = `${p1Data.x}px`;
        p1.style.top = `${p1Data.y}px`;
        p1.style.display = "block";

        // Afficher l'image "KO" si le joueur 1 n'a plus de vie
        if (p1Data.hp <= 0) {
            showKOImage("player1");
        } else {
            // Masquer l'image "KO" et afficher l'image normale
            p1.classList.remove("hidden");
            const koImage1 = document.getElementById("player1-ko");
            if (koImage1) koImage1.style.display = 'none';

            // Mettre à jour l'animation du joueur 1
            if (p1Data.animation === "walking") {
                updatePlayerAnimation("player1", p1Data);
            } else if (p1Data.animation === "attacking") {
                playAttackAnimation("player1");
            } else {
                p1.classList.remove("classique1", "classique2", "attacking1", "attacking2", "attacking3");
                p1.classList.add("idle");
            }
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

        // Afficher l'image "KO" si le joueur 2 n'a plus de vie
        if (p2Data.hp <= 0) {
            showKOImage("player2");
        } else {
            // Masquer l'image "KO" et afficher l'image normale
            p2.classList.remove("hidden");
            const koImage2 = document.getElementById("player2-ko");
            if (koImage2) koImage2.style.display = 'none';

            // Mettre à jour l'animation du joueur 2 (sans inversion de direction)
            if (p2Data.animation === "walking") {
                updatePlayerAnimation("player2", p2Data);
            } else if (p2Data.animation === "attacking") {
                playAttackAnimation("player2");
            } else {
                p2.classList.remove("classique1", "classique2", "attacking1", "attacking2", "attacking3");
                p2.classList.add("idle");
            }
        }
    } else {
        p2.style.display = "none";
    }
}
/*function showResultImage(playerId, isWinner) {
    const gameContainer = document.getElementById("game");
    const image = document.createElement('img');
    image.src = isWinner ? '/assets/img/victory.png' : '/assets/img/defeat.png'; // Chemins des images
    image.classList.add(isWinner ? 'victory-image' : 'defeat-image');
    image.style.display = 'block';
    gameContainer.appendChild(image);
}*/