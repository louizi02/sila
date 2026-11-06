import { DOC, L, O, S, tx } from './helpers.js'

const define = {
  id: 'fn', type: 'flow',
  nav: tx('Définir', 'التعريف'),
  title: tx('Écrire une fonction', 'كتابة دالة'),
  lead: tx('Une fonction regroupe du code sous un nom, pour le réutiliser. Comparez les versions.', 'تجمع الدالة كودا تحت اسم واحد لإعادة استعماله. قارن بين النسخ.'),
  source: { label: tx('Fonctions définies par l’utilisateur', 'الدوال التي يعرفها المستخدم'), url: DOC + 'functions.user-defined.php' },
  sourceLabel: 'fonctions.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'basic', label: tx('Avec un paramètre', 'مع معامل'),
      note: tx(
        'L’argument `"Salma"` est placé dans le paramètre `$nom`. `return` renvoie le texte, que `echo` affiche.',
        'توضع القيمة `"Salma"` في المعامل `$nom`، وترجع `return` النص فتعرضه `echo`.',
      ),
      lines: [L('<?php'), L('function saluer($nom) {'), L('    return "Bonjour $nom";'), L('}'), L('echo saluer("Salma");', 'a')],
      output: [O('Bonjour Salma', 'a')],
    },
    {
      id: 'default', label: tx('Valeur par défaut', 'قيمة افتراضية'),
      note: tx('Si on n’envoie pas d’argument, le paramètre prend sa valeur par défaut.', 'إذا لم نرسل أي قيمة، يأخذ المعامل قيمته الافتراضية.'),
      lines: [L('<?php'), L('function saluer($nom = "inconnu") {'), L('    return "Bonjour $nom";'), L('}'), L('echo saluer();', 'a')],
      output: [O('Bonjour inconnu', 'a')],
    },
    {
      id: 'missing', label: tx('Argument manquant', 'معامل ناقص'),
      note: tx('Sans valeur par défaut, l’argument est obligatoire. PHP arrête le script avec une erreur.', 'بدون قيمة افتراضية يكون المعامل إلزاميا، فيوقف PHP البرنامج بخطأ.'),
      lines: [L('<?php'), L('function saluer($nom) {'), L('    return "Bonjour $nom";'), L('}'), L('echo saluer();', 'a', 'err')],
      output: [O('Fatal error: Uncaught ArgumentCountError: Too few arguments to function saluer(), 0 passed in fonctions.php on line 5 and exactly 1 expected', 'a', 'err')],
    },
    {
      id: 'typed', label: tx('Types déclarés', 'أنواع مصرح بها'),
      note: tx('`int $n` exige un entier, et `: int` annonce que la fonction renvoie un entier.', 'يشترط `int $n` عددا صحيحا، ويعلن `: int` أن الدالة ترجع عددا صحيحا.'),
      lines: [L('<?php'), L('function double(int $n): int {'), L('    return $n * 2;'), L('}'), L('echo double(4);', 'a')],
      output: [O('8', 'a')],
    },
  ],
}

const returns = {
  id: 'return', type: 'flow',
  nav: tx('Valeur de retour', 'القيمة المرجعة'),
  title: tx('La valeur de retour', 'القيمة المرجعة'),
  lead: tx('`return` renvoie une valeur à l’endroit où la fonction a été appelée.', 'ترجع `return` قيمة إلى المكان الذي استدعيت فيه الدالة.'),
  source: { label: tx('Les valeurs de retour', 'القيم المرجعة'), url: DOC + 'functions.returning-values.php' },
  sourceLabel: 'retour.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'use', label: tx('Utiliser le retour', 'استعمال القيمة'),
      note: tx('`carre(3)` vaut 9 : on peut l’utiliser dans un calcul, comme n’importe quelle valeur.', 'قيمة `carre(3)` هي 9، ويمكن استعمالها في عملية حسابية مثل أي قيمة.'),
      lines: [L('<?php'), L('function carre($n) {'), L('    return $n * $n;'), L('}'), L('$x = carre(3) + 1;'), L('echo $x;', 'a')],
      output: [O('10', 'a')],
    },
    {
      id: 'none', label: tx('Sans return', 'بدون return'),
      note: tx('Une fonction sans `return` renvoie `NULL`.', 'الدالة التي لا تحتوي على `return` ترجع `NULL`.'),
      lines: [L('<?php'), L('function rien() {'), L('}'), L('var_dump(rien());', 'a')],
      output: [O('NULL', 'a')],
    },
  ],
}

