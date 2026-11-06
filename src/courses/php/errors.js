import { DOC, L, O, S, tx } from './helpers.js'

const tryLines = (second) => [
  L('<?php'),
  L('function diviser($a, $b) {'),
  L('    if ($b === 0) {'),
  L('        throw new Exception("Division par zéro");'),
  L('    }'),
  L('    return $a / $b;'),
  L('}'),
  L(''),
  L('try {'),
  L('    echo diviser(10, 2), "\\n";', 'a'),
  L(`    echo diviser(${second}), "\\n";`, 'b'),
  L('    echo "Tout va bien\\n";', 'c'),
  L('} catch (Exception $e) {'),
  L('    echo "Erreur : ", $e->getMessage(), "\\n";', 'd'),
  L('} finally {'),
  L('    echo "Fin";', 'e'),
  L('}'),
]

const tryCatch = {
  id: 'try', type: 'flow',
  nav: tx('try et catch', 'try و catch'),
  title: tx('Attraper une exception', 'التقاط استثناء'),
  lead: tx(
    'Quand quelque chose se passe mal, `throw` lance une exception, et `catch` la récupère. Lancez le code pour suivre le saut.',
    'عندما يحدث خطأ، يرمي `throw` استثناء ويلتقطه `catch`. شغل الكود لتتبع القفزة.',
  ),
  source: { label: tx('Les exceptions', 'الاستثناءات'), url: DOC + 'control-structures.try-catch.php' },
  sourceLabel: 'diviser.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'error', label: tx('Avec une erreur', 'مع خطأ'),
      note: tx(
        'Après `throw`, PHP quitte la fonction et le bloc `try`, et saute au `catch`. Le bloc `finally` s’exécute dans tous les cas.',
        'بعد `throw` يغادر PHP الدالة وكتلة `try`، وينتقل إلى `catch`. أما كتلة `finally` فتنفذ في كل الحالات.',
      ),
      lines: tryLines('1, 0'),
      output: [O('5', 'a'), O('Erreur : Division par zéro', 'd'), O('Fin', 'e')],
      trace: [
        S(2, tx('La fonction `diviser` est définie.', 'تعرف الدالة `diviser`.')),
        S(9, tx('`try` : PHP surveille les erreurs dans ce bloc.', 'كتلة `try`: يراقب PHP الأخطاء داخلها.')),
        S(10, tx('Appel de `diviser(10, 2)`.', 'استدعاء `diviser(10, 2)`.')),
        S(3, tx('`2 === 0` est faux : pas d’exception.', 'الشرط `2 === 0` خطأ: لا يوجد استثناء.'), { vars: { '$a': '10', '$b': '2' } }),
        S(6, tx('`return` renvoie `10 / 2`, soit 5.', 'ترجع `return` ناتج `10 / 2` أي 5.'), { vars: { '$a': '10', '$b': '2' } }),
        S(10, tx('Affiche 5.', 'يعرض 5.'), { out: '5\n' }),
        S(11, tx('Appel de `diviser(1, 0)`.', 'استدعاء `diviser(1, 0)`.')),
        S(3, tx('`0 === 0` est vrai.', 'الشرط `0 === 0` صحيح.'), { vars: { '$a': '1', '$b': '0' } }),
        S(4, tx('`throw` lance une exception : la fonction s’arrête immédiatement.', 'يرمي `throw` استثناء، فتتوقف الدالة فورا.'), { vars: { '$a': '1', '$b': '0' } }),
        S(13, tx('PHP saute au bloc `catch`. La ligne 12 n’est jamais exécutée.', 'ينتقل PHP إلى كتلة `catch`، ولا ينفذ السطر 12 أبدا.'), { vars: { '$e': 'Exception' } }),
        S(14, tx('Affiche le message de l’exception.', 'يعرض رسالة الاستثناء.'), { vars: { '$e': 'Exception' }, out: 'Erreur : Division par zéro\n' }),
        S(16, tx('`finally` s’exécute toujours.', 'تنفذ `finally` دائما.'), { out: 'Fin' }),
      ],
    },
    {
      id: 'ok', label: tx('Sans erreur', 'بدون خطأ'),
      note: tx('Sans exception, tout le bloc `try` s’exécute, `catch` est ignoré, et `finally` s’exécute quand même.', 'بدون استثناء تنفذ كتلة `try` كاملة، ويتجاهل `catch`، وتنفذ `finally` مع ذلك.'),
      lines: tryLines('9, 3'),
      output: [O('5', 'a'), O('3', 'b'), O('Tout va bien', 'c'), O('Fin', 'e')],
    },
  ],
}

