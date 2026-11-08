import { L, MEANING, S, ask, bad, card, flow, good, incident, module, no, opt, page, plain, pm, quiz, stage, tx, v, word, yes } from './helpers.js'

const D = 'https://docs.docker.com/'
const GH = 'https://docs.github.com/en/actions/'

/* ---------- 05 Docker ---------- */

const dockerPath = page('steps', 'docker-path', ['Image et conteneur', 'الصورة والحاوية'], ['De Dockerfile au conteneur', 'من Dockerfile إلى الحاوية'],
  ['Docker met une application et tout ce dont elle a besoin dans un paquet. Ce paquet démarre de la même façon partout.', 'يضع Docker التطبيق وكل ما يحتاجه في حزمة، وتبدأ هذه الحزمة بالطريقة نفسها في كل مكان.'],
  ['Docker : concepts', 'Docker: المفاهيم', D + 'get-started/'],
  { stages: [
    stage('file', 'Dockerfile', 'Dockerfile', 'recette', 'Un fichier texte qui explique comment fabriquer l’image.', 'ملف نصي يشرح كيفية صنع الصورة.', 'FROM node:22\nCOPY . .\nCMD ["node", "app.js"]'),
    stage('build', 'Image', 'الصورة', 'docker build', 'L’image est le paquet fabriqué. Elle ne change plus. Elle est faite de couches.', 'الصورة هي الحزمة المصنوعة، ولا تتغير بعد ذلك، وهي مكونة من طبقات.', 'docker build -t boutique:v42 .'),
    stage('push', 'Registre', 'السجل', 'docker push', 'Un registre est un entrepôt d’images. Les serveurs viennent y chercher l’image.', 'السجل مستودع للصور، وتأتي الخوادم لتأخذ الصورة منه.', 'docker push registre.example/boutique:v42'),
    stage('run', 'Conteneur', 'الحاوية', 'docker run', 'Un conteneur est une image en train de tourner. Pour Linux, c’est un processus isolé.', 'الحاوية صورة قيد التشغيل، وهي بالنسبة لـ Linux عملية معزولة.', 'docker run -p 8080:3000 boutique:v42'),
  ] })

const dockerfile = flow('layers', ['Dockerfile', 'Dockerfile'], ['Un Dockerfile rapide et petit', 'ملف Dockerfile سريع وصغير'],
  ['Chaque ligne crée une couche. Docker réutilise une couche si rien n’a changé avant elle. L’ordre des lignes compte donc beaucoup.', 'كل سطر ينشئ طبقة، ويعيد Docker استعمالها إذا لم يتغير شيء قبلها. لذلك ترتيب الأسطر مهم جدا.'],
  ['Docker : multi-stage', 'Docker: البناء متعدد المراحل', D + 'build/building/multi-stage/'],
  { sourceLabel: 'Dockerfile', outputLabel: MEANING,
    words: [
      word('Couche', 'Une étape enregistrée de l’image.', 'الطبقة', 'خطوة محفوظة من الصورة.'),
      word('Cache', 'Des couches gardées pour ne pas tout refaire.', 'الذاكرة المؤقتة', 'طبقات محفوظة لتجنب إعادة كل شيء.'),
      word('Multi-stage', 'Construire dans une image, puis garder seulement le résultat.', 'متعدد المراحل', 'البناء في صورة ثم الاحتفاظ بالنتيجة فقط.'),
    ],
    variants: [
      v('bad', ['Mauvais ordre', 'ترتيب سيئ'], ['Si vous changez une seule ligne de code, `npm ci` recommence entièrement. Chaque build est lent.', 'إذا غيرت سطرا واحدا من الكود، يعيد `npm ci` العمل كاملا، فيصبح كل بناء بطيئا.'],
        [L('FROM node:22'), L('COPY . .', 'a'), L('RUN npm ci', 'b'), L('CMD ["node", "app.js"]')],
        [plain(tx('Le code change : cette couche change.', 'يتغير الكود، فتتغير هذه الطبقة.'), 'a'), bad(tx('Donc tout est réinstallé.', 'إذن يعاد تثبيت كل شيء.'), 'b')]),
      v('good', ['Bon ordre', 'ترتيب جيد'], ['Les dépendances sont installées avant de copier le code. Elles restent dans le cache tant que le fichier package-lock.json ne change pas.', 'تثبت التبعيات قبل نسخ الكود، وتبقى في الذاكرة المؤقتة ما دام `package-lock.json` لم يتغير.'],
        [L('FROM node:22'), L('COPY package*.json ./', 'a'), L('RUN npm ci', 'b'), L('COPY . .', 'c'), L('CMD ["node", "app.js"]')],
        [plain(tx('Change rarement.', 'يتغير نادرا.'), 'a'), good(tx('Réutilisé depuis le cache.', 'يعاد استعماله من الذاكرة المؤقتة.'), 'b'), plain(tx('Seule cette couche est refaite.', 'تعاد هذه الطبقة فقط.'), 'c')]),
      v('multi', ['Multi-stage', 'متعدد المراحل'], ['Les outils de construction restent dans la première étape. L’image finale ne contient que le site : elle est plus petite et plus sûre.', 'تبقى أدوات البناء في المرحلة الأولى، ولا تحتوي الصورة النهائية إلا على الموقع، فهي أصغر وأكثر أمانا.'],
        [L('FROM node:22 AS build', 'a'), L('WORKDIR /app'), L('COPY . .'), L('RUN npm ci && npm run build', 'b'), L(''), L('FROM nginx:1.27', 'c'), L('COPY --from=build /app/dist /usr/share/nginx/html', 'd')],
        [plain(tx('Étape 1 : avec les outils.', 'المرحلة 1: مع الأدوات.'), 'a'), plain(tx('Fabrique le site.', 'يصنع الموقع.'), 'b'), plain(tx('Étape 2 : image finale.', 'المرحلة 2: الصورة النهائية.'), 'c'), good(tx('Garde seulement le résultat.', 'يحتفظ بالنتيجة فقط.'), 'd')]),
    ],
    deeper: [
      tx('Ajoutez un fichier `.dockerignore` pour ne pas copier `node_modules` ou `.git` dans l’image.', 'أضف ملف `.dockerignore` حتى لا تنسخ `node_modules` أو `.git` إلى الصورة.'),
      tx('Un secret copié dans une couche reste dans l’image, même si une ligne suivante le supprime.', 'السر المنسوخ في طبقة يبقى في الصورة، حتى إذا حذفه سطر لاحق.'),
    ] })

