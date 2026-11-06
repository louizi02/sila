const DOC = 'https://www.php.net/manual/fr/'

// Morceaux de code : [texte, type]. Les types fixent la couleur (voir .k-* dans styles.css).
const html = (s) => [s, 'html']
const tag = (s) => [s, 'tag']
const kw = (s) => [s, 'kw']
const str = (s) => [s, 'str']
const txt = (s) => [s, 'plain']
const cmt = (s) => [s, 'cmt']
const out = (s) => [s, 'out']
const err = (s) => [s, 'err']
const ws = ['⏎', 'ws']
const missing = ['', 'miss']
const nothing = ['', 'none']

/* ---------- Module 1 : syntaxe de base ---------- */

const tagsSlide = {
  id: 'tags', type: 'flow',
  nav: { fr: 'Balises', ar: 'الوسوم' },
  title: { fr: 'Les balises PHP', ar: 'وسوم PHP' },
  lead: {
    fr: 'PHP n’exécute que le code placé entre ses balises. Le reste est envoyé tel quel au navigateur. Choisissez une version et suivez les lignes.',
    ar: 'لا ينفذ PHP إلا الكود الموجود بين وسومه، وكل ما عداه يرسل كما هو إلى المتصفح. اختر نسخة وتتبع الخطوط.',
  },
  source: { label: { fr: 'Balises PHP', ar: 'وسوم PHP' }, url: DOC + 'language.basic-syntax.phptags.php' },
  sourceLabel: 'page.php',
  outputLabel: { fr: 'Ce que reçoit le navigateur', ar: 'ما يستقبله المتصفح' },
  variants: [
    {
      id: 'php', code: '<?php echo',
      label: { fr: 'Balise normale', ar: 'الوسم العادي' },
      note: {
        fr: '<?php ouvre le code PHP et ?> le ferme. Juste après <?php, il faut un espace ou un retour à la ligne.',
        ar: 'يفتح الوسم <?php كود PHP ويغلقه الوسم ?>. بعد <?php مباشرة يجب وضع فراغ أو سطر جديد.',
      },
      lines: [
        { id: 'a', k: 'html', segs: [html('<h1>Ma page</h1>')] },
        { id: 'b', k: 'php', segs: [html('<p>'), tag('<?php'), kw(' echo '), str('"Bonjour Salma"'), txt('; '), tag('?>'), html('</p>')] },
        { id: 'c', k: 'html', segs: [html('<p>Fin</p>')] },
      ],
      output: [
        { from: 'a', segs: [html('<h1>Ma page</h1>')] },
        { from: 'b', segs: [html('<p>'), out('Bonjour Salma'), html('</p>')] },
        { from: 'c', segs: [html('<p>Fin</p>')] },
      ],
    },
    {
      id: 'short', code: '<?=',
      label: { fr: 'Raccourci', ar: 'الاختصار' },
      note: {
        fr: '<?= est un raccourci pour <?php echo. Le navigateur reçoit exactement la même chose.',
        ar: 'الوسم <?= اختصار لـ <?php echo، ويستقبل المتصفح الشيء نفسه تماما.',
      },
      lines: [
        { id: 'a', k: 'html', segs: [html('<h1>Ma page</h1>')] },
        { id: 'b', k: 'php', segs: [html('<p>'), tag('<?='), txt(' '), str('"Bonjour Salma"'), txt(' '), tag('?>'), html('</p>')] },
        { id: 'c', k: 'html', segs: [html('<p>Fin</p>')] },
      ],
      output: [
        { from: 'a', segs: [html('<h1>Ma page</h1>')] },
        { from: 'b', segs: [html('<p>'), out('Bonjour Salma'), html('</p>')] },
        { from: 'c', segs: [html('<p>Fin</p>')] },
      ],
    },
    {
      id: 'none',
      label: { fr: 'Sans balises', ar: 'بدون وسوم' },
      note: {
        fr: 'Sans balises, PHP ne voit pas ce code : le navigateur reçoit le texte tel quel, sans l’exécuter.',
        ar: 'بدون وسوم لا يرى PHP هذا الكود، فيستقبل المتصفح النص كما هو دون تنفيذه.',
      },
      lines: [
        { id: 'a', k: 'html', segs: [html('<h1>Ma page</h1>')] },
        { id: 'b', k: 'html', segs: [html('<p>echo "Bonjour Salma";</p>')] },
        { id: 'c', k: 'html', segs: [html('<p>Fin</p>')] },
      ],
      output: [
        { from: 'a', segs: [html('<h1>Ma page</h1>')] },
        { from: 'b', segs: [html('<p>echo "Bonjour Salma";</p>')] },
        { from: 'c', segs: [html('<p>Fin</p>')] },
      ],
    },
  ],
}