const builtIn = {
  id: 'builtin', type: 'flow',
  nav: tx('Erreurs de PHP', 'أخطاء PHP'),
  title: tx('Les erreurs lancées par PHP', 'الأخطاء التي يرميها PHP'),
  lead: tx('PHP lance lui-même des erreurs, par exemple pour un reste de division par zéro. On peut les attraper aussi.', 'يرمي PHP بنفسه أخطاء، مثلا عند باقي القسمة على صفر، ويمكن التقاطها أيضا.'),
  source: { label: tx('Les erreurs Throwable', 'أخطاء Throwable'), url: DOC + 'language.error-handling.throwable.php' },
  sourceLabel: 'reste.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'caught', label: tx('Attrapée', 'ملتقط'),
      note: tx('`catch (DivisionByZeroError $e)` attrape cette erreur précise et affiche son message.', 'يلتقط `catch (DivisionByZeroError $e)` هذا الخطأ بالتحديد ويعرض رسالته.'),
      lines: [L('<?php'), L('try {'), L('    echo 10 % 0;'), L('} catch (DivisionByZeroError $e) {'), L('    echo "Erreur : ", $e->getMessage();', 'a'), L('}')],
      output: [O('Erreur : Modulo by zero', 'a')],
    },
    {
      id: 'uncaught', label: tx('Non attrapée', 'غير ملتقط'),
      note: tx('Sans `try`, l’erreur arrête tout le script.', 'بدون `try` يوقف الخطأ البرنامج كله.'),
      lines: [L('<?php'), L('echo 10 % 0;', 'a', 'err'), L('echo "Suite";')],
      output: [O('Fatal error: Uncaught DivisionByZeroError: Modulo by zero in reste.php:2', 'a', 'err')],
    },
  ],
}

const quiz = {
  id: 'errors-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Les exceptions', 'الاستثناءات'), url: DOC + 'control-structures.try-catch.php' },
  items: [
    { title: tx('Après throw, la suite du bloc try continue.', 'بعد throw تستمر بقية كتلة try.'), ok: false, why: tx('PHP saute directement au `catch`.', 'ينتقل PHP مباشرة إلى `catch`.') },
    { title: tx('finally s’exécute même sans erreur.', 'تنفذ finally حتى بدون خطأ.'), ok: true, why: tx('`finally` s’exécute dans tous les cas.', 'تنفذ `finally` في كل الحالات.') },
    { title: tx('getMessage() donne le texte de l’exception.', 'تعطي getMessage() نص الاستثناء.'), ok: true, why: tx('C’est le texte passé à `new Exception(...)`.', 'هو النص الممرر إلى `new Exception(...)`.') },
    { title: tx('Une erreur non attrapée laisse le script continuer.', 'الخطأ غير الملتقط يترك البرنامج يستمر.'), ok: false, why: tx('Elle arrête le script avec une erreur fatale.', 'يوقف البرنامج بخطأ فادح.') },
  ],
}

export const errorsModule = {
  id: 'errors',
  title: tx('Gestion des erreurs', 'معالجة الأخطاء'),
  notions: tx('throw, try, catch, finally, erreurs de PHP', 'throw و try و catch و finally وأخطاء PHP'),
  slides: [tryCatch, builtIn, quiz],
}
