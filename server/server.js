const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const game = require("./game");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static("public"));

const MAP_WIDTH = 1440; // Largeur totale de la carte
const GROUND_LEVEL = 300; // Niveau du sol
const JUMP_HEIGHT = 50; // Hauteur du saut

const players = {}; // Stockage des joueurs
let playersReady = 0; // Nombre de joueurs prêts

io.on("connection", (socket) => {
    if (Object.keys(players).length >= 2) {
        socket.disconnect(); // Bloque les joueurs en trop
        return;
    }

    // Assigner des positions de départ en fonction de l'ordre de connexion
    const startX = Object.keys(players).length === 0 ? 100 : 500; // Joueur 1 à gauche, Joueur 2 à droite
    players[socket.id] = {
        x: startX, // Position de départ différente pour chaque joueur
        y: GROUND_LEVEL, // Position verticale initiale
        hp: 100,
        attacking: false,
        jumping: false,
        animation: "idle",
        name: "",
        ready: false // Indique si le joueur a choisi son personnage et sa map
    };

    console.log(`Nouveau joueur connecté : ${socket.id}`);
    console.log("Joueurs actuels :", players);

    socket.on("setPlayerName", (name) => {
        if (players[socket.id]) {
            players[socket.id].name = name;
            console.log(`Joueur ${socket.id} a défini son nom : ${name}`);
            io.emit("updatePlayers", players); // Mettre à jour les joueurs avec les nouveaux noms
        }
    });

    socket.on("playerReady", () => {
        if (players[socket.id]) {
            players[socket.id].ready = true;
            playersReady++;
            io.emit("updatePlayers", players);

            if (playersReady === 2) {
                // Les deux joueurs sont prêts, lancer le compte à rebours
                io.emit("startCountdown");
            }
        }
    });

    socket.on("selectMap", (selectedMap) => {
        if (players[socket.id]) {
            players[socket.id].mapSelected = true; // Indiquer que le joueur a choisi sa carte
            console.log(`Joueur ${socket.id} a choisi la carte : ${selectedMap}`);
            io.emit("updatePlayers", players); // Mettre à jour les joueurs
    
            // Vérifier si les deux joueurs ont choisi leur carte
            const playersWithMap = Object.values(players).filter(player => player.mapSelected).length;
            if (playersWithMap === 2) {
                io.emit("bothMapsSelected"); // Notifier les clients que les deux joueurs ont choisi leur carte
            }
        }
    });

    socket.emit("init", { id: socket.id, players, mapWidth: MAP_WIDTH });
    io.emit("updatePlayers", players);

    socket.on("move", (direction) => {
        if (players[socket.id] && players[socket.id].ready && playersReady === 2) {
            if (direction === "left") {
                players[socket.id].x = Math.max(0, players[socket.id].x - 10);
                players[socket.id].animation = "walking"; // Mettre à jour l'état d'animation
                players[socket.id].direction = "left"; 
            }
            if (direction === "right") {
                players[socket.id].x = Math.min(MAP_WIDTH - 300, players[socket.id].x + 10);
                players[socket.id].animation = "walking"; // Mettre à jour l'état d'animation
                players[socket.id].direction = "right";
            }
            io.emit("updatePlayers", players);
        }
    });

    socket.on("jump", () => {
        if (players[socket.id] && !players[socket.id].jumping && players[socket.id].ready && playersReady === 2) {
            players[socket.id].jumping = true;
            const initialY = players[socket.id].y;

            // Monter
            players[socket.id].y = initialY - JUMP_HEIGHT;
            io.emit("updatePlayers", players);

            // Redescendre après un délai
            setTimeout(() => {
                players[socket.id].y = initialY;
                players[socket.id].jumping = false;
                io.emit("updatePlayers", players);
            }, 500); // Durée du saut
        }
    });

    socket.on("attack", () => {
        if (players[socket.id] && players[socket.id].ready && playersReady === 2) {
            players[socket.id].attacking = true;
            players[socket.id].animation = "attacking";
            const result = game.processAttack(socket.id, players);

            if (result && result.gameOver) {
                // Émettre l'événement gameOver à tous les clients
                io.emit("gameOver", { winner: result.winner, loser: result.loser });
            }

            // Envoyer les données mises à jour à tous les clients
            io.emit("updatePlayers", players);

            setTimeout(() => {
                players[socket.id].attacking = false;
                players[socket.id].animation = "idle";
                io.emit("updatePlayers", players);
            }, 500);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Joueur déconnecté : ${socket.id}`);
        delete players[socket.id];
        playersReady--;
        io.emit("updatePlayers", players);
    });
});

server.listen(port, () => {
    console.log(`Le serveur écoute sur http://localhost:${port}`);
});