const semicolonSlide = {
  id: 'semicolon', type: 'flow',
  nav: { fr: 'Point-virgule', ar: 'الفاصلة المنقوطة' },
  title: { fr: 'Le point-virgule', ar: 'الفاصلة المنقوطة' },
  lead: {
    fr: 'Chaque instruction PHP se termine par un point-virgule. Comparez les trois versions.',
    ar: 'تنتهي كل تعليمة في PHP بفاصلة منقوطة. قارن بين النسخ الثلاث.',
  },
  source: { label: { fr: 'Séparation des instructions', ar: 'الفصل بين التعليمات' }, url: DOC + 'language.basic-syntax.instruction-separation.php' },
  sourceLabel: 'bonjour.php',
  outputLabel: { fr: 'Résultat', ar: 'النتيجة' },
  variants: [
    {
      id: 'ok',
      label: { fr: 'Correct', ar: 'صحيح' },
      note: {
        fr: 'Chaque echo se termine par ;. Les deux textes s’affichent à la suite, car echo n’ajoute pas de retour à la ligne.',
        ar: 'تنتهي كل echo بالرمز ;. يظهر النصان متتابعين لأن echo لا تضيف سطرا جديدا.',
      },
      lines: [
        { segs: [tag('<?php')] },
        { id: 'a', k: 'php', segs: [kw('echo '), str('"Bonjour"'), txt(';')] },
        { id: 'b', k: 'php', segs: [kw('echo '), str('" Salma"'), txt(';')] },
      ],
      output: [{ from: ['a', 'b'], segs: [out('Bonjour Salma')] }],
    },
    {
      id: 'missing', code: ';',
      label: { fr: 'Point-virgule oublié', ar: 'فاصلة منقوطة منسية' },
      note: {
        fr: 'Sans point-virgule, PHP lit la ligne 3 comme la suite de la ligne 2. Il signale l’erreur à la ligne 3, où il tombe sur le second echo.',
        ar: 'بدون فاصلة منقوطة يقرأ PHP السطر 3 كأنه تتمة للسطر 2، فيظهر الخطأ في السطر 3 عند echo الثانية.',
      },
      lines: [
        { segs: [tag('<?php')] },
        { segs: [kw('echo '), str('"Bonjour"'), missing] },
        { id: 'b', k: 'err', segs: [kw('echo '), str('" Salma"'), txt(';')] },
      ],
      output: [{ from: 'b', segs: [err('Parse error: syntax error, unexpected token "echo", expecting "," or ";" in bonjour.php on line 3')] }],
    },
    {
      id: 'close', code: '?>',
      label: { fr: 'Juste avant la fin', ar: 'قبل النهاية مباشرة' },
      note: {
        fr: 'La balise ?> ajoute automatiquement le point-virgule de la dernière instruction du bloc.',
        ar: 'يضيف الوسم ?> تلقائيا الفاصلة المنقوطة لآخر تعليمة في الكتلة.',
      },
      lines: [{ id: 'a', k: 'php', segs: [tag('<?php '), kw('echo '), str('"Bonjour"'), txt(' '), tag('?>')] }],
      output: [{ from: 'a', segs: [out('Bonjour')] }],
    },
  ],
}

