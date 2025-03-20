document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ gameplay.js chargé !");
    const socket = io();
    const gameContainer = document.getElementById("game-container");
    
    // Initialiser les barres de statut
    const player1Health = document.getElementById('player1-health');
    const player2Health = document.getElementById('player2-health');
    const player1HealthBar = document.querySelector("#player1-health .health-bar");
    const player2HealthBar = document.querySelector("#player2-health .health-bar");
    const player1ManaBar = document.querySelector("#player1-health .mana-bar");
    const player2ManaBar = document.querySelector("#player2-health .mana-bar");

    // Initialiser les barres au démarrage
    if (player1Health) player1Health.style.display = 'none';
    if (player2Health) player2Health.style.display = 'none';
    if (player1HealthBar) player1HealthBar.style.width = "100%";
    if (player2HealthBar) player2HealthBar.style.width = "100%";
    if (player1ManaBar) player1ManaBar.style.width = "0%";
    if (player2ManaBar) player2ManaBar.style.width = "0%";
    
    // Créer et configurer les sons
    const attackSound = new Audio("/assets/sounds/attack.mp3");
    attackSound.volume = 0.5;
    const blockSound = new Audio("/assets/sounds/block.mp3");
    blockSound.volume = 0.5;
    const criticalSound = new Audio("/assets/sounds/critical.mp3");
    criticalSound.volume = 0.5;

    // Mettre à jour les barres de vie et de mana
    const updateStatusBars = (playerId, hp, mana) => {
        const playerIndex = playerId === socket.id ? '1' : '2';
        const healthBarContainer = document.querySelector(`#player${playerIndex}-health`);
        const healthBar = healthBarContainer.querySelector('.health-bar');
        const manaBar = healthBarContainer.querySelector('.mana-bar');

        if (healthBar) {
            // Calculer la nouvelle largeur de la barre de vie
            const currentWidth = parseFloat(healthBar.style.width) || 100;
            const newWidth = Math.max(0, Math.min(100, hp));
            
            // Mettre à jour la largeur avec animation
            requestAnimationFrame(() => {
                healthBar.style.width = `${newWidth}%`;
                
                // Ajouter l'effet de dégâts si les PV diminuent
                if (newWidth < currentWidth) {
                    healthBar.classList.remove('damaged');
                    void healthBar.offsetWidth; // Force le reflow
                    healthBar.classList.add('damaged');
                }
                
                // Changer la couleur de la barre de vie
                let gradient;
                if (newWidth <= 20) {
                    gradient = 'linear-gradient(to right, #e74c3c, #c0392b)';
                } else if (newWidth <= 50) {
                    gradient = 'linear-gradient(to right, #f39c12, #d35400)';
                } else {
                    gradient = 'linear-gradient(to right, #2ecc71, #27ae60)';
                }
                healthBar.style.background = gradient;
            });
        }

        if (manaBar) {
            manaBar.style.width = `${mana}%`;
            // Ajouter l'effet de lueur quand le mana est plein
            if (mana >= 100) {
                manaBar.classList.add('full');
            } else {
                manaBar.classList.remove('full');
            }
            
            // Mettre à jour l'apparence en fonction du niveau de mana
            if (mana >= 100) {
                manaBar.classList.add('full');
                manaBar.style.background = 'linear-gradient(to right, #00a8ff, #0097e6)';
                manaBar.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.8)';
            } else if (mana >= 50) {
                manaBar.classList.remove('full');
                manaBar.style.background = 'linear-gradient(to right, #3498db, #2980b9)';
                manaBar.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.5)';
            } else {
                manaBar.classList.remove('full');
                manaBar.style.background = 'linear-gradient(to right, #2980b9, #2475a8)';
                manaBar.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.4)';
            }
        }
    };

    // Gérer le bouton de retour
    const returnButton = document.getElementById("return-button");
    if (returnButton) {
        returnButton.addEventListener("click", () => {
            // Nettoyer les ressources avant de quitter
            socket.disconnect();
            // Rediriger vers la page de sélection des personnages
            window.location.href = "/selection.html";
        });
    }

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
    const playerName = localStorage.getItem("playerName"); 

    if (!selectedCharacter || !selectedMap) {
        console.error("❌ ERREUR : Données manquantes !");
        window.location.href = "/";
    }

    console.log("🗺️ Map sélectionnée : ", selectedMap);
    console.log("🦸‍♂️ Personnage sélectionné : ", selectedCharacter);
    console.log("👤 Nom du joueur : ", playerName);

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

    let playerId; // Déclarez une variable pour stocker l'ID du joueur

