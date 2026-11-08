const tx = (fr, ar) => ({ fr, ar })
const word = (termFr, defFr, termAr, defAr) => ({ term: tx(termFr, termAr), def: tx(defFr, defAr) })

/* ---------- Coloration d'un fichier YAML ---------- */

function yamlLine(text) {
  const m = text.match(/^(\s*)(- )?([\w-]+:)?(.*)$/)
  const segs = []
  if (m[1]) segs.push([m[1], 'plain'])
  if (m[2]) segs.push([m[2], 'plain'])
  if (m[3]) segs.push([m[3], 'kw'])
  if (m[4]) segs.push([m[4], 'str'])
  return { segs }
}

const workflow = `name: livraison
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm ci
      - run: npm test

  image:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: ./ci/construire-image.sh

  staging:
    needs: image
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v6
      - run: ./ci/deployer.sh staging
      - run: ./ci/verifier.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v6
      - run: ./ci/deployer.sh production
      - run: ./ci/verifier.sh production
      - if: \${{ failure() }}
        run: ./ci/rollback.sh production`

const OLD = 'v41 · sha256:7b1e04'
const NEW = 'v42 · sha256:9f2c6a'

/* ---------- 1. C'est quoi ---------- */

const definition = {
  id: 'what', type: 'rules', reveal: true,
  nav: tx('C’est quoi ?', 'ما هو؟'),
  title: tx('DevOps, c’est quoi ?', 'ما هو DevOps؟'),
  lead: tx(
    'Dev veut dire développer l’application. Ops veut dire la faire marcher sur les serveurs. DevOps, c’est faire les deux ensemble. Cliquez sur chaque carte.',
    'كلمة Dev تعني تطوير التطبيق، وكلمة Ops تعني تشغيله على الخوادم. و DevOps يعني القيام بالأمرين معا. انقر على كل بطاقة.',
  ),
  source: { label: tx('Microsoft Learn : qu’est-ce que DevOps', 'Microsoft Learn: ما هو DevOps'), url: 'https://learn.microsoft.com/fr-fr/devops/what-is-devops' },
  items: [
    {
      title: tx('Une seule équipe', 'فريق واحد'),
      why: tx(
        'Avant, une équipe écrivait le code et une autre le mettait en ligne. Cela créait des retards et des disputes. Avec DevOps, tout le monde est responsable du résultat.',
        'في السابق، كان فريق يكتب الكود وفريق آخر ينشره، فتحدث تأخيرات وخلافات. مع DevOps، الجميع مسؤول عن النتيجة.',
      ),
    },
    {
      title: tx('Livrer souvent', 'التسليم كثيرا'),
      why: tx(
        'On envoie de petits changements, souvent. C’est moins dangereux qu’un très gros changement de temps en temps.',
        'نرسل تغييرات صغيرة وبشكل متكرر. هذا أقل خطرا من تغيير كبير جدا من حين لآخر.',
      ),
    },
    {
      title: tx('Savoir vite', 'المعرفة بسرعة'),
      why: tx(
        'Les tests et la surveillance disent vite si quelque chose ne marche pas. Plus on le sait tôt, plus c’est facile à réparer.',
        'تخبرنا الاختبارات والمراقبة بسرعة إذا كان هناك شيء لا يعمل. كلما عرفنا مبكرا، سهل الإصلاح.',
      ),
    },
    {
      title: tx('Automatiser', 'الأتمتة'),
      why: tx(
        'Une machine refait les mêmes étapes sans rien oublier. Un humain qui répète tout à la main finit par se tromper.',
        'تعيد الآلة الخطوات نفسها دون نسيان شيء. أما الإنسان الذي يكرر كل شيء يدويا فسيخطئ في النهاية.',
      ),
    },
    {
      title: tx('Mesurer', 'القياس'),
      why: tx(
        'On regarde des chiffres simples : combien de mises en ligne, combien de pannes, combien de temps pour réparer. Ainsi, on voit si l’équipe progresse.',
        'ننظر إلى أرقام بسيطة: عدد عمليات النشر، وعدد الأعطال، ومدة الإصلاح. وهكذا نرى هل يتقدم الفريق.',
      ),
    },
  ],
}

/* ---------- 2. Le chemin du code ---------- */

