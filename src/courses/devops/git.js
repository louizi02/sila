import { L, O, tx, word } from './helpers.js'

const BOOK = 'https://git-scm.com/book/fr/v2/'
const c = (id, x, y, msg, parents, hash, st) => ({ id, x, y, msg, parents, hash, st })

const A = c('A', 0, 0, 'A', [], 'da7d056')
const B = c('B', 1, 0, 'B', ['A'], '6e1eb0e')
const D = c('D', 2, 0, 'D', ['B'], '5db6039')
const C = c('C', 2, 1, 'C', ['B'], '70d87c0')

const merge = {
  id: 'merge', label: tx('Merge', 'Merge'),
  note: tx('Merge garde l’histoire vraie, et ajoute un commit qui réunit les deux branches.', 'يحافظ `merge` على التاريخ الحقيقي، ويضيف إيداعا يجمع الفرعين.'),
  steps: [
    { commits: [A, B, D, C], refs: { main: 'D', 'ma-branche': 'C' }, text: tx('Vous avez fait le commit C sur votre branche. Pendant ce temps, D est arrivé sur main.', 'أنشأت الإيداع C في فرعك، وفي هذه الأثناء وصل D إلى `main`.') },
    {
      commits: [A, B, D, C, c('M', 3, 0, 'M', ['D', 'C'], 'e2bb619', 'new')], refs: { main: 'M', 'ma-branche': 'C' },
      text: tx('Git crée le commit M. Il a deux parents : D et C.', 'ينشئ Git الإيداع M، وله أبوان: D و C.'),
      cmd: 'git merge --no-edit ma-branche', out: "Merge made by the 'ort' strategy.\n f.txt | 1 +\n 1 file changed, 1 insertion(+)",
    },
  ],
}

const rebase = {
  id: 'rebase', label: tx('Rebase', 'Rebase'),
  note: tx('Regardez le numéro de C : il a changé. Pour Git, c’est un nouveau commit. Ne faites donc jamais de rebase sur des commits déjà partagés.', 'انظر إلى رقم C: لقد تغير. بالنسبة لـ Git هذا إيداع جديد، لذلك لا تستعمل `rebase` أبدا على إيداعات تمت مشاركتها.'),
  steps: [
    { commits: [A, B, D, C], refs: { main: 'D', 'ma-branche': 'C' }, text: tx('Même situation : C est sur votre branche, D est sur main.', 'الوضع نفسه: C في فرعك و D في `main`.') },
    {
      commits: [A, B, D, { ...C, st: 'ghost' }, c('C2', 3, 0, "C'", ['D'], '66a33e2', 'new')], refs: { main: 'D', 'ma-branche': 'C2' },
      text: tx('Git refait votre travail après D. Le résultat est une ligne droite, mais C est remplacé par un nouveau commit.', 'يعيد Git عملك بعد D. النتيجة خط مستقيم، لكن C تم تعويضه بإيداع جديد.'),
      cmd: 'git rebase main', out: 'Successfully rebased and updated refs/heads/ma-branche.',
    },
  ],
}

const history = {
  id: 'history', type: 'git',
  nav: tx('Merge / rebase', 'Merge / rebase'),
  title: tx('Réunir son travail avec celui de l’équipe', 'جمع عملك مع عمل الفريق'),
  lead: tx('Chaque rond est un commit, c’est-à-dire une version enregistrée. Cliquez sur « Lancer » pour voir ce que fait chaque commande.', 'كل دائرة إيداع، أي نسخة محفوظة. انقر على «تشغيل» لترى ما يفعله كل أمر.'),
  words: [
    word('Commit', 'Une version enregistrée du code, avec un numéro unique.', 'الإيداع', 'نسخة محفوظة من الكود لها رقم فريد.'),
    word('Branche', 'Une ligne de travail séparée.', 'الفرع', 'خط عمل منفصل.'),
    word('main', 'La branche principale du projet.', 'main', 'الفرع الرئيسي للمشروع.'),
  ],
  source: { label: tx('Pro Git : rebaser', 'Pro Git: إعادة التأسيس'), url: BOOK + 'Les-branches-avec-Git-Rebaser-Rebasing' },
  scenarios: [merge, rebase],
}

const base2 = [A, B, c('D', 2, 0, 'D', ['B'], '5db6039'), c('C', 3, 0, 'C', ['D'], '66a33e2')]

