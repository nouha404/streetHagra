# Street Hagra - Jeu de Combat 2D

## Description
Street Hagra est un jeu de combat 2D multijoueur en temps réel où deux joueurs s'affrontent dans des combats intenses. Le jeu propose des personnages uniques, des mécaniques de combat stratégiques et un système de mana innovant.

## Fonctionnalités

### 1. Système de Combat
- **Attaques Normales** : Inflige 10 points de dégâts
- **Attaques Critiques** : 
  - Disponible quand la barre de mana est à 100%
  - Inflige 50% de dégâts supplémentaires
  - Consomme toute la barre de mana
- **Portée d'Attaque** :
  - Foudubus : 200px de portée
  - Smehlee : 100px de portée

### 2. Système de Mana
- Charge automatiquement (1% toutes les 100ms)
- Gain de mana lors du blocage d'attaques
- Bonus de mana pour les combos (5 coups consécutifs)
- Barre de mana avec effet visuel spécial à 100%

### 3. Système de Blocage
- Activation avec la touche 'B'
- Animation de bouclier avec effet visuel
- Chance de contre-attaque (20%)
- Récupération de mana pendant le blocage

### 4. Effets Visuels
- Animation de tremblement pour les coups critiques
- Flash et mise à l'échelle pour les attaques critiques
- Animation de KO pour les joueurs vaincus
- Barres de statut avec effets de lueur :
  - Barre de vie verte
  - Barre de mana bleue

## Contrôles
- **Déplacement** : Flèches gauche/droite
- **Attaque** : Touche 'A'
- **Blocage** : Touche 'B' (maintenir)
- **Attaque Critique** : Touche 'C' (quand mana = 100%)

## Installation
1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Lancer le serveur : `node server/server.js`
4. Ouvrir le jeu dans le navigateur : `http://localhost:3000`

## Technologies Utilisées
- Node.js
- Socket.IO pour le multijoueur en temps réel
- Express.js pour le serveur web
- JavaScript vanilla pour le frontend
- CSS pour les animations et effets visuels
