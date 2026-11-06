import { DOC, L, O, tx } from './helpers.js'

const basics = {
  id: 'types-basics', type: 'flow',
  nav: tx('Types de base', 'الأنواع الأساسية'),
  title: tx('Les types de base', 'الأنواع الأساسية'),
  lead: tx('Chaque valeur a un type. Suivez chaque ligne jusqu’à ce que PHP affiche.', 'لكل قيمة نوع. تتبع كل سطر حتى ما يعرضه PHP.'),
  source: { label: tx('Les types', 'الأنواع'), url: DOC + 'language.types.intro.php' },
  sourceLabel: 'types.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'all', label: tx('Cinq types', 'خمسة أنواع'),
      note: tx(
        '`var_dump()` affiche le type puis la valeur : `NULL` (aucune valeur), `bool` (vrai ou faux), `int` (entier), `float` (nombre à virgule) et `string` (texte). Pour un texte, le nombre entre parenthèses est sa longueur en octets.',
        'تعرض `var_dump()` النوع ثم القيمة: `NULL` بلا قيمة، و `bool` صحيح أو خطأ، و `int` عدد صحيح، و `float` عدد عشري، و `string` نص. في النص، العدد بين القوسين هو طوله بالبايت.',
      ),
      lines: [
        L('<?php'),
        L('var_dump(null);', 'a'),
        L('var_dump(true);', 'b'),
        L('var_dump(42);', 'c'),
        L('var_dump(3.14);', 'd'),
        L('var_dump("Salma");', 'e'),
      ],
      output: [O('NULL', 'a'), O('bool(true)', 'b'), O('int(42)', 'c'), O('float(3.14)', 'd'), O('string(5) "Salma"', 'e')],
    },
  ],
}

const arrays = {
  id: 'arrays', type: 'flow',
  nav: tx('Tableaux', 'الجداول'),
  title: tx('Les tableaux', 'الجداول'),
  lead: tx('Un tableau range plusieurs valeurs sous une seule variable. Chaque valeur a une clé.', 'الجدول يجمع عدة قيم في متغير واحد، ولكل قيمة مفتاح.'),
  source: { label: tx('Les tableaux', 'الجداول'), url: DOC + 'language.types.array.php' },
  sourceLabel: 'tableaux.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'list', label: tx('Liste', 'قائمة'),
      note: tx(
        'Sans clé précisée, PHP numérote les valeurs à partir de `0` : `$fruits[0]` est la première valeur.',
        'إذا لم نحدد المفاتيح، يرقم PHP القيم ابتداء من `0`، فتكون `$fruits[0]` هي القيمة الأولى.',
      ),
      lines: [L('<?php'), L('$fruits = ["pomme", "orange"];'), L('echo $fruits[0];', 'a')],
      output: [O('pomme', 'a')],
    },
    {
      id: 'keys', label: tx('Clés nommées', 'مفاتيح بأسماء'),
      note: tx('Avec `=>`, on choisit soi-même la clé de chaque valeur.', 'باستعمال `=>` نختار بأنفسنا مفتاح كل قيمة.'),
      lines: [L('<?php'), L('$ages = ["Salma" => 25, "Yassine" => 30];'), L('echo $ages["Yassine"];', 'a')],
      output: [O('30', 'a')],
    },
    {
      id: 'dump', label: tx('Tout afficher', 'عرض الكل'),
      note: tx(
        '`var_dump()` montre la taille du tableau, puis chaque clé avec sa valeur.',
        'تعرض `var_dump()` حجم الجدول، ثم كل مفتاح مع قيمته.',
      ),
      lines: [L('<?php'), L('$fruits = ["pomme", "orange"];'), L('var_dump($fruits);', 'a')],
      output: [
        O('array(2) {', 'a'),
        O('  [0]=>'), O('  string(5) "pomme"'), O('  [1]=>'), O('  string(6) "orange"'), O('}'),
      ],
    },
  ],
}

