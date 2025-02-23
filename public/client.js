const socket = io();

let playerId = null;
let players = {};

socket.on("init", (data) => {
    playerId = data.id;
    players = data.players;
    drawPlayers();
});

socket.on("updatePlayers", (data) => {
    players = data;
    drawPlayers();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") socket.emit("move", "left");
    if (e.key === "ArrowRight") socket.emit("move", "right");
    if (e.key === " ") socket.emit("attack"); // Touche espace pour attaquer
});

function drawPlayers() {
    const p1 = document.getElementById("player1");
    const p2 = document.getElementById("playertwo");
    const status = document.getElementById("status");

    let p1Data = Object.values(players)[0];
    let p2Data = Object.values(players)[1];

    if (p1Data) {
        p1.setAttribute("x", p1Data.x);
        p1.setAttribute("y", p1Data.y);
    }
    if (p2Data) {
        p2.setAttribute("x", p2Data.x);
        p2.setAttribute("y", p2Data.y);
    }

    if (p1Data && p2Data) {
        status.innerHTML = `Joueur 1: ${p1Data.hp} HP | Joueur 2: ${p2Data.hp} HP`;
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        socket.emit("jump");
    }
});
