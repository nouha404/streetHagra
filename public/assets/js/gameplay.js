/*document.addEventListener("DOMContentLoaded", function () {
    const gameBackground = document.getElementById("game-background");
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    // Récupérer la map sélectionnée depuis `localStorage`
    const selectedMap = localStorage.getItem("selectedMap");
    if (selectedMap) {
        gameBackground.style.backgroundImage = `url('${selectedMap}')`;
    } else {
        gameBackground.style.backgroundImage = `url('/assets/img/maps/default-map.png')`;
    }

    // Récupérer les personnages sélectionnés
    const player1Character = localStorage.getItem("player1Character");
    const player2Character = localStorage.getItem("player2Character");

    if (player1Character) {
        player1.style.backgroundImage = `url('${player1Character}')`;
    } else {
        player1.style.backgroundImage = `url('/assets/img/foudubus/to-left/toleft-foudubus-classique-1.svg')`;
    }

    if (player2Character) {
        player2.style.backgroundImage = `url('${player2Character}')`;
    } else {
        player2.style.backgroundImage = `url('/assets/img/smehlee/to-right/toright-smehlee-classique-1.svg')`;
    }

    console.log("Map et personnages chargés !");
});*/


document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ gameplay.js chargé !");
    const gameBackground = document.getElementById("game-background");
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    const selectedMap = localStorage.getItem("selectedMap");
    const player1Data = JSON.parse(localStorage.getItem("player1"));
    const player2Data = JSON.parse(localStorage.getItem("player2"));

    console.log("🔍 Vérification des données stockées :");
    console.log("🗺️ Map :", selectedMap);
    console.log("🦸 Joueur 1 :", player1Data);
    console.log("🦸 Joueur 2 :", player2Data);

    if (selectedMap) {
        gameBackground.style.backgroundImage = `url('/assets/img/maps/${selectedMap}.png')`;
    } else {
        console.error("❌ Aucune map trouvée !");
    }

    if (player1Data) {
        player1.style.backgroundImage = `url('${player1Data.avatar}')`;
        player1.style.display = "block";
    } else {
        console.error("❌ Joueur 1 non trouvé !");
    }

    if (player2Data) {
        player2.style.backgroundImage = `url('${player2Data.avatar}')`;
        player2.style.display = "block";
    } else {
        console.log("🟡 Joueur 2 non encore connecté !");
    }
});
