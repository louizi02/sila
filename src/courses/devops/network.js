import { L, MAN, O, tx, word } from './helpers.js'

const plain = (text, from) => O(text, from, 'plain')
const bad = (text, from) => O(text, from, 'err')
const MDN = 'https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status'

const path = {
  id: 'request', type: 'steps',
  nav: tx('Une requête', 'الطلب'),
  title: tx('Que se passe-t-il quand on ouvre un site ?', 'ماذا يحدث عند فتح موقع؟'),
  lead: tx(
    'Il y a quatre étapes avant de recevoir la page. Si vous savez à quelle étape ça bloque, vous savez où chercher.',
    'توجد أربع مراحل قبل استقبال الصفحة. إذا عرفت المرحلة التي يتوقف فيها الأمر، عرفت أين تبحث.',
  ),
  source: { label: tx('MDN : aperçu de HTTP', 'MDN: نظرة على HTTP'), url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Overview' },
  stages: [
    {
      id: 'dns', label: tx('DNS', 'DNS'), sub: '9 ms',
      detail: tx('Le nom du site est traduit en adresse IP. C’est comme chercher un numéro dans un annuaire. Mesure réelle sur example.com : 9 ms.', 'يترجم اسم الموقع إلى عنوان IP، مثل البحث عن رقم في دليل الهاتف. قياس حقيقي على `example.com`: 9 مللي ثانية.'),
      code: 'nslookup example.com\nAddresses: 104.20.23.154',
    },
    {
      id: 'tcp', label: tx('TCP', 'TCP'), sub: '46 ms',
      detail: tx('Votre ordinateur ouvre une connexion avec le serveur, sur un port. Le port 443 sert au HTTPS. Mesure réelle : terminé à 46 ms.', 'يفتح حاسوبك اتصالا مع الخادم على منفذ. المنفذ 443 مخصص لـ HTTPS. قياس حقيقي: انتهى عند 46 مللي ثانية.'),
    },
    {
      id: 'tls', label: tx('TLS', 'TLS'), sub: '133 ms',
      detail: tx('Le serveur prouve son identité avec un certificat, puis la connexion est chiffrée. Mesure réelle : terminé à 133 ms.', 'يثبت الخادم هويته بشهادة، ثم يشفر الاتصال. قياس حقيقي: انتهى عند 133 مللي ثانية.'),
    },
    {
      id: 'http', label: tx('HTTP', 'HTTP'), sub: '175 ms',
      detail: tx('Le navigateur demande la page, et le serveur répond avec un code. 200 veut dire que tout va bien. Mesure réelle : terminé à 175 ms.', 'يطلب المتصفح الصفحة ويجيب الخادم برمز. الرمز 200 يعني أن كل شيء بخير. قياس حقيقي: انتهى عند 175 مللي ثانية.'),
      code: 'curl -sI https://example.com\nHTTP/1.1 200 OK',
    },
  ],
}

const errors = {
  id: 'curl-errors', type: 'flow',
  nav: tx('Les erreurs', 'الأخطاء'),
  title: tx('L’erreur vous dit où chercher', 'الخطأ يخبرك أين تبحث'),
  lead: tx(
    'Ces messages viennent de la commande curl. Chaque erreur correspond à une étape différente.',
    'تأتي هذه الرسائل من الأمر `curl`. وكل خطأ يقابل مرحلة مختلفة.',
  ),
  words: [
    word('curl', 'Une commande qui envoie une requête, comme un navigateur.', 'curl', 'أمر يرسل طلبا مثل المتصفح.'),
    word('Port', 'Une porte d’entrée sur un serveur, avec un numéro.', 'المنفذ', 'باب دخول إلى الخادم له رقم.'),
    word('Pare-feu', 'Un filtre qui bloque ou autorise les connexions.', 'الجدار الناري', 'مرشح يمنع الاتصالات أو يسمح بها.'),
  ],
  source: { label: tx('Codes d’erreur de curl', 'رموز أخطاء curl'), url: 'https://curl.se/libcurl/c/libcurl-errors.html' },
  sourceLabel: 'terminal',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'dns', label: tx('Nom introuvable', 'اسم غير موجود'),
      note: tx('Étape DNS. Le nom n’existe pas ou il est mal écrit. Le serveur n’a même pas été contacté.', 'مرحلة DNS. الاسم غير موجود أو مكتوب بشكل خاطئ، ولم يتم الاتصال بالخادم أصلا.'),
      lines: [L('curl -sS -m 5 http://inexistant.invalid', 'a')],
      output: [bad('curl: (6) Could not resolve host: inexistant.invalid', 'a')],
    },
    {
      id: 'refused', label: tx('Connexion refusée', 'اتصال مرفوض'),
      note: tx('Étape TCP. La machine répond, mais aucun programme n’écoute sur ce port. Vérifiez que l’application tourne.', 'مرحلة TCP. يجيب الجهاز، لكن لا يوجد برنامج يستمع على هذا المنفذ. تأكد من أن التطبيق يعمل.'),
      lines: [L('curl -sS -m 5 http://127.0.0.1:9', 'a')],
      output: [bad('curl: (7) Failed to connect to 127.0.0.1 port 9 after 2036 ms: Could not connect to server', 'a')],
    },
    {
      id: 'timeout', label: tx('Pas de réponse', 'لا يوجد جواب'),
      note: tx('Étape TCP. Personne ne répond. Souvent, un pare-feu bloque la connexion sans rien dire.', 'مرحلة TCP. لا أحد يجيب. غالبا يمنع جدار ناري الاتصال دون أي رسالة.'),
      lines: [L('curl -sS -m 3 http://10.255.255.1', 'a')],
      output: [bad('curl: (28) Connection timed out after 3004 milliseconds', 'a')],
    },
    {
      id: 'cert', label: tx('Certificat expiré', 'شهادة منتهية'),
      note: tx('Étape TLS. La connexion marche, mais le certificat du site n’est plus valide. Il faut le renouveler.', 'مرحلة TLS. الاتصال يعمل، لكن شهادة الموقع لم تعد صالحة، ويجب تجديدها.'),
      lines: [L('curl -sS https://expired.badssl.com/', 'a')],
      output: [bad('curl: (60) SSL certificate problem: certificate has expired', 'a')],
    },
  ],
  deeper: [
    tx('« Refusée » et « pas de réponse » semblent proches, mais ne disent pas la même chose. Refusée : la machine a répondu non. Pas de réponse : rien n’est revenu.', 'يبدو «مرفوض» و«لا جواب» متقاربين لكنهما مختلفان. مرفوض: أجاب الجهاز بالرفض. لا جواب: لم يعد أي شيء.'),
    tx('`curl -w` mesure le temps de chaque étape. Cela aide à savoir si la lenteur vient du DNS, de la connexion ou de l’application.', 'يقيس `curl -w` زمن كل مرحلة، مما يساعد على معرفة هل البطء من DNS أو الاتصال أو التطبيق.'),
    tx('Le message du certificat vient de curl sous Linux. Sous Windows, le texte est différent.', 'رسالة الشهادة من `curl` في Linux، والنص مختلف في Windows.'),
  ],
}