const revert = {
  id: 'revert', label: tx('Revert', 'Revert'),
  note: tx('Revert ajoute un commit qui annule le changement. L’histoire est gardée, donc l’équipe peut récupérer le code sans problème.', 'يضيف `revert` إيداعا يلغي التغيير. يبقى التاريخ محفوظا، فيستطيع الفريق جلب الكود دون مشكلة.'),
  steps: [
    { commits: base2, refs: { main: 'C' }, text: tx('Le commit C a un bug, et il est déjà sur GitHub.', 'في الإيداع C خطأ، وهو موجود بالفعل في GitHub.') },
    {
      commits: [...base2, c('R', 4, 0, 'R', ['C'], '834da7c', 'new')], refs: { main: 'R' },
      text: tx('Git ajoute le commit R. Il fait l’inverse de C.', 'يضيف Git الإيداع R، وهو عكس C.'),
      cmd: 'git revert --no-edit HEAD', out: '[main 834da7c] Revert "C"\n 1 file changed, 1 deletion(-)',
    },
  ],
}

const reset = {
  id: 'reset', label: tx('Reset', 'Reset'),
  note: tx('Reset réécrit l’histoire. GitHub refuse donc le push, car vous essayez d’effacer un commit partagé. Sur main, utilisez revert.', 'يعيد `reset` كتابة التاريخ، لذلك يرفض GitHub الدفع لأنك تحاول حذف إيداع مشترك. في `main` استعمل `revert`.'),
  steps: [
    { commits: base2, refs: { main: 'C' }, text: tx('Même situation : le commit C est déjà sur GitHub.', 'الوضع نفسه: الإيداع C موجود بالفعل في GitHub.') },
    {
      commits: [base2[0], base2[1], base2[2], { ...base2[3], st: 'ghost' }], refs: { main: 'D' },
      text: tx('Sur votre PC, le commit C disparaît de la branche.', 'في حاسوبك، يختفي الإيداع C من الفرع.'),
      cmd: 'git reset --hard HEAD~1', out: 'HEAD is now at 5db6039 D',
    },
    {
      commits: [base2[0], base2[1], base2[2], { ...base2[3], st: 'ghost' }], refs: { main: 'D' },
      text: tx('Votre branche est maintenant en retard sur GitHub. Le push est refusé.', 'أصبح فرعك متأخرا عن GitHub، فيرفض الدفع.'),
      cmd: 'git push', out: ' ! [rejected]        main -> main (non-fast-forward)\nerror: failed to push some refs\nhint: Updates were rejected because the tip of your current branch is behind\nhint: its remote counterpart.',
    },
  ],
}

const undo = {
  id: 'undo', type: 'git',
  nav: tx('Annuler', 'الإلغاء'),
  title: tx('Annuler un changement déjà envoyé', 'إلغاء تغيير تم إرساله'),
  lead: tx('Un commit qui casse le site est arrivé sur main. Comparez deux manières de l’annuler.', 'وصل إلى `main` إيداع يعطل الموقع. قارن بين طريقتين لإلغائه.'),
  words: [
    word('Push', 'Envoyer ses commits sur GitHub.', 'الدفع', 'إرسال الإيداعات إلى GitHub.'),
    word('HEAD', 'Le commit sur lequel vous êtes.', 'HEAD', 'الإيداع الذي تقف عليه.'),
  ],
  source: { label: tx('Pro Git : annuler', 'Pro Git: التراجع'), url: BOOK + 'Les-bases-de-Git-Annuler-des-actions' },
  scenarios: [revert, reset],
}

const bisectCommits = (marks = {}, ref = '8') => ({
  commits: Array.from({ length: 8 }, (_, i) => {
    const id = String(i + 1)
    return c(id, i, 0, id, i ? [String(i)] : [], undefined, marks[id])
  }),
  refs: { HEAD: ref },
})

