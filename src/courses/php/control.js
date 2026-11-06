import { DOC, L, O, tx } from './helpers.js'
import { configSlide } from './legacy.js'

const ifLines = (note) => [
  L('<?php'),
  L(`$note = ${note};`),
  L('if ($note >= 16) {'),
  L('    echo "Très bien";', 'e1'),
  L('} elseif ($note >= 10) {'),
  L('    echo "Bien";', 'e2'),
  L('} else {'),
  L('    echo "Insuffisant";', 'e3'),
  L('}'),
]

const conditions = {
  id: 'if', type: 'flow',
  nav: tx('Conditions', 'الشروط'),
  title: tx('if, elseif, else', 'الشروط if و elseif و else'),
  lead: tx('Changez la note et regardez quelle ligne arrive jusqu’au résultat.', 'غير النقطة ولاحظ أي سطر يصل إلى النتيجة.'),
  source: { label: tx('if', 'if'), url: DOC + 'control-structures.if.php' },
  sourceLabel: 'note.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'n18', label: tx('`$note = 18`', '`$note = 18`'),
      note: tx('`18 >= 16` est vrai : PHP exécute le premier bloc et ignore les autres.', 'الشرط `18 >= 16` صحيح، فينفذ PHP الكتلة الأولى ويتجاهل الباقي.'),
      lines: ifLines(18), output: [O('Très bien', 'e1')],
    },
    {
      id: 'n12', label: tx('`$note = 12`', '`$note = 12`'),
      note: tx('La première condition est fausse, la deuxième (`12 >= 10`) est vraie.', 'الشرط الأول خطأ، والثاني `12 >= 10` صحيح.'),
      lines: ifLines(12), output: [O('Bien', 'e2')],
    },
    {
      id: 'n7', label: tx('`$note = 7`', '`$note = 7`'),
      note: tx('Aucune condition n’est vraie : PHP exécute le bloc `else`.', 'لا يوجد شرط صحيح، فينفذ PHP كتلة `else`.'),
      lines: ifLines(7), output: [O('Insuffisant', 'e3')],
    },
  ],
}

const loops = {
  id: 'loops', type: 'flow',
  nav: tx('Boucles', 'الحلقات'),
  title: tx('Répéter avec une boucle', 'التكرار بالحلقات'),
  lead: tx('Une boucle répète un bloc. Les trois versions affichent une liste.', 'تكرر الحلقة كتلة من الكود. النسخ الثلاث تعرض قائمة.'),
  source: { label: tx('for', 'for'), url: DOC + 'control-structures.for.php' },
  sourceLabel: 'boucles.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'for', label: tx('`for`', '`for`'),
      note: tx(
        '`for` a trois parties : le départ (`$i = 1`), la condition pour continuer (`$i <= 3`) et ce qui change à chaque tour (`$i++`).',
        'للحلقة `for` ثلاثة أجزاء: البداية `$i = 1`، وشرط الاستمرار `$i <= 3`، وما يتغير في كل دورة `$i++`.',
      ),
      lines: [L('<?php'), L('for ($i = 1; $i <= 3; $i++) {'), L('    echo $i, " ";', 'a'), L('}')],
      output: [O('1 2 3 ', 'a')],
    },
    {
      id: 'while', label: tx('`while`', '`while`'),
      note: tx('`while` répète tant que la condition est vraie. N’oubliez pas de changer `$i`, sinon la boucle ne s’arrête jamais.', 'تكرر `while` ما دام الشرط صحيحا. لا تنس تغيير `$i`، وإلا فلن تتوقف الحلقة.'),
      lines: [L('<?php'), L('$i = 1;'), L('while ($i <= 3) {'), L('    echo $i, " ";', 'a'), L('    $i++;'), L('}')],
      output: [O('1 2 3 ', 'a')],
    },
    {
      id: 'foreach', label: tx('`foreach`', '`foreach`'),
      note: tx('`foreach` parcourt chaque valeur d’un tableau.', 'تمر `foreach` على كل قيمة في الجدول.'),
      lines: [L('<?php'), L('$fruits = ["pomme", "orange"];'), L('foreach ($fruits as $fruit) {'), L('    echo $fruit, " ";', 'a'), L('}')],
      output: [O('pomme orange ', 'a')],
    },
  ],
}

