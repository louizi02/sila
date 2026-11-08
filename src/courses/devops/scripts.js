import { L, O, S, tx, word } from './helpers.js'

const BASH = 'https://www.gnu.org/software/bash/manual/html_node/'
const REAL = tx('Résultat réel', 'النتيجة الحقيقية')
const plain = (text, from) => O(text, from, 'plain')
const bad = (text, from) => O(text, from, 'err')
const code = (n) => O(tx(`Code de sortie : ${n}`, `رمز الخروج: ${n}`), undefined, n ? 'err' : 'out')

const exitCodes = {
  id: 'exit', type: 'flow',
  nav: tx('Code de sortie', 'رمز الخروج'),
  title: tx('Comment savoir si une commande a réussi ?', 'كيف نعرف أن الأمر نجح؟'),
  lead: tx('Chaque commande laisse un numéro quand elle se termine. Un pipeline utilise ce numéro pour continuer ou s’arrêter.', 'يترك كل أمر رقما عندما ينتهي. يستعمل المسار هذا الرقم للاستمرار أو التوقف.'),
  words: [
    word('Code de sortie', '0 veut dire succès. Un autre nombre veut dire erreur.', 'رمز الخروج', '0 يعني النجاح، وأي رقم آخر يعني خطأ.'),
    word('$?', 'Le code de sortie de la dernière commande.', '$?', 'رمز خروج آخر أمر.'),
  ],
  source: { label: tx('Manuel Bash : codes de sortie', 'دليل Bash: رموز الخروج'), url: BASH + 'Exit-Status.html' },
  sourceLabel: 'terminal',
  outputLabel: REAL,
  variants: [
    {
      id: 'ok', label: tx('Succès', 'نجاح'),
      note: tx('La commande a réussi, donc son code est 0.', 'نجح الأمر، فرمزه 0.'),
      lines: [L('true', 'a'), L('echo "code=$?"', 'b')],
      output: [plain('code=0', 'b')],
    },
    {
      id: 'fail', label: tx('Erreur', 'خطأ'),
      note: tx('Le fichier n’existe pas : ls renvoie 2. Un code différent de 0 veut dire que ça n’a pas marché.', 'الملف غير موجود، فيرجع `ls` الرقم 2. الرمز المختلف عن 0 يعني أن الأمر لم ينجح.'),
      lines: [L('ls /nexistepas', 'a'), L('echo "code=$?"', 'b')],
      output: [bad("ls: cannot access '/nexistepas': No such file or directory", 'a'), plain('code=2', 'b')],
    },
  ],
}

const copyLines = [L('cp /nexistepas /tmp/copie', 'a'), L('echo "Sauvegarde terminee"', 'b')]
const pipeLines = [L('cat /nexistepas | sort', 'a'), L('echo "Suite"', 'b')]
const varLines = [L('dossier=$DOSIER_TYPO', 'a'), L('echo "rm -rf /$dossier"', 'b')]