const path = {
  id: 'path', type: 'steps',
  nav: tx('Le chemin', 'الطريق'),
  title: tx('Du code jusqu’aux clients', 'من الكود إلى العملاء'),
  lead: tx(
    'Exemple : vous travaillez sur une boutique en ligne et vous corrigez un bug. Suivez votre changement, étape par étape.',
    'مثال: تعمل على متجر إلكتروني وتصلح خطأ. تتبع تغييرك خطوة بخطوة.',
  ),
  source: { label: tx('Microsoft Learn : qu’est-ce que DevOps', 'Microsoft Learn: ما هو DevOps'), url: 'https://learn.microsoft.com/fr-fr/devops/what-is-devops' },
  stages: [
    {
      id: 'pc', label: tx('Votre PC', 'حاسوبك'), sub: 'code',
      detail: tx('Vous modifiez le code sur votre ordinateur. Les clients ne voient encore rien.', 'تعدل الكود على حاسوبك. لا يرى العملاء أي شيء بعد.'),
    },
    {
      id: 'git', label: tx('GitHub', 'GitHub'), sub: 'git push',
      detail: tx('Vous envoyez le code sur GitHub. C’est l’endroit où l’équipe garde tout le code.', 'ترسل الكود إلى GitHub، وهو المكان الذي يحفظ فيه الفريق كل الكود.'),
      code: 'git push',
    },
    {
      id: 'tests', label: tx('Tests', 'الاختبارات'), sub: 'npm test',
      detail: tx('Des tests se lancent tout seuls. Ils vérifient que le code marche toujours. Si un test échoue, tout s’arrête ici.', 'تبدأ الاختبارات تلقائيا وتتأكد من أن الكود ما زال يعمل. إذا فشل اختبار، يتوقف كل شيء هنا.'),
      code: 'npm test',
    },
    {
      id: 'image', label: tx('Image', 'الصورة'), sub: 'docker',
      detail: tx('Le code est mis dans un paquet prêt à démarrer. Ce paquet s’appelle une image.', 'يوضع الكود في حزمة جاهزة للتشغيل، وتسمى هذه الحزمة صورة.'),
    },
    {
      id: 'staging', label: tx('Serveur de test', 'خادم الاختبار'), sub: 'staging',
      detail: tx('L’image est installée sur un serveur de test. Les clients ne le voient pas. On vérifie que tout marche.', 'تثبت الصورة على خادم اختبار لا يراه العملاء، ونتأكد من أن كل شيء يعمل.'),
    },
    {
      id: 'prod', label: tx('Vrai serveur', 'الخادم الحقيقي'), sub: 'production',
      detail: tx('La même image est installée sur le vrai serveur. Maintenant, les clients reçoivent votre correction.', 'تثبت الصورة نفسها على الخادم الحقيقي. الآن يحصل العملاء على إصلاحك.'),
    },
    {
      id: 'watch', label: tx('Surveillance', 'المراقبة'), sub: 'logs',
      detail: tx('On regarde si tout va bien : les erreurs et la vitesse du site. Si quelque chose casse, une alerte prévient l’équipe.', 'نراقب هل كل شيء بخير: الأخطاء وسرعة الموقع. وإذا تعطل شيء، ينبه إنذار الفريق.'),
    },
  ],
}

/* ---------- 3. Taille des livraisons ---------- */

const batch = {
  id: 'batch', type: 'batch',
  nav: tx('Livraisons', 'التسليمات'),
  title: tx('Petites ou grosses livraisons ?', 'تسليمات صغيرة أم كبيرة؟'),
  lead: tx(
    'Votre équipe fait 200 changements par mois. Vous pouvez les envoyer tous ensemble, ou petit à petit. Essayez les boutons, puis cliquez sur « Envoyer cette livraison ».',
    'ينجز فريقك 200 تغيير في الشهر. يمكنك إرسالها كلها معا، أو شيئا فشيئا. جرب الأزرار، ثم انقر على «إرسال هذا التسليم».',
  ),
  words: [
    word('Livraison', 'Mettre un ou plusieurs changements en ligne.', 'التسليم', 'نشر تغيير واحد أو عدة تغييرات.'),
    word('Bug', 'Une erreur dans le code.', 'الخطأ', 'مشكلة داخل الكود.'),
  ],
  source: { label: tx('DORA : travailler par petits lots', 'DORA: العمل بدفعات صغيرة'), url: 'https://dora.dev/capabilities/working-in-small-batches/' },
  monthlyChanges: 200,
  presets: [
    { n: 1, label: tx('Un par un', 'واحدا تلو الآخر') },
    { n: 20, label: tx('20 ensemble', '20 معا') },
    { n: 200, label: tx('Tout ensemble', 'كلها معا') },
  ],
  note: tx(
    'Plus la livraison est grosse, plus elle a de chances de contenir un bug. Et si elle casse, il faut chercher le bug parmi tous les changements. Avec 1 changement, il n’y a qu’un seul endroit à vérifier. Avec 200 changements, il y en a 200.',
    'كلما كبر التسليم، زاد احتمال وجود خطأ فيه. وإذا فشل، يجب البحث عن الخطأ بين كل التغييرات. مع تغيير واحد يوجد مكان واحد للفحص، ومع 200 تغيير يوجد 200 مكان.',
  ),
  deeper: [
    tx('La formule : `P = 1 - (1 - p)^n`. Elle suppose que chaque changement a la même chance d’avoir un bug, sans lien avec les autres.', 'الصيغة: `P = 1 - (1 - p)^n`. وهي تفترض أن لكل تغيير الاحتمال نفسه، دون علاقة بالتغييرات الأخرى.'),
    tx('La commande `git bisect` aide à trouver le changement fautif en environ `log₂(n)` essais, si chaque commit fonctionne.', 'يساعد الأمر `git bisect` على إيجاد التغيير المسؤول في حوالي `log₂(n)` محاولة، إذا كان كل إيداع يعمل.'),
    tx('Repère de DORA : un travail qui prend plus d’une semaine est trop gros. Il faut le couper.', 'مرجع DORA: العمل الذي يستغرق أكثر من أسبوع كبير جدا، ويجب تقسيمه.'),
  ],
}

/* ---------- 4. Pipeline ---------- */

