# ERP-SIG Logistique

Application web ERP-SIG pour la gestion logistique, incluant un tableau de bord, une cartographie interactive et la gestion des livraisons.

## 🚀 Comment lancer le projet

Puisque c'est un projet web statique (HTML/CSS/JS), vous avez plusieurs options pour le lancer :

### Option 1 : Python (Recommandé)
Si vous avez Python installé, c'est la méthode la plus simple pour simuler un serveur local.

1. Ouvrez un terminal dans le dossier du projet.
2. Lancez la commande :
   ```bash
   python -m http.server
   ```
3. Ouvrez votre navigateur à l'adresse : `http://localhost:8000`

### Option 2 : Node.js
Si vous préférez Node.js :

1. Installez `serve` ou `http-server` (optionnel) ou utilisez npx directement :
   ```bash
   npx serve
   ```
2. Ouvrez l'adresse indiquée (généralement `http://localhost:3000`).

### Option 3 : VS Code Live Server
Si vous utilisez l'extension "Live Server" sur VS Code :
1. Faites un clic droit sur `index.html`.
2. Choisissez "Open with Live Server".

### Option 4 : Directement (Déconseillé)
Vous pouvez simplement double-cliquer sur le fichier `index.html`.
*Note : Certaines fonctionnalités (comme le chargement de fichiers ou les icônes) peuvent être bloquées par les politiques de sécurité du navigateur en mode fichier.*

## 📋 Fonctionnalités
- **Tableau de Bord** : KPIs et graphiques.
- **Carte (SIG)** : Visualisation des livraisons sur une carte Leaflet.
- **Livraisons** : Gestion (Ajout, Liste, Filtres).
- **Import/Export** : CSV.
- **Bandes de Livraison** : Génération et impression.

## 🛠 Technologies
- HTML5, CSS3, Vanilla JS
- Leaflet.js
- Chart.js
- FontAwesome
