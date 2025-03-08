/*document.addEventListener("DOMContentLoaded", function () {

    const backButton = document.getElementById("back-button");
    const boutonSuivant = document.querySelector(".suivant");
    const mapOptions = document.querySelectorAll(".character-cell"); // Les cellules des maps
    const mapChanger = document.querySelector(".personnage-changer");

    // Définition des maps et leurs images associées
    const maps = [
        {
            img: "/assets/img/maps/map1.png",
            name: "/assets/img/maps/map-blaze0.png"
        },
        {
            img: "/assets/img/maps/map2.png",
            name: "/assets/img/maps/map-blaze1.png"
        },
        {
            img: "/assets/img/maps/map3.png",
            name: "/assets/img/maps/map-blaze2.png"
        }
    ];

    let selectedMap = 0; // Index de la map sélectionnée

    // Sélection de la map dans la grille
    mapOptions.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            // Retirer la classe "selected" des autres cellules
            mapOptions.forEach(m => m.classList.remove("selected"));
            // Ajouter la classe "selected" à la cellule cliquée
            cell.classList.add("selected");

            // Mise à jour de l'affichage de la map
            if (index < maps.length) {
                mapChanger.innerHTML = `
                    <img src="${maps[index].img}" alt="Aperçu de la map">
                    <img src="${maps[index].name}" alt="Nom de la map">
                `;
                selectedMap = index;

                // ✅ Stocke la map sélectionnée
                localStorage.setItem("selectedMap", maps[index].img);
            }
        });
    });

    // Bouton retour
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "/choix-perso"; // Revient au choix du personnage
        });
    }

    // Bouton suivant
    if (boutonSuivant) {
        boutonSuivant.addEventListener("click", () => {
            window.location.href = "/gameplay"; // Redirige vers la phase de jeu
        });
    }
});
*/

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
document.addEventListener("DOMContentLoaded", function () {
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