const choose = {
  id: 'match', type: 'flow',
  nav: tx('match et switch', 'match و switch'),
  title: tx('Choisir selon une valeur', 'الاختيار حسب قيمة'),
  lead: tx('Quand une valeur a plusieurs cas possibles, `match` et `switch` évitent une longue suite de `if`.', 'عندما تكون للقيمة عدة حالات، يغني `match` و `switch` عن سلسلة طويلة من `if`.'),
  source: { label: tx('match', 'match'), url: DOC + 'control-structures.match.php' },
  sourceLabel: 'jour.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'match', label: tx('`match`', '`match`'),
      note: tx(
        '`match` renvoie la valeur du premier cas qui correspond. Il compare avec `===`, et `default` couvre les autres cas.',
        'يرجع `match` قيمة أول حالة مطابقة، ويقارن بـ `===`، وتغطي `default` باقي الحالات.',
      ),
      lines: [L('<?php'), L('$jour = 6;'), L('echo match ($jour) {'), L('    6, 7 => "Week-end",', 'a'), L('    default => "Semaine",'), L('};')],
      output: [O('Week-end', 'a')],
    },
    {
      id: 'switch', label: tx('`switch`', '`switch`'),
      note: tx('`switch` saute au `case` qui correspond. `break` arrête l’exécution du bloc.', 'ينتقل `switch` إلى الحالة `case` المطابقة، وتوقف `break` تنفيذ الكتلة.'),
      lines: [
        L('<?php'), L('$jour = 6;'), L('switch ($jour) {'), L('    case 6:'), L('    case 7:'),
        L('        echo "Week-end";', 'a'), L('        break;'), L('    default:'), L('        echo "Semaine";'), L('}'),
      ],
      output: [O('Week-end', 'a')],
    },
    {
      id: 'nobreak', label: tx('Sans `break`', 'بدون `break`'),
      note: tx('Sans `break`, PHP continue dans les `case` suivants.', 'بدون `break` يواصل PHP التنفيذ في الحالات التالية.'),
      lines: [
        L('<?php'), L('$jour = 6;'), L('switch ($jour) {'), L('    case 6:'),
        L('        echo "Samedi ";', 'a'), L('    case 7:'), L('        echo "Dimanche";', 'b'), L('}'),
      ],
      output: [O('Samedi Dimanche', ['a', 'b'])],
    },
  ],
}

const quiz = {
  id: 'control-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Le commentaire dit-il vrai ?', 'هل التعليق صحيح؟'),
  lead: tx('Chaque commentaire annonce ce que PHP affiche. Cliquez pour vérifier.', 'كل تعليق يعلن ما سيعرضه PHP. انقر للتحقق.'),
  source: { label: tx('Structures de contrôle', 'بنى التحكم'), url: DOC + 'language.control-structures.php' },
  items: [
    { code: 'if (5 > 3) { echo "oui"; } // oui', ok: true, why: tx('La condition est vraie.', 'الشرط صحيح.') },
    { code: 'for ($i = 0; $i < 3; $i++) echo $i; // 123', ok: false, why: tx('`$i` commence à 0 et s’arrête avant 3 : `012`.', 'يبدأ `$i` من 0 ويتوقف قبل 3، فالنتيجة `012`.') },
    { code: 'echo match (2) { 1 => "un", 2 => "deux" }; // deux', ok: true, why: tx('Le cas `2` correspond.', 'الحالة `2` هي المطابقة.') },
    { code: 'while (false) { echo "x"; } // x', ok: false, why: tx('La condition est fausse dès le départ : rien ne s’affiche.', 'الشرط خطأ من البداية، فلا يعرض شيء.') },
  ],
}

export const controlModule = {
  id: 'control',
  title: tx('Structures de contrôle', 'بنى التحكم'),
  notions: tx('Conditions, boucles, match, switch, require', 'الشروط والحلقات و match و switch والتضمين'),
  slides: [conditions, loops, choose, configSlide, quiz],
}
