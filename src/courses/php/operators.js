import { DOC, L, O, tx } from './helpers.js'
import { calcSlide } from './legacy.js'

const compare = {
  id: 'compare', type: 'flow',
  nav: tx('Comparaison', 'المقارنة'),
  title: tx('Comparer deux valeurs', 'مقارنة قيمتين'),
  lead: tx('Suivez chaque comparaison jusqu’à son résultat.', 'تتبع كل مقارنة حتى نتيجتها.'),
  source: { label: tx('Opérateurs de comparaison', 'عوامل المقارنة'), url: DOC + 'language.operators.comparison.php' },
  sourceLabel: 'comparaison.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'all', label: tx('Quatre comparaisons', 'أربع مقارنات'),
      note: tx(
        '`==` compare les valeurs après conversion. `===` vérifie aussi le type : `5` (entier) et `"5"` (chaîne) ne sont pas identiques. `<=>` renvoie `-1`, `0` ou `1`.',
        'يقارن `==` القيم بعد التحويل، أما `===` فيتحقق من النوع أيضا: `5` عدد و `"5"` نص، فهما غير متطابقين. ويرجع `<=>` القيمة `-1` أو `0` أو `1`.',
      ),
      lines: [L('<?php'), L('var_dump(5 == "5");', 'a'), L('var_dump(5 === "5");', 'b'), L('var_dump(5 != 3);', 'c'), L('var_dump(5 <=> 3);', 'd')],
      output: [O('bool(true)', 'a'), O('bool(false)', 'b'), O('bool(true)', 'c'), O('int(1)', 'd')],
    },
  ],
}

const logic = {
  id: 'logic', type: 'flow',
  nav: tx('Logique et texte', 'المنطق والنصوص'),
  title: tx('Logique et texte', 'المنطق والنصوص'),
  lead: tx('Combinez des conditions, et collez des textes.', 'اجمع بين الشروط، وألصق النصوص.'),
  source: { label: tx('Opérateurs logiques', 'العوامل المنطقية'), url: DOC + 'language.operators.logical.php' },
  sourceLabel: 'logique.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'all', label: tx('Quatre opérateurs', 'أربعة عوامل'),
      note: tx(
        '`&&` (et) est vrai si les deux côtés sont vrais. `||` (ou) si au moins un est vrai. `!` inverse. `.` colle deux textes.',
        'يكون `&&` صحيحا إذا كان الطرفان صحيحين، و `||` إذا كان أحدهما على الأقل صحيحا، و `!` يعكس القيمة، و `.` يلصق نصين.',
      ),
      lines: [L('<?php'), L('var_dump(true && false);', 'a'), L('var_dump(true || false);', 'b'), L('var_dump(!true);', 'c'), L('echo "Bon" . "jour";', 'd')],
      output: [O('bool(false)', 'a'), O('bool(true)', 'b'), O('bool(false)', 'c'), O('Bonjour', 'd')],
    },
  ],
}

const precedence = {
  id: 'precedence', type: 'flow',
  nav: tx('Priorité', 'الأولوية'),
  title: tx('Qui passe en premier ?', 'من يحسب أولا؟'),
  lead: tx('Certains opérateurs sont calculés avant d’autres. Comparez les versions.', 'بعض العوامل تحسب قبل غيرها. قارن بين النسخ.'),
  source: { label: tx('Priorité des opérateurs', 'أولوية العوامل'), url: DOC + 'language.operators.precedence.php' },
  sourceLabel: 'priorite.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'mul', label: tx('`2 + 3 * 4`', '`2 + 3 * 4`'),
      note: tx('`*` passe avant `+` : PHP calcule `3 * 4 = 12`, puis `2 + 12`.', 'يحسب `*` قبل `+`: أولا `3 * 4 = 12` ثم `2 + 12`.'),
      lines: [L('<?php'), L('echo 2 + 3 * 4;', 'a')],
      output: [O('14', 'a')],
    },
    {
      id: 'paren', label: tx('`(2 + 3) * 4`', '`(2 + 3) * 4`'),
      note: tx('Les parenthèses passent avant tout.', 'الأقواس تحسب قبل كل شيء.'),
      lines: [L('<?php'), L('echo (2 + 3) * 4;', 'a')],
      output: [O('20', 'a')],
    },
    {
      id: 'pow', label: tx('`-2 ** 2`', '`-2 ** 2`'),
      note: tx('`**` passe avant le signe moins : PHP calcule `-(2 ** 2)`.', 'يحسب `**` قبل علامة الناقص، أي `-(2 ** 2)`.'),
      lines: [L('<?php'), L('echo -2 ** 2;', 'a')],
      output: [O('-4', 'a')],
    },
  ],
}

