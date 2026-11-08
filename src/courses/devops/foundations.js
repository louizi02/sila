const tx = (fr, ar) => ({ fr, ar })

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

/* ---------- 1. Définition opérationnelle ---------- */

const definition = {
  id: 'what', type: 'rules', reveal: true,
  nav: tx('Le vrai sujet', 'الموضوع الحقيقي'),
  title: tx('DevOps n’est ni un outil, ni un poste', 'DevOps ليس أداة ولا وظيفة'),
  lead: tx(
    'Vous savez déjà écrire du code. Le métier commence quand ce code doit tourner en production, sans casser, et rester réparable à 3 h du matin.',
    'أنت تعرف كتابة الكود. تبدأ المهنة عندما يجب أن يعمل هذا الكود في الإنتاج دون أن ينهار، وأن يبقى قابلا للإصلاح في الساعة الثالثة ليلا.',
  ),
  source: { label: tx('Microsoft Learn : qu’est-ce que DevOps', 'Microsoft Learn: ما هو DevOps'), url: 'https://learn.microsoft.com/fr-fr/devops/what-is-devops' },
  items: [
    {
      title: tx('Le flux', 'التدفق'),
      why: tx(
        'L’unité de travail est le changement, du commit jusqu’au trafic réel. Un code fusionné mais pas déployé est du stock : il coûte, et il ne rapporte encore aucune information.',
        'وحدة العمل هي التغيير، من الإيداع إلى حركة المرور الحقيقية. الكود المدمج غير المنشور مخزون: يكلف ولا يعطي أي معلومة بعد.',
      ),
    },
    {
      title: tx('Le retour d’information', 'التغذية الراجعة'),
      why: tx(
        'Tests, supervision, incidents et retours clients sont le même mécanisme à des distances différentes. Plus le signal arrive tard, plus l’erreur coûte cher.',
        'الاختبارات والمراقبة والحوادث وآراء العملاء آلية واحدة على مسافات مختلفة. كلما تأخرت الإشارة، زادت كلفة الخطأ.',
      ),
    },
    {
      title: tx('La responsabilité', 'المسؤولية'),
      why: tx(
        'Les phases ne sont pas réservées à un rôle. Les développeurs répondent aussi de la stabilité en production, et l’exploitation intervient dès la conception, avec la sécurité et la conformité.',
        'المراحل ليست حكرا على دور واحد. يتحمل المطورون أيضا استقرار الإنتاج، ويتدخل فريق التشغيل منذ التصميم، مع الأمن والمطابقة.',
      ),
    },
    {
      title: tx('L’automatisation', 'الأتمتة'),
      why: tx(
        'On automatise ce qui doit être répétable et vérifiable. Une procédure manuelle de déploiement n’est pas seulement lente : elle est impossible à relire, à tester et à versionner.',
        'نؤتمت ما يجب أن يكون قابلا للتكرار والتحقق. إجراء النشر اليدوي ليس بطيئا فقط، بل لا يمكن مراجعته ولا اختباره ولا إدارة إصداراته.',
      ),
    },
    {
      title: tx('La mesure', 'القياس'),
      why: tx(
        'Sans mesure, « on va plus vite » est une opinion. Mais une mesure transformée en objectif se fait manipuler : vous le verrez avec les indicateurs DORA.',
        'بدون قياس تبقى عبارة «نحن أسرع» مجرد رأي. لكن المقياس الذي يتحول إلى هدف يتعرض للتلاعب، وسترى ذلك مع مؤشرات DORA.',
      ),
    },
  ],
}

/* ---------- 2. Taille des lots ---------- */

const batch = {
  id: 'batch', type: 'batch',
  nav: tx('Taille des lots', 'حجم الدفعات'),
  title: tx('Pourquoi les grosses livraisons cassent', 'لماذا تنهار عمليات التسليم الكبيرة'),
  lead: tx(
    'Votre équipe produit 200 changements par mois. Vous décidez seulement de leur regroupement. Déplacez les curseurs, puis cliquez sur « Livrer ce lot ».',
    'ينتج فريقك 200 تغيير في الشهر، وأنت تقرر فقط طريقة تجميعها. حرك المؤشرين، ثم انقر على «تسليم هذه الدفعة».',
  ),
  source: { label: tx('DORA : travailler par petits lots', 'DORA: العمل بدفعات صغيرة'), url: 'https://dora.dev/capabilities/working-in-small-batches/' },
  monthlyChanges: 200,
  presets: [
    { n: 1, label: tx('Un changement à la fois', 'تغيير واحد في كل مرة') },
    { n: 20, label: tx('20 par livraison', '20 في كل تسليم') },
    { n: 200, label: tx('Une livraison par mois', 'تسليم واحد في الشهر') },
  ],
  note: tx(
    'Le nombre total de défauts ne change pas : c’est toujours 200 × p. Ce qui change, c’est le travail pour les trouver : un échec se diagnostique parmi n changements. `git bisect` réduit cela à environ log₂(n) essais, mais seulement si chaque commit se construit et se teste. Ce modèle suppose des défauts indépendants ; en réalité, les changements interagissent, ce qui aggrave encore le gros lot. Repère DORA : un lot de plus d’une semaine est trop gros.',
    'العدد الإجمالي للعيوب لا يتغير، فهو دائما `200 × p`. الذي يتغير هو جهد العثور عليها: يشخص الفشل بين `n` تغييرا. يقلل `git bisect` ذلك إلى حوالي `log₂(n)` محاولة، لكن فقط إذا كان كل إيداع قابلا للبناء والاختبار. يفترض هذا النموذج عيوبا مستقلة، وفي الواقع تتفاعل التغييرات، مما يزيد الدفعة الكبيرة سوءا. مرجع DORA: الدفعة التي تتجاوز أسبوعا كبيرة جدا.',
  ),
}

