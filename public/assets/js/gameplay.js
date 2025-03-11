document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ gameplay.js chargé !");
    const socket = io();
    const gameContainer = document.getElementById("game-container");

    // Message indiquant que le deuxième joueur est attendu
    const waitingMessage = document.createElement("div");
    waitingMessage.id = "waiting-message";
    waitingMessage.innerText = "Le ops arrive...";
    waitingMessage.style.position = "absolute";
    waitingMessage.style.top = "50%";
    waitingMessage.style.left = "50%";
    waitingMessage.style.transform = "translate(-50%, -50%)";
    waitingMessage.style.color = "#fff";
    waitingMessage.style.fontSize = "24px";
    waitingMessage.style.fontWeight = "bold";
    waitingMessage.style.animation = "blink 1s infinite alternate";
    gameContainer.appendChild(waitingMessage);

    // Animation CSS pour le message clignotant
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes blink {
            from { opacity: 1; }
            to { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);

    // 🔹 Récupérer les données stockées
    const selectedCharacter = JSON.parse(localStorage.getItem("player1"));
    const selectedMap = localStorage.getItem("selectedMap");

    if (!selectedCharacter || !selectedMap) {
        console.error("❌ ERREUR : Données manquantes !");
        window.location.href = "/";
    }

    console.log("🗺️ Map sélectionnée : ", selectedMap);
    console.log("🦸‍♂️ Personnage sélectionné : ", selectedCharacter);

    // 🔹 Appliquer la map en fond
    const gameBackground = document.getElementById("game-background");
    gameBackground.style.backgroundImage = `url(${selectedMap})`;

    // Vérifier si la map s'affiche bien
    if (!gameBackground.style.backgroundImage) {
        console.error("❌ ERREUR : Impossible de charger la carte !");
    }

    // 🔹 Générer les classes CSS dynamiques en fonction du personnage
    generateCharacterClasses(selectedCharacter.avatar);
    // 🔹 Envoyer les données du joueur au serveur
    socket.emit("setPlayerData", { character: selectedCharacter.avatar, map: selectedMap });

    console.log("🚀 Envoi des données du joueur :", { character: selectedCharacter.avatar, map: selectedMap });

    // 🔹 Attendre la mise à jour des joueurs
    socket.on("updatePlayers", (players) => {
        console.log("🎮 Mise à jour des joueurs :", players);

        let firstPlayerId = Object.keys(players)[0]; 
        let firstPlayerCharacter = players[firstPlayerId].character;

        // Vérifier combien de joueurs sont connectés
        if (Object.keys(players).length === 2) {
            waitingMessage.remove(); // Supprime le message "Le ops arrive..."
        }

        Object.keys(players).forEach((id) => {
            let playerDiv = document.getElementById(id);
            if (!playerDiv) {
                playerDiv = document.createElement("div");
                playerDiv.id = id;
                playerDiv.classList.add("player");
                gameContainer.appendChild(playerDiv);
                console.log(`🕹️ Joueur ${id} ajouté au DOM.`);
            }
            console.log(`📍 Position mise à jour pour ${id} : x=${players[id].x}`);

            playerDiv.style.left = players[id].x + "px";
            playerDiv.style.top = players[id].y + "px";
           
           // 🔹 Ajouter la classe correspondante au personnage choisi
            if (players[id].character.includes("smehlee")) {
                playerDiv.classList.add("smehlee");
            } else {
                playerDiv.classList.add("foudubus");
            }
            // 🔹 Mettre à jour l'animation
            updatePlayerAnimation(id, players[id]);
        });
    });

    // 🔹 Gérer les déplacements avec les limites
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            socket.emit("move", { direction: "left" });
        } else if (event.key === "ArrowRight") {
            socket.emit("move", { direction: "right" });
        } else if (event.key === " ") { // Touche espace pour attaquer
            socket.emit("attack");
        }
    });

    /*function updatePlayerAnimation(playerId, playerData) {
        const player = document.getElementById(playerId);
    
        if (!player) return;
    
        // Réinitialiser toutes les classes d'animation
        player.classList.remove("classique1", "classique2", "idle", "attacking1", "attacking2", "attacking3");
    
        // Appliquer les classes en fonction de l'état du joueur
        if (playerData.animation === "walking") {
            if (playerData.direction === "left") {
                player.classList.add("classique1"); // Animation vers la gauche
            } else if (playerData.direction === "right") {
                player.classList.add("classique2"); // Animation vers la droite
            }
        } else if (playerData.animation === "attacking") {
            playAttackAnimation(playerId);
        } else {
            player.classList.add("idle"); // Animation au repos
        }
    }*/
    
    /*function updatePlayerAnimation(playerId, playerData) {
        const player = document.getElementById(playerId);
    
        if (!player) return;
    
        // Réinitialiser toutes les classes d'animation
        player.classList.remove(
            "toleft", "toright", 
            "classique1", "classique2", 
            "idle", 
            "attacking1", "attacking2", "attacking3"
        );
    
        // Appliquer la direction
        if (playerData.direction === "left") {
            player.classList.add("toright"); // Utiliser les images "toleft"
        } else if (playerData.direction === "right") {
            player.classList.add("toleft"); // Utiliser les images "toright"
        }
    
        

        // Appliquer les classes en fonction de l'état du joueur
        if (playerData.animation === "walking") {
            player.classList.remove("classique1", "classique2");

            // Alterner entre classique1 et classique2 pour l'animation de marche
            if (player.classList.contains("classique1")) {
                player.classList.remove("classique1");
                player.classList.add("classique2");
            } else {
                player.classList.remove("classique2");
                player.classList.add("classique1");
            }
        } else if (playerData.animation === "attacking") {
            playAttackAnimation(playerId);
        } else {
            player.classList.add("idle");
        }
    }*/

        function updatePlayerAnimation(playerId, playerData) {
            const player = document.getElementById(playerId);
        
            if (!player) return;
        
            // Réinitialiser toutes les classes d'animation
            player.classList.remove(
                "toleft", "toright", 
                "classique1", "classique2", 
                "idle", 
                "attacking1", "attacking2", "attacking3"
            );
        
            // Appliquer la direction
            if (playerData.direction === "left") {
                player.classList.add("toleft"); // Regarde vers la gauche
            } else if (playerData.direction === "right") {
                player.classList.add("toright"); // Regarde vers la droite
            }
        
            // Appliquer les classes en fonction de l'état du joueur
            if (playerData.animation === "walking") {
                if (player.classList.contains("classique1")) {
                    player.classList.remove("classique1");
                    player.classList.add("classique2");
                } else {
                    player.classList.remove("classique2");
                    player.classList.add("classique1");
                }
            } else if (playerData.animation === "attacking") {
                playAttackAnimation(playerId);
            } else {
                player.classList.add("idle");
            }
        }
    function startWalkingAnimation(player) {
        // Vérifier si une animation est déjà en cours
        if (player.walkingInterval) return;
    
        let isClassique1 = true;
    
        // Alterner entre classique1 et classique2 toutes les 100ms
        player.walkingInterval = setInterval(() => {
            if (isClassique1) {
                player.classList.remove("classique2");
                player.classList.add("classique1");
            } else {
                player.classList.remove("classique1");
                player.classList.add("classique2");
            }
            isClassique1 = !isClassique1;
        }, 100);
    }

    function stopWalkingAnimation(player) {
        if (player.walkingInterval) {
            clearInterval(player.walkingInterval); // Arrêter l'intervalle
            player.walkingInterval = null; // Réinitialiser l'intervalle
        }
    
        // Revenir à classique1
        player.classList.remove("classique2");
        player.classList.add("classique1");
    }

    function playAttackAnimation(playerId) {
        const player = document.getElementById(playerId);

        if (!player) return;

        // Jouer l'animation d'attaque en trois étapes
        player.classList.add("attacking1");
        setTimeout(() => {
            player.classList.remove("attacking1");
            player.classList.add("attacking2");
        }, 100);
        setTimeout(() => {
            player.classList.remove("attacking2");
            player.classList.add("attacking3");
        }, 200);
        setTimeout(() => {
            player.classList.remove("attacking3");
        }, 300);
    }
      // 🔹 Fonction pour générer les classes CSS dynamiques
      /*function generateCharacterClasses(character) {
        const isSmehlee = character.includes("smehlee");
        const prefix = isSmehlee ? "smehlee" : "foudubus";
    
        const style = document.createElement("style");
        style.innerHTML = `
            .classique1 {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-classique-1.svg');
            }
            .classique2 {
                background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-classique-1.svg');
            }
            .attacking1 {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-attaque-1.svg');
            }
            .attacking2 {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-attaque-2.svg');
            }
            .attacking3 {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-attaque-3.svg');
            }
            .idle {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-classique-1.svg');
            }
        `;
        document.head.appendChild(style);
    }*/
    
        function generateCharacterClasses(character) {
            const isSmehlee = character.includes("smehlee");
            const prefix = isSmehlee ? "smehlee" : "foudubus";
        
            const style = document.createElement("style");
            style.innerHTML = `
                .${prefix}.toleft.classique1 {
                    background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-classique-1.svg');
                }
                .${prefix}.toleft.classique2 {
                    background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-classique-2.svg');
                }
                .${prefix}.toright.classique1 {
                    background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-classique-1.svg');
                }
                .${prefix}.toright.classique2 {
                    background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-classique-2.svg');
                }
                .${prefix}.toleft.attacking1 {
                    background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-attaque-1.svg');
                }
                .${prefix}.toleft.attacking2 {
                    background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-attaque-2.svg');
                }
                .${prefix}.toleft.attacking3 {
                    background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-attaque-3.svg');
                }
                .${prefix}.toright.attacking1 {
                    background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-attaque-1.svg');
                }
                .${prefix}.toright.attacking2 {
                    background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-attaque-2.svg');
                }
                .${prefix}.toright.attacking3 {
                    background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-attaque-3.svg');
                }
                .${prefix}.idle {
                    background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-classique-1.svg');
                }
            `;
            document.head.appendChild(style);
        }
});
