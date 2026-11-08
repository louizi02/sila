import { L, MAN, O, S, tx, word } from './helpers.js'

const RESULT = tx('Résultat (exemple)', 'النتيجة (مثال)')
const plain = (text, from) => O(text, from, 'plain')

const processes = {
  id: 'process', type: 'flow',
  nav: tx('Processus', 'العمليات'),
  title: tx('Qu’est-ce qui tourne sur le serveur ?', 'ما الذي يعمل على الخادم؟'),
  lead: tx(
    'Quand une application tourne, Linux la voit comme un processus. Ces commandes montrent qui tourne et ce qu’il consomme.',
    'عندما يعمل تطبيق، يراه Linux كعملية. تعرض هذه الأوامر ما يعمل وما يستهلكه.',
  ),
  words: [
    word('Processus', 'Un programme en train de tourner.', 'العملية', 'برنامج قيد التشغيل.'),
    word('PID', 'Le numéro unique d’un processus.', 'PID', 'الرقم الفريد للعملية.'),
    word('USER', 'L’utilisateur Linux qui lance le processus.', 'USER', 'مستخدم Linux الذي شغل العملية.'),
    word('%MEM', 'La part de mémoire utilisée.', '%MEM', 'نسبة الذاكرة المستعملة.'),
  ],
  source: { label: tx('Manuel de ps', 'دليل ps'), url: MAN + 'man1/ps.1.html' },
  sourceLabel: 'terminal',
  outputLabel: RESULT,
  variants: [
    {
      id: 'ps', label: tx('Les plus gourmands', 'الأكثر استهلاكا'),
      note: tx('La liste est triée par mémoire. L’application boutique utilise le plus de mémoire, et son PID est 2143.', 'القائمة مرتبة حسب الذاكرة. يستعمل تطبيق boutique أكبر قدر من الذاكرة، ورقم عمليته 2143.'),
      lines: [L('ps -eo pid,user,%mem,cmd --sort=-%mem | head -4', 'a')],
      output: [plain('    PID USER     %MEM CMD', 'a'), plain('   2143 boutique 12.4 /usr/local/bin/boutique'), plain('    870 postgres  6.1 postgres: writer'), plain('    612 www-data  1.2 nginx: worker process')],
    },
    {
      id: 'pgrep', label: tx('Trouver un PID', 'إيجاد PID'),
      note: tx('`pgrep` cherche un processus par son nom. Vous obtenez directement son PID.', 'يبحث `pgrep` عن عملية باسمها، فتحصل مباشرة على رقمها.'),
      lines: [L('pgrep -a boutique', 'a')],
      output: [plain('2143 /usr/local/bin/boutique', 'a')],
    },
  ],
  deeper: [
    tx('Chaque processus a un parent (PPID). Quand un parent s’arrête, ses enfants sont rattachés à un autre processus.', 'لكل عملية أب (`PPID`). عندما يتوقف الأب، تلحق العمليات الأبناء بعملية أخرى.'),
    tx('Un conteneur Docker n’est pas une petite machine : c’est un processus, isolé par Linux. Vous le verrez dans le module Docker.', 'حاوية Docker ليست جهازا صغيرا، بل عملية يعزلها Linux. سترى ذلك في وحدة Docker.'),
  ],
}