const commentsSlide = {
  id: 'comments', type: 'flow',
  nav: { fr: 'Commentaires', ar: 'التعليقات' },
  title: { fr: 'Les commentaires', ar: 'التعليقات' },
  lead: {
    fr: 'Un commentaire est une note pour les humains : PHP l’ignore. Regardez quelles lignes arrivent jusqu’au résultat.',
    ar: 'التعليق ملاحظة للقارئ يتجاهلها PHP. لاحظ أي الأسطر تصل إلى النتيجة.',
  },
  source: { label: { fr: 'Commentaires', ar: 'التعليقات' }, url: DOC + 'language.basic-syntax.comments.php' },
  sourceLabel: 'commentaires.php',
  outputLabel: { fr: 'Résultat', ar: 'النتيجة' },
  variants: [
    {
      id: 'styles',
      label: { fr: 'Trois styles', ar: 'ثلاثة أنواع' },
      note: {
        fr: '`//` et `#` transforment la fin de la ligne en commentaire. `/* … */` couvre tout jusqu’au premier `*/`, même sur plusieurs lignes.',
        ar: 'يحول `//` و `#` بقية السطر إلى تعليق، أما `/* … */` فيشمل كل شيء حتى أول `*/` ولو على عدة أسطر.',
      },
      lines: [
        { segs: [tag('<?php')] },
        { id: 'a', k: 'php', segs: [kw('echo '), str('"Bonjour"'), txt('; '), cmt('// affiche Bonjour')] },
        { segs: [cmt('# echo " Salut";')] },
        { segs: [cmt('/* echo " A";')] },
        { segs: [cmt('   echo " B"; */')] },
        { id: 'b', k: 'php', segs: [kw('echo '), str('" Salma"'), txt(';')] },
      ],
      output: [{ from: ['a', 'b'], segs: [out('Bonjour Salma')] }],
    },
    {
      id: 'uncomment', code: '#',
      label: { fr: 'Sans le #', ar: 'بدون #' },
      note: {
        fr: 'Sans #, la ligne 3 redevient du code : elle s’exécute et son texte apparaît dans le résultat.',
        ar: 'بدون # يعود السطر 3 كودا، فيتم تنفيذه ويظهر نصه في النتيجة.',
      },
      lines: [
        { segs: [tag('<?php')] },
        { id: 'a', k: 'php', segs: [kw('echo '), str('"Bonjour"'), txt('; '), cmt('// affiche Bonjour')] },
        { id: 'c', k: 'php', segs: [kw('echo '), str('" Salut"'), txt(';')] },
        { segs: [cmt('/* echo " A";')] },
        { segs: [cmt('   echo " B"; */')] },
        { id: 'b', k: 'php', segs: [kw('echo '), str('" Salma"'), txt(';')] },
      ],
      output: [{ from: ['a', 'c', 'b'], segs: [out('Bonjour Salut Salma')] }],
    },
    {
      id: 'trap', code: '// … ?>',
      label: { fr: 'Le piège', ar: 'الفخ' },
      note: {
        fr: 'Un commentaire // ou # s’arrête à ?>. Ce qui suit redevient du HTML et part au navigateur.',
        ar: 'ينتهي التعليق // أو # عند ?>، فيعود ما بعده نصا يرسل إلى المتصفح.',
      },
      lines: [
        { id: 'a', k: 'html', segs: [html('<h1>Une '), tag('<?php '), cmt('// echo "grande"; '), tag('?>'), html('page</h1>')] },
      ],
      output: [{ from: 'a', segs: [html('<h1>Une page</h1>')] }],
    },
  ],
}

