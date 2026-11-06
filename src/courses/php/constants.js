import { DOC, L, O, tx } from './helpers.js'

const define = {
  id: 'const', type: 'flow',
  nav: tx('Constantes', 'الثوابت'),
  title: tx('Une valeur qui ne change pas', 'قيمة لا تتغير'),
  lead: tx('Une constante garde la même valeur pendant tout le script. Comparez les versions.', 'يحتفظ الثابت بالقيمة نفسها طوال البرنامج. قارن بين النسخ.'),
  source: { label: tx('Syntaxe des constantes', 'كتابة الثوابت'), url: DOC + 'language.constants.syntax.php' },
  sourceLabel: 'tva.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'const', label: tx('`const`', '`const`'),
      note: tx(
        'Une constante s’écrit sans `$`. Par convention, son nom est en majuscules.',
        'يكتب الثابت بدون `$`، وجرت العادة أن يكتب اسمه بحروف كبيرة.',
      ),
      lines: [L('<?php'), L('const TVA = 20;'), L('echo TVA;', 'a')],
      output: [O('20', 'a')],
    },
    {
      id: 'define', label: tx('`define()`', '`define()`'),
      note: tx('`define()` crée aussi une constante, avec son nom entre guillemets.', 'تنشئ `define()` ثابتا أيضا، مع كتابة اسمه بين علامتي تنصيص.'),
      lines: [L('<?php'), L('define("TVA", 20);'), L('echo TVA;', 'a')],
      output: [O('20', 'a')],
    },
    {
      id: 'redefine', label: tx('La redéfinir', 'إعادة تعريفه'),
      note: tx(
        'On ne peut pas changer une constante. PHP affiche un avertissement et garde la première valeur.',
        'لا يمكن تغيير الثابت، فيعرض PHP تحذيرا ويحتفظ بالقيمة الأولى.',
      ),
      lines: [L('<?php'), L('const TVA = 20;'), L('const TVA = 25;', 'w', 'err'), L('echo TVA;', 'a')],
      output: [O('Warning: Constant TVA already defined in tva.php on line 3', 'w', 'err'), O('20', 'a')],
    },
  ],
}

const magic = {
  id: 'magic', type: 'flow',
  nav: tx('Magiques', 'السحرية'),
  title: tx('Les constantes magiques', 'الثوابت السحرية'),
  lead: tx('Certaines constantes changent selon l’endroit où on les écrit.', 'بعض الثوابت تتغير حسب المكان الذي تكتب فيه.'),
  source: { label: tx('Constantes magiques', 'الثوابت السحرية'), url: DOC + 'language.constants.magic.php' },
  sourceLabel: 'lignes.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'line', label: tx('`__LINE__`', '`__LINE__`'),
      note: tx(
        '`__LINE__` vaut le numéro de la ligne où il est écrit. Il en existe d’autres, comme `__FILE__` (le chemin du fichier) et `__DIR__` (son dossier).',
        'قيمة `__LINE__` هي رقم السطر الذي كتب فيه. وهناك ثوابت أخرى مثل `__FILE__` لمسار الملف و `__DIR__` لمجلده.',
      ),
      lines: [L('<?php'), L('echo "Ligne ", __LINE__, "\\n";', 'a'), L(''), L('echo "Ligne ", __LINE__;', 'b')],
      output: [O('Ligne 2', 'a'), O('Ligne 4', 'b')],
    },
  ],
}

const quiz = {
  id: 'constants-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Ce code est-il correct ?', 'هل هذا الكود صحيح؟'),
  lead: tx('Cliquez sur chaque proposition pour voir si PHP l’accepte.', 'انقر على كل اقتراح لترى هل يقبله PHP.'),
  source: { label: tx('Les constantes', 'الثوابت'), url: DOC + 'language.constants.php' },
  items: [
    { code: 'const TVA = 20;', ok: true, why: tx('Nom valide, sans `$`.', 'اسم صحيح بدون `$`.') },
    { code: 'const $TVA = 20;', ok: false, why: tx('Une constante s’écrit sans `$`.', 'يكتب الثابت بدون `$`.') },
    { code: 'define("SITE", "Sila");', ok: true, why: tx('`define()` reçoit le nom puis la valeur.', 'تستقبل `define()` الاسم ثم القيمة.') },
    { code: 'const 1TVA = 20;', ok: false, why: tx('Un nom ne peut pas commencer par un chiffre.', 'لا يمكن أن يبدأ الاسم برقم.') },
    { code: 'const TVA = 20; echo tva;', ok: false, why: tx('Les noms respectent la casse : `tva` n’existe pas, PHP lance une erreur.', 'الأسماء تميز بين الحروف الكبيرة والصغيرة: `tva` غير موجود، فيظهر PHP خطأ.') },
  ],
}

export const constantsModule = {
  id: 'constants',
  title: tx('Les constantes', 'الثوابت'),
  notions: tx('const, define, constantes magiques', 'تعريف الثوابت والثوابت السحرية'),
  slides: [define, magic, quiz],
}