const perms = {
  id: 'perms', type: 'perms',
  nav: tx('Droits', 'الصلاحيات'),
  title: tx('Protéger un fichier avec un mot de passe', 'حماية ملف فيه كلمة مرور'),
  lead: tx(
    'Le fichier secret.env contient le mot de passe de la base de données. Cliquez sur les lettres jusqu’à ce que toutes les lignes soient vertes.',
    'يحتوي الملف `secret.env` على كلمة مرور قاعدة البيانات. انقر على الحروف حتى تصبح كل الأسطر خضراء.',
  ),
  words: [
    word('r = 4', 'Lire le fichier.', 'r = 4', 'قراءة الملف.'),
    word('w = 2', 'Modifier le fichier.', 'w = 2', 'تعديل الملف.'),
    word('x = 1', 'Exécuter le fichier comme un programme.', 'x = 1', 'تشغيل الملف كبرنامج.'),
    word('chmod 640', 'On additionne pour chaque colonne : 6 = 4 + 2, puis 4, puis 0.', 'chmod 640', 'نجمع لكل عمود: `6 = 4 + 2`، ثم 4، ثم 0.'),
  ],
  source: { label: tx('Manuel de chmod', 'دليل chmod'), url: MAN + 'man1/chmod.1.html' },
  file: 'secret.env', owner: 'root', groupName: 'boutique',
  who: [tx('root', 'root'), tx('l’application', 'التطبيق'), tx('tout le reste', 'كل الباقين')],
  start: '644',
  presets: ['644', '777', '640', '600'],
  checks: [
    { label: tx('root peut modifier le fichier', 'يستطيع root تعديل الملف'), test: (d) => (d[0] & 2) !== 0 },
    { label: tx('L’application peut lire le fichier', 'يستطيع التطبيق قراءة الملف'), test: (d) => (d[1] & 4) !== 0 },
    { label: tx('L’application ne peut pas le modifier', 'لا يستطيع التطبيق تعديله'), test: (d) => (d[1] & 2) === 0 },
    { label: tx('Les autres n’ont aucun droit', 'ليس للآخرين أي صلاحية'), test: (d) => d[2] === 0 },
    { label: tx('Personne ne peut l’exécuter', 'لا أحد يستطيع تشغيله'), test: (d) => d.every((x) => (x & 1) === 0) },
  ],
  note: tx(
    'La bonne réponse est 640. Avec 644, n’importe quel utilisateur du serveur peut lire le mot de passe. Avec 777, tout le monde peut même le modifier : ne faites jamais cela.',
    'الجواب الصحيح هو `640`. مع `644` يستطيع أي مستخدم في الخادم قراءة كلمة المرور. ومع `777` يستطيع الجميع حتى تعديلها، فلا تفعل ذلك أبدا.',
  ),
  deeper: [
    tx('Pour changer le propriétaire et le groupe : `chown root:boutique secret.env`.', 'لتغيير المالك والمجموعة: `chown root:boutique secret.env`.'),
    tx('Pour un dossier, x veut dire « pouvoir entrer dedans ». Sans x, on ne peut pas accéder aux fichiers du dossier.', 'في المجلد، يعني `x` إمكانية الدخول إليه. وبدونه لا يمكن الوصول إلى ملفاته.'),
    tx('Règle de base : donner le minimum de droits nécessaires. C’est le principe du moindre privilège.', 'قاعدة أساسية: إعطاء أقل الصلاحيات اللازمة، وهذا مبدأ أقل امتياز.'),
  ],
}

const signalLines = [L("process.on('SIGTERM', () => {"), L('  server.close(() => {'), L('    process.exit(0)'), L('  })'), L('})')]