const endOfFileSlide = {
  id: 'end', type: 'flow',
  nav: { fr: 'Fin de fichier', ar: 'نهاية الملف' },
  title: { fr: 'Fermer ou non avec ?>', ar: 'هل نغلق بالوسم ?>' },
  lead: {
    fr: 'Un fichier peut ne contenir que du PHP, comme un fichier de configuration. Que se passe-t-il à sa fin ?',
    ar: 'قد يحتوي ملف على PHP فقط، مثل ملف الإعدادات. ماذا يحدث في نهايته؟',
  },
  source: { label: { fr: 'Balises PHP', ar: 'وسوم PHP' }, url: DOC + 'language.basic-syntax.phptags.php' },
  sourceLabel: 'config.php',
  outputLabel: { fr: 'Envoyé au navigateur', ar: 'ما يرسل إلى المتصفح' },
  variants: [
    {
      id: 'open',
      label: { fr: 'Sans ?> (conseillé)', ar: 'بدون ?> (موصى به)' },
      note: {
        fr: 'Quand un fichier se termine par du code PHP, la documentation conseille de ne pas mettre ?>. Ainsi, aucun espace oublié n’est envoyé.',
        ar: 'عندما ينتهي الملف بكود PHP ينصح التوثيق بعدم وضع ?>، حتى لا يرسل أي فراغ منسي.',
      },
      lines: [
        { segs: [tag('<?php')] },
        { id: 'a', k: 'php', segs: [txt('$site = '), str('"Ma Boutique"'), txt(';')] },
      ],
      output: [{ from: 'a', segs: [nothing] }],
    },
    {
      id: 'closed', code: '?>',
      label: { fr: 'Avec ?> et une ligne vide', ar: 'مع ?> وسطر فارغ' },
      note: {
        fr: 'Le retour à la ligne juste après ?> est ignoré, mais la ligne vide suivante est envoyée. Ce caractère invisible peut gêner, par exemple dans un fichier chargé avec require.',
        ar: 'يتجاهل PHP السطر الجديد الذي يلي ?> مباشرة، لكن السطر الفارغ بعده يرسل. هذا الحرف غير المرئي قد يسبب مشاكل، مثلا في ملف يحمل بـ require.',
      },
      lines: [
        { segs: [tag('<?php')] },
        { segs: [txt('$site = '), str('"Ma Boutique"'), txt(';')] },
        { segs: [tag('?>')] },
        { id: 'e', k: 'html', segs: [ws] },
      ],
      output: [{ from: 'e', segs: [ws] }],
    },
  ],
}

const syntaxQuiz = {
  id: 'syntax-quiz', type: 'rules',
  nav: { fr: 'Exercice', ar: 'تمرين' },
  title: { fr: 'Ce code fonctionne-t-il ?', ar: 'هل يعمل هذا الكود؟' },
  lead: { fr: 'Cliquez sur chaque proposition pour voir si PHP l’accepte.', ar: 'انقر على كل اقتراح لترى هل يقبله PHP.' },
  source: { label: { fr: 'La syntaxe de base', ar: 'أساسيات الكتابة' }, url: DOC + 'language.basic-syntax.php' },
  items: [
    { code: '<?php echo "A"; echo "B"; ?>', ok: true, why: { fr: 'Deux instructions sur une ligne, chacune avec son point-virgule.', ar: 'تعليمتان في سطر واحد، ولكل منهما فاصلة منقوطة.' } },
    { code: '<?php echo "A" echo "B"; ?>', ok: false, why: { fr: 'Il manque le point-virgule après la première instruction.', ar: 'تنقص الفاصلة المنقوطة بعد التعليمة الأولى.' } },
    { code: '<?php echo "A" ?>', ok: true, why: { fr: 'La balise ?> remplace le point-virgule de la dernière instruction.', ar: 'الوسم ?> يعوض الفاصلة المنقوطة لآخر تعليمة.' } },
    { code: '<?phpecho "A"; ?>', ok: false, why: { fr: 'Il faut un espace ou un retour à la ligne juste après <?php.', ar: 'يجب وضع فراغ أو سطر جديد بعد <?php مباشرة.' } },
    { code: '<?= "A" ?>', ok: true, why: { fr: 'C’est le raccourci de <?php echo.', ar: 'هذا اختصار لـ <?php echo.' } },
    { code: '<?php /* a /* b */ c */ ?>', ok: false, why: { fr: 'Les commentaires /* */ ne s’imbriquent pas : le premier */ ferme le commentaire, et la suite devient du code invalide.', ar: 'لا يمكن وضع تعليق /* */ داخل آخر: أول */ يغلق التعليق، فيصبح ما بعده كودا غير صحيح.' } },
  ],
}

/* ---------- Diapositives déjà prêtes pour les modules suivants ---------- */

