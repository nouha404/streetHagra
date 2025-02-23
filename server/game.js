// Vérifie si un joueur attaque l’autre
//Applique les dégâts

module.exports = {
    processAttack: (attackerId, players) => {
        let attacker = players[attackerId];
        let defenderId = Object.keys(players).find(id => id !== attackerId);
        let defender = players[defenderId];

        if (defender && Math.abs(attacker.x - defender.x) < 50) {
            defender.hp -= 10; // Réduction de la vie
        }
    }
};