const bisect = {
  id: 'bisect', type: 'git',
  nav: tx('Trouver le bug', 'إيجاد الخطأ'),
  title: tx('Trouver quel commit a cassé le site', 'معرفة الإيداع الذي عطل الموقع'),
  lead: tx('Le commit 1 marche, le commit 8 est cassé. `git bisect` coupe l’historique en deux à chaque essai, au lieu de tester tous les commits.', 'الإيداع 1 يعمل والإيداع 8 معطل. يقسم `git bisect` التاريخ إلى نصفين في كل محاولة، بدلا من اختبار كل الإيداعات.'),
  words: [word('git bisect', 'Une commande qui cherche le commit fautif, par moitiés.', 'git bisect', 'أمر يبحث عن الإيداع المسؤول بالتنصيف.')],
  source: { label: tx('Pro Git : déboguer avec Git', 'Pro Git: تصحيح الأخطاء بـ Git'), url: BOOK + 'Utilitaires-Git-D%C3%A9boguer-avec-Git' },
  scenarios: [{
    id: 'run', label: tx('Bisect', 'Bisect'),
    note: tx('Il y avait 8 commits, et il a fallu seulement 3 essais. Cela marche bien si chaque commit est petit et fonctionne.', 'كان هناك 8 إيداعات، واحتجنا إلى 3 محاولات فقط. ينجح هذا جيدا إذا كان كل إيداع صغيرا ويعمل.'),
    steps: [
      { ...bisectCommits({ 1: 'good', 8: 'bad' }), text: tx('Vous savez seulement que 1 est bon et que 8 est mauvais.', 'تعرف فقط أن 1 جيد و 8 سيئ.') },
      { ...bisectCommits({ 1: 'good', 4: 'test', 8: 'bad' }, '4'), text: tx('Git vous place sur le commit 4. Testez-le.', 'يضعك Git على الإيداع 4. اختبره.'), cmd: 'git bisect start HEAD <commit-1>', out: 'Bisecting: 3 revisions left to test after this (roughly 2 steps)\n[47551e0] changement 4' },
      { ...bisectCommits({ 1: 'good', 2: 'good', 3: 'good', 4: 'good', 6: 'test', 8: 'bad' }, '6'), text: tx('Le 4 marche, donc tout ce qui est avant aussi. Git passe au 6.', 'الإيداع 4 يعمل، إذن كل ما قبله يعمل أيضا. ينتقل Git إلى 6.'), cmd: 'git bisect good', out: 'Bisecting: 1 revision left to test after this (roughly 1 step)' },
      { ...bisectCommits({ 1: 'good', 2: 'good', 3: 'good', 4: 'good', 5: 'test', 6: 'bad', 7: 'bad', 8: 'bad' }, '5'), text: tx('Le 6 est cassé. Git teste le 5.', 'الإيداع 6 معطل. يختبر Git الإيداع 5.'), cmd: 'git bisect bad', out: 'Bisecting: 0 revisions left to test after this (roughly 0 steps)' },
      { ...bisectCommits({ 1: 'good', 2: 'good', 3: 'good', 4: 'good', 5: 'good', 6: 'bad', 7: 'bad', 8: 'bad' }, '6'), text: tx('Le 5 marche et le 6 est cassé : le bug vient du commit 6.', 'الإيداع 5 يعمل و 6 معطل: الخطأ من الإيداع 6.'), cmd: 'git bisect good', out: '2d8df20 is the first bad commit\n    changement 6' },
    ],
  }],
  deeper: [tx('On peut tout automatiser avec `git bisect run ./test.sh`.', 'يمكن أتمتة كل شيء بالأمر `git bisect run ./test.sh`.')],
}

const conflict = {
  id: 'conflict', type: 'flow',
  nav: tx('Conflit', 'التعارض'),
  title: tx('Lire un conflit', 'قراءة التعارض'),
  lead: tx('Deux personnes ont changé la même ligne. Git ne sait pas laquelle garder, et il vous demande de choisir. Voici le vrai résultat.', 'غير شخصان السطر نفسه. لا يعرف Git أيهما يحتفظ به، فيطلب منك الاختيار. هذه هي النتيجة الحقيقية.'),
  words: [word('Conflit', 'Git ne peut pas réunir deux changements tout seul.', 'التعارض', 'لا يستطيع Git جمع تغييرين وحده.')],
  source: { label: tx('Pro Git : conflits', 'Pro Git: التعارضات'), url: BOOK + 'Les-branches-avec-Git-Branches-et-fusions%C2%A0:-les-bases' },
  sourceLabel: 'p.txt',
  outputLabel: tx('Ce que cela veut dire', 'ما يعنيه ذلك'),
  variants: [{
    id: 'c', label: tx('Marqueurs', 'العلامات'),
    note: tx('Pour réparer : gardez la bonne ligne, supprimez les trois marqueurs, puis faites `git add p.txt` et `git commit`.', 'للإصلاح: احتفظ بالسطر الصحيح، واحذف العلامات الثلاث، ثم نفذ `git add p.txt` و `git commit`.'),
    lines: [L('<<<<<<< HEAD', 'a'), L('Prix: 20', 'b'), L('=======', 'c'), L('Prix: 10', 'd'), L('>>>>>>> b1', 'e')],
    output: [
      O(tx('Début de votre version', 'بداية نسختك'), 'a', 'plain'),
      O(tx('Votre ligne', 'سطرك'), 'b', 'plain'),
      O(tx('Séparation', 'الفاصل'), 'c', 'plain'),
      O(tx('La ligne de l’autre branche', 'سطر الفرع الآخر'), 'd', 'plain'),
      O(tx('Fin. b1 est le nom de la branche', 'النهاية. `b1` هو اسم الفرع'), 'e', 'plain'),
    ],
  }],
}