const ports = {
  id: 'ports', type: 'flow',
  nav: tx('Ports', 'المنافذ'),
  title: tx('Pourquoi mon application marche seulement sur le serveur ?', 'لماذا يعمل تطبيقي على الخادم فقط؟'),
  lead: tx(
    'C’est un problème très courant. Regardez sur quelle adresse l’application écoute, et si le pare-feu laisse passer.',
    'هذه مشكلة شائعة جدا. انظر إلى العنوان الذي يستمع عليه التطبيق، وهل يسمح الجدار الناري بالمرور.',
  ),
  words: [
    word('127.0.0.1', 'La machine elle-même. Personne d’autre ne peut y accéder.', '127.0.0.1', 'الجهاز نفسه، ولا يمكن لأي جهاز آخر الوصول إليه.'),
    word('0.0.0.0', 'Toutes les adresses de la machine. On peut venir de l’extérieur.', '0.0.0.0', 'كل عناوين الجهاز، فيمكن الوصول إليه من الخارج.'),
    word('ss -ltn', 'Affiche les ports sur lesquels des programmes écoutent.', 'ss -ltn', 'يعرض المنافذ التي تستمع عليها البرامج.'),
  ],
  source: { label: tx('Manuel de ss', 'دليل ss'), url: MAN + 'man8/ss.8.html' },
  sourceLabel: 'terminal',
  outputLabel: tx('Résultat (exemple)', 'النتيجة (مثال)'),
  variants: [
    {
      id: 'local', label: tx('Écoute sur 127.0.0.1', 'يستمع على 127.0.0.1'),
      note: tx('L’application accepte seulement les connexions venant du serveur lui-même. Depuis l’extérieur, c’est refusé.', 'يقبل التطبيق الاتصالات القادمة من الخادم نفسه فقط، فيرفض ما يأتي من الخارج.'),
      lines: [L('ss -ltn | grep 3000', 'a'), L('curl -m 5 http://203.0.113.20:3000', 'b')],
      output: [plain('LISTEN 0 511 127.0.0.1:3000 0.0.0.0:*', 'a'), bad('curl: (7) Failed to connect to 203.0.113.20 port 3000: Could not connect to server', 'b')],
    },
    {
      id: 'firewall', label: tx('Le pare-feu bloque', 'الجدار الناري يمنع'),
      note: tx('L’application écoute bien partout, mais le pare-feu bloque le port. La requête ne reçoit jamais de réponse.', 'يستمع التطبيق في كل مكان، لكن الجدار الناري يمنع المنفذ، فلا يصل أي جواب.'),
      lines: [L('ss -ltn | grep 3000', 'a'), L('curl -m 5 http://203.0.113.20:3000', 'b')],
      output: [plain('LISTEN 0 511 0.0.0.0:3000 0.0.0.0:*', 'a'), bad('curl: (28) Connection timed out after 5002 milliseconds', 'b')],
    },
    {
      id: 'open', label: tx('Tout est bon', 'كل شيء جيد'),
      note: tx('L’application écoute partout et le port est ouvert. Le serveur répond.', 'يستمع التطبيق في كل مكان والمنفذ مفتوح، فيجيب الخادم.'),
      lines: [L('ss -ltn | grep 3000', 'a'), L('curl -sI -m 5 http://203.0.113.20:3000', 'b')],
      output: [plain('LISTEN 0 511 0.0.0.0:3000 0.0.0.0:*', 'a'), O('HTTP/1.1 200 OK', 'b')],
    },
  ],
  deeper: [
    tx('En production, on laisse souvent l’application sur 127.0.0.1, et Nginx reçoit les clients sur le port 443. Vous le verrez dans le module Nginx.', 'في الإنتاج نترك التطبيق غالبا على `127.0.0.1`، ويستقبل Nginx العملاء على المنفذ 443. سترى ذلك في وحدة Nginx.'),
    tx('Dans un conteneur, écouter sur 127.0.0.1 bloque aussi l’accès depuis l’extérieur du conteneur.', 'داخل الحاوية، الاستماع على `127.0.0.1` يمنع أيضا الوصول من خارج الحاوية.'),
  ],
}

