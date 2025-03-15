module.exports = {
    processAttack: (attackerId, players) => {
        let attacker = players[attackerId];
        let defenderId = Object.keys(players).find(id => id !== attackerId);
        let defender = players[defenderId];

        if (!attacker || !defender) {
            console.log("❌ Attaque impossible : un des joueurs est absent.");
            return null;
        }

        // Vérifier si l'attaquant peut attaquer
        if (attacker.consecutiveAttacks >= 3) {
            console.log("❌ Attaque impossible : trop d'attaques consécutives");
            return { blocked: true, message: "Trop d'attaques consécutives" };
        }

        // Vérifier la distance selon le personnage
        const distance = Math.abs(attacker.x - defender.x);
        const attackRange = attacker.character.includes("foudubus") ? 200 : 100;
        
        if (distance > attackRange) {
            console.log("❌ Attaque ratée : distance trop grande");
            return { missed: true };
        }

        // Gestion du blocage
        if (defender.isBlocking) {
            console.log("🛡️ Attaque bloquée !");
            if (attacker.isCriticalAttack) {
                attacker.mana = 0; // Perte de tout le mana si coup critique bloqué
                attacker.consecutiveHits = 0;
            }
            // Contre-attaque possible si le timing est bon (20% de chance)
            if (Math.random() < 0.2) {
                attacker.hp = Math.max(0, attacker.hp - 15);
                console.log("⚡️ Contre-attaque réussie !");
                return { blocked: true, counterAttack: true };
            }
            return { blocked: true };
        }

        // Calcul des dégâts
        let damage = 10;
        if (attacker.isCriticalAttack && attacker.mana >= 100) {
            damage = 50; // 50% de dégâts pour le coup critique
            attacker.mana = 0;
            attacker.consecutiveHits = 0;
        } else {
            // Augmenter le compteur de coups consécutifs
            attacker.consecutiveHits = (attacker.consecutiveHits || 0) + 1;
            if (attacker.consecutiveHits >= 5) {
                attacker.mana = Math.min(100, attacker.mana + 20);
            }
        }

        // Bonus de dégâts pour les combos
        if (attacker.consecutiveHits > 3) {
            damage *= 1.5; // 50% de dégâts supplémentaires pour les combos
        }

        // Appliquer les dégâts
        defender.hp = Math.max(0, defender.hp - damage);
        attacker.consecutiveAttacks = (attacker.consecutiveAttacks || 0) + 1;
        console.log(`💥 ${attackerId} inflige ${damage} dégâts à ${defenderId} !`);
        console.log(`❤️ HP après attaque - ${defenderId}: ${defender.hp}`);

        // Vérifier la fin de partie
        if (defender.hp <= 0) {
            console.log(`🏆 ${attackerId} a gagné !`);
            defender.animation = "ko";
            return { 
                gameOver: true, 
                winner: attackerId, 
                loser: defenderId,
                damage: damage
            };
        }

        return { damage: damage };
    },

    resetAttackCounter: (playerId, players) => {
        if (players[playerId]) {
            players[playerId].consecutiveAttacks = 0;
            setTimeout(() => {
                if (players[playerId]) {
                    players[playerId].consecutiveAttacks = 0;
                }
            }, 1500); // Reset plus rapide pour un gameplay plus dynamique
        }
    },

    handleBlock: (playerId, players, isStarting) => {
        const player = players[playerId];
        if (!player) return;

        if (isStarting) {
            if (!player.blockCooldown) {
                player.isBlocking = true;
                player.blockCooldown = true;
                player.animation = "block1";
                
                // Animation de blocage
                setTimeout(() => {
                    if (players[playerId] && players[playerId].isBlocking) {
                        players[playerId].animation = "block2";
                    }
                }, 100);

                // Cooldown du blocage
                setTimeout(() => {
                    if (players[playerId]) {
                        players[playerId].blockCooldown = false;
                    }
                }, 2000); // Cooldown réduit pour plus de dynamisme
            }
        } else {
            player.isBlocking = false;
            player.animation = "classique1";
        }

        // Récupération lente du mana pendant le blocage
        if (player.isBlocking) {
            player.mana = Math.min(100, player.mana + 5);
        }
    }
};