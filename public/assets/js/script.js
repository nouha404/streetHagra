document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js chargé !");

    const introScreen = document.getElementById("intro-screen");
    const transitionScreen = document.getElementById("transition-screen");
    const transitionImg = document.getElementById("transition-img");

    // Fonction pour animer fond-transition-4.png
    function animateTransition() {
        let opacity = 0.2;
        let scale = 0.5;

        function fadeEffect() {
            if (opacity < 1) {
                opacity += 0.1;
                scale += 0.1;
                transitionImg.style.opacity = opacity;
                transitionImg.style.transform = `scale(${scale})`;
                setTimeout(fadeEffect, 100); // Ajuste la fluidité
            } else {
                // Redirige vers choix-perso après l'animation
                setTimeout(() => {
                    window.location.href = "/choix-perso";
                }, 500);
            }
        }
        fadeEffect();
    }

    // Fonction pour démarrer la transition au clic
    function startTransition() {
        introScreen.classList.add("hidden");
        transitionScreen.classList.remove("hidden");
        animateTransition(); // Démarre l'animation du fond
    }

    // Événement : démarre la transition au premier clic
    document.body.addEventListener("click", startTransition);
});