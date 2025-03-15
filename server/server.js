const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const game = require("./game");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

let players = {}; // Stockage des joueurs

app.use(express.static(path.join(__dirname, "../public"))); // Dossier public

// Routes du jeu
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../public/index.html")));
app.get("/choix-perso", (req, res) => res.sendFile(path.join(__dirname, "../public/choix-perso/index.html")));
app.get("/choix-map", (req, res) => res.sendFile(path.join(__dirname, "../public/choix-map/index.html")));
app.get("/gameplay", (req, res) => res.sendFile(path.join(__dirname, "../public/gameplay/index.html")));

io.on("connection", (socket) => {
    console.log(`🟢 Joueur connecté : ${socket.id}`);

    // Vérifier si la partie est complète
    if (Object.keys(players).length >= 2) {
        console.log("⚠️ Partie complète, joueur refusé.");
        socket.emit("gameFull");
        socket.disconnect();
        return;
    }

    // Attendre que le joueur envoie ses données
    socket.on("setPlayerData", (playerData) => {
        if (Object.keys(players).length >= 2) return;

        const playerWidth = 150; // Largeur approximative du sprite du joueur
        const screenWidth = 1200; // Largeur de l'écran de jeu
        const margin = 50; // Marge par rapport aux bords

        players[socket.id] = {
            id: socket.id,
            x: Object.keys(players).length === 0 ? margin : screenWidth - playerWidth - margin,
            y: 500,
            hp: 100,
            mana: 0,
            character: playerData.character,
            name: playerData.name,
            animation: "classique1",
            direction: Object.keys(players).length === 0 ? "right" : "left",
            isBlocking: false,
            blockCooldown: false,
            consecutiveAttacks: 0,
            consecutiveHits: 0,
            isCriticalAttack: false,
            lastManaUpdate: Date.now()
        };

        console.log(`🦸 Joueur ${socket.id} a choisi ${playerData.character}`);
        console.log("🗺️ Map sélectionnée :", playerData.map);

        // Envoyer la mise à jour immédiatement
        io.emit("updatePlayers", players);

        // Démarrer le chargement automatique de mana pour ce joueur
        const manaInterval = setInterval(() => {
            if (players[socket.id]) {
                const currentTime = Date.now();
                const timeSinceLastUpdate = currentTime - players[socket.id].lastManaUpdate;
                
                // Augmenter le mana toutes les 100ms
                if (timeSinceLastUpdate >= 100) {
                    players[socket.id].mana = Math.min(100, players[socket.id].mana + 1);
                    players[socket.id].lastManaUpdate = currentTime;
                    
                    // Envoyer la mise à jour aux clients
                    io.emit("updatePlayers", players);
                }
            } else {
                clearInterval(manaInterval);
            }
        }, 100);
    });

    socket.on("move", (data) => {
        if (!players[socket.id]) return;
    
        const direction = data.direction;
        const playerWidth = 150; // Largeur du sprite
        const screenWidth = 1200;
        const minX = 0;
        const maxX = screenWidth - playerWidth;
    
        if (direction === "left") {
            players[socket.id].x = Math.max(minX, players[socket.id].x - 20);
            players[socket.id].direction = "left";
            players[socket.id].animation = "walking";
        } else if (direction === "right") {
            players[socket.id].x = Math.min(maxX, players[socket.id].x + 20);
            players[socket.id].direction = "right";
            players[socket.id].animation = "walking";
        }
    
        // Envoyer la mise à jour
        io.emit("updatePlayers", players);
    
        // Repasser en animation idle après un court délai
        setTimeout(() => {
            if (players[socket.id]) {
                players[socket.id].animation = "c";
                io.emit("updatePlayers", players);
            }
        }, 100);
    });

    socket.on("attack", (data) => {
        if (!players[socket.id]) return;
        // Vérifier si c'est une attaque critique
        players[socket.id].isCriticalAttack = data && data.isCritical;

        // Traiter l'attaque
        const result = game.processAttack(socket.id, players);
        if (result) {
            if (result.gameOver) {
                // Mettre à jour l'animation du perdant
                players[result.loser].animation = "ko";
                // Envoyer le résultat de la partie
                io.emit("gameOver", result);
            } else {
                // Envoyer le résultat de l'attaque
                io.emit("attackResult", {
                    attackerId: socket.id,
                    defenderId: Object.keys(players).find(id => id !== socket.id),
                    damage: result.damage,
                    blocked: result.blocked,
                    missed: result.missed,
                    message: result.message
                });
            }
        }

        // Animation d'attaque
        players[socket.id].animation = "attacking";
        io.emit("updatePlayers", players);

        // Réinitialiser l'animation
        setTimeout(() => {
            if (players[socket.id] && !result?.gameOver) {
                players[socket.id].animation = "classique1";
                game.resetAttackCounter(socket.id, players);
                io.emit("updatePlayers", players);
            }
        }, 500);
    });

    socket.on("block", (data) => {
        if (!players[socket.id]) return;

        game.handleBlock(socket.id, players, data.isStarting);
        
        if (data.isStarting) {
            players[socket.id].animation = "block1";
            setTimeout(() => {
                if (players[socket.id] && players[socket.id].isBlocking) {
                    players[socket.id].animation = "block2";
                }
            }, 100);
        } else {
            players[socket.id].animation = "classique1";
        }

        io.emit("updatePlayers", players);
    });

    socket.on("criticalAttack", () => {
        if (!players[socket.id] || players[socket.id].mana < 100) return;

        socket.emit("attack", { isCritical: true });
    });

    // Gestion de la déconnexion
    socket.on("disconnect", () => {
        console.log(`🔴 Joueur déconnecté : ${socket.id}`);
        delete players[socket.id];

        // Informer l'autre joueur s'il reste seul
        io.emit("updatePlayers", players);
    });
});

// Lancement du serveur
server.listen(port, () => console.log(`🚀 Serveur en ligne sur http://localhost:${port}`));