const dockerStop = flow('docker-stop', ['Arrêt', 'الإيقاف'], ['Pourquoi docker stop prend 10 secondes ?', 'لماذا يستغرق docker stop عشر ثوان؟'],
  ['`docker stop` envoie SIGTERM au processus principal. S’il ne s’arrête pas après 10 secondes, Docker envoie SIGKILL.', 'يرسل `docker stop` الإشارة `SIGTERM` إلى العملية الرئيسية. وإذا لم تتوقف بعد 10 ثوان، يرسل Docker الإشارة `SIGKILL`.'],
  ['Docker : docker stop', 'Docker: docker stop', D + 'reference/cli/docker/container/stop/'],
  { sourceLabel: 'Dockerfile',
    variants: [
      v('shell', ['CMD sans crochets', 'CMD بدون أقواس'], ['Ici, un shell est le processus principal. Il reçoit le signal, mais il ne le transmet pas à Node. Docker attend, puis tue tout : les requêtes en cours sont perdues.', 'هنا الصدفة هي العملية الرئيسية، فتستقبل الإشارة ولا تنقلها إلى Node. ينتظر Docker ثم يقتل كل شيء، فتضيع الطلبات الجارية.'],
        [L('CMD node app.js', 'a')], [bad(tx('Attend 10 s, puis arrêt forcé.', 'ينتظر 10 ثوان ثم يوقف بالقوة.'), 'a')]),
      v('exec', ['CMD avec crochets', 'CMD مع أقواس'], ['Node est directement le processus principal. Il reçoit SIGTERM et peut s’arrêter proprement.', 'Node هو العملية الرئيسية مباشرة، فيستقبل `SIGTERM` ويستطيع التوقف بشكل سليم.'],
        [L('CMD ["node", "app.js"]', 'a')], [good(tx('SIGTERM arrive à l’application.', 'تصل `SIGTERM` إلى التطبيق.'), 'a')]),
    ] })

