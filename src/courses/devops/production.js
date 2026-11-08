import { L, MEANING, S, ask, bad, card, flow, good, incident, module, no, opt, page, plain, pm, quiz, stage, tx, v, word, yes } from './helpers.js'

const K = 'https://kubernetes.io/docs/'
const SRE = 'https://sre.google/'

/* ---------- 13 Kubernetes ---------- */

const k8sLoop = page('steps', 'k8s-loop', ['Le principe', 'المبدأ'], ['Vous décrivez, Kubernetes s’en occupe', 'أنت تصف و Kubernetes يتكفل'],
  ['Vous dites : « je veux 3 copies ». Kubernetes vérifie sans arrêt que c’est vrai, et il corrige si ce n’est plus le cas.', 'تقول: «أريد 3 نسخ». ويتحقق Kubernetes باستمرار من ذلك، ويصلح إذا لم يعد صحيحا.'],
  ['Kubernetes : concepts', 'Kubernetes: المفاهيم', K + 'concepts/'],
  { stages: [
    stage('a', 'kubectl apply', 'kubectl apply', 'YAML', 'Vous envoyez l’état souhaité au cluster.', 'ترسل الحالة المطلوبة إلى المجموعة.', 'kubectl apply -f boutique.yaml'),
    stage('b', 'API', 'API', 'etcd', 'Le serveur API enregistre ce que vous voulez.', 'يسجل خادم API ما تريده.'),
    stage('c', 'Contrôleur', 'المتحكم', 'Deployment', 'Il compare ce qui existe avec ce que vous voulez, et il demande les Pods manquants.', 'يقارن الموجود بالمطلوب، ويطلب `Pods` الناقصة.'),
    stage('d', 'Scheduler', 'المجدول', 'node', 'Il choisit une machine (un node) pour chaque Pod.', 'يختار جهازا `node` لكل `Pod`.'),
    stage('e', 'kubelet', 'kubelet', 'Pod', 'Sur la machine, kubelet démarre les conteneurs et les surveille.', 'يشغل `kubelet` الحاويات على الجهاز ويراقبها.'),
    stage('f', 'Correction', 'التصحيح', 'boucle', 'Si un Pod disparaît, le contrôleur en recrée un. La boucle ne s’arrête jamais.', 'إذا اختفى `Pod`، ينشئ المتحكم آخر، والحلقة لا تتوقف أبدا.'),
  ] })

const deployment = flow('deployment', ['Deployment', 'Deployment'], ['Lire un Deployment', 'قراءة Deployment'],
  ['C’est le fichier le plus utilisé de Kubernetes. Chaque ligne a un rôle.', 'هذا أكثر ملفات Kubernetes استعمالا، ولكل سطر دور.'],
  ['Kubernetes : Deployments', 'Kubernetes: Deployments', K + 'concepts/workloads/controllers/deployment/'],
  { sourceLabel: 'boutique.yaml', outputLabel: MEANING,
    words: [word('Pod', 'Le plus petit élément : un ou plusieurs conteneurs ensemble.', 'Pod', 'أصغر عنصر: حاوية أو عدة حاويات معا.'), word('Deployment', 'Garde le bon nombre de Pods et gère les mises à jour.', 'Deployment', 'يحافظ على عدد `Pods` الصحيح ويدير التحديثات.'), word('Service', 'Une adresse stable vers des Pods qui changent.', 'Service', 'عنوان ثابت نحو `Pods` متغيرة.')],
    variants: [v('f', ['Le fichier', 'الملف'], ['Par défaut, une mise à jour remplace les Pods petit à petit. `kubectl rollout undo` revient à la version d’avant.', 'افتراضيا، يعوض التحديث `Pods` شيئا فشيئا، ويعيد `kubectl rollout undo` الإصدار السابق.'],
      [L('apiVersion: apps/v1'), L('kind: Deployment'), L('metadata: { name: boutique }'), L('spec:'), L('  replicas: 3', 'a'), L('  selector:'), L('    matchLabels: { app: boutique }', 'b'), L('  template:'), L('    metadata:'), L('      labels: { app: boutique }', 'c'), L('    spec:'), L('      containers:'), L('      - name: web'), L('        image: boutique@sha256:9f2c6a…', 'd')],
      [good(tx('Je veux 3 Pods.', 'أريد 3 `Pods`.'), 'a'), plain(tx('Quels Pods me concernent.', 'أي `Pods` تخصني.'), 'b'), plain(tx('L’étiquette de chaque Pod.', 'وسم كل `Pod`.'), 'c'), plain(tx('L’image exacte à lancer.', 'الصورة المحددة للتشغيل.'), 'd')])],
    deeper: [tx('Par défaut : `maxSurge: 25%` et `maxUnavailable: 25%`.', 'افتراضيا: `maxSurge: 25%` و `maxUnavailable: 25%`.'), tx('Chaque changement du modèle crée un nouveau ReplicaSet. Les anciens servent au rollback.', 'كل تغيير في القالب ينشئ `ReplicaSet` جديدا، وتستعمل القديمة للتراجع.')] })

