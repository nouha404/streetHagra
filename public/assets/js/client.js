/*console.log("✅ client.js chargé !");
const socket = io();

// ✅ Récupérer les données stockées
const selectedCharacter = JSON.parse(localStorage.getItem("player1"));
const selectedMap = localStorage.getItem("selectedMap");

if (!selectedCharacter || !selectedMap) {
    console.error("❌ ERREUR : Données manquantes !");
    window.location.href = "/";
}

// ✅ Appliquer la map en fond
document.getElementById("game-background").style.backgroundImage = `url(${selectedMap})`;

// ✅ Envoyer les données au serveur
socket.emit("setPlayerData", { character: selectedCharacter.avatar, map: selectedMap });

console.log("🚀 Envoi des données du joueur :", { character: selectedCharacter.avatar, map: selectedMap });

// ✅ Attendre la mise à jour des joueurs
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

// ✅ Gérer le déplacement du joueur
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") socket.emit("move", "left");
    if (event.key === "ArrowRight") socket.emit("move", "right");
});
*/