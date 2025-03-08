module.exports = {
    processAttack: (attackerId, players) => {
        let attacker = players[attackerId];
        let defenderId = Object.keys(players).find(id => id !== attackerId);
        let defender = players[defenderId];

        if (!attacker || !defender) {
            console.log("❌ Attaque impossible : un des joueurs est absent.");
            return null;
        }

        // 🔹 Correction : prendre les positions réelles
        let attackerPosition = attacker.x;
        let defenderPosition = defender.x;

        // 🔹 Calcul de la distance réelle
        const distance = Math.abs(attackerPosition - defenderPosition);
        console.log(`📏 Distance réelle entre ${attackerId} et ${defenderId} : ${distance}px`);

        if (distance <= 100) { // Ajustement de la portée d'attaque
            console.log(`💥 ${attackerId} attaque ${defenderId} !`);
            defender.hp = Math.max(0, defender.hp - 10);
            console.log(`❤️ HP après attaque - ${defenderId}: ${defender.hp}`);

            if (defender.hp <= 0) {
                console.log(`🏆 ${attackerId} a gagné !`);
                return { gameOver: true, winner: attackerId, loser: defenderId };
            }
        } else {
            console.log("❌ Attaque ratée : distance trop grande");
        }

        return null;
    }
};