const anonymous = {
  id: 'anonymous', type: 'flow',
  nav: tx('Anonymes', 'المجهولة'),
  title: tx('Fonctions anonymes et fléchées', 'الدوال المجهولة والسهمية'),
  lead: tx('Une fonction peut aussi être rangée dans une variable.', 'يمكن أيضا وضع دالة داخل متغير.'),
  source: { label: tx('Fonctions fléchées', 'الدوال السهمية'), url: DOC + 'functions.arrow.php' },
  sourceLabel: 'anonymes.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'closure', label: tx('`function`', '`function`'),
      note: tx('Une fonction sans nom est rangée dans `$double`, puis appelée avec `$double(5)`.', 'توضع دالة بلا اسم في `$double`، ثم تستدعى بـ `$double(5)`.'),
      lines: [L('<?php'), L('$double = function ($n) {'), L('    return $n * 2;'), L('};'), L('echo $double(5);', 'a')],
      output: [O('10', 'a')],
    },
    {
      id: 'arrow', label: tx('`fn`', '`fn`'),
      note: tx('`fn` écrit la même chose en une ligne : la valeur après `=>` est renvoyée.', 'تكتب `fn` الشيء نفسه في سطر واحد، وترجع القيمة التي بعد `=>`.'),
      lines: [L('<?php'), L('$double = fn($n) => $n * 2;'), L('echo $double(5);', 'a')],
      output: [O('10', 'a')],
    },
    {
      id: 'capture', label: tx('Variable du dehors', 'متغير خارجي'),
      note: tx('Une fonction `fn` peut lire les variables du dehors, ici `$taux`.', 'تستطيع الدالة `fn` قراءة المتغيرات الخارجية، وهنا `$taux`.'),
      lines: [L('<?php'), L('$taux = 3;'), L('$fois = fn($n) => $n * $taux;'), L('echo $fois(5);', 'a')],
      output: [O('15', 'a')],
    },
  ],
}

const quiz = {
  id: 'functions-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Le commentaire dit-il vrai ?', 'هل التعليق صحيح؟'),
  lead: tx('Chaque commentaire annonce ce que fait le code. Cliquez pour vérifier.', 'كل تعليق يعلن ما يفعله الكود. انقر للتحقق.'),
  source: { label: tx('Les fonctions', 'الدوال'), url: DOC + 'language.functions.php' },
  items: [
    { code: 'function f() { return 3; } echo f(); // 3', ok: true, why: tx('`f()` renvoie 3.', 'ترجع `f()` القيمة 3.') },
    { code: 'function f($a) {} f(); // aucun problème', ok: false, why: tx('`$a` est obligatoire : PHP lance une `ArgumentCountError`.', 'المعامل `$a` إلزامي، فيظهر PHP خطأ `ArgumentCountError`.') },
    { code: '$f = fn($x) => $x + 1; echo $f(1); // 2', ok: true, why: tx('La fonction fléchée renvoie `1 + 1`.', 'ترجع الدالة السهمية `1 + 1`.') },
    { code: 'function f() {} var_dump(f()); // NULL', ok: true, why: tx('Sans `return`, la fonction renvoie `NULL`.', 'بدون `return` ترجع الدالة `NULL`.') },
  ],
}

/* ---------- Exécution pas à pas ---------- */

define.variants.find((v) => v.id === 'basic').trace = [
  S(2, tx('La fonction `saluer` est définie. Son code ne s’exécute pas encore.', 'تعرف الدالة `saluer`، لكن كودها لا ينفذ بعد.')),
  S(5, tx('Appel de `saluer("Salma")` : PHP entre dans la fonction.', 'استدعاء `saluer("Salma")`: يدخل PHP إلى الدالة.')),
  S(2, tx('Le paramètre `$nom` reçoit `"Salma"`.', 'يستقبل المعامل `$nom` القيمة `"Salma"`.'), { vars: { '$nom': '"Salma"' } }),
  S(3, tx('`return` renvoie `"Bonjour Salma"` à la ligne 5.', 'ترجع `return` النص `"Bonjour Salma"` إلى السطر 5.'), { vars: { '$nom': '"Salma"' } }),
  S(5, tx('`echo` affiche la valeur renvoyée.', 'تعرض `echo` القيمة المرجعة.'), { out: 'Bonjour Salma' }),
]

returns.variants.find((v) => v.id === 'use').trace = [
  S(2, tx('La fonction `carre` est définie. Son code ne s’exécute pas encore.', 'تعرف الدالة `carre`، لكن كودها لا ينفذ بعد.')),
  S(5, tx('Appel de `carre(3)` : PHP entre dans la fonction.', 'استدعاء `carre(3)`: يدخل PHP إلى الدالة.')),
  S(2, tx('Le paramètre `$n` reçoit 3.', 'يستقبل المعامل `$n` القيمة 3.'), { vars: { '$n': '3' } }),
  S(3, tx('`return` renvoie `3 * 3`, soit 9.', 'ترجع `return` ناتج `3 * 3` أي 9.'), { vars: { '$n': '3' } }),
  S(5, tx('`carre(3)` vaut 9, donc `$x = 9 + 1`.', 'قيمة `carre(3)` هي 9، إذن `$x = 9 + 1`.'), { vars: { '$x': '10' } }),
  S(6, tx('Affiche `10`.', 'يعرض `10`.'), { vars: { '$x': '10' }, out: '10' }),
]

export const functionsModule = {
  id: 'functions',
  title: tx('Les fonctions', 'الدوال'),
  notions: tx('Paramètres, valeur de retour, fonctions anonymes', 'المعاملات والقيمة المرجعة والدوال المجهولة'),
  slides: [define, returns, anonymous, quiz],
}