const juggling = {
  id: 'juggling', type: 'flow',
  nav: tx('Conversions', 'التحويلات'),
  title: tx('Les conversions de type', 'تحويل الأنواع'),
  lead: tx('PHP change parfois le type d’une valeur selon l’opération. Comparez les cas.', 'يغير PHP أحيانا نوع القيمة حسب العملية. قارن بين الحالات.'),
  source: { label: tx('Jonglage de type', 'تحويل الأنواع'), url: DOC + 'language.types.type-juggling.php' },
  sourceLabel: 'conversions.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'plus', label: tx('`"5" + 3`', '`"5" + 3`'),
      note: tx('`+` fait un calcul : PHP convertit la chaîne `"5"` en nombre.', 'الرمز `+` عملية حسابية، فيحول PHP النص `"5"` إلى عدد.'),
      lines: [L('<?php'), L('var_dump("5" + 3);', 'a')],
      output: [O('int(8)', 'a')],
    },
    {
      id: 'dot', label: tx('`"5" . 3`', '`"5" . 3`'),
      note: tx('`.` colle deux textes : PHP convertit `3` en chaîne.', 'الرمز `.` يلصق نصين، فيحول PHP العدد `3` إلى نص.'),
      lines: [L('<?php'), L('var_dump("5" . 3);', 'a')],
      output: [O('string(2) "53"', 'a')],
    },
    {
      id: 'div', label: tx('`7 / 2`', '`7 / 2`'),
      note: tx('Une division qui ne tombe pas juste donne un `float`.', 'القسمة التي لا تكون نتيجتها عددا صحيحا تعطي `float`.'),
      lines: [L('<?php'), L('var_dump(7 / 2);', 'a')],
      output: [O('float(3.5)', 'a')],
    },
    {
      id: 'cast', label: tx('`(int)`', '`(int)`'),
      note: tx('`(int)` convertit la valeur vous-même : c’est une conversion explicite.', 'يحول `(int)` القيمة بطلب منك، وهذا تحويل صريح.'),
      lines: [L('<?php'), L('var_dump((int) "12");', 'a')],
      output: [O('int(12)', 'a')],
    },
  ],
}

const quiz = {
  id: 'types-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Le commentaire dit-il vrai ?', 'هل التعليق صحيح؟'),
  lead: tx('Chaque commentaire annonce ce que PHP affiche. Cliquez pour vérifier.', 'كل تعليق يعلن ما سيعرضه PHP. انقر للتحقق.'),
  source: { label: tx('Les types', 'الأنواع'), url: DOC + 'language.types.php' },
  items: [
    { code: 'var_dump(42); // int(42)', ok: true, why: tx('42 est un entier.', 'العدد 42 عدد صحيح.') },
    { code: 'var_dump("42"); // int(42)', ok: false, why: tx('Entre guillemets, c’est une chaîne : `string(2) "42"`.', 'بين علامتي التنصيص هو نص: `string(2) "42"`.') },
    { code: 'var_dump(1.5); // float(1.5)', ok: true, why: tx('Un nombre à virgule est un `float`.', 'العدد العشري من نوع `float`.') },
    { code: 'var_dump("5" + 3); // string(1) "8"', ok: false, why: tx('`+` fait un calcul : le résultat est `int(8)`.', 'الرمز `+` عملية حسابية، فالنتيجة `int(8)`.') },
    { code: 'var_dump("5" . 3); // string(2) "53"', ok: true, why: tx('`.` colle les deux valeurs en un texte.', 'الرمز `.` يلصق القيمتين في نص واحد.') },
    { code: 'var_dump(false); // bool(false)', ok: true, why: tx('`false` est un booléen.', 'القيمة `false` من النوع المنطقي.') },
  ],
}

export const typesModule = {
  id: 'types',
  title: tx('Les types', 'الأنواع'),
  notions: tx('null, booléens, nombres, chaînes, tableaux, conversions', 'القيم الفارغة والمنطقية والأعداد والنصوص والجداول والتحويلات'),
  slides: [basics, arrays, juggling, quiz],
}
