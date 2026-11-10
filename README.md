# Séance poids du corps

Appli web d'entraînement au poids du corps, **privée et non commerciale**, pensée pour la famille : un coach en figure filaire s'anime à l'écran pendant chaque exercice, avec chrono, étirements, ambiance sonore et voix.

## Ce que fait l'appli

- Séances de 10 à 45 minutes, trois niveaux, un ou deux types d'exercices au choix (corps entier, haut, bas, abdos, cardio).
- Gainages et étirements issus d'un livre d'ostéopathie, **redessinés et reformulés** (aucune illustration ni aucun texte du livre n'est reproduit).
- Douleurs ou gênes (cervicales, épaules, poignets, lombaires, genoux, tendon d'Achille) : les exercices concernés sont écartés. Ce n'est pas un avis médical.
- Un profil par membre de la famille (niveau et douleurs mémorisés). Calories estimées pour les adultes seulement (valeurs MET du Compendium of Physical Activities), jamais pour les moins de 18 ans.
- Variété : chaque profil retient ses 5 dernières séances pour ne pas reproposer toujours les mêmes exercices.
- Repos entre exercices au choix, ambiances sonores, voix du coach.
- Fonctionne hors ligne une fois installée.

## Données personnelles

Tout reste sur l'appareil (`localStorage`) : profils, âge, taille, poids, douleurs, historique. Rien n'est envoyé ni stocké sur GitHub.

## Installer sur le téléphone

Ouvrir `https://cyrilagi-art.github.io/Appli-sport/` dans le navigateur, puis :

- **iPhone (Safari)** : Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮ → « Installer l'application ».

La voix du coach et les sons demandent un premier toucher sur l'écran. Sur iPhone, vérifier que le mode silencieux est désactivé.

## Développement

Les sources sont dans `src/` (préfixes numériques = ordre d'assemblage). `python3 build.py` produit `index.html`.
Pour publier une nouvelle version : modifier `src/`, lancer `build.py`, incrémenter `VERSION` dans `sw.js` si besoin, commiter et pousser.

## Avertissements

Usage personnel et familial. Le contenu s'inspire d'un livre d'ostéopathie dont les droits restent à son auteur ; ne pas y ajouter de scans, photos ou extraits (le `.gitignore` bloque les images et PDF).
