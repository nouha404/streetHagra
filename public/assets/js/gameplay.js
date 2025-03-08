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

/*
document.addEventListener("DOMContentLoaded", function () {
    const gameBackground = document.getElementById("game-background");
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");
    const fightImage = document.getElementById("fight-image");
    const waitingMessage = document.getElementById("waiting-message");

    // ✅ Récupérer la MAP sélectionnée
    const selectedMap = localStorage.getItem("selectedMap");
    if (selectedMap) {
        gameBackground.style.backgroundImage = `url('${selectedMap}')`;
    }

    // ✅ Récupérer le personnage sélectionné pour PLAYER 1
    const player1Data = JSON.parse(localStorage.getItem("player1"));
    if (player1Data) {
        player1.style.backgroundImage = `url('${player1Data.img}')`;
    }

    // ✅ Récupérer le personnage sélectionné pour PLAYER 2
    const player2Data = JSON.parse(localStorage.getItem("player2"));
    if (player2Data) {
        player2.style.backgroundImage = `url('${player2Data.img}')`;
    } else {
        // Par défaut, attribuer un autre personnage si `player2` n'est pas encore choisi
        player2.style.backgroundImage = `url('/assets/img/smehlee/to-right/toright-smehlee-classique-1.svg')`;
    }

    // ✅ Animation "FIGHT" avant de commencer
    setTimeout(() => {
        waitingMessage.style.display = "none";
        fightImage.style.display = "block";
        setTimeout(() => {
            fightImage.style.display = "none";
            document.getElementById("game-container").style.display = "block";
        }, 2000);
    }, 3000);
});*/
document.addEventListener("DOMContentLoaded", function () {
    const gameBackground = document.getElementById("game-background");
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    // ✅ Récupérer les valeurs enregistrées
    const selectedMap = localStorage.getItem("selectedMap");
    const player1Data = JSON.parse(localStorage.getItem("player1"));
    const player2Data = JSON.parse(localStorage.getItem("player2"));

    if (!selectedMap || !player1Data || !player2Data) {
        console.error("❌ ERREUR : Données manquantes !");
        return;
    }

    console.log("🗺️ Map chargée :", selectedMap);
    console.log("🦸 Joueur 1 :", player1Data);
    console.log("🦸 Joueur 2 :", player2Data);

    // ✅ Appliquer la map et les personnages choisis
    gameBackground.style.backgroundImage = `url(${selectedMap})`;
    player1.style.backgroundImage = `url(${player1Data.avatar})`;
    player2.style.backgroundImage = `url(${player2Data.img})`;

    // ✅ Afficher les joueurs sur la map
    player1.style.display = "block";
    player2.style.display = "block";
});


