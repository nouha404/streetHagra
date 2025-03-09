/*const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

// ✅ Stockage des joueurs
let players = {};

app.use(express.static(path.join(__dirname, "../public"))); // Dossier public

// ✅ Routes du jeu
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../public/index.html")));
app.get("/choix-perso", (req, res) => res.sendFile(path.join(__dirname, "../public/choix-perso/index.html")));
app.get("/choix-map", (req, res) => res.sendFile(path.join(__dirname, "../public/choix-map/index.html")));
app.get("/gameplay", (req, res) => res.sendFile(path.join(__dirname, "../public/gameplay/index.html")));

// ✅ Connexion Socket.io (seulement après le choix de la map)
io.on("connection", (socket) => {
    console.log(`🟢 Joueur connecté : ${socket.id}`);

    // ✅ Vérifier si la partie est complète (empêche déconnexion immédiate)
    if (Object.keys(players).length >= 2) {
        console.log("⚠️ Partie complète, joueur refusé.");
        socket.emit("gameFull");
        socket.disconnect();
        return;
    }

    // ✅ Attendre que le joueur envoie ses données
    socket.on("setPlayerData", (playerData) => {
        if (Object.keys(players).length >= 2) return;

        players[socket.id] = {
            id: socket.id,
            x: Object.keys(players).length === 0 ? 100 : 900, // Position initiale
            y: 500,
            hp: 100,
            character: playerData.character, // Image du personnage
        };

        console.log(`🦸 Joueur ${socket.id} a choisi ${playerData.character}`);

        // ✅ Envoyer la mise à jour seulement si 2 joueurs sont connectés
        if (Object.keys(players).length === 2) {
            io.emit("updatePlayers", players);
        }
    });

    // ✅ Gérer les déplacements
    socket.on("move", (direction) => {
        if (!players[socket.id]) return;
        if (direction === "left") players[socket.id].x -= 20;
        if (direction === "right") players[socket.id].x += 20;

        // ✅ Envoyer la mise à jour de position à tous les clients
        io.emit("updatePlayers", players);
    });

    // ✅ Gestion de la déconnexion
    socket.on("disconnect", () => {
        console.log(`🔴 Joueur déconnecté : ${socket.id}`);
        delete players[socket.id];

        // ✅ Informer l'autre joueur s'il reste seul
        io.emit("updatePlayers", players);
    });
});

// ✅ Lancement du serveur
server.listen(port, () => console.log(`🚀 Serveur en ligne sur http://localhost:${port}`));
*/




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

    // Gérer les déplacements
    socket.on("move", (direction) => {
        if (!players[socket.id]) return;
    
        console.log(`🕹️ Joueur ${socket.id} veut bouger : ${direction}`);
        if (direction === "ArrowLeft") {  // 🔹 Corrige ici
            players[socket.id].x -= 20;
        }
        if (direction === "ArrowRight") { // 🔹 Corrige ici
            players[socket.id].x += 20;
        }
    
        console.log(`📍 Nouvelle position de ${socket.id} : x=${players[socket.id].x}`);
    
        // Envoyer la mise à jour à tous les clients
        io.emit("updatePlayers", players);
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