const variableSlide = {
  id: 'variable', type: 'variable',
  nav: { fr: 'Variable', ar: 'المتغير' },
  title: { fr: 'Comment écrire une variable', ar: 'كيف تكتب متغيرا' },
  lead: {
    fr: 'Une variable est un nom qui contient une valeur. Cliquez sur chaque partie du code, puis changez le nom et la valeur.',
    ar: 'المتغير اسم يحمل قيمة. انقر على كل جزء من الكود، ثم غيّر الاسم والقيمة.',
  },
  source: { label: { fr: 'Les bases des variables', ar: 'أساسيات المتغيرات' }, url: DOC + 'language.variables.basics.php' },
  parts: {
    dollar: {
      label: { fr: 'Le signe $', ar: 'الرمز $' },
      text: { fr: 'En PHP, chaque variable commence par $.', ar: 'في PHP يبدأ كل متغير بالرمز $.' },
    },
    name: {
      label: { fr: 'Le nom', ar: 'الاسم' },
      text: {
        fr: 'Il commence par une lettre ou _. Ensuite, il peut contenir des lettres, des chiffres et _, mais pas d’espace.',
        ar: 'يبدأ بحرف أو بالرمز _. بعد ذلك يمكن أن يحتوي على حروف وأرقام والرمز _، لكن بدون فراغ.',
      },
    },
    equal: {
      label: { fr: 'Le signe =', ar: 'الرمز =' },
      text: { fr: 'C’est l’affectation : la valeur de droite est placée dans la variable de gauche.', ar: 'هذا هو الإسناد: توضع القيمة التي على اليمين في المتغير الذي على اليسار.' },
    },
    value: {
      label: { fr: 'La valeur', ar: 'القيمة' },
      text: { fr: 'Un texte s’écrit entre guillemets. Un nombre s’écrit sans guillemets.', ar: 'يكتب النص بين علامتي تنصيص، ويكتب العدد بدونهما.' },
    },
    end: {
      label: { fr: 'Le point-virgule', ar: 'الفاصلة المنقوطة' },
      text: { fr: 'Chaque instruction PHP se termine par un point-virgule.', ar: 'تنتهي كل تعليمة في PHP بفاصلة منقوطة.' },
    },
  },
}

const namesQuiz = {
  id: 'rules', type: 'rules',
  nav: { fr: 'Exercice', ar: 'تمرين' },
  title: { fr: 'Quel nom est correct ?', ar: 'أي اسم صحيح؟' },
  lead: { fr: 'Cliquez sur chaque proposition pour voir si PHP l’accepte.', ar: 'انقر على كل اقتراح لترى هل يقبله PHP.' },
  source: { label: { fr: 'Les bases des variables', ar: 'أساسيات المتغيرات' }, url: DOC + 'language.variables.basics.php' },
  items: [
    { code: '$user_1', ok: true, why: { fr: 'Il commence par une lettre. Les chiffres et _ sont permis ensuite.', ar: 'يبدأ بحرف، والأرقام والرمز _ مسموح بها بعده.' } },
    { code: '$1user', ok: false, why: { fr: 'Un nom ne peut pas commencer par un chiffre.', ar: 'لا يمكن أن يبدأ الاسم برقم.' } },
    { code: '$_age', ok: true, why: { fr: 'Un nom peut commencer par _.', ar: 'يمكن أن يبدأ الاسم بالرمز _.' } },
    { code: '$full name', ok: false, why: { fr: 'L’espace est interdit. Écrivez $full_name.', ar: 'الفراغ غير مسموح. اكتب $full_name.' } },
    { code: 'age', ok: false, why: { fr: 'Il manque le signe $ : ce n’est pas une variable.', ar: 'ينقصه الرمز $، فهو ليس متغيرا.' } },
    { code: '$Age', ok: true, why: { fr: 'Attention : $Age et $age sont deux variables différentes, car PHP distingue les majuscules des minuscules.', ar: 'انتبه: $Age و $age متغيران مختلفان، لأن لغة PHP تميز بين الحروف الكبيرة والصغيرة.' } },
  ],
}

