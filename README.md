# Street Hagra - Jeu de Combat 2D

## Description
Street Hagra est un jeu de combat 2D multijoueur en temps réel où deux joueurs s'affrontent dans des combats intenses. Le jeu propose des personnages uniques, des mécaniques de combat stratégiques et un système de mana innovant.

## Guide de Gameplay

### 🎮 Contrôles de Base
- **Déplacement** : 
  - `←` (Flèche Gauche) : Se déplacer à gauche
  - `→` (Flèche Droite) : Se déplacer à droite
- **Combat** :
  - `A` : Attaque normale (10 dégâts)
  - `B` : Activer le blocage (maintenir)
  - `C` : Attaque critique (quand mana = 100%)

### ⚔️ Système de Combat

#### Attaques
1. **Attaque Normale (Touche A)**
   - Inflige 10 points de dégâts
   - Peut être enchaînée jusqu'à 3 fois
   - Portée :
     - Foudubus : 200 pixels
     - Smehlee : 100 pixels

2. **Combos**
   - Enchaîner 5 coups consécutifs donne un bonus :
     - +50% de dégâts
     - +20 points de mana

3. **Attaque Critique (Touche C)**
   - Disponible uniquement avec 100% de mana
   - Inflige 50 points de dégâts
   - Effets visuels spéciaux :
     - Flash lumineux
     - Animation de tremblement
     - Effet d'échelle

#### Défense
1. **Blocage (Touche B)**
   - Maintenir B pour bloquer
   - Animations :
     - Alternance entre block1 et block2
     - Effet de bouclier avec lueur
   - Avantages :
     - Bloque tous les dégâts
     - Récupère 2% de mana par tick
     - 20% de chance de contre-attaque (15 dégâts)

### 🌟 Système de Mana

#### Gestion du Mana
- **Gain Passif** : +1% toutes les 100ms
- **Gain en Bloquant** : +2% par tick
- **Gain par Combo** : +20% pour 5 coups consécutifs
- **Utilisation** :
  - Attaque Critique : Consomme 100% du mana

#### Barre de Mana
- **0-49%** : Bleu foncé, lueur faible
- **50-99%** : Bleu moyen, lueur moyenne
- **100%** : Bleu clair, lueur intense
  - Indique que l'attaque critique est disponible

### ❤️ Système de Vie

#### Barre de Vie
- **100-51%** : Vert vif
- **50-21%** : Orange
- **20-0%** : Rouge

#### États Spéciaux
- **KO** : Animation de défaite quand les PV atteignent 0
- **Victoire** : Écran de victoire pour le gagnant

### 💡 Astuces de Combat
1. **Gestion du Mana**
   - Bloquer est efficace pour charger le mana
   - Les combos donnent un bonus de mana important

2. **Stratégie de Combat**
   - Alterner entre attaques et blocages
   - Garder le mana à 100% pour les moments critiques
   - Utiliser la portée d'attaque à votre avantage

3. **Timing**
   - Le blocage a un court délai
   - Les combos doivent être enchaînés rapidement
   - Les contre-attaques sont automatiques pendant le blocage

## Installation
1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Lancer le serveur : `npm start`
4. Ouvrir le jeu dans le navigateur : `http://localhost:3000`

## Technologies Utilisées
- Node.js et Express.js pour le serveur
- Socket.IO pour le multijoueur en temps réel
- JavaScript vanilla pour le frontend
- CSS pour les animations et effets visuels
