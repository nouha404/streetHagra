const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static(path.join(__dirname, "../public"))); // ✅ Corrige le dossier public

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/choix-perso", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/choix-perso/index.html"));
});

app.get("/choix-map", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/choix-map/index.html"));
});
app.get("/gameplay", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/gameplay/index.html"));
});


server.listen(port, () => {
    console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