/* ---------- 3. Pipeline ---------- */

const pipeline = {
  id: 'pipeline', type: 'pipeline',
  nav: tx('Pipeline', 'مسار التسليم'),
  title: tx('Où votre changement doit mourir', 'أين يجب أن يتوقف تغييرك'),
  lead: tx(
    'Un vrai workflow GitHub Actions. Choisissez à quel endroit la livraison échoue, lancez-la, et regardez ce qui a déjà été touché.',
    'سير عمل حقيقي في GitHub Actions. اختر مكان فشل التسليم، شغله، ولاحظ ما الذي تأثر فعلا.',
  ),
  source: { label: tx('Syntaxe des workflows GitHub Actions', 'صيغة سير العمل في GitHub Actions'), url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax' },
  sourceLabel: '.github/workflows/livraison.yml',
  lines: workflow.split('\n').map(yamlLine),
  initialState: { image: '—', staging: OLD, production: OLD },
  stages: [
    {
      id: 'push', label: 'push',
      steps: [{ id: 'push', line: 4, log: tx('Un push sur `main` déclenche le workflow pour le commit `c7e9a1f`.', 'يشغل الدفع إلى `main` سير العمل للإيداع `c7e9a1f`.') }],
    },
    {
      id: 'test', label: 'test',
      steps: [
        { id: 'test-ci', line: 11, log: tx('`npm ci` installe exactement les versions du fichier de verrouillage.', 'يثبت `npm ci` الإصدارات المحددة في ملف القفل بالضبط.') },
        { id: 'test-run', line: 12, log: tx('`npm test` : tous les tests passent.', '`npm test`: نجحت كل الاختبارات.') },
      ],
    },
    {
      id: 'image', label: 'image',
      steps: [{ id: 'image-build', line: 19, log: tx('L’image est construite une seule fois, publiée et identifiée par son digest.', 'تبنى الصورة مرة واحدة، وتنشر وتعرف ببصمتها `digest`.'), effect: { image: NEW } }],
    },
    {
      id: 'staging', label: 'staging',
      steps: [
        { id: 'staging-deploy', line: 27, log: tx('Déploiement de ce digest en staging.', 'نشر هذه البصمة في بيئة `staging`.'), effect: { staging: NEW } },
        { id: 'staging-verify', line: 28, log: tx('Vérification : `GET /sante` répond 200.', 'التحقق: يجيب `GET /sante` بالرمز 200.') },
      ],
    },
    {
      id: 'production', label: 'production',
      steps: [
        { id: 'prod-gate', line: 33, log: tx('Les règles de protection de l’environnement doivent passer avant le démarrage du job.', 'يجب أن تنجح قواعد حماية البيئة قبل بدء المهمة.') },
        { id: 'prod-deploy', line: 36, log: tx('Déploiement du même digest en production.', 'نشر البصمة نفسها في الإنتاج.'), effect: { production: NEW } },
        { id: 'prod-verify', line: 37, log: tx('Vérification : la production répond correctement.', 'التحقق: يجيب الإنتاج بشكل صحيح.') },
      ],
    },
  ],
  scenarios: [
    {
      id: 'ok', label: tx('Tout passe', 'كل شيء ينجح'),
      note: tx(
        'Comparez `staging` et `production` à la fin : même digest. L’image est construite une fois, puis promue. Un tag comme `latest` peut bouger, un digest non. Reconstruire pour la production, même depuis le même commit, livrerait un artefact jamais testé : les dépendances ou l’image de base ont pu changer.',
        'قارن `staging` و `production` في النهاية: البصمة نفسها. تبنى الصورة مرة واحدة ثم ترقى. وسم مثل `latest` قد يتغير، أما البصمة فلا. إعادة البناء للإنتاج، ولو من الإيداع نفسه، ستسلم حزمة لم تختبر أبدا، فقد تتغير التبعيات أو الصورة الأساسية.',
      ),
    },
    {
      id: 'test', label: tx('Échec aux tests', 'فشل في الاختبارات'),
      failAt: 'test-run', failLog: tx('`npm test` échoue. Les jobs qui dépendent de celui-ci sont ignorés.', 'يفشل `npm test`، وتتجاهل المهام التي تعتمد عليه.'),
      note: tx(
        'L’échec le moins cher : aucune image, aucun environnement touché, le développeur a encore le contexte en tête. Repères DORA : retour des tests rapides en quelques minutes, 10 minutes environ au maximum. Un build cassé passe avant tout le reste : s’il ne se corrige pas en quelques minutes, on annule le changement.',
        'أرخص فشل: لا صورة ولا بيئة متأثرة، وما زال المطور يتذكر السياق. مراجع DORA: نتيجة الاختبارات السريعة في دقائق، و10 دقائق تقريبا كحد أقصى. البناء المعطل أولوية على كل شيء، وإذا لم يصلح في دقائق يلغى التغيير.',
      ),
    },
    {
      id: 'staging', label: tx('Échec en staging', 'فشل في staging'),
      failAt: 'staging-verify', failLog: tx('`GET /sante` répond 500. Le job `production` est ignoré.', 'يجيب `GET /sante` بالرمز 500، وتتجاهل مهمة `production`.'),
      note: tx(
        'L’image existe et staging est cassé, mais la production reste en v41 : aucun client touché. Attention à la fausse confiance : staging n’a ni le volume, ni les données, ni le comportement de la production. Il réduit le risque, il ne l’annule pas.',
        'الصورة موجودة و `staging` معطل، لكن الإنتاج يبقى على `v41` ولا يتأثر أي عميل. احذر الثقة الزائفة: ليس في `staging` حجم الإنتاج ولا بياناته ولا سلوكه. إنه يقلل الخطر ولا يلغيه.',
      ),
    },
    {
      id: 'prod', label: tx('Échec en production', 'فشل في الإنتاج'),
      failAt: 'prod-verify', failLog: tx('La vérification échoue : la production répond mal.', 'فشل التحقق: الإنتاج يجيب بشكل خاطئ.'),
      after: [{ line: 39, log: tx('`failure()` déclenche le retour au digest précédent.', 'تشغل `failure()` الرجوع إلى البصمة السابقة.'), effect: { production: OLD } }],
      note: tx(
        'Le rollback remet l’ancien code en place, mais il ne remonte pas le temps : des requêtes ont déjà échoué, et si v42 a migré ou écrit des données, l’ancien code doit encore savoir les lire. C’est pour cela qu’on sépare les migrations en étapes compatibles (expand, puis contract), et qu’on limite l’exposition. C’est la diapositive suivante.',
        'يعيد التراجع الكود القديم، لكنه لا يعيد الزمن: فقد فشلت طلبات بالفعل، وإذا غيرت `v42` البيانات فيجب أن يبقى الكود القديم قادرا على قراءتها. لهذا نقسم عمليات الترحيل إلى مراحل متوافقة `expand` ثم `contract`، ونحد من التعرض للخطر. هذا موضوع الشريحة التالية.',
      ),
    },
  ],
}

/* ---------- 4. Stratégies de déploiement ---------- */

const step = (v1, v2, f, log) => ({ v1, v2, f, log })
const initial = step(10, 0, 0, tx('10 instances v41 reçoivent tout le trafic.', '10 نسخ `v41` تستقبل كل حركة المرور.'))

function rolling(bug) {
  const up = (k) => step(10 - k, k, k / 10, tx(
    `${k} instances remplacées. Leur sonde de disponibilité répond OK.`,
    `استبدلت ${k} نسخ، ومسبار الجاهزية لديها يجيب بنجاح.`,
  ))
  if (!bug) return [initial, up(2), up(4), up(6), up(8), step(0, 10, 1, tx('Toutes les instances sont en v42.', 'كل النسخ أصبحت `v42`.'))]
  const back = (k) => step(10 - k, k, k / 10, tx(`Retour arrière : il reste ${k} instances v42.`, `تراجع: بقيت ${k} نسخ من \`v42\`.`))
  return [
    initial, up(2), up(4),
    step(4, 6, 0.6, tx('Alerte : le taux d’erreur dépasse le seuil. Le déploiement s’arrête.', 'تنبيه: تجاوز معدل الأخطاء الحد، فيتوقف النشر.')),
    back(4), back(2),
    step(10, 0, 0, tx('Retour complet en v41.', 'رجوع كامل إلى `v41`.')),
  ]
}

function blueGreen(bug) {
  const ready = step(10, 10, 0, tx('10 instances v42 démarrent à côté, sans trafic. La capacité est doublée.', 'تبدأ 10 نسخ `v42` إلى جانبها بدون حركة مرور، فتتضاعف السعة.'))
  const smoke = step(10, 10, 0, tx('Tests de fumée OK : le défaut n’apparaît que sur du vrai trafic.', 'نجحت الاختبارات الأولية: العيب لا يظهر إلا مع حركة مرور حقيقية.'))
  const cut = step(10, 10, 1, tx('Bascule : 100 % du trafic passe en v42 d’un seul coup.', 'تحويل: تنتقل 100% من حركة المرور إلى `v42` دفعة واحدة.'))
  if (!bug) return [initial, ready, smoke, cut, step(0, 10, 1, tx('Après observation, les instances v41 sont retirées.', 'بعد المراقبة، تزال نسخ `v41`.'))]
  return [
    initial, ready, smoke, cut,
    step(10, 10, 1, tx('Alerte : 20 % des requêtes échouent pour tous les utilisateurs.', 'تنبيه: 20% من الطلبات تفشل لكل المستخدمين.')),
    step(10, 10, 0, tx('Retour : le routeur rebascule sur v41 presque instantanément.', 'تراجع: يعيد الموجه الحركة إلى `v41` فورا تقريبا.')),
    step(10, 0, 0, tx('Les instances v42 sont retirées pour analyse.', 'تزال نسخ `v42` للتحليل.')),
  ]
}

function canary(bug) {
  const small = step(10, 1, 0.05, tx('Une instance v42 reçoit 5 % du trafic.', 'تستقبل نسخة `v42` واحدة 5% من حركة المرور.'))
  if (!bug) {
    return [
      initial, small,
      step(8, 3, 0.25, tx('Canary sain face au groupe témoin : passage à 25 %.', 'الكناري سليم مقارنة بمجموعة الضبط: ننتقل إلى 25%.')),
      step(5, 5, 0.5, tx('Toujours sain : passage à 50 %.', 'ما زال سليما: ننتقل إلى 50%.')),
      step(0, 10, 1, tx('Passage à 100 %.', 'الانتقال إلى 100%.')),
    ]
  }
  return [
    initial, small,
    step(10, 1, 0.05, tx('Analyse : 20 % d’erreurs sur le canary, 0 % sur le groupe témoin.', 'التحليل: 20% أخطاء في الكناري و0% في مجموعة الضبط.')),
    step(10, 0, 0, tx('Arrêt automatique : le trafic revient à 100 % sur v41.', 'توقف تلقائي: تعود كل الحركة إلى `v41`.')),
  ]
}

const deploy = {
  id: 'deploy', type: 'deploy',
  nav: tx('Déploiement', 'النشر'),
  title: tx('Limiter le rayon d’impact', 'الحد من نطاق الضرر'),
  lead: tx(
    'La version v42 fait échouer 20 % des requêtes, mais elle démarre normalement. Comparez les stratégies et regardez le compteur de requêtes échouées.',
    'الإصدار `v42` يفشل في 20% من الطلبات، لكنه يبدأ بشكل طبيعي. قارن بين الاستراتيجيات ولاحظ عداد الطلبات الفاشلة.',
  ),
  source: { label: tx('Google SRE Workbook : canary', 'كتاب Google SRE: الكناري'), url: 'https://sre.google/workbook/canarying-releases/' },
  errorRate: 0.2,
  requestsPerStep: 1000,
  strategies: [
    {
      id: 'rolling', label: tx('Rolling', 'Rolling'), build: rolling,
      note: tx(
        'Une sonde de disponibilité vérifie que l’instance répond, pas que la version est bonne. Sans analyse des erreurs réelles, un rolling propage calmement un défaut logique. Pas de capacité en double, mais v41 et v42 coexistent : elles doivent être compatibles entre elles et avec la base de données.',
        'يتحقق مسبار الجاهزية من أن النسخة تجيب، لا من أن الإصدار سليم. بدون تحليل الأخطاء الحقيقية، ينشر `rolling` العيب المنطقي بهدوء. لا توجد سعة مضاعفة، لكن `v41` و `v42` تتعايشان، فيجب أن تتوافقا فيما بينهما ومع قاعدة البيانات.',
      ),
    },
    {
      id: 'bluegreen', label: tx('Blue-green', 'Blue-green'), build: blueGreen,
      note: tx(
        'Le retour arrière du code est un simple changement de routage, mais il faut doubler les ressources et tout le monde est exposé au moment de la bascule. C’est aussi une comparaison avant/après, plus faible qu’un groupe témoin : le temps qui passe peut expliquer le changement.',
        'التراجع عن الكود مجرد تغيير في التوجيه، لكنه يتطلب مضاعفة الموارد، ويتعرض الجميع للخطر عند التحويل. وهو أيضا مقارنة قبل وبعد، أضعف من مجموعة ضبط، لأن مرور الوقت قد يفسر التغيير.',
      ),
    },
    {
      id: 'canary', label: tx('Canary', 'Canary'), build: canary,
      note: tx(
        'Erreur globale = `f × e` : 5 % du trafic × 20 % d’erreurs = 1 %. Mais canary et témoin partagent souvent caches et bases : une migration destructive touche tout le monde, même à 1 % de trafic. Le canary demande aussi assez de trafic pour que la comparaison ait un sens. Ces chiffres viennent d’un modèle simplifié : 1 000 requêtes par étape, charge uniforme.',
        'الخطأ الإجمالي `f × e`: 5% من الحركة × 20% أخطاء = 1%. لكن الكناري ومجموعة الضبط يتشاركان غالبا الذاكرة المؤقتة وقواعد البيانات، فالترحيل المدمر يصيب الجميع حتى مع 1% من الحركة. ويحتاج الكناري أيضا إلى حركة كافية لتكون المقارنة ذات معنى. هذه الأرقام من نموذج مبسط: 1000 طلب لكل مرحلة وحمل موحد.',
      ),
    },
  ],
}

/* ---------- 5. DORA ---------- */

const row = (id, lead, extra = {}) => ({ id, lead, failed: false, hotfix: false, recovery: 45, ...extra })

const dora = {
  id: 'dora', type: 'dora',
  nav: tx('Mesurer', 'القياس'),
  title: tx('Les cinq indicateurs DORA, et comment les tromper', 'مؤشرات DORA الخمسة وكيف نخدعها'),
  lead: tx(
    'Deux semaines de déploiements d’un même service (données d’exemple). Marquez un déploiement en échec ou non planifié, et suivez le lien vers ce qu’il change.',
    'أسبوعان من عمليات نشر خدمة واحدة (بيانات مثال). حدد عملية نشر فاشلة أو غير مخطط لها، وتتبع الرابط إلى ما تغيره.',
  ),
  source: { label: tx('DORA : indicateurs de livraison', 'DORA: مؤشرات التسليم'), url: 'https://dora.dev/guides/dora-metrics-four-keys/' },
  weeks: 2,
  presets: [
    {
      id: 'small', label: tx('Petits lots', 'دفعات صغيرة'),
      rows: [row(101, 4), row(102, 6), row(103, 3), row(104, 5), row(105, 8, { failed: true, recovery: 18 }), row(106, 1, { hotfix: true }), row(107, 4), row(108, 7), row(109, 3), row(110, 5)],
      note: tx(
        'Un échec, réparé en 18 minutes, et un correctif non planifié. L’équipe se trompe, mais vite et à petite échelle. Attention à ne pas confondre : le taux d’échec compte les déploiements qui exigent une intervention immédiate, le taux de reprise compte les déploiements non planifiés causés par un incident.',
        'فشل واحد أصلح في 18 دقيقة، وتصحيح واحد غير مخطط له. يخطئ الفريق، لكن بسرعة وعلى نطاق صغير. لا تخلط بين المؤشرين: نسبة الفشل تعد عمليات النشر التي تتطلب تدخلا فوريا، ونسبة إعادة العمل تعد عمليات النشر غير المخطط لها الناتجة عن حادث.',
      ),
    },
    {
      id: 'gamed', label: tx('Manipulé : 0 % d’échec', 'تلاعب: 0% فشل'),
      rows: [row(201, 168), row(202, 240)],
      note: tx(
        'Le taux d’échec est parfait : 0 %. Une équipe à qui l’on impose cet objectif a appris à déployer moins, pendant que le délai explose à plusieurs jours. C’est pourquoi DORA recommande de ne pas transformer ces indicateurs en objectifs, de les lire ensemble, et de ne pas comparer des services différents.',
        'نسبة الفشل مثالية: 0%. الفريق الذي يفرض عليه هذا الهدف يتعلم تقليل النشر، بينما تتضخم مدة التسليم إلى عدة أيام. لهذا يوصي DORA بعدم تحويل هذه المؤشرات إلى أهداف، وبقراءتها معا، وبعدم مقارنة خدمات مختلفة.',
      ),
    },
    {
      id: 'big', label: tx('Gros lots, sans maquillage', 'دفعات كبيرة بلا تجميل'),
      rows: [row(301, 168, { failed: true, recovery: 240 }), row(302, 6, { hotfix: true }), row(303, 240)],
      note: tx(
        'Peu de déploiements, un échec sur trois, quatre heures de réparation. Chaque indicateur raconte la même histoire que le simulateur des lots. Le seuil exact d’un « échec » n’est pas fixé par DORA : votre équipe doit le définir et s’y tenir.',
        'عمليات نشر قليلة، وفشل في واحدة من ثلاث، وأربع ساعات إصلاح. يحكي كل مؤشر القصة نفسها التي رأيتها في محاكي الدفعات. لا يحدد DORA الحد الدقيق لكلمة «فشل»، فيجب أن يحدده فريقك ويلتزم به.',
      ),
    },
  ],
}

/* ---------- 6. Incident ---------- */

const HOST = 'boutique@prod-1'
const URL = 'https://boutique.example'

const incident = {
  id: 'incident', type: 'incident',
  nav: tx('Astreinte', 'المناوبة'),
  title: tx('Vous êtes d’astreinte', 'أنت في المناوبة'),
  lead: tx(
    'Scénario simulé. Chaque minute compte pour les clients : choisissez la prochaine commande comme si le serveur était réel. Une action précipitée peut coûter cher.',
    'سيناريو محاكى. كل دقيقة مهمة للعملاء: اختر الأمر التالي كما لو كان الخادم حقيقيا. والتصرف المتسرع قد يكلف كثيرا.',
  ),
  source: { label: tx('Google SRE : superviser les systèmes', 'Google SRE: مراقبة الأنظمة'), url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
  host: HOST,
  startTime: '02:13',
  bestMinutes: 11,
  alert: tx('Plus de 5 % des requêtes échouent sur la boutique.', 'أكثر من 5% من طلبات المتجر تفشل.'),
  start: 'symptom',
  nodes: {
    symptom: {
      question: tx('Vous venez d’être réveillé. Que faites-vous d’abord ?', 'لقد أيقظك التنبيه للتو. ماذا تفعل أولا؟'),
      options: [
        {
          cmd: `curl -sI ${URL} | head -1`, cost: 1, good: true, next: 'service',
          output: 'HTTP/2 502',
          comment: tx('Confirmer le symptôme vu par l’utilisateur. Un 502 vient du proxy : il n’obtient pas de réponse valide de l’application.', 'تأكيد العرض كما يراه المستخدم. الرمز 502 يأتي من الوسيط: لا يحصل على جواب صحيح من التطبيق.'),
        },
        {
          cmd: 'sudo reboot', cost: 8, good: false,
          output: 'Connection to prod-1 closed by remote host.\n(8 minutes plus tard : HTTP/2 502)',
          comment: tx('Vous avez agi sans diagnostic, perdu huit minutes et effacé l’état de la machine, alors que l’incident continue.', 'تصرفت دون تشخيص، وخسرت ثماني دقائق ومسحت حالة الجهاز، والحادث مستمر.'),
        },
        {
          cmd: './rollback.sh v41', cost: 6, good: false,
          output: 'rollback: déjà en v41, aucun déploiement depuis 3 jours\nHTTP/2 502',
          comment: tx('Le rollback est souvent le bon réflexe, mais seulement si un changement récent existe. Ici, rien n’a été déployé.', 'التراجع غالبا تصرف صحيح، لكن فقط عند وجود تغيير حديث. وهنا لم ينشر أي شيء.'),
        },
      ],
    },
    service: {
      question: tx('Le proxy répond 502. Où regardez-vous ?', 'الوسيط يجيب 502. أين تنظر؟'),
      options: [
        {
          cmd: 'systemctl status boutique --no-pager', cost: 1, good: true, next: 'logs',
          output: '× boutique.service - Boutique API\n     Loaded: loaded (/etc/systemd/system/boutique.service; enabled)\n     Active: failed (Result: exit-code) since 02:11:42 UTC; 3min ago\n    Process: 2143 ExecStart=/usr/local/bin/boutique (code=exited, status=1/FAILURE)',
          comment: tx('Le service derrière le proxy est arrêté, avec une erreur à sa sortie. Il faut maintenant savoir pourquoi.', 'الخدمة خلف الوسيط متوقفة بخطأ عند خروجها. يجب الآن معرفة السبب.'),
        },
        {
          cmd: 'uptime', cost: 2, good: false,
          output: ' 02:16:03 up 41 days,  3:22,  1 user,  load average: 0.08, 0.21, 0.30',
          comment: tx('Charge faible : ce n’est pas une surcharge. Information utile, mais elle n’explique pas le 502.', 'الحمل منخفض، فالمشكلة ليست ضغطا زائدا. معلومة مفيدة لكنها لا تفسر 502.'),
        },
        {
          cmd: 'sudo nginx -t', cost: 2, good: false,
          output: 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful',
          comment: tx('La configuration est valide, et personne ne l’a changée. Le problème est plus loin.', 'الإعدادات صحيحة ولم يغيرها أحد. المشكلة أبعد من ذلك.'),
        },
      ],
    },
    logs: {
      question: tx('Le service est tombé. Quelle est la suite ?', 'الخدمة توقفت. ما الخطوة التالية؟'),
      options: [
        {
          cmd: 'journalctl -u boutique -n 3 --no-pager', cost: 2, good: true, next: 'disk',
          output: "02:11:41 boutique[2143]: Error: ENOSPC: no space left on device, write\n02:11:41 boutique[2143]:   at /var/log/boutique/app.log\n02:11:42 systemd[1]: boutique.service: Failed with result 'exit-code'.",
          comment: tx('Voilà la cause immédiate : plus de place pour écrire. Lire les journaux avant de redémarrer, c’est la différence entre réparer et espérer.', 'هذا هو السبب المباشر: لا توجد مساحة للكتابة. قراءة السجلات قبل إعادة التشغيل هي الفرق بين الإصلاح والأمل.'),
        },
        {
          cmd: 'sudo systemctl restart boutique', cost: 3, good: false,
          output: 'Job for boutique.service failed because the control process exited with error code.',
          comment: tx('Redémarrer sans connaître la cause : le service retombe immédiatement.', 'إعادة التشغيل دون معرفة السبب: تتوقف الخدمة فورا من جديد.'),
        },
      ],
    },
    disk: {
      question: tx('ENOSPC : que vérifiez-vous ?', 'خطأ ENOSPC: ماذا تتحقق منه؟'),
      options: [
        {
          cmd: 'df -h /var', cost: 1, good: true, next: 'usage',
          output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        40G   40G     0 100% /var',
          comment: tx('La partition est pleine. Reste à trouver ce qui la remplit, sans supprimer au hasard.', 'القسم ممتلئ. يبقى العثور على ما يملؤه دون حذف عشوائي.'),
        },
        {
          cmd: 'free -h', cost: 2, good: false,
          output: '               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       1.1Gi       5.2Gi        12Mi       1.5Gi       6.4Gi',
          comment: tx('ENOSPC parle du disque, pas de la mémoire.', 'يتحدث ENOSPC عن القرص وليس الذاكرة.'),
        },
      ],
    },
    usage: {
      question: tx('Comment trouver le responsable ?', 'كيف تجد المسؤول عن الامتلاء؟'),
      options: [
        {
          cmd: 'sudo du -xh --max-depth=2 /var/log | sort -h | tail -3', cost: 2, good: true, next: 'fix',
          output: '512M\t/var/log/journal\n38G\t/var/log/boutique\n39G\t/var/log',
          comment: tx('Un seul dossier de journaux prend 38 Go. `-x` reste sur ce système de fichiers, et le tri met les plus gros à la fin.', 'مجلد سجلات واحد يأخذ 38 جيجابايت. الخيار `-x` يبقى في نظام الملفات هذا، والترتيب يضع الأكبر في النهاية.'),
        },
        {
          cmd: 'sudo rm -rf /var/log/*', cost: 10, good: false,
          output: '(tous les journaux système sont perdus)',
          comment: tx('Vous libérez de la place en détruisant les preuves de l’incident, et ceux des autres services. Heureusement, ce n’est qu’une simulation.', 'حررت مساحة بتدمير أدلة الحادث وسجلات الخدمات الأخرى. لحسن الحظ هذه مجرد محاكاة.'),
        },
      ],
    },
    fix: {
      question: tx('Comment rétablir le service maintenant ?', 'كيف تعيد الخدمة الآن؟'),
      options: [
        {
          cmd: 'sudo truncate -s 0 /var/log/boutique/app.log && sudo systemctl restart boutique', cost: 3, good: true, next: 'verify',
          output: '(aucune sortie : commande réussie)',
          comment: tx('Atténuation rapide. Vider le fichier est plus sûr que `rm` : un fichier supprimé mais encore ouvert par un processus continue d’occuper le disque.', 'تخفيف سريع. إفراغ الملف أكثر أمانا من `rm`، لأن الملف المحذوف الذي ما زالت عملية تفتحه يظل يشغل القرص.'),
        },
        {
          cmd: 'commander un disque de 200 Go', cost: 25, good: false,
          output: 'Ticket ouvert. Délai estimé : 25 minutes.',
          comment: tx('Peut-être utile plus tard, mais les clients attendent. D’abord atténuer, ensuite résoudre durablement.', 'قد يفيد لاحقا، لكن العملاء ينتظرون. خفف الضرر أولا، ثم عالج المشكلة نهائيا.'),
        },
      ],
    },
    verify: {
      question: tx('Pouvez-vous clôturer l’incident ?', 'هل يمكنك إغلاق الحادث؟'),
      options: [
        {
          cmd: `curl -sI ${URL} | head -1`, cost: 1, good: true, next: 'done',
          output: 'HTTP/2 200',
          comment: tx('On vérifie ce que voit l’utilisateur, comme au début de l’incident.', 'نتحقق مما يراه المستخدم، كما في بداية الحادث.'),
        },
        {
          cmd: 'systemctl is-active boutique', cost: 1, good: false,
          output: 'active',
          comment: tx('Un processus actif ne prouve pas que le service répond aux utilisateurs.', 'العملية النشطة لا تثبت أن الخدمة تجيب المستخدمين.'),
        },
      ],
    },
    done: { end: true },
  },
  postmortem: [
    { term: tx('Symptôme', 'العرض'), text: tx('Réponses 502 sur la boutique.', 'إجابات 502 في المتجر.') },
    { term: tx('Cause immédiate', 'السبب المباشر'), text: tx('La partition /var était pleine à 100 %.', 'كان القسم /var ممتلئا بنسبة 100%.') },
    { term: tx('Causes de fond', 'الأسباب العميقة'), text: tx('Aucune rotation des journaux de l’application, et aucune alerte sur la saturation du disque.', 'لا يوجد تدوير لسجلات التطبيق، ولا تنبيه على امتلاء القرص.') },
    { term: tx('Actions', 'الإجراءات'), text: tx('Mettre en place la rotation, prévoir l’épuisement du disque avant qu’il arrive, et ajouter cette procédure au runbook.', 'إعداد تدوير السجلات، وتوقع امتلاء القرص قبل حدوثه، وإضافة هذا الإجراء إلى دليل التشغيل.') },
    { term: tx('Sans blâme', 'بدون لوم'), text: tx('La question n’est pas « qui a oublié ? », mais « pourquoi le système a-t-il permis cela ? ».', 'السؤال ليس «من نسي؟» بل «لماذا سمح النظام بذلك؟».') },
  ],
}

/* ---------- 7. Exercice ---------- */

const quiz = {
  id: 'foundations-quiz', type: 'rules',
  nav: tx('Décisions', 'القرارات'),
  title: tx('Vrai ou faux, en situation réelle', 'صحيح أم خطأ في مواقف حقيقية'),
  lead: tx('Ce sont des affirmations entendues en équipe. Cliquez pour trancher.', 'هذه عبارات تسمع داخل الفرق. انقر للحسم.'),
  source: { label: tx('Google SRE : culture du post-mortem', 'Google SRE: ثقافة تحليل الحوادث'), url: 'https://sre.google/sre-book/postmortem-culture/' },
  items: [
    { title: tx('« Notre taux d’échec a baissé depuis qu’on déploie une fois par mois, on s’est améliorés. »', '«انخفضت نسبة الفشل منذ أصبحنا ننشر مرة في الشهر، لقد تحسنا.»'), ok: false, why: tx('Un indicateur seul ne prouve rien : le délai et la fréquence se sont dégradés.', 'مؤشر واحد لا يثبت شيئا: فالمدة والتكرار ساءا.') },
    { title: tx('« Même commit, donc on peut reconstruire l’image pour la production. »', '«الإيداع نفسه، إذن يمكن إعادة بناء الصورة للإنتاج.»'), ok: false, why: tx('Les dépendances et l’image de base peuvent changer. On promeut le digest déjà testé.', 'قد تتغير التبعيات والصورة الأساسية. نرقي البصمة التي تم اختبارها.') },
    { title: tx('« Un canary à 1 % nous protège d’une migration destructive. »', '«الكناري بنسبة 1% يحمينا من ترحيل مدمر.»'), ok: false, why: tx('La base est souvent partagée : la migration touche tout le monde.', 'قاعدة البيانات مشتركة غالبا، فيصيب الترحيل الجميع.') },
    { title: tx('« Le blue-green annule vite le code, pas les données. »', '«يتراجع blue-green عن الكود بسرعة، لا عن البيانات.»'), ok: true, why: tx('Rebasculer le routeur ne défait pas ce que la version a déjà écrit.', 'إعادة توجيه الحركة لا تلغي ما كتبه الإصدار بالفعل.') },
    { title: tx('« On réveille quelqu’un quand le CPU dépasse 80 %. »', '«نوقظ شخصا عندما يتجاوز المعالج 80%.»'), ok: false, why: tx('On réveille pour un symptôme urgent, actionnable et visible des utilisateurs. Le CPU sert plutôt au diagnostic.', 'نوقظ لعرض عاجل قابل للتصرف ويراه المستخدمون. أما المعالج فيفيد في التشخيص.') },
    { title: tx('« Si une alerte se résout toujours par la même commande, il faut l’automatiser. »', '«إذا كان التنبيه يحل دائما بالأمر نفسه، فيجب أتمتته.»'), ok: true, why: tx('Une alerte doit demander du jugement humain. Une réponse mécanique doit devenir du code.', 'يجب أن يتطلب التنبيه حكما بشريا. والجواب الآلي يجب أن يصبح كودا.') },
  ],
}

export const foundationsModule = {
  id: 'foundations',
  title: tx('Qu’est-ce que DevOps, vraiment', 'ما هو DevOps حقا'),
  notions: tx('Flux, taille des lots, pipeline, rayon d’impact, DORA, astreinte', 'التدفق وحجم الدفعات ومسار التسليم ونطاق الضرر و DORA والمناوبة'),
  slides: [definition, batch, pipeline, deploy, dora, incident, quiz],
}
