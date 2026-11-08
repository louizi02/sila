import { L, MEANING, S, ask, bad, card, flow, good, incident, module, no, opt, page, plain, pm, quiz, stage, tx, v, word, yes } from './helpers.js'

const NGX = 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html'
const AWS = 'https://docs.aws.amazon.com/'
const TF = 'https://developer.hashicorp.com/terraform/'
const ANS = 'https://docs.ansible.com/projects/ansible/latest/'

/* ---------- 09 Nginx ---------- */

const nginxConf = flow('nginx-conf', ['Reverse proxy', 'الوسيط العكسي'], ['Nginx reçoit les clients à la place de l’application', 'يستقبل Nginx العملاء بدلا من التطبيق'],
  ['L’application reste cachée derrière Nginx. Nginx gère le HTTPS et transmet les requêtes.', 'يبقى التطبيق مخفيا خلف Nginx، ويدير Nginx بروتوكول HTTPS وينقل الطلبات.'],
  ['Nginx : module proxy', 'Nginx: وحدة الوسيط', NGX],
  { sourceLabel: '/etc/nginx/conf.d/boutique.conf', outputLabel: MEANING,
    words: [word('Reverse proxy', 'Un serveur placé devant l’application.', 'الوسيط العكسي', 'خادم يوضع أمام التطبيق.'), word('Upstream', 'L’application vers laquelle Nginx envoie les requêtes.', 'Upstream', 'التطبيق الذي يرسل إليه Nginx الطلبات.')],
    variants: [v('f', ['Le fichier', 'الملف'], ['Après une modification : `nginx -t` vérifie le fichier, puis `systemctl reload nginx` l’applique sans couper les clients.', 'بعد التعديل: يفحص `nginx -t` الملف، ثم يطبقه `systemctl reload nginx` دون قطع العملاء.'],
      [L('server {'), L('  listen 443 ssl;', 'a'), L('  server_name boutique.example;', 'b'), L('  location / {'), L('    proxy_pass http://127.0.0.1:3000;', 'c'), L('    proxy_set_header Host $host;', 'd'), L('    proxy_read_timeout 30s;', 'e'), L('  }'), L('}')],
      [plain(tx('Reçoit le HTTPS.', 'يستقبل HTTPS.'), 'a'), plain(tx('Pour ce nom de site.', 'لهذا الموقع.'), 'b'), good(tx('Transmet à l’application.', 'ينقل إلى التطبيق.'), 'c'), plain(tx('Garde le nom du site demandé.', 'يحتفظ باسم الموقع المطلوب.'), 'd'), plain(tx('Attend au plus 30 s entre deux lectures.', 'ينتظر 30 ثانية كحد أقصى بين قراءتين.'), 'e')])],
    deeper: [tx('Par défaut, `proxy_read_timeout` vaut 60 secondes.', 'القيمة الافتراضية لـ `proxy_read_timeout` هي 60 ثانية.'), tx('`proxy_set_header` au niveau d’un `location` remplace ceux des niveaux supérieurs.', '`proxy_set_header` في مستوى `location` يعوض ما في المستويات الأعلى.')] })

const nginxErrors = flow('nginx-errors', ['502 ou 504', '502 أو 504'], ['502 ou 504 : ce n’est pas la même panne', '502 أو 504: ليس العطل نفسه'],
  ['Le code d’erreur indique où chercher. Comparez les deux cas.', 'يخبرك رمز الخطأ أين تبحث. قارن بين الحالتين.'],
  ['Nginx : module proxy', 'Nginx: وحدة الوسيط', NGX],
  { sourceLabel: '/var/log/nginx/error.log',
    variants: [
      v('502', ['502', '502'], ['Nginx n’arrive pas à joindre l’application. Vérifiez si elle tourne.', 'لا يستطيع Nginx الوصول إلى التطبيق. تحقق من أنه يعمل.'], [L('connect() failed (111: Connection refused) while connecting to upstream', 'a')], [bad('HTTP/2 502', 'a')]),
      v('504', ['504', '504'], ['L’application accepte la requête, mais répond trop lentement. Cherchez une requête SQL lente ou un service externe.', 'يقبل التطبيق الطلب لكنه يجيب ببطء شديد. ابحث عن استعلام SQL بطيء أو خدمة خارجية.'], [L('upstream timed out (110: Connection timed out) while reading response header from upstream', 'a')], [bad('HTTP/2 504', 'a')]),
    ] })