const pipeline = {
  id: 'pipeline', type: 'pipeline',
  nav: tx('Pipeline', 'المسار'),
  title: tx('Le pipeline : un robot qui livre le code', 'المسار: روبوت يسلم الكود'),
  lead: tx(
    'Le robot suit les étapes écrites dans ce fichier. Choisissez où ça casse, puis cliquez sur « Lancer ». Regardez ce qui change sur les serveurs.',
    'يتبع الروبوت الخطوات المكتوبة في هذا الملف. اختر مكان الفشل، ثم انقر على «تشغيل»، ولاحظ ما يتغير في الخوادم.',
  ),
  words: [
    word('Pipeline', 'Une suite d’étapes faites automatiquement.', 'المسار', 'مجموعة خطوات تنفذ تلقائيا.'),
    word('Job', 'Une étape du pipeline.', 'المهمة', 'خطوة من خطوات المسار.'),
    word('Image', 'Le paquet qui contient l’application prête à démarrer.', 'الصورة', 'الحزمة التي تحتوي التطبيق جاهزا للتشغيل.'),
    word('Staging', 'Le serveur de test. Les clients ne le voient pas.', 'staging', 'خادم الاختبار، ولا يراه العملاء.'),
    word('Production', 'Le vrai serveur, utilisé par les clients.', 'production', 'الخادم الحقيقي الذي يستعمله العملاء.'),
    word('sha256:…', 'Le numéro unique d’une image, comme une empreinte.', 'sha256:…', 'الرقم الفريد للصورة، مثل البصمة.'),
    word('Rollback', 'Remettre la version d’avant.', 'التراجع', 'إعادة الإصدار السابق.'),
  ],
  source: { label: tx('Syntaxe des workflows GitHub Actions', 'صيغة سير العمل في GitHub Actions'), url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax' },
  sourceLabel: '.github/workflows/livraison.yml',
  lines: workflow.split('\n').map(yamlLine),
  initialState: { image: '—', staging: OLD, production: OLD },
  stages: [
    {
      id: 'push', label: 'push',
      steps: [{ id: 'push', line: 4, log: tx('Du code arrive sur `main`. Le robot démarre.', 'وصل كود إلى `main`، فبدأ الروبوت.') }],
    },
    {
      id: 'test', label: 'test',
      steps: [
        { id: 'test-ci', line: 11, log: tx('Le robot installe les bibliothèques du projet.', 'يثبت الروبوت مكتبات المشروع.') },
        { id: 'test-run', line: 12, log: tx('Le robot lance les tests : tout est bon.', 'يشغل الروبوت الاختبارات: كل شيء سليم.') },
      ],
    },
    {
      id: 'image', label: 'image',
      steps: [{ id: 'image-build', line: 19, log: tx('Le robot fabrique l’image v42 et lui donne un numéro unique.', 'يصنع الروبوت الصورة `v42` ويعطيها رقما فريدا.'), effect: { image: NEW } }],
    },
    {
      id: 'staging', label: 'staging',
      steps: [
        { id: 'staging-deploy', line: 27, log: tx('Le robot installe v42 sur le serveur de test.', 'يثبت الروبوت `v42` على خادم الاختبار.'), effect: { staging: NEW } },
        { id: 'staging-verify', line: 28, log: tx('Le robot vérifie le serveur de test : il répond bien.', 'يتحقق الروبوت من خادم الاختبار: إنه يجيب جيدا.') },
      ],
    },
    {
      id: 'production', label: 'production',
      steps: [
        { id: 'prod-gate', line: 33, log: tx('Le robot vérifie qu’il a le droit d’aller en production.', 'يتحقق الروبوت من أنه مسموح له بالوصول إلى الإنتاج.') },
        { id: 'prod-deploy', line: 36, log: tx('Le robot installe la même image sur le vrai serveur.', 'يثبت الروبوت الصورة نفسها على الخادم الحقيقي.'), effect: { production: NEW } },
        { id: 'prod-verify', line: 37, log: tx('Le robot vérifie le vrai serveur : il répond bien.', 'يتحقق الروبوت من الخادم الحقيقي: إنه يجيب جيدا.') },
      ],
    },
  ],
  scenarios: [
    {
      id: 'ok', label: tx('Tout marche', 'كل شيء يعمل'),
      note: tx(
        'Regardez les cases à la fin : le serveur de test et le vrai serveur ont le même numéro d’image. Ce qui a été testé est exactement ce que reçoivent les clients.',
        'انظر إلى الخانات في النهاية: لخادم الاختبار والخادم الحقيقي رقم الصورة نفسه. ما تم اختباره هو بالضبط ما يحصل عليه العملاء.',
      ),
    },
    {
      id: 'test', label: tx('Un test échoue', 'فشل اختبار'),
      failAt: 'test-run', failLog: tx('Un test échoue. Le robot s’arrête ici.', 'فشل اختبار، فيتوقف الروبوت هنا.'),
      note: tx(
        'Le robot s’arrête tout de suite. Aucun serveur n’a changé et aucun client n’est touché. C’est le meilleur endroit pour découvrir un bug.',
        'يتوقف الروبوت فورا. لم يتغير أي خادم ولم يتأثر أي عميل. هذا أفضل مكان لاكتشاف الخطأ.',
      ),
    },
    {
      id: 'staging', label: tx('Le serveur de test casse', 'خادم الاختبار يتعطل'),
      failAt: 'staging-verify', failLog: tx('Le serveur de test répond une erreur. Le robot s’arrête.', 'يجيب خادم الاختبار بخطأ، فيتوقف الروبوت.'),
      note: tx(
        'Le serveur de test est en panne, mais le vrai serveur est toujours en v41. Les clients ne voient rien.',
        'خادم الاختبار معطل، لكن الخادم الحقيقي ما زال على `v41`. العملاء لا يلاحظون شيئا.',
      ),
    },
    {
      id: 'prod', label: tx('Le vrai serveur casse', 'الخادم الحقيقي يتعطل'),
      failAt: 'prod-verify', failLog: tx('Le vrai serveur répond une erreur.', 'يجيب الخادم الحقيقي بخطأ.'),
      after: [{ line: 39, log: tx('Le robot remet la version d’avant : v41.', 'يعيد الروبوت الإصدار السابق: `v41`.'), effect: { production: OLD } }],
      note: tx(
        'Cette fois, v42 est arrivée chez les clients et elle a cassé. Le robot remet v41. Mais pendant ce temps, des clients ont vu des erreurs. C’est le cas le plus grave.',
        'هذه المرة وصلت `v42` إلى العملاء وتعطلت. يعيد الروبوت `v41`، لكن بعض العملاء رأوا أخطاء خلال ذلك. هذه أخطر حالة.',
      ),
    },
  ],
  deeper: [
    tx('Pourquoi ne pas refabriquer l’image pour la production ? Parce que les bibliothèques ont pu changer. On aurait alors une image qui n’a jamais été testée. On garde donc la même, avec son numéro `sha256`.', 'لماذا لا نعيد صنع الصورة للإنتاج؟ لأن المكتبات قد تتغير، فنحصل على صورة لم تختبر أبدا. لذلك نحتفظ بالصورة نفسها برقمها `sha256`.'),
    tx('Un rollback remet l’ancien code, mais pas les anciennes données. Si v42 a modifié la base de données, l’ancien code doit encore pouvoir la lire.', 'يعيد التراجع الكود القديم لكنه لا يعيد البيانات القديمة. إذا غيرت `v42` قاعدة البيانات، فيجب أن يبقى الكود القديم قادرا على قراءتها.'),
    tx('Repères de DORA : les tests rapides donnent un résultat en quelques minutes, et tous les tests en 10 minutes environ. Si le pipeline est cassé, on le répare en priorité.', 'مراجع DORA: تعطي الاختبارات السريعة نتيجة في دقائق، وكل الاختبارات في 10 دقائق تقريبا. وإذا تعطل المسار، فإصلاحه أولوية.'),
    tx('Le serveur de test ne ressemble jamais totalement au vrai serveur. Il a moins de clients et d’autres données. Il réduit le risque, sans l’enlever.', 'لا يشبه خادم الاختبار الخادم الحقيقي تماما، ففيه عملاء أقل وبيانات أخرى. إنه يقلل الخطر ولا يلغيه.'),
  ],
}

/* ---------- 5. Mise en ligne ---------- */

const step = (v1, v2, f, log) => ({ v1, v2, f, log })
const initial = step(10, 0, 0, tx('10 copies de v41 répondent à tous les clients.', '10 نسخ من `v41` تجيب كل العملاء.'))

function rolling(bug) {
  const up = (k) => step(10 - k, k, k / 10, tx(`${k} copies ont été remplacées par v42.`, `تم تعويض ${k} نسخ بالإصدار \`v42\`.`))
  if (!bug) return [initial, up(2), up(4), up(6), up(8), step(0, 10, 1, tx('Toutes les copies sont en v42.', 'كل النسخ أصبحت `v42`.'))]
  const back = (k) => step(10 - k, k, k / 10, tx(`Retour en arrière : il reste ${k} copies de v42.`, `تراجع: بقيت ${k} نسخ من \`v42\`.`))
  return [
    initial, up(2), up(4),
    step(4, 6, 0.6, tx('Alerte : il y a trop d’erreurs. On arrête.', 'تنبيه: الأخطاء كثيرة، فنتوقف.')),
    back(4), back(2),
    step(10, 0, 0, tx('Tout est revenu en v41.', 'عاد كل شيء إلى `v41`.')),
  ]
}

function blueGreen(bug) {
  const ready = step(10, 10, 0, tx('10 copies de v42 démarrent à côté. Elles ne reçoivent aucun client.', 'تبدأ 10 نسخ من `v42` جانبا، ولا تستقبل أي عميل.'))
  const smoke = step(10, 10, 0, tx('Un test rapide passe. Le bug n’apparaît qu’avec de vrais clients.', 'ينجح اختبار سريع. الخطأ لا يظهر إلا مع عملاء حقيقيين.'))
  const cut = step(10, 10, 1, tx('Tous les clients passent sur v42 d’un seul coup.', 'ينتقل كل العملاء إلى `v42` دفعة واحدة.'))
  if (!bug) return [initial, ready, smoke, cut, step(0, 10, 1, tx('Tout va bien. Les copies de v41 sont supprimées.', 'كل شيء بخير، فتحذف نسخ `v41`.'))]
  return [
    initial, ready, smoke, cut,
    step(10, 10, 1, tx('Alerte : tous les clients sont touchés par le bug.', 'تنبيه: الخطأ يصيب كل العملاء.')),
    step(10, 10, 0, tx('Tous les clients reviennent sur v41 en quelques secondes.', 'يعود كل العملاء إلى `v41` في ثوان.')),
    step(10, 0, 0, tx('Les copies de v42 sont arrêtées.', 'تتوقف نسخ `v42`.')),
  ]
}

function canary(bug) {
  const small = step(10, 1, 0.05, tx('Une seule copie de v42 reçoit 5 % des clients.', 'نسخة واحدة من `v42` تستقبل 5% من العملاء.'))
  if (!bug) {
    return [
      initial, small,
      step(8, 3, 0.25, tx('Pas plus d’erreurs que v41. On passe à 25 %.', 'لا توجد أخطاء أكثر من `v41`، فننتقل إلى 25%.')),
      step(5, 5, 0.5, tx('Toujours bon. On passe à 50 %.', 'ما زال جيدا، فننتقل إلى 50%.')),
      step(0, 10, 1, tx('On passe à 100 %.', 'ننتقل إلى 100%.')),
    ]
  }
  return [
    initial, small,
    step(10, 1, 0.05, tx('Comparaison : v42 fait beaucoup plus d’erreurs que v41.', 'مقارنة: أخطاء `v42` أكثر بكثير من `v41`.')),
    step(10, 0, 0, tx('On arrête. Tous les clients reviennent sur v41.', 'نتوقف، ويعود كل العملاء إلى `v41`.')),
  ]
}

const deploy = {
  id: 'deploy', type: 'deploy',
  nav: tx('Mise en ligne', 'النشر'),
  title: tx('Mettre à jour sans tout casser', 'التحديث دون تعطيل كل شيء'),
  lead: tx(
    'La nouvelle version v42 a un bug : 1 requête sur 5 échoue. Essayez les trois méthodes et regardez le total des requêtes échouées.',
    'الإصدار الجديد `v42` فيه خطأ: يفشل طلب واحد من كل 5. جرب الطرق الثلاث ولاحظ مجموع الطلبات الفاشلة.',
  ),
  words: [
    word('Requête', 'Une demande envoyée par un client au site.', 'الطلب', 'طلب يرسله عميل إلى الموقع.'),
    word('Copie', 'Une application qui tourne. Le site en a plusieurs pour tenir la charge.', 'النسخة', 'تطبيق يعمل. للموقع عدة نسخ لتحمل الضغط.'),
    word('Répartiteur de charge', 'Il envoie chaque client vers une des copies.', 'موزع الحمل', 'يرسل كل عميل إلى إحدى النسخ.'),
    word('Rolling', 'Remplacer les copies petit à petit.', 'Rolling', 'تعويض النسخ شيئا فشيئا.'),
    word('Blue-green', 'Préparer la nouvelle version à côté, puis tout changer d’un coup.', 'Blue-green', 'تحضير الإصدار الجديد جانبا، ثم تغيير كل شيء دفعة واحدة.'),
    word('Canary', 'Essayer la nouvelle version sur peu de clients d’abord.', 'Canary', 'تجربة الإصدار الجديد على عدد قليل من العملاء أولا.'),
  ],
  source: { label: tx('Google SRE Workbook : canary', 'كتاب Google SRE: الكناري'), url: 'https://sre.google/workbook/canarying-releases/' },
  errorRate: 0.2,
  requestsPerStep: 1000,
  strategies: [
    {
      id: 'rolling', label: tx('Rolling', 'Rolling'), build: rolling,
      note: tx('Les copies changent petit à petit. Le bug se répand en même temps, jusqu’à ce que l’alerte arrête tout.', 'تتغير النسخ شيئا فشيئا، وينتشر الخطأ في الوقت نفسه، حتى يوقف التنبيه كل شيء.'),
    },
    {
      id: 'bluegreen', label: tx('Blue-green', 'Blue-green'), build: blueGreen,
      note: tx('Le retour en arrière est très rapide. Mais tous les clients ont vu le bug, et il faut deux fois plus de serveurs.', 'التراجع سريع جدا، لكن كل العملاء رأوا الخطأ، ويتطلب ذلك ضعف الخوادم.'),
    },
    {
      id: 'canary', label: tx('Canary', 'Canary'), build: canary,
      note: tx('Seuls 5 % des clients essaient v42. On compare ses erreurs avec v41. Le bug est découvert en touchant très peu de monde.', 'يجرب 5% فقط من العملاء `v42`، ونقارن أخطاءها مع `v41`. يكتشف الخطأ مع تأثر عدد قليل جدا من الناس.'),
    },
  ],
  deeper: [
    tx('Un serveur peut démarrer normalement et avoir quand même un bug. Vérifier qu’il répond ne suffit pas : il faut regarder les vraies erreurs.', 'قد يبدأ الخادم بشكل طبيعي ويبقى فيه خطأ. التحقق من أنه يجيب لا يكفي، بل يجب النظر إلى الأخطاء الحقيقية.'),
    tx('Le calcul du canary : part des clients × taux d’erreur. Ici : 5 % × 20 % = 1 %.', 'حساب الكناري: نسبة العملاء × معدل الأخطاء. هنا: 5% × 20% = 1%.'),
    tx('Le canary ne protège pas la base de données. Si v42 supprime une colonne, tous les clients sont touchés, même avec 1 % du trafic.', 'لا يحمي الكناري قاعدة البيانات. إذا حذفت `v42` عمودا، يتأثر كل العملاء ولو مع 1% من الحركة.'),
    tx('Pendant un rolling ou un canary, v41 et v42 tournent en même temps. Elles doivent donc marcher avec la même base de données.', 'أثناء `rolling` أو `canary` تعمل `v41` و `v42` معا، فيجب أن تعملا مع قاعدة البيانات نفسها.'),
    tx('Les chiffres viennent d’un modèle simple : 1 000 requêtes par étape. Dans la réalité, ils changent.', 'تأتي الأرقام من نموذج بسيط: 1000 طلب لكل مرحلة. وفي الواقع تتغير.'),
  ],
}

/* ---------- 6. Mesurer ---------- */

const row = (id, lead, extra = {}) => ({ id, lead, failed: false, hotfix: false, recovery: 45, ...extra })

const dora = {
  id: 'dora', type: 'dora',
  nav: tx('Mesurer', 'القياس'),
  title: tx('Mesurer le travail de l’équipe', 'قياس عمل الفريق'),
  lead: tx(
    'Voici deux semaines de mises en ligne (exemple). Cliquez sur « Échec » ou « Urgence » et regardez les chiffres changer.',
    'هذان أسبوعان من عمليات النشر (مثال). انقر على «فشل» أو «عاجل» ولاحظ تغير الأرقام.',
  ),
  words: [
    word('Temps d’attente', 'Le temps entre l’envoi du code et sa mise en ligne.', 'مدة الانتظار', 'الوقت بين إرسال الكود ونشره.'),
    word('Mises en ligne', 'Combien de fois on publie par semaine.', 'عمليات النشر', 'عدد مرات النشر في الأسبوع.'),
    word('Temps de réparation', 'Le temps pour réparer une mise en ligne ratée.', 'مدة الإصلاح', 'الوقت اللازم لإصلاح نشر فاشل.'),
    word('Taux d’échec', 'La part des mises en ligne qui ont demandé une réparation immédiate.', 'نسبة الفشل', 'نسبة عمليات النشر التي احتاجت إصلاحا فوريا.'),
    word('Mises en ligne urgentes', 'La part des mises en ligne faites à cause d’une panne.', 'النشر العاجل', 'نسبة عمليات النشر التي تمت بسبب عطل.'),
  ],
  source: { label: tx('DORA : indicateurs de livraison', 'DORA: مؤشرات التسليم'), url: 'https://dora.dev/guides/dora-metrics-four-keys/' },
  weeks: 2,
  presets: [
    {
      id: 'small', label: tx('Équipe qui livre souvent', 'فريق ينشر كثيرا'),
      rows: [row(101, 4), row(102, 6), row(103, 3), row(104, 5), row(105, 8, { failed: true, recovery: 18 }), row(106, 1, { hotfix: true }), row(107, 4), row(108, 7), row(109, 3), row(110, 5)],
      note: tx('Cette équipe se trompe parfois, mais elle répare en 18 minutes. Le code arrive aux clients en quelques heures.', 'يخطئ هذا الفريق أحيانا، لكنه يصلح في 18 دقيقة، ويصل الكود إلى العملاء في ساعات.'),
    },
    {
      id: 'gamed', label: tx('Équipe qui triche', 'فريق يتلاعب'),
      rows: [row(201, 168), row(202, 240)],
      note: tx('0 % d’échec, cela semble parfait. Mais l’équipe publie très peu, et le code attend 9 jours. Un seul chiffre peut donc mentir. Il faut toujours lire les cinq ensemble.', 'نسبة فشل 0% تبدو مثالية، لكن الفريق ينشر قليلا جدا، وينتظر الكود 9 أيام. رقم واحد قد يكذب، لذا يجب قراءة الأرقام الخمسة معا.'),
    },
    {
      id: 'big', label: tx('Équipe qui livre rarement', 'فريق ينشر نادرا'),
      rows: [row(301, 168, { failed: true, recovery: 240 }), row(302, 6, { hotfix: true }), row(303, 240)],
      note: tx('Une grosse livraison a cassé, et il a fallu 4 heures pour réparer. C’est le problème vu dans la page « Livraisons ».', 'تعطل تسليم كبير، واحتاج الإصلاح إلى 4 ساعات. هذه هي المشكلة التي رأيتها في صفحة «التسليمات».'),
    },
  ],
  deeper: [
    tx('Ces cinq chiffres viennent des recherches de DORA. DORA conseille de ne pas en faire des objectifs imposés : sinon, les équipes trichent.', 'تأتي هذه الأرقام الخمسة من أبحاث DORA، التي تنصح بعدم جعلها أهدافا مفروضة، وإلا تلاعبت الفرق بها.'),
    tx('On compare un service avec lui-même dans le temps. Comparer deux applications très différentes n’a pas de sens.', 'نقارن الخدمة بنفسها عبر الزمن. مقارنة تطبيقين مختلفين جدا لا معنى لها.'),
    tx('C’est à l’équipe de décider ce qu’est un « échec », puis de garder la même règle.', 'على الفريق أن يحدد معنى «الفشل»، ثم يحافظ على القاعدة نفسها.'),
  ],
}

/* ---------- 7. Panne ---------- */

const URL = 'https://boutique.example'

const incident = {
  id: 'incident', type: 'incident',
  nav: tx('Panne', 'العطل'),
  title: tx('Panne à 2 h du matin', 'عطل في الساعة الثانية ليلا'),
  lead: tx(
    'Ceci est un exercice : le serveur n’est pas réel. Le site ne marche plus et vous devez le réparer. Choisissez une commande à chaque étape. Une mauvaise décision fait perdre du temps.',
    'هذا تمرين، والخادم ليس حقيقيا. الموقع لا يعمل ويجب عليك إصلاحه. اختر أمرا في كل مرحلة. القرار الخاطئ يضيع الوقت.',
  ),
  words: [
    word('Erreur 502', 'Le serveur web n’arrive pas à obtenir une réponse de l’application.', 'الخطأ 502', 'لا يستطيع خادم الويب الحصول على جواب من التطبيق.'),
    word('Logs', 'Le journal où l’application écrit ce qui lui arrive.', 'السجلات', 'الملف الذي يكتب فيه التطبيق ما يحدث له.'),
  ],
  source: { label: tx('Google SRE : superviser les systèmes', 'Google SRE: مراقبة الأنظمة'), url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
  host: 'boutique@serveur',
  startTime: '02:13',
  bestMinutes: 11,
  alert: tx('La boutique affiche des erreurs aux clients.', 'يعرض المتجر أخطاء للعملاء.'),
  start: 'symptom',
  nodes: {
    symptom: {
      question: tx('Que faites-vous en premier ?', 'ماذا تفعل أولا؟'),
      options: [
        {
          cmd: `curl -sI ${URL} | head -1`, does: tx('Regarder ce que voit un client', 'رؤية ما يراه العميل'), cost: 1, good: true, next: 'service',
          output: 'HTTP/2 502',
          comment: tx('D’abord, on confirme le problème. Le site répond 502 : l’application derrière ne répond pas.', 'أولا نؤكد المشكلة. يجيب الموقع بالرمز 502، فالتطبيق خلفه لا يجيب.'),
        },
        {
          cmd: 'sudo reboot', does: tx('Redémarrer tout le serveur', 'إعادة تشغيل الخادم كله'), cost: 8, good: false,
          output: 'Connection to serveur closed.\n(8 minutes plus tard : HTTP/2 502)',
          comment: tx('Vous avez agi sans comprendre. Vous avez perdu 8 minutes, et le site est toujours en panne.', 'تصرفت دون فهم، وخسرت 8 دقائق، والموقع ما زال معطلا.'),
        },
        {
          cmd: './rollback.sh v41', does: tx('Remettre la version d’avant', 'إعادة الإصدار السابق'), cost: 6, good: false,
          output: 'rollback: déjà en v41, aucun déploiement depuis 3 jours\nHTTP/2 502',
          comment: tx('Aucune nouvelle version n’a été installée. Le problème vient donc d’ailleurs.', 'لم يثبت أي إصدار جديد، فالمشكلة من مكان آخر.'),
        },
      ],
    },
    service: {
      question: tx('L’application ne répond pas. Que regardez-vous ?', 'التطبيق لا يجيب. ماذا تفحص؟'),
      options: [
        {
          cmd: 'systemctl status boutique --no-pager', does: tx('Voir si l’application tourne', 'معرفة هل يعمل التطبيق'), cost: 1, good: true, next: 'logs',
          output: '× boutique.service - Boutique API\n     Loaded: loaded (/etc/systemd/system/boutique.service; enabled)\n     Active: failed (Result: exit-code) since 02:11:42 UTC; 3min ago\n    Process: 2143 ExecStart=/usr/local/bin/boutique (code=exited, status=1/FAILURE)',
          comment: tx('L’application est arrêtée (failed). Il faut maintenant savoir pourquoi.', 'التطبيق متوقف (`failed`). يجب الآن معرفة السبب.'),
        },
        {
          cmd: 'uptime', does: tx('Voir si le serveur est surchargé', 'معرفة هل الخادم مضغوط'), cost: 2, good: false,
          output: ' 02:16:03 up 41 days,  3:22,  1 user,  load average: 0.08, 0.21, 0.30',
          comment: tx('Le serveur n’est pas surchargé. Cela n’explique pas la panne.', 'الخادم غير مضغوط، وهذا لا يفسر العطل.'),
        },
        {
          cmd: 'sudo nginx -t', does: tx('Vérifier la configuration du serveur web', 'فحص إعدادات خادم الويب'), cost: 2, good: false,
          output: 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful',
          comment: tx('La configuration est bonne. Le problème est ailleurs.', 'الإعدادات سليمة، والمشكلة في مكان آخر.'),
        },
      ],
    },
    logs: {
      question: tx('L’application s’est arrêtée. Et maintenant ?', 'توقف التطبيق. وماذا الآن؟'),
      options: [
        {
          cmd: 'journalctl -u boutique -n 3 --no-pager', does: tx('Lire les derniers logs de l’application', 'قراءة آخر سجلات التطبيق'), cost: 2, good: true, next: 'disk',
          output: "02:11:41 boutique[2143]: Error: ENOSPC: no space left on device, write\n02:11:41 boutique[2143]:   at /var/log/boutique/app.log\n02:11:42 systemd[1]: boutique.service: Failed with result 'exit-code'.",
          comment: tx('Voilà la cause : « no space left on device ». Le disque n’a plus de place.', 'هذا هو السبب: `no space left on device`. لم تبق مساحة في القرص.'),
        },
        {
          cmd: 'sudo systemctl restart boutique', does: tx('Redémarrer l’application', 'إعادة تشغيل التطبيق'), cost: 3, good: false,
          output: 'Job for boutique.service failed because the control process exited with error code.',
          comment: tx('Vous n’avez pas encore trouvé la cause, donc l’application s’arrête de nouveau.', 'لم تجد السبب بعد، لذلك يتوقف التطبيق من جديد.'),
        },
      ],
    },
    disk: {
      question: tx('Le disque semble plein. Que vérifiez-vous ?', 'يبدو أن القرص ممتلئ. ماذا تفحص؟'),
      options: [
        {
          cmd: 'df -h /var', does: tx('Voir la place libre sur le disque', 'رؤية المساحة الحرة في القرص'), cost: 1, good: true, next: 'usage',
          output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        40G   40G     0 100% /var',
          comment: tx('Le disque est plein à 100 %. Il faut trouver ce qui prend la place.', 'القرص ممتلئ بنسبة 100%. يجب إيجاد ما يأخذ المساحة.'),
        },
        {
          cmd: 'free -h', does: tx('Voir la mémoire RAM', 'رؤية ذاكرة RAM'), cost: 2, good: false,
          output: '               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       1.1Gi       5.2Gi        12Mi       1.5Gi       6.4Gi',
          comment: tx('La mémoire va bien. Le message parlait du disque, pas de la mémoire.', 'الذاكرة سليمة. كانت الرسالة تتحدث عن القرص وليس الذاكرة.'),
        },
      ],
    },
    usage: {
      question: tx('Qu’est-ce qui remplit le disque ?', 'ما الذي يملأ القرص؟'),
      options: [
        {
          cmd: 'sudo du -xh --max-depth=2 /var/log | sort -h | tail -3', does: tx('Lister les dossiers les plus gros', 'عرض أكبر المجلدات'), cost: 2, good: true, next: 'fix',
          output: '512M\t/var/log/journal\n38G\t/var/log/boutique\n39G\t/var/log',
          comment: tx('Les logs de la boutique prennent 38 Go. On a trouvé le responsable.', 'تأخذ سجلات المتجر 38 جيجابايت. وجدنا المسؤول.'),
        },
        {
          cmd: 'sudo rm -rf /var/log/*', does: tx('Supprimer tous les logs du serveur', 'حذف كل سجلات الخادم'), cost: 10, good: false,
          output: '(tous les logs du serveur sont perdus)',
          comment: tx('Dangereux : vous avez aussi supprimé les logs des autres services, et les informations sur la panne.', 'خطير: حذفت أيضا سجلات الخدمات الأخرى والمعلومات عن العطل.'),
        },
      ],
    },
    fix: {
      question: tx('Comment remettre le site en marche ?', 'كيف تعيد تشغيل الموقع؟'),
      options: [
        {
          cmd: 'sudo truncate -s 0 /var/log/boutique/app.log && sudo systemctl restart boutique', does: tx('Vider ce fichier de logs, puis redémarrer', 'إفراغ ملف السجلات هذا، ثم إعادة التشغيل'), cost: 3, good: true, next: 'verify',
          output: '(aucun message : la commande a réussi)',
          comment: tx('Bonne réparation rapide : de la place est libérée et l’application repart.', 'إصلاح سريع جيد: تحررت المساحة وعاد التطبيق للعمل.'),
        },
        {
          cmd: 'commander un disque de 200 Go', does: tx('Acheter un disque plus grand', 'شراء قرص أكبر'), cost: 25, good: false,
          output: 'Ticket ouvert. Délai estimé : 25 minutes.',
          comment: tx('Peut-être utile plus tard, mais les clients attendent maintenant.', 'قد يفيد لاحقا، لكن العملاء ينتظرون الآن.'),
        },
      ],
    },
    verify: {
      question: tx('Le problème est-il vraiment réglé ?', 'هل حلت المشكلة فعلا؟'),
      options: [
        {
          cmd: `curl -sI ${URL} | head -1`, does: tx('Regarder ce que voit un client', 'رؤية ما يراه العميل'), cost: 1, good: true, next: 'done',
          output: 'HTTP/2 200',
          comment: tx('Le code 200 veut dire que le site répond normalement. La panne est finie.', 'الرمز 200 يعني أن الموقع يجيب بشكل طبيعي. انتهى العطل.'),
        },
        {
          cmd: 'systemctl is-active boutique', does: tx('Voir si l’application tourne', 'معرفة هل يعمل التطبيق'), cost: 1, good: false,
          output: 'active',
          comment: tx('L’application tourne, mais cela ne prouve pas que les clients voient le site.', 'التطبيق يعمل، لكن هذا لا يثبت أن العملاء يرون الموقع.'),
        },
      ],
    },
    done: { end: true },
  },
  postmortem: [
    { term: tx('Ce que voyaient les clients', 'ما رآه العملاء'), text: tx('Une erreur 502 sur la boutique.', 'خطأ 502 في المتجر.') },
    { term: tx('La cause', 'السبب'), text: tx('Le disque était plein.', 'كان القرص ممتلئا.') },
    { term: tx('Pourquoi c’est arrivé', 'لماذا حدث'), text: tx('Les vieux logs n’étaient jamais supprimés, et aucune alerte ne surveillait le disque.', 'لم تكن السجلات القديمة تحذف أبدا، ولم يكن هناك تنبيه يراقب القرص.') },
    { term: tx('Ce qu’on change', 'ما سنغيره'), text: tx('Supprimer automatiquement les vieux logs, et ajouter une alerte avant que le disque soit plein.', 'حذف السجلات القديمة تلقائيا، وإضافة تنبيه قبل امتلاء القرص.') },
    { term: tx('Sans accuser', 'بدون اتهام'), text: tx('On ne cherche pas un coupable. On cherche comment éviter que cela recommence.', 'لا نبحث عن مذنب، بل عن طريقة لمنع تكرار ذلك.') },
  ],
}

/* ---------- 8. Exercice ---------- */

const quiz = {
  id: 'foundations-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Google SRE : culture du post-mortem', 'Google SRE: ثقافة تحليل الحوادث'), url: 'https://sre.google/sre-book/postmortem-culture/' },
  items: [
    { title: tx('Envoyer 200 changements d’un coup est plus sûr que 200 petites livraisons.', 'إرسال 200 تغيير دفعة واحدة أكثر أمانا من 200 تسليم صغير.'), ok: false, why: tx('Si ça casse, il faut chercher le bug parmi 200 changements.', 'إذا تعطل، يجب البحث عن الخطأ بين 200 تغيير.') },
    { title: tx('Il vaut mieux trouver un bug dans les tests que chez les clients.', 'من الأفضل اكتشاف الخطأ في الاختبارات بدلا من عند العملاء.'), ok: true, why: tx('Dans les tests, aucun client n’est touché.', 'في الاختبارات، لا يتأثر أي عميل.') },
    { title: tx('On peut refabriquer l’image pour la production sans risque.', 'يمكن إعادة صنع الصورة للإنتاج دون خطر.'), ok: false, why: tx('Les bibliothèques ont pu changer. On envoie l’image déjà testée.', 'قد تكون المكتبات تغيرت، لذلك نرسل الصورة التي تم اختبارها.') },
    { title: tx('Un canary montre d’abord la nouvelle version à peu de clients.', 'يعرض الكناري الإصدار الجديد على عدد قليل من العملاء أولا.'), ok: true, why: tx('Ainsi, un bug touche très peu de monde.', 'وهكذا يصيب الخطأ عددا قليلا جدا من الناس.') },
    { title: tx('Un taux d’échec de 0 % prouve que l’équipe travaille bien.', 'نسبة فشل 0% تثبت أن الفريق يعمل جيدا.'), ok: false, why: tx('Elle publie peut-être très peu. Il faut regarder les cinq chiffres.', 'ربما ينشر قليلا جدا. يجب النظر إلى الأرقام الخمسة.') },
    { title: tx('Pendant une panne, on regarde les logs avant de redémarrer.', 'أثناء العطل، نقرأ السجلات قبل إعادة التشغيل.'), ok: true, why: tx('Les logs expliquent souvent la cause de la panne.', 'غالبا ما تفسر السجلات سبب العطل.') },
  ],
}

export const foundationsModule = {
  id: 'foundations',
  title: tx('Comprendre DevOps', 'فهم DevOps'),
  notions: tx('Le chemin du code, les livraisons, le pipeline, les pannes', 'طريق الكود والتسليمات والمسار والأعطال'),
  slides: [definition, path, batch, pipeline, deploy, dora, incident, quiz],
}