const signals = {
  id: 'signals', type: 'flow',
  nav: tx('Signaux', 'الإشارات'),
  title: tx('Arrêter une application proprement', 'إيقاف تطبيق بطريقة سليمة'),
  lead: tx(
    'Pour arrêter un processus, Linux lui envoie un signal. Comparez une demande polie et un arrêt forcé. Cliquez sur « Lancer ».',
    'لإيقاف عملية، يرسل لها Linux إشارة. قارن بين طلب مهذب وإيقاف إجباري. انقر على «تشغيل».',
  ),
  words: [
    word('Signal', 'Un message envoyé par le système à un processus.', 'الإشارة', 'رسالة يرسلها النظام إلى عملية.'),
    word('SIGTERM', 'Demande à l’application de s’arrêter. Elle peut d’abord finir son travail.', 'SIGTERM', 'يطلب من التطبيق التوقف، ويمكنه إنهاء عمله أولا.'),
    word('SIGKILL', 'Arrête le processus de force. Il ne peut pas l’éviter.', 'SIGKILL', 'يوقف العملية بالقوة ولا يمكنها تجنبه.'),
  ],
  source: { label: tx('Manuel des signaux', 'دليل الإشارات'), url: MAN + 'man7/signal.7.html' },
  sourceLabel: 'app.js',
  outputLabel: RESULT,
  variants: [
    {
      id: 'term', label: tx('kill -TERM 2143', 'kill -TERM 2143'), hideBrowser: true,
      note: tx('L’application finit les requêtes en cours avant de s’arrêter. Aucun client ne voit d’erreur.', 'ينهي التطبيق الطلبات الجارية قبل التوقف، فلا يرى أي عميل خطأ.'),
      lines: signalLines, output: [],
      trace: [
        S(1, tx('L’application reçoit SIGTERM et peut réagir.', 'يستقبل التطبيق `SIGTERM` ويمكنه التصرف.')),
        S(2, tx('Elle refuse les nouvelles requêtes et finit celles en cours.', 'يرفض الطلبات الجديدة وينهي الجارية.')),
        S(3, tx('Tout est terminé : elle s’arrête avec le code 0.', 'انتهى كل شيء: يتوقف بالرمز 0.')),
      ],
    },
    {
      id: 'kill', label: tx('kill -KILL 2143', 'kill -KILL 2143'), hideBrowser: true,
      note: tx('L’application n’a pas le temps de réagir. Les requêtes en cours sont perdues. On utilise SIGKILL seulement en dernier recours.', 'لا يجد التطبيق وقتا للتصرف، فتضيع الطلبات الجارية. لا نستعمل `SIGKILL` إلا كحل أخير.'),
      lines: signalLines, output: [],
      trace: [
        S(1, tx('SIGKILL ne passe jamais par ce code.', 'لا تمر `SIGKILL` أبدا عبر هذا الكود.')),
        S(5, tx('Le système arrête le processus immédiatement.', 'يوقف النظام العملية فورا.')),
      ],
    },
  ],
  deeper: [
    tx('`systemctl stop` envoie d’abord SIGTERM. Si l’application n’a pas fini après un délai (`TimeoutStopSec`), elle reçoit SIGKILL.', 'يرسل `systemctl stop` أولا `SIGTERM`. وإذا لم ينته التطبيق بعد مهلة `TimeoutStopSec` يستقبل `SIGKILL`.'),
    tx('SIGKILL et SIGSTOP sont les deux signaux qu’un programme ne peut ni attraper, ni ignorer.', '`SIGKILL` و `SIGSTOP` هما الإشارتان اللتان لا يستطيع البرنامج التقاطهما ولا تجاهلهما.'),
    tx('Si votre application ne gère pas SIGTERM, chaque déploiement peut couper des requêtes.', 'إذا لم يعالج تطبيقك `SIGTERM`، فقد يقطع كل نشر بعض الطلبات.'),
  ],
}

const unitLines = [
  L('[Unit]'), L('Description=Boutique API'), L(''), L('[Service]'),
  L('User=boutique', 'a'), L('ExecStart=/usr/local/bin/boutique', 'b'), L('Restart=on-failure', 'c'), L('RestartSec=5', 'd'),
  L(''), L('[Install]'), L('WantedBy=multi-user.target', 'e'),
]