const strict = {
  id: 'strict', type: 'flow',
  nav: tx('Mode strict', 'الوضع الصارم'),
  title: tx('Un script qui ment', 'برنامج نصي يكذب'),
  lead: tx('Par défaut, Bash continue même après une erreur. Comparez chaque script sans protection, puis avec. Tous les résultats sont réels.', 'افتراضيا، يواصل Bash حتى بعد حدوث خطأ. قارن كل برنامج دون حماية ثم معها. كل النتائج حقيقية.'),
  words: [
    word('set -e', 'Arrête le script à la première erreur.', 'set -e', 'يوقف البرنامج عند أول خطأ.'),
    word('set -u', 'Refuse une variable qui n’existe pas.', 'set -u', 'يرفض متغيرا غير موجود.'),
    word('pipefail', 'Détecte une erreur au milieu d’un pipe |.', 'pipefail', 'يكتشف خطأ في وسط الأنبوب `|`.'),
  ],
  source: { label: tx('Manuel Bash : set', 'دليل Bash: set'), url: BASH + 'The-Set-Builtin.html' },
  sourceLabel: 'sauvegarde.sh',
  outputLabel: REAL,
  variants: [
    {
      id: 'e0', label: tx('Erreur ignorée', 'خطأ متجاهل'),
      note: tx('La copie a échoué, mais le script dit « terminée » et renvoie 0. Le pipeline croit que tout va bien.', 'فشل النسخ، لكن البرنامج يقول «انتهى» ويرجع 0، فيظن المسار أن كل شيء بخير.'),
      lines: copyLines,
      output: [bad("cp: cannot stat '/nexistepas': No such file or directory", 'a'), plain('Sauvegarde terminee', 'b'), code(0)],
    },
    {
      id: 'e1', label: tx('Avec set -e', 'مع set -e'),
      note: tx('Le script s’arrête à l’erreur et renvoie 1. Le mensonge a disparu.', 'يتوقف البرنامج عند الخطأ ويرجع 1، فاختفت الكذبة.'),
      lines: [L('set -e'), ...copyLines],
      output: [bad("cp: cannot stat '/nexistepas': No such file or directory", 'a'), code(1)],
    },
    {
      id: 'p0', label: tx('Erreur dans un pipe', 'خطأ في أنبوب'),
      note: tx('Même avec set -e, le script continue. Un pipe renvoie le code de sa dernière commande, et sort a réussi.', 'حتى مع `set -e` يواصل البرنامج، لأن الأنبوب يرجع رمز آخر أمر، وقد نجح `sort`.'),
      lines: [L('set -e'), ...pipeLines],
      output: [bad('cat: /nexistepas: No such file or directory', 'a'), plain('Suite', 'b'), code(0)],
    },
    {
      id: 'p1', label: tx('Avec pipefail', 'مع pipefail'),
      note: tx('Maintenant, une erreur dans le pipe arrête bien le script.', 'الآن، يوقف الخطأ في الأنبوب البرنامج فعلا.'),
      lines: [L('set -eo pipefail'), ...pipeLines],
      output: [bad('cat: /nexistepas: No such file or directory', 'a'), code(1)],
    },
    {
      id: 'u0', label: tx('Faute de frappe', 'خطأ كتابة'),
      note: tx('Le nom de la variable est mal écrit, donc elle est vide. La commande devient rm -rf / : elle viserait tout le serveur. Ici, on l’affiche seulement avec echo.', 'اسم المتغير مكتوب خطأ فهو فارغ، فيصبح الأمر `rm -rf /` ويستهدف الخادم كله. هنا نعرضه فقط بالأمر `echo`.'),
      lines: varLines,
      output: [bad('rm -rf /', 'b'), code(0)],
    },
    {
      id: 'u1', label: tx('Avec set -u', 'مع set -u'),
      note: tx('Bash refuse la variable inconnue et s’arrête avant la commande dangereuse.', 'يرفض Bash المتغير غير المعروف ويتوقف قبل الأمر الخطير.'),
      lines: [L('set -u'), ...varLines],
      output: [bad('sauvegarde.sh: line 2: DOSIER_TYPO: unbound variable', 'a'), code(1)],
    },
  ],
  deeper: [
    tx('Commencez presque tous vos scripts par : `set -euo pipefail`.', 'ابدأ كل برامجك تقريبا بما يلي: `set -euo pipefail`.'),
    tx('`set -e` ne s’applique pas partout. Par exemple, une erreur dans la condition d’un `if` n’arrête pas le script.', 'لا يطبق `set -e` في كل مكان، فالخطأ في شرط `if` مثلا لا يوقف البرنامج.'),
    tx('Vérifiez vos scripts avec l’outil ShellCheck. Il trouve beaucoup de ces erreurs automatiquement.', 'افحص برامجك بأداة `ShellCheck`، فهي تجد كثيرا من هذه الأخطاء تلقائيا.'),
  ],
}