const trunk = {
  id: 'trunk', type: 'rules', reveal: true,
  nav: tx('En équipe', 'ضمن فريق'),
  title: tx('Comment une équipe travaille avec Git', 'كيف يعمل فريق مع Git'),
  lead: tx('La méthode conseillée s’appelle trunk-based : tout le monde revient souvent sur main. Cliquez sur les cartes.', 'الطريقة الموصى بها تسمى `trunk-based`: يعود الجميع كثيرا إلى `main`. انقر على البطاقات.'),
  source: { label: tx('DORA : trunk-based development', 'DORA: التطوير على الجذع'), url: 'https://dora.dev/capabilities/trunk-based-development/' },
  items: [
    { title: tx('Des branches courtes', 'فروع قصيرة'), why: tx('Une branche vit quelques heures, pas des semaines. Moins elle dure, moins il y a de conflits.', 'يعيش الفرع بضع ساعات، لا أسابيع. كلما قصر عمره قلت التعارضات.') },
    { title: tx('Peu de branches', 'فروع قليلة'), why: tx('Repère de DORA : pas plus de trois branches actives dans le projet.', 'مرجع DORA: لا تزيد الفروع النشطة عن ثلاثة في المشروع.') },
    { title: tx('Revenir chaque jour', 'العودة كل يوم'), why: tx('Chaque développeur envoie son travail sur main au moins une fois par jour.', 'يرسل كل مطور عمله إلى `main` مرة واحدة في اليوم على الأقل.') },
    { title: tx('Relire vite', 'المراجعة بسرعة'), why: tx('Une relecture qui attend des jours bloque toute l’équipe. On demande une relecture dès que c’est prêt.', 'المراجعة التي تنتظر أياما تعطل الفريق كله، لذا نطلبها بمجرد أن يصبح العمل جاهزا.') },
    { title: tx('main doit marcher', '`main` يجب أن يعمل'), why: tx('Les tests passent avant chaque fusion. Si main est cassé, on le répare ou on annule le changement.', 'تنجح الاختبارات قبل كل دمج. وإذا تعطل `main`، نصلحه أو نلغي التغيير.') },
  ],
}