const probeLines = [L('readinessProbe:', 'r'), L('  httpGet: { path: /ready, port: 3000 }'), L('livenessProbe:', 'l'), L('  httpGet: { path: /healthz, port: 3000 }')]
const probes = flow('probes', ['Sondes', 'المسابير'], ['Prêt, ou à redémarrer ?', 'جاهز أم يجب إعادة تشغيله؟'],
  ['Kubernetes interroge régulièrement vos Pods. La sonde qui échoue change complètement ce qui se passe. Cliquez sur « Lancer ».', 'يسأل Kubernetes `Pods` بانتظام، والمسبار الفاشل يغير ما يحدث تماما. انقر على «تشغيل».'],
  ['Kubernetes : sondes', 'Kubernetes: المسابير', K + 'concepts/configuration/liveness-readiness-startup-probes/'],
  { sourceLabel: 'boutique.yaml',
    words: [word('Readiness', 'Le Pod peut-il recevoir des clients ?', 'Readiness', 'هل يستطيع `Pod` استقبال العملاء؟'), word('Liveness', 'Le Pod est-il bloqué ?', 'Liveness', 'هل `Pod` عالق؟')],
    variants: [
      v('r', ['Readiness échoue', 'فشل Readiness'], ['Le Pod continue de tourner, mais il ne reçoit plus de clients. Il n’est pas redémarré.', 'يواصل `Pod` العمل، لكنه لا يستقبل العملاء، ولا تعاد عملية تشغيله.'], probeLines, [], { hideBrowser: true, trace: [S(2, tx('`/ready` répond une erreur.', 'يجيب `/ready` بخطأ.')), S(1, tx('Le Pod est retiré du trafic.', 'يزال `Pod` من الحركة.')), S(2, tx('`/ready` répond OK : le Pod reçoit à nouveau du trafic.', 'يجيب `/ready` بنجاح: يستقبل `Pod` الحركة من جديد.'))] }),
      v('l', ['Liveness échoue', 'فشل Liveness'], ['Après plusieurs échecs, le conteneur est redémarré. Ne vérifiez pas la base de données ici : si elle tombe, tous vos Pods redémarrent en boucle.', 'بعد عدة إخفاقات تعاد عملية تشغيل الحاوية. لا تفحص قاعدة البيانات هنا، فإذا تعطلت تدخل كل `Pods` في إعادة تشغيل متكررة.'], probeLines, [], { hideBrowser: true, trace: [S(4, tx('`/healthz` ne répond plus.', 'لم يعد `/healthz` يجيب.')), S(4, tx('Plusieurs échecs de suite.', 'عدة إخفاقات متتالية.')), S(3, tx('kubelet redémarre le conteneur.', 'يعيد `kubelet` تشغيل الحاوية.'))] }),
    ] })

const resources = flow('resources', ['Ressources', 'الموارد'], ['CPU et mémoire : deux réactions différentes', 'المعالج والذاكرة: ردان مختلفان'],
  ['On dit à Kubernetes ce qu’il faut réserver (requests), et le maximum permis (limits).', 'نخبر Kubernetes بما يجب حجزه `requests` وبالحد الأقصى `limits`.'],
  ['Kubernetes : ressources', 'Kubernetes: الموارد', K + 'concepts/configuration/manage-resources-containers/'],
  { sourceLabel: 'boutique.yaml', outputLabel: tx('Ce qui se passe', 'ما يحدث'),
    words: [word('Request', 'Ce que Kubernetes réserve pour choisir la machine.', 'Request', 'ما يحجزه Kubernetes لاختيار الجهاز.'), word('Limit', 'Le maximum que le conteneur peut utiliser.', 'Limit', 'أقصى ما تستعمله الحاوية.'), word('OOMKilled', 'Tué car il a utilisé trop de mémoire.', 'OOMKilled', 'قتل لأنه استعمل ذاكرة كثيرة.')],
    variants: [
      v('cpu', ['Trop de CPU', 'معالج زائد'], ['Le conteneur n’est pas tué. Il est ralenti, ce qui peut causer des lenteurs difficiles à comprendre.', 'لا تقتل الحاوية بل تبطأ، مما قد يسبب بطئا يصعب فهمه.'], [L('limits: { cpu: "500m" }', 'a')], [plain(tx('Le conteneur est ralenti.', 'تبطأ الحاوية.'), 'a')]),
      v('mem', ['Trop de mémoire', 'ذاكرة زائدة'], ['Le système tue le conteneur quand il manque de mémoire.', 'يقتل النظام الحاوية عند نقص الذاكرة.'], [L('limits: { memory: "512Mi" }', 'a')], [bad('Last State: Terminated  Reason: OOMKilled', 'a')]),
    ] })