const codes = {
  id: 'codes', type: 'rules', reveal: true,
  nav: tx('Codes HTTP', 'رموز HTTP'),
  title: tx('Que veut dire ce code ?', 'ماذا يعني هذا الرمز؟'),
  lead: tx('Les codes 4xx disent : le problème vient de la demande. Les codes 5xx disent : le problème vient du serveur.', 'الرموز `4xx` تعني أن المشكلة في الطلب، والرموز `5xx` تعني أن المشكلة في الخادم.'),
  source: { label: tx('MDN : codes de réponse HTTP', 'MDN: رموز استجابة HTTP'), url: MDN },
  items: [
    { code: '301', why: tx('La page a changé d’adresse pour toujours.', 'تغير عنوان الصفحة نهائيا.') },
    { code: '401', why: tx('Il faut se connecter d’abord.', 'يجب تسجيل الدخول أولا.') },
    { code: '403', why: tx('Vous êtes connu, mais vous n’avez pas le droit.', 'أنت معروف، لكن ليس لك الحق.') },
    { code: '404', why: tx('La page n’existe pas.', 'الصفحة غير موجودة.') },
    { code: '429', why: tx('Trop de requêtes en peu de temps.', 'طلبات كثيرة في وقت قصير.') },
    { code: '500', why: tx('L’application a eu une erreur. Regardez ses logs.', 'حدث خطأ في التطبيق. انظر إلى سجلاته.') },
    { code: '502', why: tx('Le proxy a reçu une mauvaise réponse de l’application, ou aucune.', 'تلقى الوسيط جوابا خاطئا من التطبيق، أو لم يتلق شيئا.') },
    { code: '503', why: tx('Le service n’est pas prêt : surcharge ou maintenance.', 'الخدمة غير جاهزة: ضغط زائد أو صيانة.') },
    { code: '504', why: tx('Le proxy attend l’application, et elle répond trop lentement.', 'ينتظر الوسيط التطبيق، لكنه يجيب ببطء شديد.') },
  ],
}

