# La méthode : expliquer par les liens

> **Brouillon.** Cette méthode n'est pas une version finale : elle évoluera avec les leçons.

## L'idée

Un débutant bloque rarement sur une ligne isolée. Il bloque parce qu'il ne voit pas **d'où vient une valeur et où elle va**.

On ne décrit donc pas ces relations avec des phrases : on les **dessine** et on laisse l'apprenant les **manipuler**. Il clique, change une valeur, et voit le résultat suivre le chemin de la ligne.

> Si une chose dépend d'une autre, on trace un lien entre les deux.

## Les trois règles

1. **Montrer le lien avant de l'expliquer.** Le texte vient compléter ce que l'écran montre déjà.
2. **Faire agir à chaque étape.** L'apprenant clique, choisit ou modifie quelque chose.
3. **Montrer l'effet tout de suite.** Chaque changement met à jour le code, les liens et le résultat.

## Les types de liens

| Lien | Question à laquelle il répond | Exemple en PHP |
|---|---|---|
| Partie → explication | À quoi sert ce morceau ? | `$` → « chaque variable commence par $ » |
| Déclaration → utilisation | D'où vient cette valeur ? | `$a = 12;` → `$total = $a + $b;` |
| Variable → résultat | Que produit ce code ? | `echo $total;` → `17` |
| Fichier → fichier | Qui charge qui ? | `config.php` → `require 'config.php'` |
| Valeur → tous ses usages | Que se passe-t-il si je la change ? | `tva` → `prix.php`, ligne 4 |

Un lien part d'un élément précis et arrive à un élément précis, jamais à un fichier entier si la ligne exacte est connue.

Le même principe s'applique aux autres technologies :

| Technologie | Lien à montrer |
|---|---|
| JavaScript | Une fonction déclarée → chaque endroit où elle est appelée |
| React | Une prop passée par le parent → son utilisation dans l'enfant |
| SQL | Une clé étrangère → la table et la colonne qu'elle référence |
| Docker | Un service dans `compose.yaml` → le service qui en dépend |

## Le déroulé d'une explication

Une notion suit ces quatre étapes, dans cet ordre :

1. **Découvrir.** Un exemple réel, dont l'apprenant clique les parties.
2. **Essayer.** Il modifie les valeurs et voit l'effet.
3. **Vérifier.** Il répond à un exercice qui explique aussi les mauvaises réponses.
4. **Relier.** La notion est utilisée avec les précédentes, si possible sur plusieurs fichiers.

## Comment écrire l'explication

- **Partir de la documentation officielle,** et vérifier chaque règle dans cette source.
- **Une idée par étape.** S'il en faut deux, il faut deux étapes.
- **Du vrai code,** qui fonctionne s'il est copié, sans pseudo-code.
- **Des phrases courtes,** avec les mots que l'apprenant verra vraiment dans le code.
- **Montrer aussi les erreurs,** avec le vrai message de la technologie.
- **Le sujet peut être difficile, pas la langue.** On écrit avec des mots simples, en phrases courtes.
- **Expliquer chaque mot technique avant de l'utiliser.**
- **Partir d'un exemple concret,** puis donner la règle.
- **Garder les détails avancés à part,** dans « Pour aller plus loin ».

## Comment montrer les liens

- **Une couleur représente une valeur :** elle garde la même couleur partout où cette valeur apparaît.
- **Une ligne ne couvre jamais le code :** elle doit aider à lire, pas gêner.

## Expliquer en français et en arabe

- Le code reste toujours de gauche à droite, même en arabe.
- Les noms de code restent en latin : `config.php`, `$age`, `require`.
- Les phrases arabes commencent par un mot arabe, et les termes de code y restent le plus rares possible.