const calcSlide = {
  id: 'calc', type: 'calc',
  nav: { fr: 'Calculs', ar: 'الحساب' },
  title: { fr: 'Les calculs', ar: 'العمليات الحسابية' },
  lead: { fr: 'Choisissez une opération et déplacez les curseurs. Les lignes montrent d’où vient chaque valeur.', ar: 'اختر عملية وحرّك المؤشرين. تبيّن الخطوط مصدر كل قيمة.' },
  source: { label: { fr: 'Opérateurs arithmétiques', ar: 'العوامل الحسابية' }, url: DOC + 'language.operators.arithmetic.php' },
  ops: [
    { op: '+', name: { fr: 'Addition', ar: 'الجمع' } },
    { op: '-', name: { fr: 'Soustraction', ar: 'الطرح' } },
    { op: '*', name: { fr: 'Multiplication', ar: 'الضرب' } },
    { op: '/', name: { fr: 'Division', ar: 'القسمة' } },
    { op: '%', name: { fr: 'Reste', ar: 'باقي القسمة' } },
    { op: '**', name: { fr: 'Puissance', ar: 'الأس' } },
  ],
}

const configSlide = {
  id: 'config', type: 'config',
  nav: { fr: 'Config', ar: 'الإعدادات' },
  title: { fr: 'Config : écrire une seule fois', ar: 'الإعدادات: اكتبها مرة واحدة' },
  lead: {
    fr: 'Cliquez sur un fichier ou une valeur pour voir où elle est utilisée. Changez une valeur dans config.php : tous les fichiers suivent.',
    ar: 'انقر على ملف أو قيمة لترى أين تستعمل. غيّر قيمة في config.php وستتغير في كل الملفات.',
  },
  source: { label: { fr: 'include (valeur de retour)', ar: 'القيمة التي ترجعها include' }, url: DOC + 'function.include.php' },
}

/* ---------- Le cours ---------- */

export const phpCourse = {
  name: 'PHP',
  title: { fr: 'Les fondamentaux de PHP', ar: 'أساسيات PHP' },
  lead: { fr: 'Huit modules, dans l’ordre de la documentation officielle.', ar: 'ثماني وحدات بترتيب التوثيق الرسمي.' },
  modules: [
    {
      id: 'syntax', title: { fr: 'Syntaxe de base', ar: 'أساسيات الكتابة' },
      notions: { fr: 'Balises, point-virgule, commentaires', ar: 'الوسوم والفاصلة المنقوطة والتعليقات' },
      slides: [tagsSlide, semicolonSlide, commentsSlide, endOfFileSlide, syntaxQuiz],
    },
    {
      id: 'types', title: { fr: 'Les types', ar: 'الأنواع' },
      notions: { fr: 'null, booléens, nombres, chaînes, tableaux', ar: 'القيم الفارغة والمنطقية والأعداد والنصوص والجداول' },
      slides: [],
    },
    {
      id: 'variables', title: { fr: 'Les variables', ar: 'المتغيرات' },
      notions: { fr: 'Noms, affectation, portée', ar: 'الأسماء والإسناد والنطاق' },
      slides: [variableSlide, namesQuiz],
    },
    {
      id: 'constants', title: { fr: 'Les constantes', ar: 'الثوابت' },
      notions: { fr: 'const, define, constantes magiques', ar: 'تعريف الثوابت والثوابت السحرية' },
      slides: [],
    },
    {
      id: 'expressions', title: { fr: 'Les expressions', ar: 'التعابير' },
      notions: { fr: 'Tout ce qui produit une valeur', ar: 'كل ما ينتج قيمة' },
      slides: [],
    },
    {
      id: 'operators', title: { fr: 'Les opérateurs', ar: 'العوامل' },
      notions: { fr: 'Calculs, comparaisons, logique, priorité', ar: 'الحساب والمقارنة والمنطق والأولوية' },
      slides: [calcSlide],
    },
    {
      id: 'control', title: { fr: 'Structures de contrôle', ar: 'بنى التحكم' },
      notions: { fr: 'Conditions, boucles, include et require', ar: 'الشروط والحلقات والتضمين' },
      slides: [configSlide],
    },
    {
      id: 'functions', title: { fr: 'Les fonctions', ar: 'الدوال' },
      notions: { fr: 'Paramètres, valeur de retour', ar: 'المعاملات والقيمة المرجعة' },
      slides: [],
    },
  ],
}