const incident = {
  id: 'dns-incident', type: 'incident',
  nav: tx('Panne', 'العطل'),
  title: tx('Après un changement de serveur', 'بعد تغيير الخادم'),
  lead: tx('Ceci est un exercice. Hier, le site a changé de serveur. Chez vous tout marche, mais des clients voient encore l’ancien site.', 'هذا تمرين. غير الموقع خادمه أمس. كل شيء يعمل عندك، لكن بعض العملاء ما زالوا يرون الموقع القديم.'),
  words: [
    word('Cache DNS', 'Une réponse DNS gardée en mémoire pour aller plus vite.', 'ذاكرة DNS المؤقتة', 'جواب DNS محفوظ لتسريع العمل.'),
    word('TTL', 'Le nombre de secondes pendant lesquelles on garde cette réponse.', 'TTL', 'عدد الثواني التي يحفظ فيها هذا الجواب.'),
  ],
  source: { label: tx('Manuel de dig', 'دليل dig'), url: 'https://bind9.readthedocs.io/en/latest/manpages.html' },
  host: 'admin@poste',
  startTime: '09:40',
  bestMinutes: 6,
  alert: tx('Certains clients voient encore l’ancien site.', 'بعض العملاء ما زالوا يرون الموقع القديم.'),
  start: 'compare',
  nodes: {
    compare: {
      question: tx('Comment voir ce que reçoivent les autres ?', 'كيف ترى ما يستقبله الآخرون؟'),
      options: [
        { cmd: 'dig +short boutique.example @1.1.1.1; dig +short boutique.example @8.8.8.8', does: tx('Demander à deux serveurs DNS publics', 'السؤال من خادمي DNS عامين'), cost: 2, good: true, next: 'ttl', output: '203.0.113.20\n198.51.100.7', comment: tx('Deux réponses différentes : un serveur DNS donne encore l’ancienne adresse.', 'جوابان مختلفان: ما زال خادم DNS يعطي العنوان القديم.') },
        { cmd: 'sudo systemctl restart nginx', does: tx('Redémarrer le serveur web', 'إعادة تشغيل خادم الويب'), cost: 3, good: false, output: '(aucun message)', comment: tx('Le serveur va bien. Certains clients n’arrivent simplement pas dessus.', 'الخادم بخير، لكن بعض العملاء لا يصلون إليه.') },
      ],
    },
    ttl: {
      question: tx('Pourquoi l’ancienne adresse reste-t-elle ?', 'لماذا يبقى العنوان القديم؟'),
      options: [
        { cmd: 'dig boutique.example @8.8.8.8 | grep -A1 "ANSWER SECTION"', does: tx('Voir le TTL de la réponse', 'رؤية TTL الجواب'), cost: 2, good: true, next: 'act', output: ';; ANSWER SECTION:\nboutique.example. 72000 IN A 198.51.100.7', comment: tx('72 000 secondes, soit 20 heures. Ce serveur DNS va garder l’ancienne adresse encore longtemps.', '72000 ثانية أي 20 ساعة. سيحتفظ خادم DNS بالعنوان القديم مدة طويلة.') },
        { cmd: 'ipconfig /flushdns', does: tx('Vider le cache DNS de votre PC', 'إفراغ ذاكرة DNS في حاسوبك'), cost: 2, good: false, output: 'Successfully flushed the DNS Resolver Cache.', comment: tx('Cela change seulement votre PC, pas celui des clients.', 'هذا يغير حاسوبك فقط، وليس أجهزة العملاء.') },
      ],
    },
    act: {
      question: tx('Que faites-vous pour les clients ?', 'ماذا تفعل من أجل العملاء؟'),
      options: [
        { cmd: 'garder l’ancien serveur actif et renvoyer vers le nouveau', does: tx('Servir aussi les clients qui arrivent sur l’ancienne adresse', 'خدمة العملاء القادمين إلى العنوان القديم أيضا'), cost: 2, good: true, next: 'done', output: 'ancien serveur : proxy vers 203.0.113.20', comment: tx('Tous les clients sont servis pendant que les caches expirent.', 'تتم خدمة كل العملاء بينما تنتهي صلاحية الذاكرة المؤقتة.') },
        { cmd: 'éteindre l’ancien serveur', does: tx('Arrêter l’ancienne machine', 'إيقاف الجهاز القديم'), cost: 5, good: false, output: 'Les clients concernés ne peuvent plus accéder au site.', comment: tx('Ces clients sont encore envoyés vers cette machine. Ils ont maintenant une panne.', 'ما زال هؤلاء العملاء يوجهون إلى هذا الجهاز، فأصبح لديهم عطل.') },
      ],
    },
    done: { end: true },
  },
  postmortem: [
    { term: tx('La cause', 'السبب'), text: tx('Le TTL était de 20 heures au moment du changement.', 'كان TTL يساوي 20 ساعة عند التغيير.') },
    { term: tx('Ce qu’on change', 'ما سنغيره'), text: tx('Baisser le TTL plusieurs jours avant, et garder l’ancien serveur jusqu’à la fin de la transition.', 'تخفيض TTL قبل التغيير بعدة أيام، والاحتفاظ بالخادم القديم حتى نهاية الانتقال.') },
  ],
}

