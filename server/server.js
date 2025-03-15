const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

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

        players[socket.id] = {
            id: socket.id,
            x: Object.keys(players).length === 0 ? 100 : 900,
            y: 500,
            hp: 100,
            character: playerData.character,
            name: playerData.name,
            animation: "idle", // Animation initiale
            direction: "right", // Direction initiale
        };

        console.log(`🦸 Joueur ${socket.id} a choisi ${playerData.character}`);
        console.log("🗺️ Map sélectionnée :", playerData.map);

        // Envoyer la mise à jour immédiatement au premier joueurchat
         io.emit("updatePlayers", players);

        // Envoyer la mise à jour seulement si 2 joueurs sont connectés
        if (Object.keys(players).length === 2) {
            io.emit("updatePlayers", players);
        }
    });

   
    socket.on("move", (data) => {
        if (!players[socket.id]) return;
    
        const direction = data.direction;
    
        if (direction === "left") {
            players[socket.id].x -= 20;
            players[socket.id].direction = "left"; // Regarde vers la gauche
            players[socket.id].animation = "walking";
        } else if (direction === "right") {
            players[socket.id].x += 20;
            players[socket.id].direction = "right"; // Regarde vers la droite
            players[socket.id].animation = "walking";
        }
    
        io.emit("updatePlayers", players);
    });

    socket.on("attack", () => {
        if (!players[socket.id]) return;

        players[socket.id].animation = "attacking";
        io.emit("updatePlayers", players);

        // Réinitialiser l'animation après l'attaque
        setTimeout(() => {
            players[socket.id].animation = "idle";
            io.emit("updatePlayers", players);
        }, 500); // Durée de l'animation d'attaque
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