const systemd = {
  id: 'systemd', type: 'flow',
  nav: tx('systemd', 'systemd'),
  title: tx('Garder une application allumée', 'إبقاء التطبيق يعمل'),
  lead: tx(
    'systemd démarre vos applications et les relance si elles plantent. Ce petit fichier lui explique quoi faire.',
    'يشغل systemd تطبيقاتك ويعيد تشغيلها إذا تعطلت. هذا الملف الصغير يشرح له ما يجب فعله.',
  ),
  words: [
    word('systemd', 'Le programme de Linux qui gère les services.', 'systemd', 'برنامج Linux الذي يدير الخدمات.'),
    word('Service', 'Une application qui tourne en permanence.', 'الخدمة', 'تطبيق يعمل باستمرار.'),
    word('Crash', 'Quand une application s’arrête à cause d’une erreur.', 'التعطل', 'توقف التطبيق بسبب خطأ.'),
  ],
  source: { label: tx('Documentation systemd', 'توثيق systemd'), url: 'https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html' },
  sourceLabel: '/etc/systemd/system/boutique.service',
  outputLabel: tx('Ce que fait chaque ligne', 'ما يفعله كل سطر'),
  variants: [
    {
      id: 'file', label: tx('Lire le fichier', 'قراءة الملف'),
      note: tx('Après avoir créé ce fichier, on lance : `systemctl daemon-reload`, puis `systemctl enable --now boutique`.', 'بعد إنشاء هذا الملف، ننفذ `systemctl daemon-reload` ثم `systemctl enable --now boutique`.'),
      lines: unitLines,
      output: [
        plain(tx('Lance l’application sans être root.', 'يشغل التطبيق دون استعمال root.'), 'a'),
        plain(tx('La commande qui démarre l’application.', 'الأمر الذي يشغل التطبيق.'), 'b'),
        plain(tx('Relance si l’application plante.', 'يعيد التشغيل إذا تعطل التطبيق.'), 'c'),
        plain(tx('Attend 5 secondes avant de relancer.', 'ينتظر 5 ثوان قبل إعادة التشغيل.'), 'd'),
        plain(tx('Démarre avec le serveur.', 'يبدأ مع تشغيل الخادم.'), 'e'),
      ],
    },
    {
      id: 'crash', label: tx('Simuler un crash', 'محاكاة تعطل'), hideBrowser: true,
      note: tx('L’application est tombée, mais systemd l’a relancée sans aide. Attention : si elle plante à chaque démarrage, cela ne réparera rien.', 'تعطل التطبيق، لكن systemd أعاد تشغيله دون مساعدة. انتبه: إذا تعطل عند كل بداية، فلن يصلح هذا شيئا.'),
      lines: unitLines, output: [],
      trace: [
        S(6, tx('systemd lance l’application.', 'يشغل systemd التطبيق.')),
        S(6, tx('L’application plante avec une erreur.', 'يتعطل التطبيق بسبب خطأ.')),
        S(7, tx('`on-failure` : il y a eu une erreur, donc systemd va relancer.', '`on-failure`: حدث خطأ، إذن سيعيد systemd التشغيل.')),
        S(8, tx('systemd attend 5 secondes.', 'ينتظر systemd مدة 5 ثوان.')),
        S(6, tx('systemd relance l’application.', 'يعيد systemd تشغيل التطبيق.')),
      ],
    },
  ],
  deeper: [
    tx('Après un arrêt manuel avec `systemctl stop`, `Restart=` ne relance jamais l’application.', 'بعد إيقاف يدوي بالأمر `systemctl stop`، لا يعيد `Restart=` تشغيل التطبيق أبدا.'),
    tx('systemd limite aussi le nombre de relances rapides. Après trop d’échecs, il abandonne.', 'يحدد systemd أيضا عدد إعادات التشغيل السريعة، وبعد فشل كثير يتوقف عن المحاولة.'),
    tx('Avec `Type=exec`, `systemctl start` échoue si le programme n’existe pas. Avec le mode par défaut, il peut dire que tout va bien.', 'مع `Type=exec` يفشل `systemctl start` إذا كان البرنامج غير موجود. أما الوضع الافتراضي فقد يقول إن كل شيء بخير.'),
  ],
}