socket.on("setPlayerData", (data) => {
    playerId = socket.id; // Stockez l'ID du joueur
});
    //socket.emit("setPlayerData", { character: selectedCharacter.avatar, map: selectedMap });

    socket.emit("setPlayerData", { 
        character: selectedCharacter.avatar, 
        map: selectedMap,
        name: playerName // Envoie le nom du joueur au serveur
    });

    console.log("🚀 Envoi des données du joueur :", { 
        character: selectedCharacter.avatar, 
        map: selectedMap,
        name: playerName
    });
    // 🔹 Attendre la mise à jour des joueurs
    // Créer l'élément pour afficher le résultat de la partie
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.style.display = 'none';
    gameContainer.appendChild(gameOverScreen);

    // Écouter les événements d'attaque
    // Écoutez l'événement "attackResult" envoyé par le serveur
    socket.on("attackResult", (data) => {
        console.log("AttackResult reçu :", data);
    
        // Sélectionner la barre de vie du joueur concerné
        const healthBarContainer = data.defenderId === playerId
            ? document.querySelector(`#player1-health`)
            : document.querySelector(`#player2-health`);
    
        const healthBar = healthBarContainer.querySelector('.health-bar');
    
        console.log("Barre de vie sélectionnée :", healthBar);
    
        // Récupérer la largeur actuelle de la barre de vie
        const currentHealth = parseFloat(healthBar.style.width) || 100;
        const newHealth = currentHealth - data.damage;
    
        console.log("Nouvelle largeur de la barre de vie :", newHealth);
    
        // Appliquer l'animation de dégâts
        healthBarContainer.classList.add("taking-damage");
    
        // Mettre à jour la largeur de la barre de vie
        healthBar.style.width = `${newHealth}%`;
    
        // Changer la couleur de la barre de vie en fonction des dégâts
        if (newHealth <= 20) {
            healthBar.style.background = "linear-gradient(to right, #e74c3c, #c0392b)";
        } else if (newHealth <= 50) {
            healthBar.style.background = "linear-gradient(to right, #f39c12, #e67e22)";
        } else {
            healthBar.style.background = "linear-gradient(to right, #2ecc71, #27ae60)";
        }
    
        // Retirer la classe d'animation après la fin de l'animation
        setTimeout(() => {
            healthBarContainer.classList.remove("taking-damage");
        }, 400); // Correspond à la durée de l'animation (0.4s)
    });

    socket.on("updatePlayers", (players) => {
        console.log("🎮 Mise à jour des joueurs :", players);

        // Vérifier combien de joueurs sont connectés
        const player1Health = document.getElementById('player1-health');
        const player2Health = document.getElementById('player2-health');

        if (Object.keys(players).length === 2) {
            // Afficher les barres de statut quand les deux joueurs sont connectés
            if (player1Health) player1Health.style.display = 'block';
            if (player2Health) player2Health.style.display = 'block';
            waitingMessage?.remove(); // Supprime le message "Le ops arrive..."
        }

        Object.keys(players).forEach((id) => {
            let playerDiv = document.getElementById(id);
            const player = players[id];

            // Vérifier si le joueur est KO
            if (player.hp <= 0 && gameOverScreen.style.display !== 'block') {
                // Afficher l'écran de fin de partie
                const isWinner = id !== socket.id;
                gameOverScreen.style.display = 'block';
                gameOverScreen.innerHTML = `
                    <img src="/assets/img/${isWinner ? 'win.png' : 'loose.png'}" 
                         alt="${isWinner ? 'Victoire' : 'Défaite'}"
                         style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 80%;">
                `;
                
                // Désactiver les contrôles pour ce joueur
                if (id === socket.id) {
                    document.removeEventListener('keydown', handleKeyDown);
                    document.removeEventListener('keyup', handleKeyUp);
                }
                
                // Rediriger vers la page de choix de personnage après 3 secondes
                setTimeout(() => {
                    window.location.href = '/choix-perso';
                }, 3000);
                return;
            }

            if (!playerDiv) {
                playerDiv = document.createElement("div");
                playerDiv.id = id;
                playerDiv.classList.add("player");
                playerDiv.style.display = 'block'; // Forcer l'affichage
                gameContainer.appendChild(playerDiv);
                console.log(`🕹️ Joueur ${id} ajouté au DOM.`);
            }

            // Toujours forcer l'affichage
            playerDiv.style.display = 'block';
            playerDiv.style.visibility = 'visible';
            playerDiv.style.opacity = '1';

            // Mettre à jour la position
            playerDiv.style.left = player.x + "px";
            playerDiv.style.top = player.y + "px";

            // Mettre à jour les barres de statut
            updateStatusBars(id, player.hp, player.mana);
           
            // Ajouter la classe correspondante au personnage choisi
            if (player.character) {
                playerDiv.classList.remove("smehlee", "foudubus");
                playerDiv.classList.add(player.character.includes("smehlee") ? "smehlee" : "foudubus");
            }
            
            // Mettre à jour l'animation
            updatePlayerAnimation(id, player);
        });
    });

    // Variable pour suivre l'état global de l'attaque
    let isGlobalAttacking = false;

    // Fonction pour gérer les événements clavier
    const handleKeyDown = (event) => {
        const player = document.getElementById(socket.id);
        if (!player || player.classList.contains('ko')) return;

        // Empêcher les actions pendant une attaque
        if (isGlobalAttacking || player.isAttacking) return;

        switch (event.key.toLowerCase()) {
            case "arrowleft":
                socket.emit("move", { direction: "left" });
                break;
            case "arrowright":
                socket.emit("move", { direction: "right" });
                break;
            case " ":
                if (!isGlobalAttacking && !player.isAttacking) {
                    isGlobalAttacking = true;
                    socket.emit("attack");
                    attackSound.currentTime = 0;
                    attackSound.play().catch(console.error);
                    // Réinitialiser l'état global après un délai
                    setTimeout(() => {
                        isGlobalAttacking = false;
                    }, 500); // Délai légèrement plus long que l'animation
                }
                break;
            case "b":
                if (!isGlobalAttacking) {
                    socket.emit("block", { isStarting: true });
                    blockSound.currentTime = 0;
                    blockSound.play().catch(console.error);
                }
                break;
            case "c":
                const manaBar = document.querySelector(`#mana-${socket.id}`);
                if (!isGlobalAttacking && manaBar && parseFloat(manaBar.style.width) >= 100) {
                    isGlobalAttacking = true;
                    socket.emit("criticalAttack");
                    criticalSound.currentTime = 0;
                    criticalSound.play().catch(console.error);
                    setTimeout(() => {
                        isGlobalAttacking = false;
                    }, 500);
                }
                break;
        }
    };

    const handleKeyUp = (event) => {
        const player = document.getElementById(socket.id);
        if (!player || player.classList.contains('ko')) return;

        if (event.key.toLowerCase() === "b") {
            socket.emit("block", { isStarting: false });
        }
    };

    // Ajouter les écouteurs d'événements
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Empêcher le défilement de la page
    window.addEventListener("keydown", (e) => {
        if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }
    });
        function updateHealthBars(players) {
            if (!players || Object.keys(players).length === 0) {
                console.error("❔ Aucun joueur à mettre à jour !");
                return;
            }

            Object.entries(players).forEach(([playerId, playerData], index) => {
                const playerIndex = index + 1;
                const healthBarContainer = document.querySelector(`#player${playerIndex}-health`);
                const healthBar = healthBarContainer?.querySelector('.health-bar');
                const playerName = healthBarContainer?.querySelector('.player-name');

                if (!healthBar || !playerName) {
                    console.error(`❔ Éléments de la barre de vie non trouvés pour le joueur ${playerIndex}`);
                    return;
                }

                const oldWidth = parseFloat(healthBar.style.width) || 100;
                const newWidth = Math.max(0, Math.min(100, playerData.hp));

                // Ajouter l'effet de dégâts si les PV diminuent
                if (newWidth < oldWidth) {
                    healthBar.classList.remove('damaged');
                    void healthBar.offsetWidth; // Force le reflow
                    healthBar.classList.add('damaged');
                    
                    // Ajouter l'effet de tremblement pour les coups critiques
                    if (oldWidth - newWidth >= 20) {
                        healthBarContainer.classList.add('critical-hit');
                        setTimeout(() => {
                            healthBarContainer.classList.remove('critical-hit');
                        }, 500);
                    }
                }

                // Mettre à jour la largeur avec animation
                requestAnimationFrame(() => {
                    healthBar.style.width = `${newWidth}%`;
                    
                    // Mise à jour du style de la barre de vie selon le niveau de santé
                    let gradient, shadowColor;
                    if (newWidth <= 20) {
                        gradient = 'linear-gradient(to right, #e74c3c, #c0392b)';
                        shadowColor = 'rgba(231, 76, 60, 0.7)';
                    } else if (newWidth <= 50) {
                        gradient = 'linear-gradient(to right, #f39c12, #d35400)';
                        shadowColor = 'rgba(243, 156, 18, 0.7)';
                    } else {
                        gradient = 'linear-gradient(to right, #2ecc71, #27ae60)';
                        shadowColor = 'rgba(46, 204, 113, 0.7)';
                    }
                    
                    healthBar.style.background = gradient;
                    healthBar.style.boxShadow = `0 0 15px ${shadowColor}`;
                });

                playerName.textContent = playerData.name;
            });
        }
 
    let isAnimating = false;

    function updatePlayerAnimation(playerId, playerData) {
        const player = document.getElementById(playerId);
        if (!player) return;

        // Forcer la visibilité du joueur
        player.style.display = 'block';
        player.style.visibility = 'visible';
        player.style.opacity = '1';

        // S'assurer que le personnage a la bonne classe de base
        if (playerData.character) {
            if (!player.classList.contains(playerData.character.includes("smehlee") ? "smehlee" : "foudubus")) {
                player.classList.add(playerData.character.includes("smehlee") ? "smehlee" : "foudubus");
            }
        }

        // Gérer la direction
        player.classList.remove("toleft", "toright");
        player.classList.add(playerData.direction === "left" ? "toright" : "toleft");

        // Gérer les animations
        if (playerData.hp <= 0) {
            player.classList.remove('classique1', 'block1', 'block2', 'shield');
            player.classList.add('ko');
            player.style.pointerEvents = 'none';
        } else if (playerData.isBlocking) {
            player.classList.remove('classique1', 'attacking1', 'attacking2', 'attacking3');
            
            // Si on est attaqué pendant le blocage
            if (playerData.animation === 'shield') {
                player.classList.remove('block1', 'block2');
                player.classList.add('shield');
            } 
            // Sinon on alterne entre block1 et block2
            else {
                player.classList.remove('shield');
                player.classList.add(playerData.animation);
            }
        } else if (playerData.animation === "attacking" && !isAnimating) {
            isAnimating = true;
            
            // Animation d'attaque fluide
            const attackSequence = async () => {
                player.classList.remove('classique1', 'block1', 'block2', 'bouclier');
                player.classList.add('attacking1');
                await new Promise(resolve => setTimeout(resolve, 150));

                if (player) {
                    player.classList.remove('attacking1');
                    player.classList.add('attacking2');
                    await new Promise(resolve => setTimeout(resolve, 150));
                }

                if (player) {
                    player.classList.remove('attacking2');
                    player.classList.add('attacking3');
                    await new Promise(resolve => setTimeout(resolve, 150));
                }

                if (player) {
                    player.classList.remove('attacking3');
                    player.classList.add('classique1');
                    isAnimating = false;
                } else {
                    isAnimating = false;
                }
            };

            attackSequence().catch(() => {
                isAnimating = false;
                if (player) {
                    player.classList.remove('attacking1', 'attacking2', 'attacking3');
                    player.classList.add('classique1');
                }
            });
        } else if (!isAnimating) {
            player.classList.remove('attacking1', 'attacking2', 'attacking3', 'block1', 'block2', 'bouclier', 'ko');
            player.classList.add('classique1');
        }

        // Mettre à jour les barres de statut
        updateStatusBars(playerId, playerData.hp, playerData.mana);
    }

    function generateCharacterClasses(character) {
        const isSmehlee = character.includes("smehlee");
        const prefix = isSmehlee ? "smehlee" : "foudubus";

        const style = document.createElement("style");
        style.innerHTML = `
            .${prefix} {
                position: absolute;
                background-repeat: no-repeat;
            }
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
            .${prefix}.toleft.block1 {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-block-classique-1.svg');
            }
            .${prefix}.toleft.block2 {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-block-classique-2.svg');
            }
            .${prefix}.toleft.shield {
                background-image: url('/assets/img/${prefix}/to-left/toleft-${prefix}-bouclier.svg');
            }
            .${prefix}.toright.block1 {
                background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-block-classique-1.svg');
            }
            .${prefix}.toright.block2 {
                background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-block-classique-2.svg');
            }
            .${prefix}.toright.shield {
                background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-bouclier.svg');
            }
            .${prefix}.ko {
                background-image: url('/assets/img/${prefix}/to-right/toright-${prefix}-ko.svg');
            }
            .win-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('/assets/img/win.png');
                background-size: cover;
                z-index: 1000;
            }
            .lose-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('/assets/img/loose.png');
                background-size: cover;
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }
    
});
