/*const express = require('express');
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
        name: "" 
    };

    console.log(`Nouveau joueur connecté : ${socket.id}`);
    console.log("Joueurs actuels :", players);

    socket.on("setPlayerName", (name) => {
        // ne crée pas de joueur tant que le nom n'a pas été soumis
        if (players[socket.id]) {
            players[socket.id].name = name;
            console.log(`Joueur ${socket.id} a défini son nom : ${name}`);
            io.emit("updatePlayers", players); // Mettre à jour les joueurs avec les nouveaux noms
        }
    });
    
    socket.emit("init", { id: socket.id, players, mapWidth: MAP_WIDTH });
    io.emit("updatePlayers", players);


 

    socket.on("move", (direction) => {
        if (players[socket.id]) {
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
        if (players[socket.id] && !players[socket.id].jumping) {
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
    if (players[socket.id]) {
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


    socket.on("gameOver", (data) => {
        const winner = data.winner;
        const loser = data.loser;
    
        if (playerName === winner) {
            showVictoryMessage("Vous avez gagné !");
        } else if (playerName === loser) {
            showVictoryMessage("Vous avez perdu !");
        }

    });

    socket.on("disconnect", () => {
        console.log(`Joueur déconnecté : ${socket.id}`);
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});


server.listen(port, () => {
    console.log(`Le serveur écoute sur http://localhost:${port}`);
});*/



const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const game = require("./game");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static("public"));

const MAP_WIDTH = 1440; 
const GROUND_LEVEL = 300; 
const JUMP_HEIGHT = 50; 

const players = {}; 

io.on("connection", (socket) => {
    if (Object.keys(players).length >= 2) {
        socket.disconnect(); 
        return;
    }

    // Position initiale des joueurs
    const startX = Object.keys(players).length === 0 ? 100 : 500;
    players[socket.id] = {
        x: startX, 
        y: GROUND_LEVEL, 
        hp: 100,
        attacking: false,
        jumping: false,
        animation: "idle",
        name: "",
    };

    console.log(`🔵 Nouveau joueur connecté : ${socket.id}`);
    console.log("📋 Joueurs actuels :", players);

    socket.on("setPlayerName", (name) => {
        if (players[socket.id]) {
            players[socket.id].name = name;
            console.log(`📛 Joueur ${socket.id} a défini son nom : ${name}`);

            if (Object.keys(players).length === 2) {
                console.log("🚀 Les deux joueurs sont prêts, ils peuvent maintenant bouger !");
                io.emit("playersReady");
            }
            io.emit("updatePlayers", players);
        }
    });

    socket.emit("init", { id: socket.id, players, mapWidth: MAP_WIDTH });
    io.emit("updatePlayers", players);

    // Gestion des déplacements
    /*socket.on("move", (direction) => {
        if (players[socket.id]) {
            if (direction === "left") {
                players[socket.id].x = Math.max(0, players[socket.id].x - 10);
                players[socket.id].animation = "walking";
            }
            if (direction === "right") {
                players[socket.id].x = Math.min(MAP_WIDTH - 300, players[socket.id].x + 10);
                players[socket.id].animation = "walking";
            }
            console.log(`🕹️ ${socket.id} se déplace à x=${players[socket.id].x}`);
            
            io.emit("updatePlayers", players);
        }
    });*/
    socket.on("move", (direction) => {
        if (players[socket.id]) {
            if (direction === "left") {
                players[socket.id].x = Math.max(0, players[socket.id].x - 10);
                players[socket.id].animation = "walking";
                players[socket.id].direction = "left"; // Ajoute la direction actuelle
            }
            if (direction === "right") {
                players[socket.id].x = Math.min(MAP_WIDTH - 300, players[socket.id].x + 10);
                players[socket.id].animation = "walking";
                players[socket.id].direction = "right"; // Ajoute la direction actuelle
            }
    
            console.log(`🕹️ ${socket.id} se déplace à x=${players[socket.id].x}`);
    
            io.emit("updatePlayers", players);
    
            // **Ajout du timeout pour repasser à idle**
            setTimeout(() => {
                if (players[socket.id]) {
                    players[socket.id].animation = "idle"; // Passe à idle après un petit délai
                    io.emit("updatePlayers", players);
                }
            }, 150); // 150ms après, il passe en idle
        }
    });
    

    // Gestion du saut
    socket.on("jump", () => {
        if (players[socket.id] && !players[socket.id].jumping) {
            players[socket.id].jumping = true;
            const initialY = players[socket.id].y;

            players[socket.id].y = initialY - JUMP_HEIGHT;
            io.emit("updatePlayers", players);

            setTimeout(() => {
                players[socket.id].y = initialY;
                players[socket.id].jumping = false;
                io.emit("updatePlayers", players);
            }, 500);
        }
    });

    // Gestion de l'attaque
    socket.on("attack", () => {
        if (players[socket.id]) {
            players[socket.id].attacking = true;
            players[socket.id].animation = "attacking";

            const result = game.processAttack(socket.id, players);

            if (result && result.gameOver) {
                io.emit("gameOver", { winner: result.winner, loser: result.loser });
            }

            io.emit("updatePlayers", players);

            setTimeout(() => {
                players[socket.id].attacking = false;
                players[socket.id].animation = "idle";
                io.emit("updatePlayers", players);
            }, 500);
        }
    });

    // Gestion de la déconnexion
    socket.on("disconnect", () => {
        console.log(`🔴 Joueur déconnecté : ${socket.id}`);
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

server.listen(port, () => {
    console.log(`🚀 Le serveur écoute sur http://localhost:${port}`);
});