const disk = {
  id: 'disk', type: 'flow',
  nav: tx('Disque et logs', 'القرص والسجلات'),
  title: tx('Lire les logs et trouver ce qui remplit le disque', 'قراءة السجلات ومعرفة ما يملأ القرص'),
  lead: tx('Ce sont les commandes les plus utiles quand un serveur a un problème.', 'هذه أكثر الأوامر فائدة عندما تكون في الخادم مشكلة.'),
  words: [
    word('Logs', 'Le journal où les programmes écrivent ce qui leur arrive.', 'السجلات', 'الملف الذي تكتب فيه البرامج ما يحدث لها.'),
    word('Partition', 'Une partie du disque, montée sur un dossier comme /var.', 'القسم', 'جزء من القرص مربوط بمجلد مثل `/var`.'),
  ],
  source: { label: tx('Manuel de journalctl', 'دليل journalctl'), url: MAN + 'man1/journalctl.1.html' },
  sourceLabel: 'terminal',
  outputLabel: RESULT,
  variants: [
    {
      id: 'logs', label: tx('Lire les erreurs', 'قراءة الأخطاء'),
      note: tx('`-u` choisit le service, `--since` la période, et `-p err` garde seulement les erreurs.', 'يختار `-u` الخدمة، و `--since` الفترة، ويبقي `-p err` الأخطاء فقط.'),
      lines: [L('journalctl -u boutique --since "1 hour ago" -p err --no-pager', 'a')],
      output: [plain('09:12:41 boutique[2143]: database connection failed', 'a'), plain('09:12:47 boutique[2143]: database connection failed')],
    },
    {
      id: 'df', label: tx('Place libre', 'المساحة الحرة'),
      note: tx('`df` montre la place de chaque partition. Ici, /var est presque plein.', 'يعرض `df` مساحة كل قسم. هنا `/var` شبه ممتلئ.'),
      lines: [L('df -h /var', 'a')],
      output: [plain('Filesystem      Size  Used Avail Use% Mounted on', 'a'), plain('/dev/sda2        40G   37G  1.1G  98% /var')],
    },
    {
      id: 'du', label: tx('Qui prend la place ?', 'من يأخذ المساحة؟'),
      note: tx('`df` dit que le disque est plein. `du` dit quels dossiers le remplissent.', 'يخبرك `df` أن القرص ممتلئ، ويخبرك `du` بالمجلدات التي تملؤه.'),
      lines: [L('sudo du -xh --max-depth=2 /var | sort -h | tail -3', 'a')],
      output: [plain('2.1G\t/var/lib/postgresql', 'a'), plain('33G\t/var/log/boutique'), plain('36G\t/var')],
    },
    {
      id: 'open', label: tx('Le piège', 'الفخ'),
      note: tx('Le fichier est supprimé, mais l’application le garde ouvert. La place reste donc occupée jusqu’à ce que l’application le ferme, souvent en la redémarrant.', 'حذف الملف، لكن التطبيق ما زال يفتحه، فتبقى المساحة مشغولة حتى يغلقه التطبيق، وغالبا بإعادة تشغيله.'),
      lines: [L('sudo rm /var/log/boutique/app.log'), L('df -h /var | tail -1', 'a'), L('sudo lsof +L1 | tail -1', 'b')],
      output: [plain('/dev/sda2        40G   37G  1.1G  98% /var', 'a'), plain('boutique 2143 boutique 3w REG 8,2 35G 0 1312 /var/log/boutique/app.log (deleted)', 'b')],
    },
  ],
  deeper: [
    tx('Il faut configurer la rotation des logs avec `logrotate`, sinon ils grossissent sans limite.', 'يجب إعداد تدوير السجلات باستعمال `logrotate`، وإلا كبرت دون حد.'),
    tx('Un disque peut aussi être « plein » sans manquer de place : il n’a plus d’inodes. On le vérifie avec `df -i`.', 'قد يكون القرص ممتلئا دون نقص في المساحة، لأنه لم تبق فيه `inodes`. نتحقق من ذلك بالأمر `df -i`.'),
  ],
}

const URL = 'https://boutique.example'

