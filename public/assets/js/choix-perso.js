

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ choix-perso.js chargé !");

    const characterCells = document.querySelectorAll(".character-cell");
    const personnageChanger = document.querySelector(".personnage-changer");
    const boutonSuivant = document.querySelector(".suivant");

    if (!boutonSuivant) {
        console.error("❌ ERREUR : Le bouton 'Suivant' n'a pas été trouvé !");
        return;
    }

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

    let selectedCharacter = 0;

    characterCells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            characterCells.forEach(b => b.classList.remove("selected"));
            cell.classList.add("selected");

            if (index < personnages.length) {
                personnageChanger.innerHTML = `
                    <img src="${personnages[index].avatar}" alt="Avatar">
                    <img src="${personnages[index].blaze}" alt="Nom">
                `;
                selectedCharacter = index;
            }
        });
    });

    boutonSuivant.addEventListener("click", () => {
        localStorage.setItem("player1", JSON.stringify(personnages[selectedCharacter]));
        console.log("✅ Personnage sauvegardé :", personnages[selectedCharacter]);
        window.location.href = "/choix-map";
    });
});