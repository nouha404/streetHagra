/*Rôle de game.js :

    Gestion des attaques :

        Il contient la logique pour vérifier si un joueur attaque un autre joueur.

        Il applique les dégâts si les conditions d'attaque sont remplies (par exemple, si les joueurs sont suffisamment proches).
        
        Utilisation de game.js dans server.js :

Dans server.js, la fonction processAttack est appelée lorsqu'un joueur attaque. Voici comment elle est utilisée :
*/
        

module.exports = {
    processAttack: (attackerId, players) => {
        let attacker = players[attackerId];
        let defenderId = Object.keys(players).find(id => id !== attackerId);
        let defender = players[defenderId];

        if (defender) {
            const distance = Math.abs(attacker.x - defender.x);
            console.log(`Distance entre les joueurs : ${distance}`); // Log de la distance

            if (distance < 50) {
                defender.hp -= 10; // Réduction de la vie de 10 points
                console.log(`Dégâts appliqués à ${defenderId}. HP restant : ${defender.hp}`);
                if (defender.hp <= 0) {
                    console.log(`${defenderId} a perdu !`);
                    
                    return { gameOver: true, winner: attackerId, loser: defenderId };
                }
            } else {
                console.log("Attaque ratée : distance trop grande");
            }
        }
    }
};