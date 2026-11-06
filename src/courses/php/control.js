import { DOC, L, O, S, tx } from './helpers.js'
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

/* ---------- Exécution pas à pas ---------- */

function forTrace() {
  const steps = [S(2, tx('`$i = 1` : la boucle commence.', 'تبدأ الحلقة بـ `$i = 1`.'), { vars: { '$i': '1' } })]
  for (let i = 1; ; i++) {
    const vars = { '$i': String(i) }
    if (i > 3) {
      steps.push(S(2, tx(`\`${i} <= 3\` est faux : la boucle s’arrête.`, `الشرط \`${i} <= 3\` خطأ: تتوقف الحلقة.`), { vars }))
      break
    }
    steps.push(S(2, tx(`\`${i} <= 3\` est vrai : on exécute le bloc.`, `الشرط \`${i} <= 3\` صحيح: ننفذ الكتلة.`), { vars }))
    steps.push(S(3, tx(`Affiche \`${i}\` dans la page.`, `يعرض \`${i}\` في الصفحة.`), { vars, out: `${i} ` }))
    steps.push(S(2, tx(`\`$i++\` : \`$i\` vaut maintenant ${i + 1}.`, `بعد \`$i++\` أصبحت قيمة \`$i\` هي ${i + 1}.`), { vars: { '$i': String(i + 1) } }))
  }
  steps.push(S(4, tx('Fin de la boucle et du script.', 'نهاية الحلقة والبرنامج.'), { vars: { '$i': '4' } }))
  return steps
}

function whileTrace() {
  const steps = [S(2, tx('On prépare le compteur : `$i = 1`.', 'نهيئ العداد: `$i = 1`.'), { vars: { '$i': '1' } })]
  for (let i = 1; ; i++) {
    const vars = { '$i': String(i) }
    if (i > 3) {
      steps.push(S(3, tx(`\`${i} <= 3\` est faux : la boucle s’arrête.`, `الشرط \`${i} <= 3\` خطأ: تتوقف الحلقة.`), { vars }))
      break
    }
    steps.push(S(3, tx(`\`${i} <= 3\` est vrai : on entre dans la boucle.`, `الشرط \`${i} <= 3\` صحيح: ندخل الحلقة.`), { vars }))
    steps.push(S(4, tx(`Affiche \`${i}\` dans la page.`, `يعرض \`${i}\` في الصفحة.`), { vars, out: `${i} ` }))
    steps.push(S(5, tx(`\`$i++\` : \`$i\` vaut maintenant ${i + 1}.`, `بعد \`$i++\` أصبحت قيمة \`$i\` هي ${i + 1}.`), { vars: { '$i': String(i + 1) } }))
  }
  steps.push(S(6, tx('Fin de la boucle et du script.', 'نهاية الحلقة والبرنامج.'), { vars: { '$i': '4' } }))
  return steps
}

function foreachTrace() {
  const list = '["pomme", "orange"]'
  const steps = [S(2, tx('Le tableau `$fruits` contient 2 valeurs.', 'يحتوي الجدول `$fruits` على قيمتين.'), { vars: { '$fruits': list } })]
  for (const fruit of ['pomme', 'orange']) {
    const vars = { '$fruits': list, '$fruit': `"${fruit}"` }
    steps.push(S(3, tx(`\`$fruit\` prend la valeur \`"${fruit}"\`.`, `يأخذ \`$fruit\` القيمة \`"${fruit}"\`.`), { vars }))
    steps.push(S(4, tx(`Affiche \`${fruit}\` dans la page.`, `يعرض \`${fruit}\` في الصفحة.`), { vars, out: `${fruit} ` }))
  }
  const end = { '$fruits': list, '$fruit': '"orange"' }
  steps.push(S(3, tx('Il n’y a plus de valeur : la boucle s’arrête.', 'لم تبق أي قيمة: تتوقف الحلقة.'), { vars: end }))
  steps.push(S(5, tx('Fin du script.', 'نهاية البرنامج.'), { vars: end }))
  return steps
}