const nginxIncident = incident('nginx-incident', ['Panne', 'العطل'], ['Le site répond 504 à midi', 'يجيب الموقع 504 عند الظهر'],
  ['Exercice simulé. Chaque midi, la page des commandes tombe en 504.', 'تمرين محاكى. كل ظهر تعطي صفحة الطلبات الخطأ 504.'],
  ['Nginx : module proxy', 'Nginx: وحدة الوسيط', NGX],
  { startTime: '12:04', alert: tx('Erreurs 504 sur /commandes.', 'أخطاء 504 في `/commandes`.'), start: 'a',
    nodes: {
      a: ask('Que faites-vous ?', 'ماذا تفعل؟', [
        opt('tail -1 /var/log/nginx/error.log', 'Lire l’erreur exacte', 'قراءة الخطأ بدقة', 1, true, 'b', 'upstream timed out while reading response header, request: "GET /commandes"', 'L’application est trop lente sur cette page.', 'التطبيق بطيء جدا في هذه الصفحة.'),
        opt('augmenter proxy_read_timeout à 600s', 'Attendre plus longtemps', 'الانتظار مدة أطول', 3, false, undefined, 'Les clients attendent maintenant 10 minutes.', 'L’erreur est cachée, mais la lenteur reste.', 'أخفي الخطأ، لكن البطء ما زال موجودا.'),
      ]),
      b: ask('Qu’est-ce qui ralentit ?', 'ما سبب البطء؟', [
        opt("psql -c \"SELECT query, now()-query_start FROM pg_stat_activity WHERE state='active'\"", 'Voir les requêtes SQL en cours', 'رؤية استعلامات SQL الجارية', 2, true, 'c', 'SELECT * FROM commandes WHERE client_id=… | 00:00:48', 'Une requête prend 48 secondes.', 'يستغرق استعلام 48 ثانية.'),
        opt('sudo reboot', 'Redémarrer le serveur', 'إعادة تشغيل الخادم', 8, false, undefined, 'Connection closed.', 'Le problème revient au prochain pic.', 'تعود المشكلة عند الذروة التالية.'),
      ]),
      c: ask('Comment corriger ?', 'كيف تصلح؟', [
        opt('CREATE INDEX CONCURRENTLY ON commandes (client_id);', 'Ajouter un index sans bloquer la table', 'إضافة فهرس دون قفل الجدول', 6, true, 'done', 'CREATE INDEX\nrequête : 12 ms', 'La requête passe de 48 secondes à 12 millisecondes.', 'ينتقل الاستعلام من 48 ثانية إلى 12 مللي ثانية.'),
        opt('ajouter 10 serveurs web', 'Ajouter des serveurs', 'إضافة خوادم', 20, false, undefined, 'La base est toujours lente.', 'Le blocage est dans la base, pas dans le web.', 'العائق في القاعدة وليس في الويب.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La cause', 'السبب', 'Il manquait un index sur une grande table.', 'كان فهرس ناقصا في جدول كبير.'), pm('Ce qu’on change', 'ما سنغيره', 'Surveiller les requêtes lentes et alerter sur la latence.', 'مراقبة الاستعلامات البطيئة والتنبيه على التأخر.')] })

const nginxQuiz = quiz('nginx-quiz', ['Nginx : documentation', 'توثيق Nginx', 'https://nginx.org/en/docs/'], [
  yes('Un 502 indique souvent que l’application ne répond pas à Nginx.', 'يشير 502 غالبا إلى أن التطبيق لا يجيب Nginx.', 'Nginx n’obtient pas de réponse valide.', 'لا يحصل Nginx على جواب صحيح.'),
  no('Augmenter le délai répare une application lente.', 'زيادة المهلة تصلح التطبيق البطيء.', 'Elle cache seulement le problème.', 'إنها تخفي المشكلة فقط.'),
  yes('nginx -t vérifie la configuration avant de l’appliquer.', 'يفحص nginx -t الإعدادات قبل تطبيقها.', 'Cela évite de casser le site.', 'هذا يجنب تعطيل الموقع.'),
])

/* ---------- 10 Cloud ---------- */

const cloudMap = page('steps', 'cloud-map', ['Les bases', 'الأساسيات'], ['Comment est organisé le cloud', 'كيف تنظم السحابة'],
  ['Le cloud, ce sont des serveurs loués et pilotés avec des API. Les exemples utilisent AWS, mais les idées sont les mêmes ailleurs.', 'السحابة خوادم مستأجرة يتم التحكم فيها عبر واجهات. تستعمل الأمثلة AWS، لكن الأفكار نفسها في غيرها.'],
  ['AWS : qu’est-ce qu’un VPC', 'AWS: ما هو VPC', AWS + 'vpc/latest/userguide/what-is-amazon-vpc.html'],
  { stages: [
    stage('r', 'Région', 'المنطقة', 'eu-west-3', 'Un lieu dans le monde, par exemple Paris. On choisit celle qui est proche des clients.', 'مكان في العالم مثل باريس، ونختار الأقرب إلى العملاء.'),
    stage('a', 'Zone', 'نطاق التوفر', 'AZ', 'Une région contient plusieurs zones séparées. Si une zone tombe, les autres continuent.', 'تحتوي المنطقة على عدة نطاقات منفصلة، وإذا تعطل نطاق تواصل الأخرى.'),
    stage('v', 'VPC', 'VPC', '10.0.0.0/16', 'Votre réseau privé dans le cloud.', 'شبكتك الخاصة في السحابة.'),
    stage('s', 'Sous-réseaux', 'الشبكات الفرعية', 'public / privé', 'Le sous-réseau public peut parler à Internet. La base de données reste dans le privé.', 'الشبكة الفرعية العامة تتصل بالإنترنت، وتبقى قاعدة البيانات في الخاصة.'),
    stage('g', 'Groupe de sécurité', 'مجموعة الأمان', 'pare-feu', 'Il choisit qui peut entrer sur quel port. Exemple : la base accepte seulement les serveurs web.', 'تحدد من يدخل وعلى أي منفذ. مثال: تقبل القاعدة خوادم الويب فقط.'),
  ] })

const iam = page('rules', 'iam', ['IAM', 'IAM'], ['Qui a le droit de faire quoi ?', 'من له الحق في ماذا؟'],
  ['IAM gère les droits dans le cloud. Une erreur ici peut coûter très cher. Cliquez sur les cartes.', 'يدير IAM الصلاحيات في السحابة، والخطأ هنا قد يكلف كثيرا. انقر على البطاقات.'],
  ['AWS : bonnes pratiques IAM', 'AWS: أفضل ممارسات IAM', AWS + 'IAM/latest/UserGuide/best-practices.html'], { reveal: true, items: [
    card('Droits minimum', 'أقل الصلاحيات', 'Donnez seulement les actions nécessaires, sur les ressources nécessaires.', 'أعط فقط الإجراءات والموارد اللازمة.'),
    card('Identifiants temporaires', 'بيانات مؤقتة', 'Les personnes et les applications doivent utiliser des accès temporaires, avec des rôles.', 'يجب أن يستعمل الأشخاص والتطبيقات وصولا مؤقتا عبر الأدوار.'),
    card('Double authentification', 'التحقق المزدوج', 'Activez la MFA pour les comptes importants.', 'فعل `MFA` للحسابات المهمة.'),
    card('Protéger root', 'حماية root', 'Le compte root peut tout faire. Ne l’utilisez pas tous les jours.', 'يستطيع حساب `root` فعل كل شيء، فلا تستعمله يوميا.'),
    card('Nettoyer', 'التنظيف', 'Supprimez les utilisateurs, clés et droits qui ne servent plus.', 'احذف المستخدمين والمفاتيح والصلاحيات غير المستعملة.'),
  ] })

const cost = page('rules', 'cost', ['Coûts', 'التكاليف'], ['Éviter les mauvaises surprises sur la facture', 'تجنب المفاجآت في الفاتورة'],
  ['Dans le cloud, tout ce qui tourne se paie. Cliquez sur les cartes.', 'في السحابة، كل ما يعمل يدفع ثمنه. انقر على البطاقات.'],
  ['AWS : Well-Architected, coûts', 'AWS: إطار التكاليف', AWS + 'wellarchitected/latest/cost-optimization-pillar/welcome.html'], { reveal: true, items: [
    card('Alerte de budget', 'تنبيه الميزانية', 'Créez une alerte le premier jour.', 'أنشئ تنبيها منذ اليوم الأول.'),
    card('Éteindre', 'الإيقاف', 'Un serveur de test oublié continue de coûter de l’argent.', 'خادم اختبار منسي يواصل كلفة المال.'),
    card('Bonne taille', 'الحجم المناسب', 'Regardez l’usage réel avant de choisir une machine.', 'انظر إلى الاستعمال الحقيقي قبل اختيار الجهاز.'),
    card('Étiquettes', 'الوسوم', 'Marquez chaque ressource avec son projet pour savoir qui coûte quoi.', 'ضع على كل مورد اسم مشروعه لمعرفة تكلفة كل شيء.'),
  ] })

const cloudQuiz = quiz('cloud-quiz', ['AWS : bonnes pratiques IAM', 'AWS: أفضل ممارسات IAM', AWS + 'IAM/latest/UserGuide/best-practices.html'], [
  no('La base de données doit être accessible depuis Internet.', 'يجب أن تكون قاعدة البيانات متاحة من الإنترنت.', 'Elle reste dans un réseau privé.', 'تبقى في شبكة خاصة.'),
  yes('Une application doit préférer un rôle à une clé longue durée.', 'يجب أن يفضل التطبيق دورا على مفتاح طويل الأمد.', 'Le rôle donne des accès temporaires.', 'يعطي الدور وصولا مؤقتا.'),
  yes('Utiliser plusieurs zones réduit le risque de panne.', 'استعمال عدة نطاقات يقلل خطر العطل.', 'Une zone peut tomber sans les autres.', 'قد يتعطل نطاق دون الأخرى.'),
])

/* ---------- 11 Terraform ---------- */

const tfCode = flow('tf-code', ['Le code', 'الكود'], ['Décrire son infrastructure dans un fichier', 'وصف البنية التحتية في ملف'],
  ['Avec Terraform, on écrit ce qu’on veut obtenir. L’outil calcule ce qu’il doit créer, modifier ou supprimer.', 'مع Terraform نكتب ما نريد الحصول عليه، وتحسب الأداة ما يجب إنشاؤه أو تعديله أو حذفه.'],
  ['Terraform : documentation', 'توثيق Terraform', TF + 'docs'],
  { sourceLabel: 'main.tf', outputLabel: MEANING,
    words: [word('Ressource', 'Un élément de l’infrastructure : serveur, réseau, base.', 'المورد', 'عنصر في البنية التحتية: خادم أو شبكة أو قاعدة.'), word('Plan', 'La liste des changements, avant de les faire.', 'الخطة', 'قائمة التغييرات قبل تنفيذها.')],
    variants: [v('f', ['main.tf', 'main.tf'], ['Le cycle est toujours le même : `terraform plan` pour vérifier, puis `terraform apply` pour appliquer.', 'الدورة نفسها دائما: `terraform plan` للتحقق، ثم `terraform apply` للتطبيق.'],
      [L('resource "aws_instance" "web" {', 'a'), L('  ami           = "ami-0abc123"', 'b'), L('  instance_type = "t3.small"', 'c'), L('  tags = { Projet = "boutique" }', 'd'), L('}')],
      [plain(tx('Je veux un serveur appelé web.', 'أريد خادما اسمه `web`.'), 'a'), plain(tx('Le système de départ.', 'النظام الأساسي.'), 'b'), plain(tx('La taille de la machine.', 'حجم الجهاز.'), 'c'), good(tx('Pour suivre les coûts.', 'لمتابعة التكاليف.'), 'd')])] })

const tfPlan = flow('tf-plan', ['Lire un plan', 'قراءة الخطة'], ['Toujours lire le plan avant d’appliquer', 'اقرأ الخطة دائما قبل التطبيق'],
  ['Le signe devant chaque ligne dit ce qui va se passer. Un seul caractère peut signifier « supprimer la production ».', 'تدل العلامة أمام كل سطر على ما سيحدث، وحرف واحد قد يعني «حذف الإنتاج».'],
  ['Terraform : plan', 'Terraform: plan', TF + 'cli/commands/plan'],
  { words: [word('+', 'Créer', '+', 'إنشاء'), word('~', 'Modifier sans recréer', '~', 'تعديل دون إعادة إنشاء'), word('-/+', 'Supprimer, puis recréer', '-/+', 'حذف ثم إعادة إنشاء')],
    variants: [
      v('add', ['Créer', 'إنشاء'], ['Rien n’est détruit : le plan est sans danger.', 'لا يتم تدمير شيء: الخطة دون خطر.'], [L('terraform plan', 'a')], [good('  + resource "aws_instance" "web"', 'a'), plain('Plan: 1 to add, 0 to change, 0 to destroy.')]),
      v('change', ['Modifier', 'تعديل'], ['La ressource est modifiée sur place.', 'يعدل المورد في مكانه.'], [L('terraform plan', 'a')], [plain('  ~ tags = { Projet = "boutique" }', 'a'), plain('Plan: 0 to add, 1 to change, 0 to destroy.')]),
      v('replace', ['Remplacer', 'تعويض'], ['Attention : cette base va être détruite. Si vous appliquez, ses données partent avec.', 'انتبه: ستدمر هذه القاعدة، وإذا طبقت ذلك ضاعت بياناتها معها.'], [L('terraform plan', 'a')], [bad('-/+ resource "aws_db_instance" "base" # forces replacement', 'a'), bad('Plan: 1 to add, 0 to change, 1 to destroy.')]),
    ],
    deeper: [tx('Ajoutez `prevent_destroy = true` sur les ressources importantes.', 'أضف `prevent_destroy = true` إلى الموارد المهمة.'), tx('Le pipeline peut afficher le plan dans la pull request pour le faire relire.', 'يمكن للمسار عرض الخطة في طلب الدمج لمراجعتها.')] })

const tfState = page('rules', 'tf-state', ['State', 'الحالة'], ['Le fichier state, le cœur de Terraform', 'ملف الحالة، قلب Terraform'],
  ['Le state est la mémoire de Terraform : il relie votre code aux vraies ressources. Cliquez sur les cartes.', 'الحالة هي ذاكرة Terraform: تربط كودك بالموارد الحقيقية. انقر على البطاقات.'],
  ['Terraform : state', 'Terraform: الحالة', TF + 'language/state'], { reveal: true, items: [
    card('Ne pas le mettre dans Git', 'لا تضعه في Git', 'Le state peut contenir des secrets.', 'قد تحتوي الحالة على أسرار.'),
    card('Le garder à distance', 'حفظه عن بعد', 'Toute l’équipe doit utiliser le même state, dans un stockage sécurisé.', 'يجب أن يستعمل الفريق كله الحالة نفسها في تخزين آمن.'),
    card('Le verrouiller', 'قفله', 'Le verrou empêche deux personnes d’appliquer en même temps.', 'يمنع القفل شخصين من التطبيق في الوقت نفسه.'),
    card('Ne pas l’éditer', 'لا تعدله', 'Utilisez la commande `terraform state`, jamais un éditeur.', 'استعمل الأمر `terraform state` وليس محررا.'),
    card('La dérive', 'الانحراف', 'Si quelqu’un change le cloud à la main, le plan le montrera. Évitez ces changements.', 'إذا غير شخص السحابة يدويا ستظهر ذلك الخطة، فتجنب هذه التغييرات.'),
    card('OpenTofu', 'OpenTofu', 'Une version libre de Terraform, avec des commandes très proches.', 'نسخة حرة من Terraform بأوامر قريبة جدا.'),
  ] })

const tfIncident = incident('tf-incident', ['Décision', 'القرار'], ['Le plan veut détruire la base', 'الخطة تريد تدمير القاعدة'],
  ['Exercice simulé. Vous avez juste renommé une ressource, et le plan annonce « 1 to destroy ».', 'تمرين محاكى. غيرت اسم مورد فقط، وتعلن الخطة `1 to destroy`.'],
  ['Terraform : moved', 'Terraform: moved', TF + 'language/moved'],
  { startTime: '10:15', alert: tx('Plan: 1 to add, 0 to change, 1 to destroy.', 'Plan: 1 to add, 0 to change, 1 to destroy.'), start: 'a',
    nodes: {
      a: ask('Que faites-vous ?', 'ماذا تفعل؟', [
        opt('lire le détail du plan', 'Comprendre pourquoi', 'فهم السبب', 2, true, 'b', '# aws_db_instance.base will be destroyed\n# aws_db_instance.principale will be created', 'Pour Terraform, l’ancien nom disparaît et un nouveau arrive. Il ne sait pas que c’est la même base.', 'بالنسبة لـ Terraform يختفي الاسم القديم ويظهر جديد، ولا يعرف أنها القاعدة نفسها.'),
        opt('terraform apply -auto-approve', 'Appliquer sans lire', 'التطبيق دون قراءة', 30, false, undefined, 'aws_db_instance.base: Destroying...', 'La base est détruite. Il faut restaurer une sauvegarde.', 'دمرت القاعدة، ويجب استعادة نسخة احتياطية.'),
      ]),
      b: ask('Comment renommer sans détruire ?', 'كيف تغير الاسم دون تدمير؟', [
        opt('moved { from = aws_db_instance.base  to = aws_db_instance.principale }', 'Dire à Terraform que la ressource a changé de nom', 'إخبار Terraform بتغير اسم المورد', 3, true, 'done', 'Plan: 0 to add, 0 to change, 0 to destroy.', 'Terraform comprend que c’est la même base.', 'يفهم Terraform أنها القاعدة نفسها.'),
        opt('supprimer le fichier state', 'Effacer la mémoire de Terraform', 'مسح ذاكرة Terraform', 20, false, undefined, 'Plan: 12 to add.', 'Terraform ne connaît plus rien et veut tout recréer.', 'لم يعد Terraform يعرف شيئا ويريد إعادة إنشاء كل شيء.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La leçon', 'الدرس', 'Un plan se lit toujours, surtout quand il contient « destroy ».', 'تقرأ الخطة دائما، خصوصا عندما تحتوي على `destroy`.')] })

const tfQuiz = quiz('tf-quiz', ['Terraform : state', 'Terraform: الحالة', TF + 'language/state'], [
  no('Le fichier state peut aller dans Git sans risque.', 'يمكن وضع ملف الحالة في Git دون خطر.', 'Il peut contenir des secrets.', 'قد يحتوي على أسرار.'),
  yes('Le verrou évite deux applications en même temps.', 'يمنع القفل تطبيقين في الوقت نفسه.', 'Sinon, le state peut être abîmé.', 'وإلا قد تتضرر الحالة.'),
  no('Il est inutile de lire le plan si le code a été relu.', 'لا حاجة لقراءة الخطة إذا تمت مراجعة الكود.', 'Seul le plan montre l’effet réel.', 'الخطة وحدها تعرض الأثر الحقيقي.'),
])

/* ---------- 12 Ansible ---------- */

const playbook = flow('playbook', ['Playbook', 'Playbook'], ['Configurer dix serveurs comme un seul', 'إعداد عشرة خوادم كخادم واحد'],
  ['Terraform crée les serveurs. Ansible les configure : paquets, fichiers, services. Il se connecte simplement en SSH.', 'ينشئ Terraform الخوادم، ويعدها Ansible: الحزم والملفات والخدمات. ويتصل ببساطة عبر SSH.'],
  ['Ansible : glossaire', 'Ansible: المصطلحات', ANS + 'reference_appendices/glossary.html'],
  { outputLabel: MEANING,
    words: [word('Inventaire', 'La liste des serveurs.', 'المخزون', 'قائمة الخوادم.'), word('Playbook', 'Le fichier qui décrit ce qu’il faut faire.', 'Playbook', 'الملف الذي يصف ما يجب فعله.'), word('Tâche', 'Une action à faire sur les serveurs.', 'المهمة', 'إجراء ينفذ على الخوادم.')],
    variants: [v('f', ['Les fichiers', 'الملفات'], ['On lance : `ansible-playbook -i inventaire.ini web.yml`.', 'ننفذ: `ansible-playbook -i inventaire.ini web.yml`.'], undefined,
      [plain(tx('Les serveurs du groupe web.', 'خوادم مجموعة `web`.'), 'a'), plain(tx('S’applique à ce groupe.', 'يطبق على هذه المجموعة.'), 'b'), good(tx('Nginx doit être installé.', 'يجب أن يكون Nginx مثبتا.'), 'c')],
      { files: [
        { label: 'inventaire.ini', lines: [L('[web]', 'a'), L('web1.example'), L('web2.example')] },
        { label: 'web.yml', lines: [L('- hosts: web', 'b'), L('  become: true'), L('  tasks:'), L('    - name: Installer nginx'), L('      ansible.builtin.apt:', 'c'), L('        name: nginx'), L('        state: present')] },
      ] })] })

const idem = flow('ansible-idem', ['Relancer', 'إعادة التشغيل'], ['Lancer deux fois ne change rien', 'التشغيل مرتين لا يغير شيئا'],
  ['Ansible dit l’état souhaité : « nginx doit être installé ». S’il l’est déjà, il ne fait rien.', 'يصف Ansible الحالة المطلوبة: «يجب أن يكون nginx مثبتا». وإذا كان مثبتا لا يفعل شيئا.'],
  ['Ansible : glossaire', 'Ansible: المصطلحات', ANS + 'reference_appendices/glossary.html'],
  { variants: [
    v('one', ['1re fois', 'المرة الأولى'], ['`changed=1` : nginx a été installé.', '`changed=1`: تم تثبيت nginx.'], [L('ansible-playbook web.yml', 'a')], [good('web1 : ok=2  changed=1  unreachable=0  failed=0', 'a')]),
    v('two', ['2e fois', 'المرة الثانية'], ['`changed=0` : tout était déjà correct. C’est l’idempotence.', '`changed=0`: كان كل شيء صحيحا، وهذا هو التكرار الآمن.'], [L('ansible-playbook web.yml', 'a')], [good('web1 : ok=2  changed=0  unreachable=0  failed=0', 'a')]),
    v('shell', ['Avec shell', 'مع shell'], ['Une commande `shell` ne sait pas si le travail est déjà fait. Elle dit toujours « changed ». Préférez un vrai module.', 'لا يعرف أمر `shell` هل تم العمل بالفعل، فيقول دائما `changed`. فضل وحدة حقيقية.'], [L('- ansible.builtin.shell: apt-get install -y nginx', 'a')], [bad('web1 : ok=2  changed=1  unreachable=0  failed=0', 'a')]),
  ], deeper: [tx('Chiffrez les mots de passe avec Ansible Vault. Ne les mettez jamais en clair dans Git.', 'شفر كلمات المرور باستعمال `Ansible Vault`، ولا تضعها واضحة في Git أبدا.'), tx('Testez d’abord avec `--check --diff` pour voir les changements sans les faire.', 'اختبر أولا بالخيار `--check --diff` لرؤية التغييرات دون تنفيذها.')] })

const ansibleQuiz = quiz('ansible-quiz', ['Ansible : documentation', 'توثيق Ansible', ANS], [
  yes('Ansible peut configurer plusieurs serveurs avec le même fichier.', 'يستطيع Ansible إعداد عدة خوادم بالملف نفسه.', 'Les serveurs sont listés dans l’inventaire.', 'تسرد الخوادم في المخزون.'),
  no('Le module shell est toujours le meilleur choix.', 'وحدة shell هي الخيار الأفضل دائما.', 'Un module dédié sait vérifier l’état.', 'تعرف الوحدة المخصصة كيف تتحقق من الحالة.'),
  yes('changed=0 au second passage est un bon signe.', '`changed=0` في المرة الثانية علامة جيدة.', 'Le playbook est idempotent.', 'الملف متكرر بأمان.'),
])

export const nginxModule = module('nginx', ['Nginx et reverse proxy', 'Nginx والوسيط العكسي'], ['Proxy, délais, 502 et 504', 'الوسيط والمهل و 502 و 504'], [nginxConf, nginxErrors, nginxIncident, nginxQuiz])
export const cloudModule = module('cloud', ['Le cloud', 'السحابة'], ['Régions, réseau, IAM, coûts', 'المناطق والشبكة و IAM والتكاليف'], [cloudMap, iam, cost, cloudQuiz])
export const terraformModule = module('terraform', ['Terraform', 'Terraform'], ['Code, plan, state, renommage', 'الكود والخطة والحالة وتغيير الأسماء'], [tfCode, tfPlan, tfState, tfIncident, tfQuiz])
export const ansibleModule = module('ansible', ['Ansible', 'Ansible'], ['Inventaire, playbook, idempotence', 'المخزون و Playbook والتكرار الآمن'], [playbook, idem, ansibleQuiz])
