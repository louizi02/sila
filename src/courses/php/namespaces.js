import { DOC, L, O, tx } from './helpers.js'

const clientFile = {
  label: 'Client.php',
  lines: [L('<?php'), L('namespace App\\Modeles;'), L(''), L('class Client {}')],
}

const basics = {
  id: 'ns', type: 'flow',
  nav: tx('Espaces de noms', 'مساحات الأسماء'),
  title: tx('Ranger son code avec namespace', 'تنظيم الكود بـ namespace'),
  lead: tx(
    'Un espace de noms est comme un dossier pour les classes. Deux classes peuvent porter le même nom dans deux espaces différents.',
    'مساحة الأسماء تشبه مجلدا للأصناف، فيمكن لصنفين أن يحملا الاسم نفسه في مساحتين مختلفتين.',
  ),
  source: { label: tx('Espaces de noms', 'مساحات الأسماء'), url: DOC + 'language.namespaces.basics.php' },
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'use', label: tx('Avec `use`', 'مع `use`'),
      note: tx(
        '`Client` est rangé dans `App\\Modeles`. `use` importe son nom complet : on peut ensuite écrire simplement `Client`.',
        'يوجد `Client` في `App\\Modeles`، وتستورد `use` اسمه الكامل، فنكتب بعد ذلك `Client` فقط.',
      ),
      files: [
        clientFile,
        { label: 'index.php', lines: [L('<?php'), L("require 'Client.php';"), L('use App\\Modeles\\Client;'), L(''), L('$c = new Client();'), L('echo get_class($c);', 'a')] },
      ],
      output: [O('App\\Modeles\\Client', 'a')],
    },
    {
      id: 'full', label: tx('Nom complet', 'الاسم الكامل'),
      note: tx('Sans `use`, on peut écrire le nom complet, qui commence par `\\`.', 'بدون `use` يمكن كتابة الاسم الكامل الذي يبدأ بـ `\\`.'),
      files: [
        clientFile,
        { label: 'index.php', lines: [L('<?php'), L("require 'Client.php';"), L(''), L('$c = new \\App\\Modeles\\Client();'), L('echo get_class($c);', 'a')] },
      ],
      output: [O('App\\Modeles\\Client', 'a')],
    },
    {
      id: 'missing', label: tx('Oublier `use`', 'نسيان `use`'),
      note: tx(
        'Sans `use` ni nom complet, PHP cherche `Client` dans l’espace global, où il n’existe pas.',
        'بدون `use` ولا اسم كامل، يبحث PHP عن `Client` في المساحة العامة، وهو غير موجود فيها.',
      ),
      files: [
        clientFile,
        { label: 'index.php', lines: [L('<?php'), L("require 'Client.php';"), L(''), L('$c = new Client();', 'a', 'err'), L('echo get_class($c);')] },
      ],
      output: [O('Fatal error: Uncaught Error: Class "Client" not found in index.php on line 4', 'a', 'err')],
    },
  ],
}

const quiz = {
  id: 'ns-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Espaces de noms', 'مساحات الأسماء'), url: DOC + 'language.namespaces.php' },
  items: [
    { title: tx('Deux classes peuvent avoir le même nom dans deux espaces de noms différents.', 'يمكن لصنفين أن يحملا الاسم نفسه في مساحتين مختلفتين.'), ok: true, why: tx('Leurs noms complets restent différents.', 'لأن اسميهما الكاملين يبقيان مختلفين.') },
    { title: tx('use copie le code de la classe dans le fichier.', 'تنسخ use كود الصنف داخل الملف.'), ok: false, why: tx('`use` importe seulement un nom. Le fichier doit toujours être chargé, par exemple avec `require`.', 'تستورد `use` اسما فقط، ويجب دائما تحميل الملف، مثلا بـ `require`.') },
    { title: tx('Un nom complet commence par une barre oblique inverse.', 'يبدأ الاسم الكامل بشرطة مائلة عكسية.'), ok: true, why: tx('Par exemple `\\App\\Modeles\\Client`.', 'مثل `\\App\\Modeles\\Client`.') },
  ],
}

export const namespacesModule = {
  id: 'namespaces',
  title: tx('Espaces de noms', 'مساحات الأسماء'),
  notions: tx('namespace, use, noms complets', 'namespace و use والأسماء الكاملة'),
  slides: [basics, quiz],
}