function ifTrace(note) {
  const vars = { '$note': String(note) }
  const cond = (line, test, ok) =>
    S(line, ok
      ? tx(`\`${test}\` est vrai : on entre dans ce bloc.`, `الشرط \`${test}\` صحيح: ندخل هذه الكتلة.`)
      : tx(`\`${test}\` est faux : on passe à la suite.`, `الشرط \`${test}\` خطأ: ننتقل إلى ما بعده.`), { vars })
  const show = (line, text) => S(line, tx(`Affiche \`${text}\`.`, `يعرض \`${text}\`.`), { vars, out: text })
  const skip = S(9, tx('Les autres blocs sont ignorés. Fin du script.', 'تتجاهل باقي الكتل. نهاية البرنامج.'), { vars })
  const steps = [S(2, tx(`\`$note\` vaut ${note}.`, `قيمة \`$note\` هي ${note}.`), { vars }), cond(3, `${note} >= 16`, note >= 16)]
  if (note >= 16) return [...steps, show(4, 'Très bien'), skip]
  steps.push(cond(5, `${note} >= 10`, note >= 10))
  if (note >= 10) return [...steps, show(6, 'Bien'), skip]
  return [
    ...steps,
    S(7, tx('Aucune condition n’est vraie : on entre dans `else`.', 'لا يوجد شرط صحيح: ندخل كتلة `else`.'), { vars }),
    show(8, 'Insuffisant'),
    S(9, tx('Fin du script.', 'نهاية البرنامج.'), { vars }),
  ]
}

const jour = { '$jour': '6' }
const matchTrace = [
  S(2, tx('`$jour` vaut 6.', 'قيمة `$jour` هي 6.'), { vars: jour }),
  S(3, tx('`match` compare `$jour` à chaque cas, avec `===`.', 'يقارن `match` قيمة `$jour` بكل حالة باستعمال `===`.'), { vars: jour }),
  S(4, tx('`6 === 6` : ce cas correspond. Sa valeur est `"Week-end"`.', 'الحالة `6 === 6` مطابقة، وقيمتها `"Week-end"`.'), { vars: jour }),
  S(3, tx('`echo` affiche la valeur renvoyée par `match`.', 'تعرض `echo` القيمة التي يرجعها `match`.'), { vars: jour, out: 'Week-end' }),
  S(6, tx('Fin du script.', 'نهاية البرنامج.'), { vars: jour }),
]

const switchTrace = [
  S(2, tx('`$jour` vaut 6.', 'قيمة `$jour` هي 6.'), { vars: jour }),
  S(3, tx('`switch` cherche le premier `case` égal à 6.', 'يبحث `switch` عن أول حالة `case` تساوي 6.'), { vars: jour }),
  S(4, tx('`case 6` correspond : l’exécution commence ici.', 'الحالة `case 6` مطابقة: يبدأ التنفيذ من هنا.'), { vars: jour }),
  S(5, tx('`case 7` n’a pas de code : on continue en dessous.', 'لا يوجد كود في `case 7`: نواصل إلى الأسفل.'), { vars: jour }),
  S(6, tx('Affiche `Week-end`.', 'يعرض `Week-end`.'), { vars: jour, out: 'Week-end' }),
  S(7, tx('`break` : on sort du `switch`.', 'تعليمة `break`: نخرج من `switch`.'), { vars: jour }),
  S(10, tx('Fin du script.', 'نهاية البرنامج.'), { vars: jour }),
]

const noBreakTrace = [
  S(2, tx('`$jour` vaut 6.', 'قيمة `$jour` هي 6.'), { vars: jour }),
  S(3, tx('`switch` cherche le premier `case` égal à 6.', 'يبحث `switch` عن أول حالة `case` تساوي 6.'), { vars: jour }),
  S(4, tx('`case 6` correspond : l’exécution commence ici.', 'الحالة `case 6` مطابقة: يبدأ التنفيذ من هنا.'), { vars: jour }),
  S(5, tx('Affiche `Samedi`.', 'يعرض `Samedi`.'), { vars: jour, out: 'Samedi ' }),
  S(6, tx('Pas de `break` : PHP continue, sans tester `case 7`.', 'لا يوجد `break`: يواصل PHP دون اختبار `case 7`.'), { vars: jour }),
  S(7, tx('Affiche aussi `Dimanche`.', 'يعرض أيضا `Dimanche`.'), { vars: jour, out: 'Dimanche' }),
  S(8, tx('Fin du script.', 'نهاية البرنامج.'), { vars: jour }),
]

const traces = {
  n18: ifTrace(18), n12: ifTrace(12), n7: ifTrace(7),
  for: forTrace(), while: whileTrace(), foreach: foreachTrace(),
  match: matchTrace, switch: switchTrace, nobreak: noBreakTrace,
}
for (const slide of [conditions, loops, choose]) {
  for (const v of slide.variants) v.trace = traces[v.id]
}

export const controlModule = {
  id: 'control',
  title: tx('Structures de contrôle', 'بنى التحكم'),
  notions: tx('Conditions, boucles, match, switch, require', 'الشروط والحلقات و match و switch والتضمين'),
  slides: [conditions, loops, choose, configSlide, quiz],
}