const incident = {
  id: 'linux-incident', type: 'incident',
  nav: tx('Panne', 'العطل'),
  title: tx('L’application ne démarre plus', 'التطبيق لم يعد يبدأ'),
  lead: tx('Ceci est un exercice. Depuis la dernière mise à jour, l’application ne démarre plus. Réparez-la sans ouvrir de faille de sécurité.', 'هذا تمرين. منذ آخر تحديث لم يعد التطبيق يبدأ. أصلحه دون فتح ثغرة أمنية.'),
  words: [word('Permission denied', 'Le système refuse l’accès à un fichier.', 'Permission denied', 'يرفض النظام الوصول إلى ملف.')],
  source: { label: tx('Manuel de chown', 'دليل chown'), url: MAN + 'man1/chown.1.html' },
  host: 'admin@serveur',
  startTime: '10:05',
  bestMinutes: 7,
  alert: tx('Le service boutique est arrêté.', 'الخدمة boutique متوقفة.'),
  start: 'logs',
  nodes: {
    logs: {
      question: tx('Que faites-vous en premier ?', 'ماذا تفعل أولا؟'),
      options: [
        { cmd: 'journalctl -u boutique -n 2 --no-pager', does: tx('Lire les derniers logs', 'قراءة آخر السجلات'), cost: 2, good: true, next: 'look', output: "boutique[3120]: Error: EACCES: permission denied, open '/etc/boutique/secret.env'\nsystemd[1]: boutique.service: Failed with result 'exit-code'.", comment: tx('L’application n’a pas le droit de lire son fichier de configuration.', 'ليس للتطبيق حق قراءة ملف إعداداته.') },
        { cmd: 'sudo systemctl restart boutique', does: tx('Redémarrer l’application', 'إعادة تشغيل التطبيق'), cost: 3, good: false, output: 'Job for boutique.service failed because the control process exited with error code.', comment: tx('Sans connaître la cause, redémarrer ne sert à rien.', 'دون معرفة السبب، لا تفيد إعادة التشغيل.') },
      ],
    },
    look: {
      question: tx('Que vérifiez-vous ?', 'ماذا تفحص؟'),
      options: [
        { cmd: 'ls -l /etc/boutique/secret.env', does: tx('Voir les droits du fichier', 'رؤية صلاحيات الملف'), cost: 1, good: true, next: 'fix', output: '-rw------- 1 root root 120 Nov  8 09:02 /etc/boutique/secret.env', comment: tx('Le fichier appartient à root, et seul root peut le lire. L’application tourne avec un autre utilisateur.', 'الملف ملك لـ root، ولا يقرؤه غيره. والتطبيق يعمل بمستخدم آخر.') },
        { cmd: 'free -h', does: tx('Voir la mémoire', 'رؤية الذاكرة'), cost: 2, good: false, output: 'Mem:  7.8Gi  1.1Gi  5.2Gi', comment: tx('Le message parle de droits, pas de mémoire.', 'تتحدث الرسالة عن الصلاحيات وليس الذاكرة.') },
      ],
    },
    fix: {
      question: tx('Quelle est la bonne correction ?', 'ما هو الإصلاح الصحيح؟'),
      options: [
        { cmd: 'sudo chown root:boutique /etc/boutique/secret.env && sudo chmod 640 /etc/boutique/secret.env', does: tx('Donner seulement la lecture à l’application', 'إعطاء التطبيق حق القراءة فقط'), cost: 2, good: true, next: 'verify', output: '(aucun message : la commande a réussi)', comment: tx('L’application peut lire, et personne d’autre.', 'يستطيع التطبيق القراءة ولا أحد غيره.') },
        { cmd: 'sudo chmod 666 /etc/boutique/secret.env', does: tx('Donner lecture et écriture à tout le monde', 'إعطاء القراءة والكتابة للجميع'), cost: 4, good: false, output: '(mot de passe lisible par tous les utilisateurs)', comment: tx('Ça marcherait, mais tout le monde peut maintenant lire et modifier le mot de passe.', 'قد ينجح هذا، لكن الجميع يستطيع الآن قراءة كلمة المرور وتعديلها.') },
        { cmd: 'sudo sed -i s/User=boutique/User=root/ /etc/systemd/system/boutique.service', does: tx('Lancer l’application en root', 'تشغيل التطبيق باستعمال root'), cost: 4, good: false, output: '(application lancée avec tous les droits)', comment: tx('Dangereux : si un pirate trouve une faille dans l’application, il a tout le serveur.', 'خطير: إذا وجد مخترق ثغرة في التطبيق، حصل على الخادم كله.') },
      ],
    },
    verify: {
      question: tx('Comment le vérifier ?', 'كيف تتحقق؟'),
      options: [
        { cmd: `sudo systemctl restart boutique && curl -sI ${URL} | head -1`, does: tx('Redémarrer, puis tester comme un client', 'إعادة التشغيل ثم الاختبار كعميل'), cost: 2, good: true, next: 'done', output: 'HTTP/2 200', comment: tx('Le site répond normalement.', 'يجيب الموقع بشكل طبيعي.') },
        { cmd: 'sudo reboot', does: tx('Redémarrer tout le serveur', 'إعادة تشغيل الخادم كله'), cost: 8, good: false, output: 'Connection to serveur closed.', comment: tx('Inutile : seul le service devait redémarrer.', 'غير ضروري: كان يكفي إعادة تشغيل الخدمة.') },
      ],
    },
    done: { end: true },
  },
  postmortem: [
    { term: tx('La cause', 'السبب'), text: tx('Le script de mise à jour a recréé le fichier avec le groupe root.', 'أعاد برنامج التحديث إنشاء الملف بالمجموعة root.') },
    { term: tx('Ce qu’on change', 'ما سنغيره'), text: tx('Le script doit fixer le propriétaire et les droits, et un test doit le vérifier.', 'يجب أن يحدد البرنامج المالك والصلاحيات، وأن يتحقق اختبار من ذلك.') },
  ],
}

