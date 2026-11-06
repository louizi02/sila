import { DOC, L, O, tx } from './helpers.js'

const facts = {
  id: 'what', type: 'rules', reveal: true,
  nav: tx('PHP ?', 'ما هو PHP'),
  title: tx('Qu’est-ce que PHP ?', 'ما هو PHP؟'),
  lead: tx('Cliquez sur chaque carte pour découvrir PHP en cinq idées.', 'انقر على كل بطاقة لتتعرف على PHP في خمس أفكار.'),
  source: { label: tx('Introduction', 'مقدمة'), url: DOC + 'introduction.php' },
  items: [
    {
      title: tx('Un langage de script', 'لغة برمجة نصية'),
      why: tx(
        'PHP est un langage de programmation généraliste, spécialement conçu pour créer des applications web.',
        'لغة PHP لغة برمجة عامة، صممت خصيصا لإنشاء تطبيقات الويب.',
      ),
    },
    {
      title: tx('Il tourne sur le serveur', 'يعمل على الخادم'),
      why: tx(
        'Contrairement à JavaScript dans le navigateur, le code PHP s’exécute sur le serveur, l’ordinateur qui héberge le site.',
        'على عكس JavaScript في المتصفح، ينفذ كود PHP على الخادم، أي الحاسوب الذي يستضيف الموقع.',
      ),
    },
    {
      title: tx('Il produit du HTML', 'ينتج HTML'),
      why: tx(
        'PHP génère le HTML de la page, puis ce HTML est envoyé au navigateur du visiteur.',
        'ينشئ PHP كود HTML الخاص بالصفحة، ثم يرسل هذا الكود إلى متصفح الزائر.',
      ),
    },
    {
      title: tx('Le code reste caché', 'الكود يبقى مخفيا'),
      why: tx(
        'Le visiteur ne reçoit que le résultat du script. Il n’a aucun moyen de voir le code PHP qui l’a produit.',
        'لا يستقبل الزائر إلا نتيجة البرنامج، ولا يمكنه رؤية كود PHP الذي أنتجها.',
      ),
    },
    {
      title: tx('Libre et gratuit', 'حر ومجاني'),
      why: tx(
        'PHP est open source. Son nom est un acronyme récursif : PHP: Hypertext Preprocessor.',
        'لغة PHP مفتوحة المصدر، واسمها اختصار يتضمن نفسه: `PHP: Hypertext Preprocessor`.',
      ),
    },
  ],
}

const journey = {
  id: 'how', type: 'steps',
  nav: tx('Fonctionnement', 'طريقة العمل'),
  title: tx('Comment fonctionne PHP', 'كيف يعمل PHP'),
  lead: tx(
    'Suivez une page PHP, de la demande du navigateur jusqu’à l’affichage. Cliquez sur une étape, ou sur « Étape suivante ».',
    'تتبع صفحة PHP من طلب المتصفح إلى عرضها. انقر على مرحلة، أو على «المرحلة التالية».',
  ),
  source: { label: tx('Introduction', 'مقدمة'), url: DOC + 'introduction.php' },
  stages: [
    {
      id: 'browser', label: tx('Navigateur', 'المتصفح'), sub: 'bonjour.php',
      detail: tx(
        'Vous ouvrez une page. Le navigateur envoie une demande, appelée requête, au serveur qui héberge le site.',
        'تفتح صفحة، فيرسل المتصفح طلبا إلى الخادم الذي يستضيف الموقع.',
      ),
      code: 'GET /bonjour.php',
    },
    {
      id: 'server', label: tx('Serveur web', 'خادم الويب'), sub: 'Apache, Nginx…',
      detail: tx(
        'Le serveur reçoit la requête. Le fichier se termine par `.php` : le serveur, configuré pour cela, le confie à PHP.',
        'يستقبل الخادم الطلب. الملف ينتهي بـ `.php`، فيسلمه الخادم إلى PHP لأنه مهيأ لذلك.',
      ),
    },
    {
      id: 'php', label: tx('PHP', 'PHP'), sub: 'bonjour.php',
      detail: tx(
        'PHP exécute le code du fichier, sur le serveur. Ici, il remplace `<?= $nom ?>` par la valeur de la variable.',
        'ينفذ PHP كود الملف على الخادم. هنا يعوض `<?= $nom ?>` بقيمة المتغير.',
      ),
      code: '<?php $nom = "Salma"; ?>\n<p>Bonjour <?= $nom ?></p>',
    },
    {
      id: 'html', label: tx('Réponse HTML', 'استجابة HTML'), sub: 'HTML',
      detail: tx(
        'PHP produit du HTML, et le serveur renvoie ce HTML au navigateur. Le code PHP, lui, reste sur le serveur.',
        'ينتج PHP كود HTML، ويعيده الخادم إلى المتصفح. أما كود PHP فيبقى على الخادم.',
      ),
      code: '<p>Bonjour Salma</p>',
    },
    {
      id: 'screen', label: tx('Affichage', 'العرض'), sub: 'Bonjour Salma',
      detail: tx(
        'Le navigateur affiche la page. Le visiteur voit le résultat, mais jamais le code PHP qui l’a produit.',
        'يعرض المتصفح الصفحة. يرى الزائر النتيجة، لكنه لا يرى أبدا كود PHP الذي أنتجها.',
      ),
    },
  ],
}

