# Sila

**Sila** (صلة, « lien » en arabe) est une application pour apprendre les technologies en voyant les liens dans le code : d'où vient chaque valeur, et où elle va.

> **Projet en développement.** Ce n'est pas une version finale.

## Contenu actuel

- Une page d'accueil avec une carte par technologie.
- Un cours PHP en 8 modules, dans l'ordre de la documentation officielle. Le module 1 (syntaxe de base) est complet ; les modules 3, 6 et 7 ont déjà quelques diapositives.
- Des lignes néon entre le code, les valeurs et les résultats.
- Une interface en français et en arabe, de droite à gauche pour l'arabe.
- Un affichage adapté à l'ordinateur, à la tablette et au téléphone.

| Technologie | État |
|---|---|
| PHP | Premier cours disponible |
| JavaScript, Python, SQL, React, Docker | Bientôt |

## Démarrer

Il faut [Node.js](https://nodejs.org/) avec npm.

```bash
npm install
```

```bash
npm run dev
```

L'application s'ouvre ensuite sur <http://localhost:5173>.

Pour créer la version de production dans `dist/` :

```bash
npm run build
```

## Structure

```text
METHODE.md            La méthode d'explication (brouillon)
public/logo.svg       Le logo
src/
  App.jsx             Barre du haut et navigation dans un cours
  Home.jsx            Page d'accueil et cartes
  Wires.jsx           Lignes néon
  i18n.jsx            Français et arabe
  phpMath.js          Calculs affichés comme en PHP
  courses/
    index.js          Liste des technologies
    php.js            Contenu du cours PHP
  slides/             Types de diapositives
```

Le projet utilise [React](https://react.dev/) et [Vite](https://vite.dev/).

## Ajouter une technologie

1. Créer son cours dans `src/courses/`, sur le modèle de `php.js`, en suivant [la méthode](METHODE.md).
2. Le relier à sa carte dans `src/courses/index.js`. Sans cours, la carte affiche « Bientôt ».
3. Écrire tous les textes en français et en arabe.

Certaines parties sont encore propres à PHP et devront devenir génériques :

- `ConfigSlide.jsx` contient directement ses fichiers d'exemple.
- `CalcSlide.jsx` et `phpMath.js` calculent comme PHP.
- `VariableSlide.jsx` applique les règles de nommage de PHP.