const quiz = {
  id: 'linux-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Manuel des signaux', 'دليل الإشارات'), url: MAN + 'man7/signal.7.html' },
  items: [
    { title: tx('Une application peut ignorer SIGKILL.', 'يستطيع التطبيق تجاهل SIGKILL.'), ok: false, why: tx('SIGKILL ne peut être ni attrapé, ni ignoré.', 'لا يمكن التقاط `SIGKILL` ولا تجاهله.') },
    { title: tx('chmod 777 est une bonne solution rapide.', 'chmod 777 حل سريع جيد.'), ok: false, why: tx('Tout le monde peut alors tout faire sur ce fichier.', 'يستطيع الجميع عندها فعل كل شيء بهذا الملف.') },
    { title: tx('Avec Restart=on-failure, systemctl stop relance l’application.', 'مع Restart=on-failure يعيد systemctl stop تشغيل التطبيق.'), ok: false, why: tx('Un arrêt manuel ne déclenche jamais de relance.', 'الإيقاف اليدوي لا يؤدي أبدا إلى إعادة التشغيل.') },
    { title: tx('Un fichier supprimé peut encore occuper le disque.', 'قد يبقى ملف محذوف يشغل القرص.'), ok: true, why: tx('Oui, tant qu’un processus le garde ouvert.', 'نعم، ما دامت عملية تفتحه.') },
    { title: tx('Une application ne devrait pas tourner en root sans raison.', 'يجب ألا يعمل تطبيق باستعمال root دون سبب.'), ok: true, why: tx('Une faille donnerait alors tout le serveur.', 'لأن أي ثغرة ستمنح الخادم كله.') },
  ],
}

export const linuxModule = {
  id: 'linux',
  title: tx('Linux en production', 'Linux في الإنتاج'),
  notions: tx('Processus, droits, signaux, systemd, logs, disque', 'العمليات والصلاحيات والإشارات و systemd والسجلات والقرص'),
  slides: [processes, perms, signals, systemd, disk, incident, quiz],
}