const k8sIncident = incident('k8s-incident', ['Panne', 'العطل'], ['Le Pod redémarre sans arrêt', '`Pod` يعيد التشغيل باستمرار'],
  ['Exercice simulé. Après une mise à jour, un Pod affiche CrashLoopBackOff. Cela veut dire : il plante, Kubernetes le relance, il replante.', 'تمرين محاكى. بعد التحديث يعرض `Pod` الحالة `CrashLoopBackOff`، أي يتعطل ويعيد Kubernetes تشغيله ثم يتعطل.'],
  ['Kubernetes : déboguer des Pods', 'Kubernetes: تصحيح Pods', K + 'tasks/debug/debug-application/debug-pods/'],
  { host: 'admin@cluster', startTime: '13:20', alert: tx('boutique-7c9 : CrashLoopBackOff', 'boutique-7c9: CrashLoopBackOff'), start: 'a',
    nodes: {
      a: ask('Que regardez-vous d’abord ?', 'ماذا تفحص أولا؟', [
        opt('kubectl describe pod boutique-7c9', 'Voir l’état et les événements du Pod', 'رؤية حالة `Pod` وأحداثه', 2, true, 'b', 'Last State: Terminated\n  Reason: OOMKilled\n  Exit Code: 137\nLimits: memory: 128Mi', 'Le conteneur est tué car il dépasse sa limite de mémoire.', 'تقتل الحاوية لأنها تتجاوز حد الذاكرة.'),
        opt('kubectl delete pod boutique-7c9', 'Supprimer le Pod', 'حذف `Pod`', 3, false, undefined, 'pod "boutique-7c9" deleted\nboutique-8d1  CrashLoopBackOff', 'Le Deployment en recrée un, avec le même problème.', 'ينشئ `Deployment` آخر بالمشكلة نفسها.'),
      ]),
      b: ask('Quelle est la bonne suite ?', 'ما هي الخطوة الصحيحة؟', [
        opt('kubectl top pod -l app=boutique', 'Mesurer la vraie consommation', 'قياس الاستهلاك الحقيقي', 2, true, 'c', 'boutique-a12   240Mi', 'Les Pods sains utilisent 240 Mi. La limite de 128 Mi est trop basse.', 'تستعمل `Pods` السليمة 240 Mi، فالحد 128 Mi منخفض جدا.'),
        opt('enlever toutes les limites du cluster', 'Supprimer les protections', 'حذف الحمايات', 5, false, undefined, 'Un Pod peut maintenant remplir la machine.', 'Un seul Pod pourrait faire tomber toute la machine.', 'قد يعطل `Pod` واحد الجهاز كله.'),
      ]),
      c: ask('Comment corriger ?', 'كيف تصلح؟', [
        opt('monter la limite à 512Mi dans le YAML, puis git push', 'Corriger la configuration dans Git', 'تصحيح الإعدادات في Git', 4, true, 'done', 'deployment.apps/boutique configured\nboutique-b45  Running', 'Le correctif est versionné et relu.', 'الإصلاح محفوظ في Git وتمت مراجعته.'),
        opt('kubectl edit deployment boutique', 'Modifier directement le cluster', 'التعديل مباشرة في المجموعة', 3, false, undefined, 'edited', 'Ça marche, mais Git ne le sait pas : le prochain déploiement annulera ce changement.', 'ينجح ذلك، لكن Git لا يعرفه، وسيلغيه النشر التالي.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La cause', 'السبب', 'La limite mémoire était trop basse pour la nouvelle version.', 'كان حد الذاكرة منخفضا جدا للإصدار الجديد.'), pm('Ce qu’on change', 'ما سنغيره', 'Mesurer la mémoire réelle, et alerter sur les redémarrages.', 'قياس الذاكرة الحقيقية والتنبيه على إعادات التشغيل.')] })

const k8sQuiz = quiz('k8s-quiz', ['Kubernetes : sondes', 'Kubernetes: المسابير', K + 'concepts/configuration/liveness-readiness-startup-probes/'], [
  no('Un échec de readiness redémarre le conteneur.', 'فشل readiness يعيد تشغيل الحاوية.', 'Il retire seulement le Pod du trafic.', 'يزيل `Pod` من الحركة فقط.'),
  yes('Dépasser la limite CPU ralentit le conteneur.', 'تجاوز حد المعالج يبطئ الحاوية.', 'Le CPU est limité, pas tué.', 'يحد المعالج ولا تقتل.'),
  no('Supprimer un Pod répare une mauvaise image.', 'حذف `Pod` يصلح صورة سيئة.', 'Le Deployment recrée le même Pod.', 'يعيد `Deployment` إنشاء `Pod` نفسه.'),
  yes('Le code de sortie 137 accompagne souvent OOMKilled.', 'يرافق رمز الخروج 137 غالبا OOMKilled.', '137 veut dire : tué par SIGKILL.', '137 يعني: قتل بالإشارة `SIGKILL`.'),
])

/* ---------- 14 Helm et GitOps ---------- */

const helm = flow('helm', ['Helm', 'Helm'], ['Un même modèle pour plusieurs environnements', 'قالب واحد لعدة بيئات'],
  ['Helm remplit un modèle Kubernetes avec des valeurs. Le même modèle sert au test et à la production.', 'يملأ Helm قالب Kubernetes بقيم، ويستعمل القالب نفسه للاختبار والإنتاج.'],
  ['Helm : utilisation', 'Helm: الاستعمال', 'https://helm.sh/docs/intro/using_helm/'],
  { outputLabel: tx('Résultat envoyé au cluster', 'النتيجة المرسلة إلى المجموعة'),
    words: [word('Chart', 'Un paquet de modèles Kubernetes.', 'Chart', 'حزمة قوالب Kubernetes.'), word('Values', 'Les valeurs qui remplissent le modèle.', 'Values', 'القيم التي تملأ القالب.')],
    variants: [
      v('s', ['Staging', 'Staging'], ['La même base, avec une seule copie.', 'الأساس نفسه مع نسخة واحدة.'], undefined, [good('replicas: 1', 'a')], { files: [{ label: 'templates/deployment.yaml', lines: [L('replicas: {{ .Values.copies }}', 'a')] }, { label: 'values-staging.yaml', lines: [L('copies: 1')] }] }),
      v('p', ['Production', 'Production'], ['Le modèle ne change pas, seule la valeur change.', 'لا يتغير القالب، بل تتغير القيمة فقط.'], undefined, [good('replicas: 5', 'a')], { files: [{ label: 'templates/deployment.yaml', lines: [L('replicas: {{ .Values.copies }}', 'a')] }, { label: 'values-prod.yaml', lines: [L('copies: 5')] }] }),
    ] })

const gitops = page('steps', 'gitops', ['GitOps', 'GitOps'], ['Git devient la seule source de vérité', 'يصبح Git المصدر الوحيد للحقيقة'],
  ['Avec GitOps, plus personne ne déploie à la main. Un outil comme Argo CD compare Git et le cluster, puis corrige les différences.', 'مع GitOps لا ينشر أحد يدويا. تقارن أداة مثل Argo CD بين Git والمجموعة ثم تصلح الفروق.'],
  ['Argo CD : concepts', 'Argo CD: المفاهيم', 'https://argo-cd.readthedocs.io/en/stable/core_concepts/'],
  { stages: [
    stage('a', 'Changer Git', 'تغيير Git', 'pull request', 'Vous proposez un changement du fichier de configuration. Il est relu.', 'تقترح تغيير ملف الإعدادات وتتم مراجعته.'),
    stage('b', 'Comparer', 'المقارنة', 'OutOfSync', 'Argo CD voit que le cluster est différent de Git.', 'يرى Argo CD أن المجموعة مختلفة عن Git.'),
    stage('c', 'Synchroniser', 'المزامنة', 'Sync', 'Argo CD applique l’état écrit dans Git.', 'يطبق Argo CD الحالة المكتوبة في Git.'),
    stage('d', 'Revenir', 'التراجع', 'git revert', 'Pour annuler, on annule le commit. L’historique Git montre qui a changé quoi.', 'للإلغاء نلغي الإيداع، ويعرض تاريخ Git من غير ماذا.'),
  ] })

const gitopsQuiz = quiz('gitops-quiz', ['Argo CD : concepts', 'Argo CD: المفاهيم', 'https://argo-cd.readthedocs.io/en/stable/core_concepts/'], [
  yes('Avec GitOps, un rollback peut être un git revert.', 'مع GitOps قد يكون التراجع `git revert`.', 'Le cluster suit Git.', 'تتبع المجموعة Git.'),
  no('Un changement fait avec kubectl edit reste forcément en place.', 'يبقى تغيير kubectl edit في مكانه حتما.', 'L’outil peut le remplacer par ce qui est dans Git.', 'قد تعوضه الأداة بما في Git.'),
  yes('Un même chart peut servir à plusieurs environnements.', 'قد يخدم Chart واحد عدة بيئات.', 'Seules les valeurs changent.', 'تتغير القيم فقط.'),
])

/* ---------- 15 Observabilité ---------- */

const signals = page('rules', 'signals', ['3 signaux', '3 إشارات'], ['Trois façons de voir ce qui se passe', 'ثلاث طرق لرؤية ما يحدث'],
  ['Observer, c’est pouvoir répondre à « que se passe-t-il ? » sans ajouter de code. Cliquez sur les cartes.', 'المراقبة تعني الإجابة عن «ماذا يحدث؟» دون إضافة كود. انقر على البطاقات.'],
  ['OpenTelemetry : signaux', 'OpenTelemetry: الإشارات', 'https://opentelemetry.io/docs/concepts/signals/'], { reveal: true, items: [
    card('Métriques', 'المقاييس', 'Des nombres dans le temps. Elles disent QUE quelque chose ne va pas.', 'أرقام عبر الزمن، وتخبرنا أن هناك مشكلة.'),
    card('Logs', 'السجلات', 'Des messages détaillés. Ils disent CE QUI s’est passé.', 'رسائل مفصلة تخبرنا بما حدث.'),
    card('Traces', 'التتبعات', 'Le chemin d’une requête entre les services. Elles disent OÙ le temps est perdu.', 'مسار الطلب بين الخدمات، وتخبرنا أين يضيع الوقت.'),
    card('Les 4 signaux d’or', 'الإشارات الذهبية الأربع', 'Latence, trafic, erreurs, saturation. C’est le minimum à surveiller.', 'التأخر والحركة والأخطاء والتشبع، وهذا أقل ما تجب مراقبته.'),
  ] })

const metrics = flow('promql', ['Métriques', 'المقاييس'], ['Lire une métrique Prometheus', 'قراءة مقياس Prometheus'],
  ['Un compteur ne fait que monter. Sa valeur seule dit peu de chose. Ce qui compte, c’est sa vitesse.', 'العداد يرتفع فقط، وقيمته وحدها لا تقول الكثير. المهم هو سرعته.'],
  ['Prometheus : types de métriques', 'Prometheus: أنواع المقاييس', 'https://prometheus.io/docs/concepts/metric_types/'],
  { sourceLabel: 'PromQL',
    words: [word('Counter', 'Un nombre qui ne fait que monter.', 'Counter', 'رقم يرتفع فقط.'), word('Gauge', 'Un nombre qui monte et descend.', 'Gauge', 'رقم يرتفع وينخفض.'), word('Histogram', 'Des valeurs rangées par tranches, utile pour la latence.', 'Histogram', 'قيم مرتبة في شرائح، ومفيدة للتأخر.')],
    variants: [
      v('raw', ['Valeur brute', 'القيمة الخام'], ['152 340 erreurs depuis le démarrage : on ne sait pas si c’est grave maintenant.', '152340 خطأ منذ البداية: لا نعرف هل الأمر خطير الآن.'], [L('http_errors_total', 'a')], [plain('152340', 'a')]),
      v('rate', ['Par seconde', 'في الثانية'], ['`rate` donne la vitesse sur les 5 dernières minutes. C’est utile.', 'يعطي `rate` السرعة خلال آخر 5 دقائق، وهذا مفيد.'], [L('rate(http_errors_total[5m])', 'a')], [good(tx('2,4 erreurs par seconde', '2.4 خطأ في الثانية'), 'a')]),
      v('p95', ['Latence p95', 'تأخر p95'], ['95 % des requêtes sont plus rapides que cette valeur. Une moyenne cacherait les clients les plus lents.', '95% من الطلبات أسرع من هذه القيمة، والمتوسط قد يخفي أبطأ العملاء.'], [L('histogram_quantile(0.95, rate(http_duration_bucket[5m]))', 'a')], [good(tx('0,8 seconde', '0.8 ثانية'), 'a')]),
    ] })

const alerts = flow('alerts', ['Alertes', 'التنبيهات'], ['Quand réveiller quelqu’un ?', 'متى نوقظ شخصا؟'],
  ['Une bonne alerte est urgente, on peut agir, et les clients sont touchés. Sinon, elle fatigue l’équipe.', 'التنبيه الجيد عاجل ويمكن التصرف فيه ويؤثر في العملاء، وإلا فإنه يرهق الفريق.'],
  ['Google SRE : superviser', 'Google SRE: المراقبة', SRE + 'sre-book/monitoring-distributed-systems/'],
  { sourceLabel: 'alerte.yml', outputLabel: tx('Résultat', 'النتيجة'),
    variants: [
      v('cause', ['CPU élevé', 'معالج مرتفع'], ['Le CPU peut être élevé sans que personne soit touché. Gardez cette donnée pour le diagnostic.', 'قد يرتفع المعالج دون تأثر أحد، فاحتفظ بهذه المعلومة للتشخيص.'], [L('expr: cpu_usage > 0.8', 'a')], [bad(tx('Réveil à 3 h, sans problème pour les clients.', 'إيقاظ في الثالثة دون مشكلة للعملاء.'), 'a')]),
      v('sym', ['Erreurs clients', 'أخطاء العملاء'], ['L’alerte décrit ce que vivent les clients.', 'يصف التنبيه ما يعيشه العملاء.'], [L('expr: rate(http_5xx[5m]) / rate(http_total[5m]) > 0.05', 'a'), L('for: 5m', 'b')], [good(tx('Plus de 5 % d’erreurs.', 'أكثر من 5% أخطاء.'), 'a'), plain(tx('Pendant 5 minutes, pour éviter les fausses alertes.', 'لمدة 5 دقائق لتجنب التنبيهات الخاطئة.'), 'b')]),
    ],
    deeper: [tx('Si une alerte se règle toujours par la même commande, automatisez cette commande.', 'إذا كان التنبيه يحل دائما بالأمر نفسه، فأتمت هذا الأمر.')] })

const obsQuiz = quiz('obs-quiz', ['Prometheus : alertes', 'Prometheus: التنبيهات', 'https://prometheus.io/docs/practices/alerting/'], [
  yes('Une trace aide à voir quel service est lent.', 'يساعد التتبع على رؤية الخدمة البطيئة.', 'Elle suit une requête de service en service.', 'يتبع الطلب من خدمة إلى أخرى.'),
  no('La moyenne suffit pour connaître la latence.', 'المتوسط يكفي لمعرفة التأخر.', 'Elle cache les requêtes les plus lentes.', 'يخفي أبطأ الطلبات.'),
  no('Il faut une alerte pour chaque métrique.', 'يجب وضع تنبيه لكل مقياس.', 'Trop d’alertes fatiguent l’équipe.', 'كثرة التنبيهات ترهق الفريق.'),
])

/* ---------- 16 DevSecOps ---------- */

const secPath = page('steps', 'sec-path', ['Où protéger', 'أين نحمي'], ['La sécurité à chaque étape', 'الأمن في كل مرحلة'],
  ['La sécurité n’est pas une étape à la fin. Chaque étape du chemin a sa protection.', 'الأمن ليس مرحلة في النهاية، فلكل مرحلة من الطريق حمايتها.'],
  ['OWASP Top 10', 'OWASP Top 10', 'https://owasp.org/www-project-top-ten/'],
  { stages: [
    stage('a', 'Code', 'الكود', 'secrets', 'Un outil refuse les mots de passe dans le code.', 'ترفض أداة كلمات المرور داخل الكود.'),
    stage('b', 'Dépendances', 'التبعيات', 'audit', 'On cherche les failles connues dans les bibliothèques.', 'نبحث عن الثغرات المعروفة في المكتبات.', 'npm audit'),
    stage('c', 'Image', 'الصورة', 'scan', 'On analyse l’image, et elle ne tourne pas en root.', 'نحلل الصورة، ولا تعمل باستعمال `root`.'),
    stage('d', 'Pipeline', 'المسار', 'droits', 'Le pipeline a le minimum de droits et des accès temporaires.', 'للمسار أقل الصلاحيات ووصول مؤقت.'),
    stage('e', 'Production', 'الإنتاج', 'surveiller', 'On surveille les accès, et on met à jour régulièrement.', 'نراقب الوصول ونحدث بانتظام.'),
  ] })

const rootless = flow('rootless', ['Sans root', 'بدون root'], ['Ne pas lancer le conteneur en root', 'لا تشغل الحاوية باستعمال root'],
  ['Si un pirate entre dans l’application, il a les droits de cet utilisateur. Donnez-lui le moins possible.', 'إذا دخل مخترق إلى التطبيق، يحصل على صلاحيات هذا المستخدم، فأعطه أقل ما يمكن.'],
  ['Docker : bonnes pratiques', 'Docker: أفضل الممارسات', 'https://docs.docker.com/build/building/best-practices/'],
  { sourceLabel: 'Dockerfile',
    variants: [
      v('root', ['Par défaut', 'افتراضيا'], ['Sans instruction USER, le processus tourne en root dans le conteneur.', 'بدون التعليمة `USER` تعمل العملية باستعمال `root` داخل الحاوية.'], [L('FROM node:22'), L('COPY . .'), L('CMD ["node", "app.js"]', 'a')], [bad('uid=0(root)', 'a')]),
      v('user', ['Avec USER', 'مع USER'], ['L’image officielle Node fournit l’utilisateur `node`. L’application n’a plus les droits root.', 'توفر صورة Node الرسمية المستخدم `node`، فلم تعد للتطبيق صلاحيات `root`.'], [L('FROM node:22'), L('COPY . .'), L('USER node'), L('CMD ["node", "app.js"]', 'a')], [good('uid=1000(node)', 'a')]),
    ] })

const oidc = flow('oidc', ['Sans clé', 'بدون مفتاح'], ['Déployer sans stocker de clé', 'النشر دون تخزين مفتاح'],
  ['Une clé stockée peut être volée et reste valable longtemps. Un accès temporaire expire tout seul.', 'قد يسرق المفتاح المخزن ويبقى صالحا مدة طويلة، أما الوصول المؤقت فينتهي تلقائيا.'],
  ['GitHub : OIDC', 'GitHub: OIDC', 'https://docs.github.com/en/actions/concepts/security/openid-connect'],
  { sourceLabel: 'deploy.yml', outputLabel: tx('Risque', 'الخطر'),
    words: [word('OIDC', 'Le cloud donne un accès temporaire au pipeline, sans mot de passe stocké.', 'OIDC', 'تعطي السحابة المسار وصولا مؤقتا دون كلمة مرور مخزنة.')],
    variants: [
      v('key', ['Clé stockée', 'مفتاح مخزن'], ['Si cette clé fuit, elle reste utilisable jusqu’à ce que quelqu’un la remplace.', 'إذا تسرب هذا المفتاح يبقى قابلا للاستعمال حتى يعوضه شخص.'], [L('AWS_ACCESS_KEY_ID: ${{ secrets.AWS_KEY }}', 'a')], [bad(tx('Clé valable longtemps', 'مفتاح صالح مدة طويلة'), 'a')]),
      v('oidc', ['OIDC', 'OIDC'], ['Aucune clé n’est stockée. L’accès est temporaire, et seulement pour ce dépôt.', 'لا يخزن أي مفتاح، والوصول مؤقت ولهذا المستودع فقط.'], [L('permissions:'), L('  id-token: write', 'a'), L('- uses: aws-actions/configure-aws-credentials@v5'), L('  with: { role-to-assume: arn:aws:iam::123456789012:role/deploy }', 'b')], [good(tx('Le pipeline peut demander un jeton.', 'يستطيع المسار طلب رمز.'), 'a'), good(tx('Accès temporaire à ce rôle.', 'وصول مؤقت إلى هذا الدور.'), 'b')]),
    ] })

const slsa = page('rules', 'slsa', ['SLSA', 'SLSA'], ['Prouver d’où vient votre image', 'إثبات مصدر صورتك'],
  ['Un pirate peut attaquer votre chaîne de construction. SLSA décrit des niveaux de protection. Cliquez sur les cartes.', 'قد يهاجم مخترق سلسلة البناء، ويصف SLSA مستويات الحماية. انقر على البطاقات.'],
  ['SLSA 1.0 : niveaux', 'SLSA 1.0: المستويات', 'https://slsa.dev/spec/v1.0/levels'], { reveal: true, items: [
    card('Niveau 0', 'المستوى 0', 'Aucune garantie.', 'لا توجد أي ضمانات.'),
    card('Niveau 1', 'المستوى 1', 'Une construction régulière, avec un document qui décrit comment l’image a été faite.', 'بناء منتظم مع مستند يصف كيفية صنع الصورة.'),
    card('Niveau 2', 'المستوى 2', 'Construction sur une plateforme hébergée, et document signé.', 'بناء على منصة مستضافة ومستند موقع.'),
    card('Niveau 3', 'المستوى 3', 'Plateforme renforcée : les constructions sont isolées, et la clé de signature reste protégée.', 'منصة مقواة: البناء معزول ومفتاح التوقيع محمي.'),
  ] })

const secQuiz = quiz('sec-quiz', ['OWASP Top 10', 'OWASP Top 10', 'https://owasp.org/www-project-top-ten/'], [
  no('Un conteneur peut tourner en root sans aucun risque.', 'يمكن للحاوية العمل بـ root دون أي خطر.', 'Une faille donne alors plus de pouvoir.', 'تعطي الثغرة عندها سلطة أكبر.'),
  yes('Un accès temporaire est plus sûr qu’une clé stockée.', 'الوصول المؤقت أكثر أمانا من مفتاح مخزن.', 'Il expire tout seul.', 'ينتهي تلقائيا.'),
  yes('Les bibliothèques peuvent contenir des failles.', 'قد تحتوي المكتبات على ثغرات.', 'Il faut les analyser et les mettre à jour.', 'يجب فحصها وتحديثها.'),
])

/* ---------- 17 SRE ---------- */

const budget = page('budget', 'budget', ['Budget d’erreur', 'ميزانية الأخطاء'], ['Combien de pannes pouvez-vous vous permettre ?', 'كم عطلا يمكنك تحمله؟'],
  ['Le SLO est votre objectif de fiabilité. Ce qui reste jusqu’à 100 % est votre budget d’erreur. Changez les valeurs.', 'SLO هو هدف الموثوقية، وما يبقى حتى 100% هو ميزانية الأخطاء. غير القيم.'],
  ['Google SRE : accepter le risque', 'Google SRE: تقبل المخاطر', SRE + 'sre-book/embracing-risk/'],
  { words: [word('SLO', 'L’objectif : par exemple, 99,9 % de réussite.', 'SLO', 'الهدف: مثلا 99.9% من النجاح.'), word('Budget d’erreur', 'La panne permise pour respecter le SLO.', 'ميزانية الأخطاء', 'العطل المسموح به لاحترام SLO.')],
    decisions: {
      go: tx('Il reste du budget : l’équipe peut continuer à livrer.', 'بقيت ميزانية: يستطيع الفريق مواصلة التسليم.'),
      slow: tx('Le budget baisse : livrez avec plus de prudence.', 'الميزانية تنخفض: سلم بحذر أكبر.'),
      stop: tx('Le budget est épuisé : on freine les nouveautés et on travaille la fiabilité.', 'نفدت الميزانية: نبطئ الجديد ونعمل على الموثوقية.'),
    },
    deeper: [tx('Le 100 % n’est ni réaliste ni utile : les clients subissent aussi les pannes de leur propre réseau.', '100% ليس واقعيا ولا مفيدا، فالعملاء يتعرضون أيضا لأعطال شبكاتهم.')] })

const roles = page('rules', 'incident-roles', ['En cas de panne', 'عند العطل'], ['Bien gérer une panne en équipe', 'إدارة العطل جيدا كفريق'],
  ['Pendant une grosse panne, le désordre coûte cher. Chacun a un rôle. Cliquez sur les cartes.', 'أثناء عطل كبير، تكلف الفوضى كثيرا، ولكل شخص دور. انقر على البطاقات.'],
  ['Google SRE : gérer les incidents', 'Google SRE: إدارة الحوادث', SRE + 'sre-book/managing-incidents/'], { reveal: true, items: [
    card('Responsable', 'المسؤول', 'Il coordonne et décide. Il ne tape pas les commandes.', 'ينسق ويقرر ولا يكتب الأوامر.'),
    card('Opérations', 'العمليات', 'Il agit sur le système. Une seule équipe fait les changements.', 'يعمل على النظام، وفريق واحد فقط يجري التغييرات.'),
    card('Communication', 'التواصل', 'Il informe les clients et l’entreprise régulièrement.', 'يخبر العملاء والشركة بانتظام.'),
    card('D’abord réparer', 'الإصلاح أولا', 'On rétablit le service en premier, on cherche la cause exacte après.', 'نعيد الخدمة أولا، ونبحث عن السبب الدقيق بعد ذلك.'),
    card('Le rapport', 'التقرير', 'Il raconte ce qui s’est passé, sans chercher de coupable, avec des actions à suivre.', 'يحكي ما حدث دون البحث عن مذنب، مع إجراءات للمتابعة.'),
  ] })

const sreIncident = incident('sre-incident', ['Exercice', 'تمرين'], ['La décision du vendredi', 'قرار يوم الجمعة'],
  ['Exercice simulé. Le SLO est de 99,9 %. Il reste 2 minutes de budget. Une grosse nouveauté est prête à partir.', 'تمرين محاكى. قيمة SLO هي 99.9%، وبقيت دقيقتان من الميزانية، وميزة كبيرة جاهزة للنشر.'],
  ['Google SRE : accepter le risque', 'Google SRE: تقبل المخاطر', SRE + 'sre-book/embracing-risk/'],
  { host: 'equipe@sila', startTime: '17:00', alert: tx('Il reste 2 minutes de budget d’erreur.', 'بقيت دقيقتان من ميزانية الأخطاء.'), start: 'a',
    nodes: {
      a: ask('Que proposez-vous ?', 'ماذا تقترح؟', [
        opt('reporter et consacrer le temps à la fiabilité', 'Respecter le budget', 'احترام الميزانية', 5, true, 'b', 'Déploiement reporté.', 'Le budget sert justement à prendre cette décision avec des faits.', 'تستعمل الميزانية لاتخاذ هذا القرار بالوقائع.'),
        opt('déployer quand même', 'Prendre le risque', 'المخاطرة', 40, false, undefined, 'Panne de 40 minutes.', 'L’objectif promis aux clients n’est plus tenu.', 'لم يعد الهدف الموعود للعملاء محققا.'),
      ]),
      b: ask('Quelle est la suite ?', 'ما التالي؟', [
        opt('livrer derrière un flag, à 5 % des clients', 'Livrer avec peu de risque', 'التسليم بخطر قليل', 3, true, 'done', 'Canary à 5 % : sain', 'La nouveauté avance sans mettre le budget en danger.', 'تتقدم الميزة دون تعريض الميزانية للخطر.'),
        opt('supprimer le SLO', 'Enlever l’objectif', 'حذف الهدف', 2, false, undefined, 'Plus de mesure.', 'Sans objectif, on ne sait plus quand s’arrêter.', 'بدون هدف لا نعرف متى نتوقف.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La leçon', 'الدرس', 'Le budget d’erreur remplace les disputes par un chiffre partagé.', 'تعوض ميزانية الأخطاء الخلافات برقم مشترك.')] })

const sreQuiz = quiz('sre-quiz', ['Google SRE : post-mortem', 'Google SRE: تحليل الحوادث', SRE + 'sre-book/postmortem-culture/'], [
  yes('99,9 % sur 30 jours permet environ 43 minutes de panne.', '99.9% خلال 30 يوما تسمح بحوالي 43 دقيقة عطل.', '43 200 minutes × 0,1 %.', '43200 دقيقة × 0.1%.'),
  no('Un rapport de panne doit nommer le coupable.', 'يجب أن يذكر تقرير العطل المذنب.', 'On cherche ce qu’il faut changer dans le système.', 'نبحث عما يجب تغييره في النظام.'),
  no('Il faut viser 100 % de disponibilité.', 'يجب استهداف توفر 100%.', 'C’est très cher et peu utile.', 'هذا مكلف جدا وقليل الفائدة.'),
])

export const k8sModule = module('k8s', ['Kubernetes', 'Kubernetes'], ['Boucle de contrôle, Deployment, sondes, ressources', 'حلقة التحكم و Deployment والمسابير والموارد'], [k8sLoop, deployment, probes, resources, k8sIncident, k8sQuiz])
export const gitopsModule = module('gitops', ['Helm et GitOps', 'Helm و GitOps'], ['Modèles, valeurs, Argo CD', 'القوالب والقيم و Argo CD'], [helm, gitops, gitopsQuiz])
export const observabilityModule = module('observability', ['Observabilité', 'قابلية المراقبة'], ['Métriques, logs, traces, alertes', 'المقاييس والسجلات والتتبعات والتنبيهات'], [signals, metrics, alerts, obsQuiz])
export const devsecopsModule = module('devsecops', ['DevSecOps', 'DevSecOps'], ['Sans root, sans clé, chaîne de construction', 'بدون root وبدون مفتاح وسلسلة البناء'], [secPath, rootless, oidc, slsa, secQuiz])
export const sreModule = module('sre', ['SRE et incidents', 'SRE والحوادث'], ['SLO, budget d’erreur, gestion de panne', 'SLO وميزانية الأخطاء وإدارة الأعطال'], [budget, roles, sreIncident, sreQuiz])