const increment = {
  id: 'increment', type: 'flow',
  nav: tx('++ et --', '++ و --'),
  title: tx('Incrémenter', 'الزيادة بواحد'),
  lead: tx('`++` ajoute 1 à une variable. Sa place change ce qui est affiché.', 'يضيف `++` واحدا إلى المتغير، ومكانه يغير ما يعرض.'),
  source: { label: tx('Incrémentation', 'الزيادة والنقصان'), url: DOC + 'language.operators.increment.php' },
  sourceLabel: 'compteur.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'post', label: tx('`$i++`', '`$i++`'),
      note: tx('`$i++` renvoie l’ancienne valeur, puis ajoute 1.', 'يرجع `$i++` القيمة القديمة، ثم يضيف واحدا.'),
      lines: [L('<?php'), L('$i = 5;'), L('echo $i++, "\\n";', 'a'), L('echo $i;', 'b')],
      output: [O('5', 'a'), O('6', 'b')],
    },
    {
      id: 'pre', label: tx('`++$i`', '`++$i`'),
      note: tx('`++$i` ajoute 1 d’abord, puis renvoie la nouvelle valeur.', 'يضيف `++$i` واحدا أولا، ثم يرجع القيمة الجديدة.'),
      lines: [L('<?php'), L('$i = 5;'), L('echo ++$i, "\\n";', 'a'), L('echo $i;', 'b')],
      output: [O('6', 'a'), O('6', 'b')],
    },
  ],
}

const quiz = {
  id: 'operators-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Le commentaire dit-il vrai ?', 'هل التعليق صحيح؟'),
  lead: tx('Chaque commentaire annonce ce que PHP affiche. Cliquez pour vérifier.', 'كل تعليق يعلن ما سيعرضه PHP. انقر للتحقق.'),
  source: { label: tx('Les opérateurs', 'العوامل'), url: DOC + 'language.operators.php' },
  items: [
    { code: 'echo 2 + 3 * 4; // 20', ok: false, why: tx('`*` passe avant `+` : le résultat est 14.', 'يحسب `*` قبل `+`، فالنتيجة 14.') },
    { code: 'var_dump("5" === 5); // bool(false)', ok: true, why: tx('Les types sont différents : chaîne et entier.', 'النوعان مختلفان: نص وعدد صحيح.') },
    { code: 'echo "a" . "b"; // ab', ok: true, why: tx('`.` colle les deux textes.', 'الرمز `.` يلصق النصين.') },
    { code: '$i = 1; echo $i++; // 2', ok: false, why: tx('`$i++` affiche l’ancienne valeur, 1.', 'يعرض `$i++` القيمة القديمة، أي 1.') },
    { code: 'var_dump(true && false); // bool(true)', ok: false, why: tx('`&&` demande que les deux côtés soient vrais.', 'يتطلب `&&` أن يكون الطرفان صحيحين.') },
  ],
}

export const operatorsModule = {
  id: 'operators',
  title: tx('Les opérateurs', 'العوامل'),
  notions: tx('Calculs, comparaisons, logique, priorité, incrémentation', 'الحساب والمقارنة والمنطق والأولوية والزيادة'),
  slides: [calcSlide, compare, logic, precedence, increment, quiz],
}