const quotes = {
  id: 'quotes', type: 'flow',
  nav: tx('Guillemets', 'علامات التنصيص'),
  title: tx('Un espace peut casser un script', 'الفراغ قد يعطل برنامجا'),
  lead: tx('Le fichier s’appelle « mon fichier.txt ». Regardez la différence avec et sans guillemets autour de la variable.', 'اسم الملف `mon fichier.txt`. لاحظ الفرق مع علامات التنصيص حول المتغير وبدونها.'),
  words: [word('Variable', 'Un nom qui contient une valeur. On la lit avec $.', 'المتغير', 'اسم يحمل قيمة، ونقرؤه بالرمز `$`.')],
  source: { label: tx('Manuel Bash : guillemets', 'دليل Bash: علامات التنصيص'), url: BASH + 'Double-Quotes.html' },
  sourceLabel: 'terminal',
  outputLabel: REAL,
  variants: [
    {
      id: 'no', label: tx('Sans guillemets', 'بدون علامات'),
      note: tx('Bash a coupé le nom en deux mots : mon, puis fichier.txt. Le vrai fichier n’a pas été supprimé.', 'قسم Bash الاسم إلى كلمتين: `mon` ثم `fichier.txt`، ولم يحذف الملف الحقيقي.'),
      lines: [L('f="mon fichier.txt"'), L('rm $f', 'a')],
      output: [bad("rm: cannot remove 'mon': No such file or directory", 'a'), bad("rm: cannot remove 'fichier.txt': No such file or directory", 'a')],
    },
    {
      id: 'yes', label: tx('Avec guillemets', 'مع علامات'),
      note: tx('Avec les guillemets, le nom reste entier. Mettez toujours vos variables entre guillemets : "$f".', 'مع علامات التنصيص يبقى الاسم كاملا. ضع متغيراتك دائما بين علامات التنصيص: `"$f"`.'),
      lines: [L('f="mon fichier.txt"'), L('rm "$f"', 'a')],
      output: [O(tx('Aucune erreur : le fichier est supprimé.', 'لا يوجد خطأ: تم حذف الملف.'), 'a')],
    },
  ],
}

const idempotent = {
  id: 'idempotent', type: 'flow',
  nav: tx('Relancer', 'إعادة التشغيل'),
  title: tx('Un script qu’on peut relancer sans peur', 'برنامج يمكن إعادة تشغيله دون خوف'),
  lead: tx('Un déploiement peut s’arrêter au milieu. Il faut pouvoir relancer le même script. Voici ce qui arrive en le lançant deux fois.', 'قد يتوقف النشر في المنتصف، فيجب أن نتمكن من إعادة تشغيل البرنامج نفسه. هذا ما يحدث عند تشغيله مرتين.'),
  words: [word('Idempotent', 'On peut le lancer plusieurs fois : le résultat reste le même.', 'متكرر بأمان', 'يمكن تشغيله عدة مرات وتبقى النتيجة نفسها.')],
  source: { label: tx('Manuel de mkdir', 'دليل mkdir'), url: 'https://man7.org/linux/man-pages/man1/mkdir.1.html' },
  sourceLabel: 'terminal',
  outputLabel: REAL,
  variants: [
    {
      id: 'bad', label: tx('mkdir', 'mkdir'),
      note: tx('La deuxième fois, la commande échoue car le dossier existe déjà. Avec set -e, tout le script s’arrêterait.', 'في المرة الثانية يفشل الأمر لأن المجلد موجود. ومع `set -e` سيتوقف البرنامج كله.'),
      lines: [L('mkdir data', 'a'), L('mkdir data', 'b')],
      output: [O(tx('Première fois : OK', 'المرة الأولى: نجاح'), 'a'), bad("mkdir: cannot create directory 'data': File exists", 'b')],
    },
    {
      id: 'good', label: tx('mkdir -p', 'mkdir -p'),
      note: tx('Avec -p, la commande réussit, que le dossier existe ou non. On peut relancer le script sans problème.', 'مع `-p` ينجح الأمر سواء كان المجلد موجودا أم لا، فيمكن إعادة تشغيل البرنامج دون مشكلة.'),
      lines: [L('mkdir -p data', 'a'), L('mkdir -p data', 'b')],
      output: [O(tx('Première fois : OK', 'المرة الأولى: نجاح'), 'a'), O(tx('Deuxième fois : OK', 'المرة الثانية: نجاح'), 'b')],
    },
  ],
}

const trapLines = [L('set -e'), L('tmp=$(mktemp -d)'), L(`trap 'echo "Nettoyage"; rm -rf "$tmp"' EXIT`), L('echo "Travail"'), L('false'), L('echo "Jamais"')]

