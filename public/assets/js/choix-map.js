
/*
document.addEventListener("DOMContentLoaded", function () {
    const mapOptions = document.querySelectorAll(".map-cell");
    const mapChanger = document.querySelector(".map-changer");
    const selectedMapImg = document.getElementById("selected-map-img");
    const selectedMapName = document.getElementById("selected-map-name");
    const boutonSuivant = document.querySelector(".suivant");

    // Liste des maps avec leurs images et noms associés
    const maps = {
        "map1": { img: "/assets/img/maps/map1.png", name: "/assets/img/maps/map-blaze0.png" },
        "map2": { img: "/assets/img/maps/map2.png", name: "/assets/img/maps/map-blaze1.png" },
    };

    let selectedMap = "map1"; // Map par défaut

    // ✅ Sélection d'une map et mise à jour de l'affichage
    mapOptions.forEach(cell => {
        cell.addEventListener("click", () => {
            mapOptions.forEach(b => b.classList.remove("selected"));
            cell.classList.add("selected");
    
            selectedMap = cell.getAttribute("data-map");
            console.log("🗺️ Map sélectionnée :", selectedMap);
    
            if (maps[selectedMap]) {
                selectedMapImg.src = maps[selectedMap].img;
                selectedMapName.src = maps[selectedMap].name;
            }
        });
    });
    

    if (!boutonSuivant) {
        console.error("❌ ERREUR : Le bouton 'Suivant' n'a pas été trouvé !");
        return;
    }
    // ✅ Stocke la map sélectionnée et passe à la page de gameplay
    boutonSuivant.addEventListener("click", () => {
        localStorage.setItem("selectedMap", maps[selectedMap].img);
    
        // ✅ Simuler un deuxième joueur en attribuant un autre personnage
        const player1Data = JSON.parse(localStorage.getItem("player1"));
        let player2Character = player1Data.img.includes("foudubus") ? "smehlee" : "foudubus";
    
        localStorage.setItem("player2", JSON.stringify({
            img: `/assets/img/${player2Character}/to-right/toright-${player2Character}-classique-1.svg`
        }));
    
        window.location.href = "/gameplay";
    });
    
});*/

/*document.addEventListener("DOMContentLoaded", function () {
    const mapOptions = document.querySelectorAll(".map-cell");
    const selectedMapImg = document.getElementById("selected-map-img");
    const selectedMapName = document.getElementById("selected-map-name");
    const boutonSuivant = document.querySelector(".suivant");

    // Vérifier si le bouton existe
    if (!boutonSuivant) {
        console.error("❌ ERREUR : Le bouton 'Suivant' n'a pas été trouvé !");
        return;
    }

    // Liste des maps disponibles
    const maps = {
        "map1": { img: "/assets/img/maps/map1.png", name: "/assets/img/maps/map-blaze0.png" },
        "map2": { img: "/assets/img/maps/map2.png", name: "/assets/img/maps/map-blaze1.png" }
    };

    let selectedMap = "map1"; // Valeur par défaut

    // ✅ Sélectionner une map et mettre à jour l'affichage
    mapOptions.forEach(cell => {
        cell.addEventListener("click", () => {
            mapOptions.forEach(b => b.classList.remove("selected"));
            cell.classList.add("selected");

            selectedMap = cell.getAttribute("data-map");
            console.log("🗺️ Map sélectionnée :", selectedMap);

            if (maps[selectedMap]) {
                selectedMapImg.src = maps[selectedMap].img;
                selectedMapName.src = maps[selectedMap].name;
            }
        });
    });

    // ✅ Clic sur "Suivant" → Enregistrer et rediriger
    boutonSuivant.addEventListener("click", () => {
        if (!maps[selectedMap]) {
            console.error("❌ ERREUR : Map non trouvée !");
            return;
        }

        // ✅ Sauvegarde la map sélectionnée
        localStorage.setItem("selectedMap", maps[selectedMap].img);
        console.log("✅ Map sauvegardée :", maps[selectedMap].img);

        // ✅ Récupère le personnage sélectionné
        const player1Data = JSON.parse(localStorage.getItem("player1"));
        if (!player1Data) {
            console.error("❌ ERREUR : Aucun personnage sélectionné !");
            return;
        }

        console.log("🦸 Joueur 1 :", player1Data);

        // ✅ Assigner un personnage par défaut au Joueur 2
        let player2Character = player1Data.avatar.includes("foudubus") ? "smehlee" : "foudubus";

        localStorage.setItem("player2", JSON.stringify({
            img: `/assets/img/${player2Character}/to-right/toright-${player2Character}-classique-1.svg`
        }));

        console.log("🦸 Joueur 2 attribué :", player2Character);

        // ✅ Redirection vers le gameplay
        window.location.href = "/gameplay";
    });
});
*/

console.log("✅ choix-map.js chargé !");
document.addEventListener("DOMContentLoaded", function () {
    const mapOptions = document.querySelectorAll(".map-cell");
    const selectedMapImg = document.getElementById("selected-map-img");
    const selectedMapName = document.getElementById("selected-map-name");
    const boutonSuivant = document.querySelector(".suivant");

    if (!boutonSuivant) {
        console.error("❌ ERREUR : Le bouton 'Suivant' n'a pas été trouvé !");
        return;
    }

    const maps = {
        "map1": { img: "/assets/img/maps/map1.png", name: "/assets/img/maps/map-blaze0.png" },
        "map2": { img: "/assets/img/maps/map2.png", name: "/assets/img/maps/map-blaze1.png" },
        "map3": { img: "/assets/img/maps/map3.png", name: "/assets/img/maps/map-blaze2.png" }
    };

    let selectedMap = "map1";

    mapOptions.forEach(cell => {
        cell.addEventListener("click", () => {
            mapOptions.forEach(b => b.classList.remove("selected"));
            cell.classList.add("selected");

            selectedMap = cell.getAttribute("data-map");

            if (maps[selectedMap]) {
                selectedMapImg.src = maps[selectedMap].img;
                selectedMapName.src = maps[selectedMap].name;
                localStorage.setItem("selectedMap", selectedMap); // ✅ Sauvegarde correcte
            }
        });
    });

    boutonSuivant.addEventListener("click", () => {
        if (!maps[selectedMap]) {
            console.error("❌ ERREUR : Map non trouvée !");
            return;
        }
        localStorage.setItem("selectedMap", selectedMap);
        console.log("✅ Map sauvegardée :", selectedMap);
        window.location.href = "/gameplay";
    });
});




