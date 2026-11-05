# La méthode Sila : expliquer par les liens

**Sila** (صلة) veut dire « lien » en arabe. C'est une application pour apprendre des technologies, en commençant par PHP.

Ce document décrit comment écrire une leçon. Il sert de référence pour PHP et pour toutes les technologies suivantes.

## L'idée

Un débutant bloque rarement sur une ligne isolée. Il bloque parce qu'il ne voit pas **d'où vient une valeur et où elle va**.

Dans Sila, ces relations ne sont donc pas décrites avec des phrases : elles sont **dessinées et manipulables**. L'apprenant clique, change une valeur, et voit le résultat suivre le chemin de la ligne.

> Si une chose dépend d'une autre, on trace un lien entre les deux.

## Les trois règles

1. **Montrer le lien avant de l'expliquer.** Le texte vient compléter ce que l'écran montre déjà.
2. **Faire agir à chaque diapositive.** L'apprenant clique, choisit ou modifie quelque chose. Une diapositive qu'on peut seulement lire n'a pas sa place dans une leçon.
3. **Montrer l'effet tout de suite.** Chaque changement met à jour le code, les liens et le résultat, sans bouton « Exécuter ».

## Les types de liens

| Lien | Question à laquelle il répond | Exemple en PHP |
|---|---|---|
| Partie → explication | À quoi sert ce morceau ? | `$` → « chaque variable commence par $ » |
| Déclaration → utilisation | D'où vient cette valeur ? | `$a = 12;` → `$total = $a + $b;` |
| Variable → résultat | Que produit ce code ? | `echo $total;` → `17` |
| Fichier → fichier | Qui charge qui ? | `config.php` → `require 'config.php'` |
| Valeur → tous ses usages | Que se passe-t-il si je la change ? | `tva` → `prix.php`, ligne 4 |

Chaque lien part d'un élément précis et arrive à un élément précis, jamais à un fichier entier si la ligne exacte est connue.

## Le déroulé d'une leçon

Une notion suit ces quatre étapes, dans cet ordre :

1. **Découvrir.** Un exemple réel, dont l'apprenant clique les parties.
2. **Essayer.** Il modifie les valeurs et voit l'effet.
3. **Vérifier.** Il répond à un exercice qui explique aussi les mauvaises réponses.
4. **Relier.** La notion est utilisée avec les précédentes, si possible sur plusieurs fichiers.

La leçon PHP actuelle suit ce déroulé : Variable, Exercice, Calculs, puis Config.

## Écrire le contenu

- **Partir de la documentation officielle.** Chaque diapositive donne le lien de sa source, et chaque règle y est vérifiée avant publication.
- **Une idée par diapositive.** S'il en faut deux, il faut deux diapositives.
- **Du vrai code.** Il doit fonctionner s'il est copié, sans pseudo-code.
- **Des phrases courtes,** avec les mots que l'apprenant verra vraiment dans le code.
- **Montrer aussi les erreurs.** Une division par zéro ou un nom invalide doit afficher le vrai message de la technologie.

## Langues

Chaque texte existe en **français** et en **arabe**.

- Le code reste toujours de gauche à droite, même en arabe.
- Les noms de code restent en latin : `config.php`, `$age`, `require`.
- En arabe, chaque terme latin est isolé de la phrase par le composant `T`, pour garder le bon ordre de lecture.
- Les phrases arabes commencent par un mot arabe, et les termes de code restent le plus rares possible.

## Le style visuel

- Fond noir, couleurs néon, une diapositive à la fois.
- **Une couleur représente une valeur** : elle garde la même couleur partout où cette valeur apparaît.
- Une ligne ne passe jamais sur le texte du code.
- Tout doit rester utilisable sur téléphone.

## Ajouter une technologie

1. Créer un fichier dans `src/courses/`, sur le modèle de `php.js`, puis le relier à sa carte dans `src/courses/index.js`. Tant qu'une carte n'a pas de cours, elle affiche « Bientôt ».
2. Lister les notions de base en suivant la documentation officielle.
3. Pour chaque notion, noter les liens à montrer avec le tableau ci-dessus.
4. Écrire les diapositives avec le déroulé en quatre étapes.
5. Relire les textes dans les deux langues, puis tester sur téléphone.

Exemples de liens à montrer pour d'autres technologies :

| Technologie | Lien à montrer |
|---|---|
| JavaScript | Une fonction déclarée → chaque endroit où elle est appelée |
| React | Une prop passée par le parent → son utilisation dans l'enfant |
| SQL | Une clé étrangère → la table et la colonne qu'elle référence |
| Docker | Un service dans `compose.yaml` → le service qui en dépend |

## État actuel

**Réutilisable pour toute technologie :** l'accueil avec ses cartes (`Home.jsx`), les lignes néon (`Wires.jsx`), la navigation, le système de langues (`i18n.jsx`), la structure des cours et la diapositive d'exercice (`RulesSlide.jsx`).

**Cours disponibles :** seul PHP a une leçon. JavaScript, Python, SQL, React et Docker sont affichés « Bientôt ».

**Encore propre à PHP :**

- `ConfigSlide.jsx` contient ses fichiers d'exemple directement dans le composant.
- `CalcSlide.jsx` et `phpMath.js` calculent comme PHP.
- `VariableSlide.jsx` applique les règles de nommage de PHP.

Ces points seront à rendre génériques au moment d'ajouter la deuxième technologie.