const uses = {
  id: 'where', type: 'flow',
  nav: tx('Usages', 'الاستعمالات'),
  title: tx('Où utilise-t-on PHP ?', 'أين نستعمل PHP؟'),
  lead: tx('La documentation cite deux grands usages. Comparez-les.', 'يذكر التوثيق استعمالين رئيسيين. قارن بينهما.'),
  source: { label: tx('Introduction', 'مقدمة'), url: DOC + 'introduction.php' },
  sourceLabel: 'bonjour.php',
  outputLabel: tx('Ce que reçoit le navigateur', 'ما يستقبله المتصفح'),
  variants: [
    {
      id: 'web', label: tx('Sur un serveur web', 'على خادم ويب'),
      note: tx(
        'C’est l’usage principal : un serveur web exécute le fichier et envoie le résultat au navigateur.',
        'هذا هو الاستعمال الرئيسي: ينفذ خادم الويب الملف ويرسل النتيجة إلى المتصفح.',
      ),
      lines: [L('<?php $nom = "Salma"; ?>'), L('<p>Bonjour <?= $nom ?></p>', 'a')],
      output: [O('<p>Bonjour Salma</p>', 'a')],
    },
    {
      id: 'cli', label: tx('En ligne de commande', 'في سطر الأوامر'),
      sourceLabel: 'sauvegarde.php',
      outputLabel: tx('Terminal', 'الطرفية'),
      note: tx(
        'Un script PHP peut aussi tourner dans un terminal, sans serveur web ni navigateur. On s’en sert pour des tâches automatiques.',
        'يمكن أيضا تشغيل برنامج PHP في الطرفية بدون خادم ويب ولا متصفح، ويستعمل ذلك للمهام التلقائية.',
      ),
      lines: [L('<?php'), L('echo "Sauvegarde terminée";', 'a')],
      output: [O('$ php sauvegarde.php', null, 'plain'), O('Sauvegarde terminée', 'a')],
    },
  ],
}

const setup = {
  id: 'start', type: 'steps',
  nav: tx('Démarrer', 'البداية'),
  title: tx('Lancer PHP sur votre ordinateur', 'تشغيل PHP على حاسوبك'),
  lead: tx('Quatre étapes pour voir votre première page PHP.', 'أربع مراحل لترى أول صفحة PHP خاصة بك.'),
  source: { label: tx('Serveur web interne', 'خادم الويب المدمج'), url: DOC + 'features.commandline.webserver.php' },
  stages: [
    {
      id: 'install', label: tx('Installer PHP', 'تثبيت PHP'), sub: 'php.net',
      detail: tx(
        'Installez PHP depuis php.net, ou un paquet tout-en-un comme XAMPP. Cette commande vérifie que PHP est bien installé.',
        'ثبت PHP من موقع php.net، أو حزمة متكاملة مثل XAMPP. هذا الأمر يتحقق من أن PHP مثبت.',
      ),
      code: 'php -v',
    },
    {
      id: 'file', label: tx('Écrire un fichier', 'كتابة ملف'), sub: 'bonjour.php',
      detail: tx(
        'Créez un fichier qui se termine par `.php` dans un éditeur de texte, par exemple VS Code.',
        'أنشئ ملفا ينتهي بـ `.php` في محرر نصوص، مثل VS Code.',
      ),
      code: '<?php\necho "Bonjour";',
    },
    {
      id: 'serve', label: tx('Lancer le serveur', 'تشغيل الخادم'), sub: 'php -S',
      detail: tx(
        'Dans le terminal, ouvert dans le dossier du fichier, cette commande démarre le serveur web intégré à PHP. Il sert au développement, pas à un site public.',
        'في الطرفية، داخل مجلد الملف، يشغل هذا الأمر خادم الويب المدمج في PHP. وهو مخصص للتطوير، لا لموقع عام.',
      ),
      code: 'php -S localhost:8000',
    },
    {
      id: 'open', label: tx('Ouvrir la page', 'فتح الصفحة'), sub: 'localhost:8000',
      detail: tx(
        'Ouvrez cette adresse dans le navigateur : la page affiche Bonjour.',
        'افتح هذا العنوان في المتصفح، فتعرض الصفحة كلمة Bonjour.',
      ),
      code: 'http://localhost:8000/bonjour.php',
    },
  ],
}

const quiz = {
  id: 'intro-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Introduction', 'مقدمة'), url: DOC + 'introduction.php' },
  items: [
    { title: tx('Le navigateur reçoit le code PHP.', 'يستقبل المتصفح كود PHP.'), ok: false, why: tx('Il reçoit seulement le résultat, en général du HTML.', 'يستقبل النتيجة فقط، وغالبا تكون HTML.') },
    { title: tx('PHP s’exécute sur le serveur.', 'ينفذ PHP على الخادم.'), ok: true, why: tx('C’est ce qui le distingue de JavaScript dans le navigateur.', 'هذا ما يميزه عن JavaScript في المتصفح.') },
    { title: tx('Un fichier PHP peut contenir du HTML.', 'يمكن أن يحتوي ملف PHP على HTML.'), ok: true, why: tx('Le texte hors des balises PHP est envoyé tel quel.', 'النص الموجود خارج وسوم PHP يرسل كما هو.') },
    { title: tx('PHP sert uniquement à faire des sites web.', 'يستعمل PHP للمواقع فقط.'), ok: false, why: tx('Il peut aussi exécuter des scripts en ligne de commande.', 'يمكنه أيضا تشغيل برامج في سطر الأوامر.') },
    { title: tx('Le serveur intégré php -S convient à un site public.', 'الخادم المدمج مناسب لموقع عام.'), ok: false, why: tx('La documentation le réserve au développement et aux tests.', 'يخصصه التوثيق للتطوير والاختبار فقط.') },
  ],
}

export const introModule = {
  id: 'intro',
  title: tx('Introduction', 'مقدمة'),
  notions: tx('Ce qu’est PHP, où il s’exécute, comment le lancer', 'ما هو PHP، وأين ينفذ، وكيف نشغله'),
  slides: [facts, journey, uses, setup, quiz],
}
