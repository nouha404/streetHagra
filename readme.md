Pour recuperez le projet assurez vous d'avoir git bash sur votre machine et une fois que c'est fait, ouvrez git bash et faite : 
- git clone https://github.com/nouha404/streetHagra.git


VOici des commandes git si vous voulez en apprendre plus 
<img src="/public/assets/img/versionner.png">

Assurez-vous d'avoir node js sur windows
- https://nodejs.org 

🏗️ 1. Executez ces commande pour lancer le projet
- npm init -y
- npm install express socket.io

Pour lancer le projet : 
- npm start


La page principale c'est dans /public/index.html : c'est celui-ci qu'on va modifier et tout
si on veut ajouter des fonctionnalité de l'acteur : on modifie le fichier server.js dans le dossier /server

Pour utiliser le mana :

Il se charge automatiquement pendant le jeu
Le mana est consommé lors des attaques spéciales
Bloquer les attaques permet de gagner du mana plus rapidement
Faire des combos (5 coups consécutifs) donne un bonus de mana

Je vais vous expliquer en détail le système de combat basé sur le code dans game.js :

Système de Mana :
Le mana se charge automatiquement (1% toutes les 100ms)
Quand il atteint 100%, vous pouvez faire une attaque critique qui :
Inflige 50% de dégâts (au lieu de 10% normalement)
Consomme tout votre mana (retombe à 0%)
Réinitialise votre compteur de coups consécutifs
Système d'Attaque :
Attaque normale (touche A) :
Inflige 10 points de dégâts
La portée dépend du personnage :
Foudubus : 200 pixels
Smehlee : 100 pixels
Après 3 attaques consécutives, vous devez faire une pause
Les combos (5 coups consécutifs) :
Augmentent les dégâts de 50%
Donnent +20 points de mana
Système de Blocage (touche S) :
Quand vous bloquez :
Vous gagnez +5 points de mana
Vous avez 20% de chance de faire une contre-attaque qui inflige 15 points de dégâts
Si vous bloquez une attaque critique :
L'attaquant perd tout son mana
Son compteur de coups consécutifs est réinitialisé
Le blocage a un temps de recharge de 2 secondes
Stratégies :
Pour maximiser les dégâts :
Faites des combos de 5 coups pour gagner du mana et des dégâts bonus
Attendez d'avoir 100% de mana pour une attaque critique
Pour une approche défensive :
Utilisez le blocage pour gagner du mana
Tentez les contre-attaques
Bloquez les attaques critiques pour vider le mana de l'adversaire
Points de vie (HP) :
Chaque joueur commence avec 100 HP
Le joueur qui tombe à 0 HP perd la partie
Les dégâts varient selon le type d'attaque :
Attaque normale : 10 HP
Attaque critique : 50 HP
Contre-attaque : 15 HP
Combo (5 coups) : 15 HP (10 + 50% bonus)