const incident = {
  id: 'git-incident', type: 'incident',
  nav: tx('Secret', 'السر'),
  title: tx('Un mot de passe est parti sur GitHub', 'وصلت كلمة مرور إلى GitHub'),
  lead: tx('Ceci est un exercice. Un collègue vient d’envoyer le fichier .env sur un dépôt public. Il contient le mot de passe de la base de données.', 'هذا تمرين. أرسل زميلك الملف `.env` إلى مستودع عام، وفيه كلمة مرور قاعدة البيانات.'),
  words: [word('Secret', 'Une information privée : mot de passe, clé, jeton.', 'السر', 'معلومة خاصة: كلمة مرور أو مفتاح أو رمز.')],
  source: { label: tx('GitHub : supprimer des données sensibles', 'GitHub: حذف البيانات الحساسة'), url: 'https://docs.github.com/fr/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository' },
  host: 'admin@poste',
  startTime: '15:20',
  bestMinutes: 12,
  alert: tx('Le mot de passe de la base de données est public.', 'كلمة مرور قاعدة البيانات أصبحت عامة.'),
  start: 'first',
  nodes: {
    first: {
      question: tx('Quelle est la première chose à faire ?', 'ما أول شيء يجب فعله؟'),
      options: [
        { cmd: 'changer le mot de passe de la base', does: tx('Rendre le mot de passe volé inutile', 'جعل كلمة المرور المسروقة بلا فائدة'), cost: 5, good: true, next: 'deploy', output: 'ALTER ROLE boutique PASSWORD nouveau', comment: tx('C’est la priorité : considérez que le secret a déjà été copié.', 'هذه هي الأولوية: اعتبر أن السر قد تم نسخه بالفعل.') },
        { cmd: 'git rm .env && git commit -m "suppression" && git push', does: tx('Supprimer le fichier de la dernière version', 'حذف الملف من آخر نسخة'), cost: 3, good: false, output: '[main 4c1a2d9] suppression\n 1 file changed, 1 deletion(-)', comment: tx('Le fichier reste visible dans l’historique, et le mot de passe marche toujours.', 'يبقى الملف ظاهرا في التاريخ، وما زالت كلمة المرور تعمل.') },
      ],
    },
    deploy: {
      question: tx('L’application a besoin du nouveau mot de passe. Où le mettre ?', 'يحتاج التطبيق إلى كلمة المرور الجديدة. أين تضعها؟'),
      options: [
        { cmd: 'gh secret set DB_PASSWORD', does: tx('Le ranger dans les secrets GitHub', 'حفظها في أسرار GitHub'), cost: 3, good: true, next: 'stop', output: '✓ Set Actions secret DB_PASSWORD', comment: tx('Le secret n’est plus écrit dans le code.', 'لم يعد السر مكتوبا في الكود.') },
        { cmd: 'écrire le mot de passe dans config.js', does: tx('Le mettre dans le code', 'وضعها في الكود'), cost: 4, good: false, output: 'config.js modifié', comment: tx('C’est exactement la même erreur.', 'هذا هو الخطأ نفسه تماما.') },
      ],
    },
    stop: {
      question: tx('Comment éviter que cela recommence ?', 'كيف نمنع تكرار ذلك؟'),
      options: [
        { cmd: 'echo ".env" >> .gitignore && activer le scan de secrets', does: tx('Ignorer le fichier et détecter les secrets', 'تجاهل الملف واكتشاف الأسرار'), cost: 4, good: true, next: 'done', output: '.gitignore mis à jour\nsecret scanning : activé', comment: tx('Le système protège maintenant toute l’équipe.', 'أصبح النظام يحمي الفريق كله.') },
        { cmd: 'demander au collègue de faire attention', does: tx('Compter sur la mémoire de chacun', 'الاعتماد على ذاكرة كل شخص'), cost: 2, good: false, output: '(rien ne change dans le système)', comment: tx('Tout le monde peut oublier. Il faut une protection automatique.', 'الجميع قد ينسى، لذا نحتاج إلى حماية تلقائية.') },
      ],
    },
    done: { end: true },
  },
  postmortem: [
    { term: tx('L’ordre', 'الترتيب'), text: tx('D’abord changer le secret. Ensuite seulement, nettoyer l’historique si nécessaire.', 'أولا غير السر، وبعد ذلك فقط نظف التاريخ عند الحاجة.') },
    { term: tx('Ce qu’on change', 'ما سنغيره'), text: tx('Les secrets ne sont jamais dans le code, et un outil vérifie chaque push.', 'لا توضع الأسرار في الكود أبدا، وتفحص أداة كل عملية دفع.') },
  ],
}

const quiz = {
  id: 'git-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Pro Git', 'Pro Git'), url: BOOK },
  items: [
    { title: tx('Rebase change les numéros des commits.', 'يغير rebase أرقام الإيداعات.'), ok: true, why: tx('Git crée de nouveaux commits.', 'ينشئ Git إيداعات جديدة.') },
    { title: tx('On peut faire un rebase sur des commits déjà partagés sans danger.', 'يمكن استعمال rebase على إيداعات مشتركة دون خطر.'), ok: false, why: tx('Cela crée des doublons pour le reste de l’équipe.', 'هذا ينشئ نسخا مكررة لبقية الفريق.') },
    { title: tx('Pour annuler un commit déjà sur main, on préfère revert.', 'لإلغاء إيداع موجود في main نفضل revert.'), ok: true, why: tx('Revert ajoute un commit sans réécrire l’histoire.', 'يضيف `revert` إيداعا دون إعادة كتابة التاريخ.') },
    { title: tx('Supprimer un secret avec un nouveau commit suffit.', 'يكفي حذف السر بإيداع جديد.'), ok: false, why: tx('Il reste dans l’historique. Il faut le changer.', 'يبقى في التاريخ، ويجب تغييره.') },
    { title: tx('Plus une branche vit longtemps, plus les conflits sont probables.', 'كلما عاش الفرع مدة أطول، زاد احتمال التعارضات.'), ok: true, why: tx('Elle s’éloigne de plus en plus de main.', 'يبتعد أكثر فأكثر عن `main`.') },
  ],
}

export const gitModule = {
  id: 'git',
  title: tx('Git en équipe', 'Git ضمن فريق'),
  notions: tx('Merge, rebase, annuler, bisect, conflits, secrets', 'الدمج وإعادة التأسيس والإلغاء و bisect والتعارضات والأسرار'),
  slides: [history, undo, bisect, conflict, trunk, incident, quiz],
}
