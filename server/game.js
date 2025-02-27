module.exports = {
    processAttack: (attackerId, players) => {
        let attacker = players[attackerId];
        let defenderId = Object.keys(players).find(id => id !== attackerId);
        let defender = players[defenderId];


        if (defender) {
            const distance = Math.abs(attacker.x - defender.x);
            console.log(`Distance entre les joueurs : ${distance}`); // Log de la distance


            if (distance < 50) {
                // Appliquer les dégâts tout en empêchant les HP de devenir négatifs
                defender.hp = Math.max(0, defender.hp - 10); // Réduction de la vie de 10 points
                console.log(`Dégâts appliqués à ${defenderId}. HP restant : ${defender.hp}`);


                // Vérifier si le défenseur a perdu
                if (defender.hp <= 0) {
                    console.log(`${defenderId} a perdu !`);
                    return { gameOver: true, winner: attackerId, loser: defenderId }; // Retourner le résultat de la fin de partie
                }
            } else {
                console.log("Attaque ratée : distance trop grande");
            }
        }


        // Si la partie n'est pas terminée, retourner null
        return null;
    }
};