const quiz = {
  id: 'network-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('MDN : codes de réponse HTTP', 'MDN: رموز استجابة HTTP'), url: MDN },
  items: [
    { title: tx('« Connection refused » veut souvent dire qu’aucun programme n’écoute sur ce port.', '«Connection refused» تعني غالبا أنه لا يوجد برنامج يستمع على هذا المنفذ.'), ok: true, why: tx('La machine répond, mais rien n’accepte la connexion.', 'يجيب الجهاز، لكن لا شيء يقبل الاتصال.') },
    { title: tx('Une application sur 127.0.0.1 est accessible depuis Internet.', 'يمكن الوصول من الإنترنت إلى تطبيق على 127.0.0.1.'), ok: false, why: tx('Seule la machine elle-même peut y accéder.', 'لا يصل إليه إلا الجهاز نفسه.') },
    { title: tx('Une erreur 404 veut dire que le serveur est en panne.', 'الخطأ 404 يعني أن الخادم معطل.'), ok: false, why: tx('Le serveur marche : il dit que la page n’existe pas.', 'الخادم يعمل، ويقول إن الصفحة غير موجودة.') },
    { title: tx('Une erreur 504 peut venir d’une application trop lente.', 'قد يأتي الخطأ 504 من تطبيق بطيء جدا.'), ok: true, why: tx('Le proxy a arrêté d’attendre sa réponse.', 'توقف الوسيط عن انتظار جوابه.') },
    { title: tx('Un changement DNS arrive partout immédiatement.', 'يصل تغيير DNS إلى كل مكان فورا.'), ok: false, why: tx('Les caches gardent l’ancienne réponse pendant le TTL.', 'تحتفظ الذاكرات المؤقتة بالجواب القديم طوال مدة TTL.') },
  ],
}

export const networkModule = {
  id: 'network',
  title: tx('Réseau pour réparer', 'الشبكة من أجل الإصلاح'),
  notions: tx('DNS, ports, HTTP, certificats, messages d’erreur', 'DNS والمنافذ و HTTP والشهادات ورسائل الخطأ'),
  slides: [path, errors, ports, codes, incident, quiz],
}
