const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const game = require("./game");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static("public"));

const MAP_WIDTH = 2000; // Largeur totale de la carte (plus grande que l'écran)
const GROUND_LEVEL = 300; // Niveau du sol
const JUMP_HEIGHT = 50; // Hauteur du saut

const players = {}; // Stockage des joueurs

io.on("connection", (socket) => {
    if (Object.keys(players).length >= 2) {
        socket.disconnect(); // Bloque les joueurs en trop
        return;
    }

    players[socket.id] = {
        x: socket.id.endsWith("1") ? 100 : 500, // Position de départ
        y: GROUND_LEVEL,
        hp: 100,
        attacking: false,
        jumping: false
    };

    socket.emit("init", { id: socket.id, players, mapWidth: MAP_WIDTH });
    io.emit("updatePlayers", players);

    socket.on("move", (direction) => {
        if (players[socket.id]) {
            if (direction === "left") {
                players[socket.id].x = Math.max(0, players[socket.id].x - 10);
            }
            if (direction === "right") {
                players[socket.id].x = Math.min(MAP_WIDTH, players[socket.id].x + 10);
            }
            io.emit("updatePlayers", players);
        }
    });

    socket.on("jump", () => {
        if (players[socket.id] && !players[socket.id].jumping) {
            players[socket.id].jumping = true;
            players[socket.id].y = Math.max(0, players[socket.id].y - JUMP_HEIGHT);
            io.emit("updatePlayers", players);

            setTimeout(() => {
                players[socket.id].y = GROUND_LEVEL;
                players[socket.id].jumping = false;
                io.emit("updatePlayers", players);
            }, 500);
        }
    });

    socket.on("attack", () => {
        if (players[socket.id]) {
            players[socket.id].attacking = true;
            game.processAttack(socket.id, players);
            io.emit("updatePlayers", players);
            setTimeout(() => {
                players[socket.id].attacking = false;
                io.emit("updatePlayers", players);
            }, 500);
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

server.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});
