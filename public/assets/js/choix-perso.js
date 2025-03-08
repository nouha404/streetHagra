/*document.addEventListener("DOMContentLoaded", function () {
    const menuScreen = document.getElementById("menu-screen");
    const opsScreen = document.getElementById("ops-screen");
    const characterSelection = document.getElementById("character-selection");
    const backButtonCharacter = document.getElementById("back-button-character");
    const boutonSuivant = document.querySelector(".suivant");
    const banditoOptions = document.querySelectorAll(".character-cell");
    const personnageChanger = document.querySelector(".personnage-changer");
    const boutonRetour = document.getElementById("back-button");

    // Définition des personnages et leurs images associées
    const personnages = [
        {
            avatar: "/assets/img/fond/foudubus.png",
            blaze: "/assets/img/fond/blaze2.png"
        },
        {
            avatar: "/assets/img/fond/smehlee.png",
            blaze: "/assets/img/fond/blaze1.png"
        }
    ];

    let selectedCharacter = 0; // Index du personnage sélectionné

    // Sélection du personnage dans la grille
    banditoOptions.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            // Retirer la classe "selected" des autres cellules
            banditoOptions.forEach(b => b.classList.remove("selected"));
            // Ajouter la classe "selected" à la cellule cliquée
            cell.classList.add("selected");

            // Mise à jour des images dans la div "personnage-changer"
            if (index < personnages.length) {
                personnageChanger.innerHTML = `
                    <img src="${personnages[index].avatar}" alt="Avatar du personnage">
                    <img src="${personnages[index].blaze}" alt="Nom du personnage">
                `;
                selectedCharacter = index;
            }
        });
    });
   
    setTimeout(() => {
        if (menuScreen) menuScreen.classList.add("hidden");
        if (opsScreen) opsScreen.classList.add("hidden");
        if (characterSelection) {
            characterSelection.classList.remove("hidden");
        }
    }, 7000);
    if (backButtonCharacter) {
        backButtonCharacter.addEventListener("click", () => {
            characterSelection.classList.add("hidden");
            menuScreen.classList.remove("hidden");
          
        });
    }
    if(boutonRetour){
        boutonRetour.addEventListener("click", () => {
            window.location.href = "/";
        });
     
    }

    // Bouton suivant
    if (boutonSuivant) {
        boutonSuivant.addEventListener("click", () => {
            localStorage.setItem("player1", JSON.stringify(personnages[selectedCharacter]));
            window.location.href = "/choix-map";
        });
    }
});*/

document.addEventListener("DOMContentLoaded", function () {
    const characterCells = document.querySelectorAll(".character-cell");
    const personnageChanger = document.querySelector(".personnage-changer");
    const boutonSuivant = document.querySelector(".suivant");

    if (!boutonSuivant) {
        console.error("❌ ERREUR : Le bouton 'Suivant' n'a pas été trouvé !");
        return;
    }

    // Liste des personnages disponibles
    const personnages = [
        {
            avatar: "/assets/img/fond/foudubus.png",
            blaze: "/assets/img/fond/blaze2.png"
        },
        {
            avatar: "/assets/img/fond/smehlee.png",
            blaze: "/assets/img/fond/blaze1.png"
        }
    ];

    let selectedCharacter = 0; // Par défaut, premier personnage

    // ✅ Sélection du personnage
    characterCells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            characterCells.forEach(b => b.classList.remove("selected"));
            cell.classList.add("selected");

            if (index < personnages.length) {
                personnageChanger.innerHTML = `
                    <img src="${personnages[index].avatar}" alt="Avatar du personnage">
                    <img src="${personnages[index].blaze}" alt="Nom du personnage">
                `;
                selectedCharacter = index;
            }
        });
    });

    // ✅ Clic sur "Suivant" → Enregistrer et rediriger
    boutonSuivant.addEventListener("click", () => {
        localStorage.setItem("player1", JSON.stringify(personnages[selectedCharacter]));
        console.log("✅ Joueur 1 sauvegardé :", personnages[selectedCharacter]);

        window.location.href = "/choix-map";
    });
});
