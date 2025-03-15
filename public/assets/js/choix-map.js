document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ choix-map.js chargé !");

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
        "map2": { img: "/assets/img/maps/map2.png", name: "/assets/img/maps/map-blaze1.png" }
    };

    let selectedMap = "map1";

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

    boutonSuivant.addEventListener("click", () => {
        if (!maps[selectedMap]) {
            console.error("❌ ERREUR : Map non trouvée !");
            return;
        }

        localStorage.setItem("selectedMap", maps[selectedMap].img);
        console.log("✅ Map sauvegardée :", maps[selectedMap].img);

        window.location.href = "/gameplay";
    });
});