const cleanup = {
  id: 'trap', type: 'flow',
  nav: tx('Nettoyer', 'التنظيف'),
  title: tx('Toujours nettoyer, même après une erreur', 'التنظيف دائما حتى بعد الخطأ'),
  lead: tx('Un script crée souvent des fichiers temporaires. `trap` lance un nettoyage quand le script se termine. Cliquez sur « Lancer ».', 'ينشئ البرنامج غالبا ملفات مؤقتة. يشغل `trap` التنظيف عندما ينتهي البرنامج. انقر على «تشغيل».'),
  words: [word('trap', 'Choisit une commande à lancer à la fin du script.', 'trap', 'يحدد أمرا يشغل عند نهاية البرنامج.')],
  source: { label: tx('Manuel Bash : commandes internes', 'دليل Bash: الأوامر المدمجة'), url: BASH + 'Bourne-Shell-Builtins.html' },
  sourceLabel: 'nettoyage.sh',
  outputLabel: REAL,
  variants: [{
    id: 't', label: tx('Lancer', 'تشغيل'), hideBrowser: true,
    note: tx('Résultat réel : Travail, puis Nettoyage, avec le code 1. La ligne 6 n’est jamais lancée, mais le nettoyage a bien eu lieu.', 'النتيجة الحقيقية: `Travail` ثم `Nettoyage` مع الرمز 1. لا ينفذ السطر 6 أبدا، لكن التنظيف تم فعلا.'),
    lines: trapLines, output: [],
    trace: [
      S(1, tx('Le script s’arrêtera à la première erreur.', 'سيتوقف البرنامج عند أول خطأ.')),
      S(2, tx('Un dossier temporaire est créé.', 'ينشأ مجلد مؤقت.')),
      S(3, tx('`trap` enregistre le nettoyage pour la fin.', 'يسجل `trap` التنظيف للنهاية.')),
      S(4, tx('Affiche : Travail', 'يعرض: `Travail`')),
      S(5, tx('`false` échoue : le script doit s’arrêter.', 'يفشل `false`، فيجب أن يتوقف البرنامج.')),
      S(3, tx('Avant de quitter, le nettoyage se lance. Affiche : Nettoyage', 'قبل الخروج يبدأ التنظيف، ويعرض: `Nettoyage`')),
    ],
  }],
}

const quiz = {
  id: 'scripts-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Ce script est-il sûr ?', 'هل هذا البرنامج آمن؟'),
  lead: tx('Cliquez sur chaque ligne pour vérifier.', 'انقر على كل سطر للتحقق.'),
  source: { label: tx('Manuel Bash : set', 'دليل Bash: set'), url: BASH + 'The-Set-Builtin.html' },
  items: [
    { code: 'set -euo pipefail', ok: true, why: tx('Un bon début pour la plupart des scripts.', 'بداية جيدة لمعظم البرامج.') },
    { code: 'rm -rf $DOSSIER/*', ok: false, why: tx('Si la variable est vide, on vise /*. Il faut des guillemets et set -u.', 'إذا كان المتغير فارغا نستهدف `/*`. نحتاج إلى علامات التنصيص و `set -u`.') },
    { code: 'mkdir -p /opt/boutique', ok: true, why: tx('On peut la relancer sans erreur.', 'يمكن إعادة تشغيله دون خطأ.') },
    { code: 'cat a.txt | grep x  # sans pipefail', ok: false, why: tx('Une erreur de cat serait cachée.', 'سيختفي خطأ `cat`.') },
    { code: 'cp "$source" "$cible"', ok: true, why: tx('Les guillemets protègent les noms avec espaces.', 'تحمي علامات التنصيص الأسماء التي فيها فراغات.') },
  ],
}

export const scriptsModule = {
  id: 'bash',
  title: tx('Scripts fiables', 'برامج نصية موثوقة'),
  notions: tx('Codes de sortie, mode strict, guillemets, relance, nettoyage', 'رموز الخروج والوضع الصارم وعلامات التنصيص وإعادة التشغيل والتنظيف'),
  slides: [exitCodes, strict, quotes, idempotent, cleanup, quiz],
}