const dockerIncident = incident('docker-incident', ['Panne', 'العطل'], ['Ça marche sur mon PC, pas dans le conteneur', 'يعمل على حاسوبي وليس في الحاوية'],
  ['Exercice simulé. Le conteneur tourne, mais le site ne répond pas sur le port 8080.', 'تمرين محاكى. الحاوية تعمل، لكن الموقع لا يجيب على المنفذ 8080.'],
  ['Docker : publier des ports', 'Docker: نشر المنافذ', D + 'get-started/docker-concepts/running-containers/publishing-ports/'],
  { startTime: '11:00', alert: tx('curl localhost:8080 : Connection reset', 'curl localhost:8080: انقطع الاتصال'), start: 'a',
    nodes: {
      a: ask('Que regardez-vous d’abord ?', 'ماذا تفحص أولا؟', [
        opt('docker ps', 'Voir si le conteneur tourne et ses ports', 'رؤية هل تعمل الحاوية ومنافذها', 1, true, 'b', 'IMAGE          STATUS       PORTS\nboutique:v42   Up 2 min     0.0.0.0:8080->3000/tcp', 'Le conteneur tourne, et le port 8080 est bien relié au port 3000.', 'الحاوية تعمل، والمنفذ 8080 مربوط فعلا بالمنفذ 3000.'),
        opt('docker system prune -a', 'Tout supprimer', 'حذف كل شيء', 6, false, undefined, 'Total reclaimed space: 4.2GB', 'Vous avez supprimé des images sans rien comprendre.', 'حذفت صورا دون فهم أي شيء.'),
      ]),
      b: ask('Le port est relié. Et maintenant ?', 'المنفذ مربوط. وماذا الآن؟', [
        opt('docker logs boutique', 'Lire les logs du conteneur', 'قراءة سجلات الحاوية', 1, true, 'c', 'Server listening on 127.0.0.1:3000', 'Voilà le problème : dans le conteneur, 127.0.0.1 veut dire « seulement le conteneur ».', 'هذه هي المشكلة: داخل الحاوية يعني `127.0.0.1` «الحاوية فقط».'),
        opt('docker restart boutique', 'Redémarrer le conteneur', 'إعادة تشغيل الحاوية', 2, false, undefined, 'boutique', 'Le même réglage repart avec le conteneur.', 'يعود الإعداد نفسه مع الحاوية.'),
      ]),
      c: ask('Comment corriger ?', 'كيف تصلح؟', [
        opt('HOST=0.0.0.0 dans la configuration, puis nouvelle image', 'Écouter sur toutes les adresses du conteneur', 'الاستماع على كل عناوين الحاوية', 3, true, 'done', 'Server listening on 0.0.0.0:3000\nHTTP/1.1 200 OK', 'Le trafic qui arrive dans le conteneur atteint maintenant l’application.', 'تصل الآن الحركة القادمة إلى الحاوية إلى التطبيق.'),
        opt('docker run --privileged boutique:v42', 'Donner tous les droits au conteneur', 'إعطاء الحاوية كل الصلاحيات', 3, false, undefined, 'Server listening on 127.0.0.1:3000', 'Ce n’est pas un problème de droits, et ce réglage est dangereux.', 'هذه ليست مشكلة صلاحيات، وهذا الإعداد خطير.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La cause', 'السبب', 'L’application écoutait seulement à l’intérieur du conteneur.', 'كان التطبيق يستمع داخل الحاوية فقط.'), pm('Ce qu’on change', 'ما سنغيره', 'Un test vérifie le port depuis l’extérieur du conteneur.', 'يتحقق اختبار من المنفذ من خارج الحاوية.')] })

const dockerQuiz = quiz('docker-quiz', ['Docker : documentation', 'توثيق Docker', D], [
  yes('Un conteneur est un processus isolé.', 'الحاوية عملية معزولة.', 'Il partage le noyau de la machine.', 'تتشارك نواة الجهاز.'),
  no('Supprimer un secret dans une couche suivante le fait disparaître de l’image.', 'حذف سر في طبقة لاحقة يزيله من الصورة.', 'Il reste dans la couche précédente.', 'يبقى في الطبقة السابقة.'),
  yes('L’ordre des lignes du Dockerfile change la vitesse du build.', 'ترتيب أسطر Dockerfile يغير سرعة البناء.', 'À cause du cache des couches.', 'بسبب ذاكرة الطبقات المؤقتة.'),
  no('Dans un conteneur, 127.0.0.1 désigne la machine hôte.', 'داخل الحاوية يدل 127.0.0.1 على الجهاز المضيف.', 'Il désigne le conteneur lui-même.', 'يدل على الحاوية نفسها.'),
])

/* ---------- 06 Compose ---------- */

const composeFile = flow('compose', ['Compose', 'Compose'], ['Lancer plusieurs conteneurs ensemble', 'تشغيل عدة حاويات معا'],
  ['Une application a souvent besoin d’une base de données. Compose décrit tous les conteneurs dans un seul fichier.', 'يحتاج التطبيق غالبا إلى قاعدة بيانات، ويصف Compose كل الحاويات في ملف واحد.'],
  ['Docker Compose', 'Docker Compose', D + 'compose/'],
  { sourceLabel: 'compose.yaml', outputLabel: MEANING,
    words: [word('Service', 'Un conteneur décrit dans Compose.', 'الخدمة', 'حاوية موصوفة في Compose.'), word('Volume', 'Un espace disque qui survit au conteneur.', 'القرص الدائم', 'مساحة قرص تبقى بعد الحاوية.')],
    variants: [v('f', ['Le fichier', 'الملف'], ['On lance tout avec `docker compose up -d`. Le service web joint la base avec le nom `db`.', 'نشغل كل شيء بالأمر `docker compose up -d`، وتصل خدمة `web` إلى القاعدة بالاسم `db`.'],
      [L('services:'), L('  web:'), L('    build: .', 'a'), L('    ports: ["8080:3000"]', 'b'), L('  db:'), L('    image: postgres:18', 'c'), L('    volumes:'), L('      - data:/var/lib/postgresql', 'd'), L('volumes:'), L('  data:')],
      [plain(tx('Construit l’image depuis ce dossier.', 'يبني الصورة من هذا المجلد.'), 'a'), plain(tx('Port 8080 du PC vers 3000 du conteneur.', 'المنفذ 8080 للحاسوب نحو 3000 للحاوية.'), 'b'), plain(tx('Utilise une image existante.', 'يستعمل صورة موجودة.'), 'c'), good(tx('Les données restent après l’arrêt.', 'تبقى البيانات بعد الإيقاف.'), 'd')])] })

const dbLines = [L('web:'), L('  depends_on:'), L('    db:'), L('      condition: service_healthy'), L('db:'), L('  healthcheck:'), L('    test: ["CMD-SHELL", "pg_isready"]')]
const composeOrder = flow('healthy', ['Démarrage', 'البدء'], ['Démarré ne veut pas dire prêt', 'البدء لا يعني الجاهزية'],
  ['La base met du temps à être prête. Lancez le démarrage et regardez ce qui se passe.', 'تحتاج القاعدة إلى وقت لتصبح جاهزة. شغل البدء ولاحظ ما يحدث.'],
  ['Compose : ordre de démarrage', 'Compose: ترتيب البدء', D + 'compose/how-tos/startup-order/'],
  { sourceLabel: 'compose.yaml',
    words: [word('Healthcheck', 'Une commande qui vérifie que le service est vraiment prêt.', 'فحص الصحة', 'أمر يتحقق من أن الخدمة جاهزة فعلا.')],
    variants: [
      v('alone', ['depends_on seul', 'depends_on وحده'], ['`depends_on` seul donne l’ordre de démarrage. Compose attend que la base tourne, pas qu’elle soit prête.', '`depends_on` وحده يعطي ترتيب البدء. ينتظر Compose أن تعمل القاعدة، لا أن تصبح جاهزة.'],
        [L('web:'), L('  depends_on: [db]'), L('db:'), L('  image: postgres:18')], [], { hideBrowser: true, trace: [S(4, tx('La base démarre, mais elle n’est pas encore prête.', 'تبدأ القاعدة لكنها ليست جاهزة بعد.')), S(2, tx('Le web démarre tout de suite.', 'يبدأ `web` فورا.')), S(1, tx('Erreur : connexion à la base impossible.', 'خطأ: تعذر الاتصال بالقاعدة.'))] }),
      v('ok', ['Avec healthcheck', 'مع فحص الصحة'], ['`service_healthy` attend que la vérification réussisse avant de créer le service web.', 'ينتظر `service_healthy` نجاح الفحص قبل إنشاء خدمة `web`.'],
        dbLines, [], { hideBrowser: true, trace: [S(7, tx('`pg_isready` : la base n’est pas prête.', '`pg_isready`: القاعدة ليست جاهزة.')), S(7, tx('`pg_isready` : la base est prête.', '`pg_isready`: القاعدة جاهزة.')), S(4, tx('La condition est remplie.', 'تحقق الشرط.')), S(1, tx('Le web démarre et se connecte.', 'يبدأ `web` ويتصل.'))] }),
    ] })

const composeData = flow('registry', ['Tags', 'الوسوم'], ['Volumes et versions : deux pièges', 'الأقراص والإصدارات: فخان'],
  ['Deux erreurs fréquentes : perdre les données, et ne pas savoir quelle version tourne.', 'خطآن شائعان: فقدان البيانات، وعدم معرفة الإصدار الذي يعمل.'],
  ['Docker Compose', 'Docker Compose', D + 'reference/cli/docker/compose/down/'],
  { words: [word('Tag', 'Un nom donné à une image. Il peut changer.', 'الوسم', 'اسم يعطى للصورة، وقد يتغير.'), word('Digest', 'Le numéro unique du contenu. Il ne change jamais.', 'البصمة', 'الرقم الفريد للمحتوى، ولا يتغير أبدا.')],
    variants: [
      v('down', ['down', 'down'], ['Les conteneurs sont supprimés, mais les données restent dans le volume.', 'تحذف الحاويات، لكن البيانات تبقى في القرص الدائم.'], [L('docker compose down', 'a')], [good(tx('Conteneurs supprimés. Volume conservé.', 'حذفت الحاويات، وبقي القرص الدائم.'), 'a')]),
      v('downv', ['down -v', 'down -v'], ['`-v` supprime aussi les volumes. Toutes les données de la base sont perdues.', 'يحذف `-v` الأقراص الدائمة أيضا، فتضيع كل بيانات القاعدة.'], [L('docker compose down -v', 'a')], [bad(tx('Conteneurs ET données supprimés.', 'حذفت الحاويات والبيانات.'), 'a')]),
      v('latest', ['latest', 'latest'], ['Le tag `latest` peut désigner une autre image demain. Deux serveurs peuvent avoir deux versions différentes.', 'قد يدل الوسم `latest` غدا على صورة أخرى، فيكون لخادمين إصداران مختلفان.'], [L('image: boutique:latest', 'a')], [bad(tx('Quelle version tourne ? Impossible à savoir.', 'أي إصدار يعمل؟ لا يمكن المعرفة.'), 'a')]),
      v('digest', ['Digest', 'البصمة'], ['Avec un digest, vous êtes sûr d’avoir exactement la même image partout.', 'مع البصمة تتأكد من وجود الصورة نفسها تماما في كل مكان.'], [L('image: boutique@sha256:9f2c6a…', 'a')], [good(tx('Toujours exactement la même image.', 'دائما الصورة نفسها تماما.'), 'a')]),
    ] })

const composeQuiz = quiz('compose-quiz', ['Docker Compose', 'Docker Compose', D + 'compose/'], [
  no('depends_on seul attend que la base soit prête.', 'ينتظر depends_on وحده جاهزية القاعدة.', 'Il attend seulement qu’elle tourne.', 'ينتظر فقط أن تعمل.'),
  yes('docker compose down -v supprime les données.', 'يحذف docker compose down -v البيانات.', 'Il supprime aussi les volumes.', 'يحذف الأقراص الدائمة أيضا.'),
  no('Le tag latest garantit toujours la même image.', 'يضمن الوسم latest الصورة نفسها دائما.', 'Un tag peut bouger. Pas un digest.', 'الوسم قد يتغير، أما البصمة فلا.'),
])

/* ---------- 07 CI ---------- */

const ciFile = flow('ci-file', ['Workflow', 'سير العمل'], ['Un workflow d’intégration continue', 'سير عمل للتكامل المستمر'],
  ['L’intégration continue vérifie chaque changement automatiquement, avant qu’il arrive sur main.', 'يتحقق التكامل المستمر من كل تغيير تلقائيا قبل وصوله إلى `main`.'],
  ['GitHub Actions', 'GitHub Actions', GH + 'reference/workflows-and-actions/workflow-syntax'],
  { sourceLabel: '.github/workflows/ci.yml', outputLabel: MEANING,
    words: [word('CI', 'Tester chaque changement automatiquement.', 'CI', 'اختبار كل تغيير تلقائيا.'), word('Pull request', 'Une demande pour ajouter ses changements à main.', 'طلب الدمج', 'طلب لإضافة تغييراتك إلى `main`.'), word('Runner', 'La machine qui exécute le workflow.', 'المشغل', 'الجهاز الذي ينفذ سير العمل.')],
    variants: [v('f', ['GitHub Actions', 'GitHub Actions'], ['`permissions` donne le minimum de droits au workflow. C’est une bonne habitude de sécurité.', 'يعطي `permissions` أقل الصلاحيات لسير العمل، وهذه عادة أمنية جيدة.'],
      [L('on: pull_request', 'a'), L('permissions:'), L('  contents: read', 'b'), L('jobs:'), L('  test:'), L('    runs-on: ubuntu-latest', 'c'), L('    steps:'), L('      - uses: actions/checkout@v6', 'd'), L('      - uses: actions/setup-node@v6'), L('        with: { node-version: 22, cache: npm }', 'e'), L('      - run: npm ci'), L('      - run: npm test', 'f')],
      [plain(tx('Se lance à chaque pull request.', 'يبدأ مع كل طلب دمج.'), 'a'), good(tx('Lecture seule : droits minimum.', 'قراءة فقط: أقل الصلاحيات.'), 'b'), plain(tx('La machine utilisée.', 'الجهاز المستعمل.'), 'c'), plain(tx('Récupère le code.', 'يجلب الكود.'), 'd'), good(tx('Garde les dépendances en cache.', 'يحفظ التبعيات مؤقتا.'), 'e'), plain(tx('Bloque si un test échoue.', 'يمنع الدمج إذا فشل اختبار.'), 'f')]),
    v('gl', ['GitLab CI', 'GitLab CI'], ['Le fichier change, mais l’idée reste la même : des étapes qui se lancent à chaque changement.', 'يتغير الملف لكن الفكرة نفسها: خطوات تبدأ مع كل تغيير.'],
      [L('test:', 'a'), L('  image: node:22', 'b'), L('  script:'), L('    - npm ci'), L('    - npm test', 'c')],
      [plain(tx('Le nom du job.', 'اسم المهمة.'), 'a'), plain(tx('Le job tourne dans cette image.', 'تعمل المهمة في هذه الصورة.'), 'b'), plain(tx('Bloque si un test échoue.', 'يمنع إذا فشل اختبار.'), 'c')])] })

const ciSecrets = flow('ci-secrets', ['Secrets', 'الأسرار'], ['Utiliser un secret dans un pipeline', 'استعمال سر في المسار'],
  ['Un mot de passe ne doit jamais être écrit dans le fichier du workflow. GitHub le garde à part.', 'يجب ألا تكتب كلمة المرور أبدا في ملف سير العمل، فيحتفظ بها GitHub منفصلة.'],
  ['GitHub : secrets', 'GitHub: الأسرار', GH + 'concepts/security/secrets'],
  { sourceLabel: 'ci.yml', outputLabel: tx('Dans les logs', 'في السجلات'),
    variants: [
      v('plain', ['Bonne façon', 'الطريقة الجيدة'], ['GitHub cache la valeur du secret quand elle apparaît dans les logs.', 'يخفي GitHub قيمة السر عندما تظهر في السجلات.'], [L('env:'), L('  TOKEN: ${{ secrets.DEPLOY_TOKEN }}', 'a'), L('run: ./deployer.sh', 'b')], [good('***', 'a')]),
      v('trans', ['Secret transformé', 'سر محول'], ['Si le secret est transformé, par exemple en base64, GitHub ne le reconnaît plus. Il peut alors apparaître en clair dans les logs.', 'إذا تحول السر، مثلا إلى `base64`، لا يتعرف عليه GitHub، فقد يظهر واضحا في السجلات.'], [L('run: echo "$TOKEN" | base64', 'a')], [bad('c2VjcmV0LXRyw6hzLXByaXbDqQo=', 'a')]),
    ],
    deeper: [tx('Pour le cloud, préférez des identifiants temporaires (OIDC) à une clé stockée. Vous le verrez dans DevSecOps.', 'في السحابة، فضل بيانات دخول مؤقتة `OIDC` بدلا من مفتاح مخزن. سترى ذلك في DevSecOps.')] })

const ciGood = page('rules', 'ci-good', ['Bon pipeline', 'مسار جيد'], ['Ce qui fait un bon pipeline', 'ما يجعل المسار جيدا'],
  ['Un pipeline lent ou peu fiable finit par être ignoré. Cliquez sur les cartes.', 'المسار البطيء أو غير الموثوق يتم تجاهله في النهاية. انقر على البطاقات.'],
  ['DORA : intégration continue', 'DORA: التكامل المستمر', 'https://dora.dev/capabilities/continuous-integration/'], { reveal: true, items: [
    card('Rapide', 'سريع', 'Les tests rapides répondent en quelques minutes, et tous les tests en 10 minutes environ.', 'تجيب الاختبارات السريعة في دقائق، وكل الاختبارات في 10 دقائق تقريبا.'),
    card('Fiable', 'موثوق', 'Un test qui échoue au hasard doit être réparé ou isolé. Sinon, plus personne ne croit le pipeline.', 'الاختبار الذي يفشل عشوائيا يجب إصلاحه أو عزله، وإلا لن يصدق أحد المسار.'),
    card('Reproductible', 'قابل للتكرار', 'Tout ce qu’il faut pour construire le projet est dans Git.', 'كل ما يلزم لبناء المشروع موجود في Git.'),
    card('Prioritaire', 'أولوية', 'Si main est cassé, l’équipe le répare d’abord, ou annule le changement.', 'إذا تعطل `main` يصلحه الفريق أولا أو يلغي التغيير.'),
  ] })

const ciIncident = incident('ci-incident', ['Test instable', 'اختبار غير مستقر'], ['Un test échoue une fois sur cinq', 'اختبار يفشل مرة من كل خمس'],
  ['Exercice. Le même code réussit parfois et échoue parfois. L’équipe relance le pipeline jusqu’à ce qu’il passe.', 'تمرين. الكود نفسه ينجح أحيانا ويفشل أحيانا، ويعيد الفريق تشغيل المسار حتى ينجح.'],
  ['DORA : intégration continue', 'DORA: التكامل المستمر', 'https://dora.dev/capabilities/continuous-integration/'],
  { host: 'dev@poste', startTime: '14:00', alert: tx('Le pipeline est rouge pour une raison inconnue.', 'المسار أحمر لسبب غير معروف.'), start: 'a',
    nodes: {
      a: ask('Que faites-vous ?', 'ماذا تفعل؟', [
        opt('gh run view --log-failed', 'Lire le log de l’échec', 'قراءة سجل الفشل', 2, true, 'b', 'FAIL commande.test.js\nexpected 200, received 500 (timeout after 1000ms)', 'Le test dépend d’un délai trop court.', 'يعتمد الاختبار على مهلة قصيرة جدا.'),
        opt('gh run rerun --failed', 'Relancer jusqu’à ce que ça passe', 'إعادة التشغيل حتى ينجح', 8, false, undefined, 'run passed', 'Le problème reste caché et reviendra.', 'تبقى المشكلة مخفية وستعود.'),
      ]),
      b: ask('Comment corriger ?', 'كيف تصلح؟', [
        opt('attendre la réponse au lieu d’un délai fixe', 'Rendre le test indépendant de la vitesse', 'جعل الاختبار مستقلا عن السرعة', 5, true, 'done', '50 exécutions : 50 réussies', 'Le test est maintenant stable.', 'أصبح الاختبار مستقرا.'),
        opt('supprimer le test', 'Enlever le test', 'حذف الاختبار', 2, false, undefined, 'Le test a disparu.', 'Le pipeline passe, mais plus rien ne protège cette partie.', 'ينجح المسار، لكن لا شيء يحمي هذا الجزء.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La cause', 'السبب', 'Un test dépendait d’un délai fixe.', 'كان اختبار يعتمد على مهلة ثابتة.'), pm('Ce qu’on change', 'ما سنغيره', 'On suit les tests instables et on les corrige vite.', 'نتابع الاختبارات غير المستقرة ونصلحها بسرعة.')] })

const ciQuiz = quiz('ci-quiz', ['GitHub Actions', 'GitHub Actions', GH], [
  no('Relancer un test instable règle le problème.', 'إعادة تشغيل اختبار غير مستقر تحل المشكلة.', 'Le problème reste caché.', 'تبقى المشكلة مخفية.'),
  yes('Un workflow doit avoir le minimum de droits.', 'يجب أن تكون لسير العمل أقل الصلاحيات.', 'Une attaque aura alors moins d’effet.', 'فيكون أثر الهجوم أقل.'),
  no('GitHub cache toujours un secret dans les logs.', 'يخفي GitHub السر دائما في السجلات.', 'Un secret transformé peut apparaître.', 'قد يظهر السر المحول.'),
])

/* ---------- 08 CD ---------- */

const migration = page('steps', 'expand', ['Base de données', 'قاعدة البيانات'], ['Changer une base sans panne', 'تغيير قاعدة البيانات دون عطل'],
  ['Exemple : renommer la colonne `nom` en `nom_complet`. Pendant un déploiement, l’ancienne et la nouvelle version tournent ensemble. Il faut donc avancer par étapes.', 'مثال: تغيير اسم العمود `nom` إلى `nom_complet`. أثناء النشر يعمل الإصداران معا، لذا يجب التقدم بمراحل.'],
  ['Google SRE Workbook : canary', 'كتاب Google SRE: الكناري', 'https://sre.google/workbook/canarying-releases/'],
  { stages: [
    stage('e', 'Ajouter', 'الإضافة', 'expand', 'On ajoute la nouvelle colonne. L’ancien code continue de marcher.', 'نضيف العمود الجديد، ويواصل الكود القديم العمل.', 'ALTER TABLE clients ADD COLUMN nom_complet text;'),
    stage('w', 'Écrire aux deux', 'الكتابة في الاثنين', 'code', 'La nouvelle version écrit dans les deux colonnes.', 'يكتب الإصدار الجديد في العمودين.'),
    stage('c', 'Copier', 'النسخ', 'backfill', 'On copie les anciennes données, petit à petit.', 'ننسخ البيانات القديمة شيئا فشيئا.', 'UPDATE clients SET nom_complet = nom WHERE nom_complet IS NULL;'),
    stage('r', 'Lire la nouvelle', 'قراءة الجديد', 'code', 'Le code lit maintenant la nouvelle colonne. Un rollback reste possible.', 'يقرأ الكود الآن العمود الجديد، ويبقى التراجع ممكنا.'),
    stage('d', 'Supprimer', 'الحذف', 'contract', 'Quand plus aucune version n’utilise l’ancienne colonne, on la supprime.', 'عندما لا يستعمل أي إصدار العمود القديم، نحذفه.', 'ALTER TABLE clients DROP COLUMN nom;'),
  ] })

const flagLines = (on) => [L(`const nouveauPaiement = ${on}`, 'a'), L('if (nouveauPaiement) {'), L('  payerAvecStripe()', 'b'), L('} else {'), L('  payerAncienSysteme()', 'c'), L('}')]
const flags = flow('flags', ['Feature flag', 'مفتاح الميزة'], ['Déployer n’est pas activer', 'النشر ليس التفعيل'],
  ['Un feature flag est un interrupteur dans le code. Le code est en ligne, mais les clients ne voient pas encore la nouveauté.', 'مفتاح الميزة قاطع داخل الكود. الكود منشور، لكن العملاء لا يرون الجديد بعد.'],
  ['DORA : petits lots', 'DORA: دفعات صغيرة', 'https://dora.dev/capabilities/working-in-small-batches/'],
  { sourceLabel: 'paiement.js', outputLabel: tx('Ce que voit le client', 'ما يراه العميل'),
    words: [word('Déployer', 'Installer le code sur les serveurs.', 'النشر', 'تثبيت الكود على الخوادم.'), word('Activer', 'Rendre la fonction visible aux clients.', 'التفعيل', 'جعل الوظيفة ظاهرة للعملاء.')],
    variants: [
      v('off', ['Flag éteint', 'المفتاح مطفأ'], ['Le nouveau code est déployé, mais il ne s’exécute pas.', 'تم نشر الكود الجديد، لكنه لا ينفذ.'], flagLines('false'), [plain(tx('Ancien paiement', 'الدفع القديم'), 'c')]),
      v('on', ['Flag allumé', 'المفتاح مشغل'], ['La fonction est activée sans nouveau déploiement. S’il y a un problème, on éteint simplement le flag.', 'تفعل الوظيفة دون نشر جديد، وعند وجود مشكلة نطفئ المفتاح فقط.'], flagLines('true'), [good(tx('Nouveau paiement', 'الدفع الجديد'), 'b')]),
    ],
    deeper: [tx('Supprimez les vieux flags : chacun ajoute un chemin de code à tester.', 'احذف المفاتيح القديمة، فكل مفتاح يضيف مسار كود يجب اختباره.')] })

const cdIncident = incident('cd-incident', ['Décision', 'القرار'], ['Rollback, ou pas ?', 'هل نتراجع أم لا؟'],
  ['Exercice. La version v42 vient de supprimer une colonne de la base, et le site a des erreurs.', 'تمرين. حذف الإصدار `v42` عمودا من القاعدة، وفي الموقع أخطاء.'],
  ['Google SRE Workbook', 'كتاب Google SRE', 'https://sre.google/workbook/canarying-releases/'],
  { startTime: '16:30', alert: tx('Erreurs après la mise à jour v42.', 'أخطاء بعد تحديث `v42`.'), start: 'a',
    nodes: {
      a: ask('Que vérifiez-vous avant de revenir en arrière ?', 'ماذا تفحص قبل التراجع؟', [
        opt('git show v42 --stat -- migrations/', 'Voir si la base a changé', 'معرفة هل تغيرت القاعدة', 2, true, 'b', 'migrations/042_drop_nom.sql | 1 +', 'La base a changé. Le rollback du code ne suffira pas.', 'تغيرت القاعدة، ولن يكفي التراجع عن الكود.'),
        opt('./rollback.sh v41', 'Remettre v41 tout de suite', 'إعادة `v41` فورا', 4, false, undefined, 'ERROR: column "nom" does not exist', 'L’ancien code a besoin de la colonne supprimée.', 'يحتاج الكود القديم إلى العمود المحذوف.'),
      ]),
      b: ask('Que faites-vous ?', 'ماذا تفعل؟', [
        opt('restaurer la colonne, puis remettre v41', 'Réparer la base, puis le code', 'إصلاح القاعدة ثم الكود', 15, true, 'done', 'colonne restaurée\nHTTP/2 200', 'Le site remarche. Il faudra vérifier les données écrites entre-temps.', 'عاد الموقع للعمل، ويجب فحص البيانات المكتوبة خلال ذلك.'),
        opt('supprimer d’autres colonnes', 'Continuer la migration', 'مواصلة الترحيل', 10, false, undefined, 'Plus d’erreurs encore.', 'Vous aggravez la panne.', 'أنت تزيد العطل سوءا.'),
      ]),
      done: { end: true },
    },
    postmortem: [pm('La cause', 'السبب', 'La colonne a été supprimée trop tôt.', 'حذف العمود مبكرا جدا.'), pm('Ce qu’on change', 'ما سنغيره', 'Les migrations suivent toujours les étapes ajouter, copier, puis supprimer.', 'تتبع عمليات الترحيل دائما مراحل الإضافة والنسخ ثم الحذف.')] })

const cdQuiz = quiz('cd-quiz', ['DORA : capacités', 'DORA: القدرات', 'https://dora.dev/capabilities/'], [
  yes('Un feature flag sépare déployer et activer.', 'يفصل مفتاح الميزة بين النشر والتفعيل.', 'Le code peut être en ligne sans être visible.', 'قد يكون الكود منشورا دون أن يظهر.'),
  no('On peut supprimer une colonne dans la même version que le changement de code.', 'يمكن حذف عمود في إصدار تغيير الكود نفسه.', 'Pendant le déploiement, l’ancienne version en a encore besoin.', 'يحتاجه الإصدار القديم أثناء النشر.'),
  no('Un rollback répare toujours tout.', 'يصلح التراجع كل شيء دائما.', 'Il ne remet pas les données comme avant.', 'لا يعيد البيانات كما كانت.'),
])

export const dockerModule = module('docker', ['Docker', 'Docker'], ['Images, couches, Dockerfile, signaux', 'الصور والطبقات و Dockerfile والإشارات'], [dockerPath, dockerfile, dockerStop, dockerIncident, dockerQuiz])
export const composeModule = module('compose', ['Compose et registres', 'Compose والسجلات'], ['Plusieurs conteneurs, santé, volumes, digest', 'حاويات متعددة والصحة والأقراص والبصمة'], [composeFile, composeOrder, composeData, composeQuiz])
export const ciModule = module('ci', ['Intégration continue', 'التكامل المستمر'], ['Workflows, secrets, tests instables', 'سير العمل والأسرار والاختبارات غير المستقرة'], [ciFile, ciSecrets, ciGood, ciIncident, ciQuiz])
export const cdModule = module('cd', ['Déploiement continu', 'النشر المستمر'], ['Migrations sûres, feature flags, rollback', 'ترحيل آمن ومفاتيح الميزات والتراجع'], [migration, flags, cdIncident, cdQuiz])
