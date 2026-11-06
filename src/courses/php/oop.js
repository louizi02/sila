import { DOC, L, O, S, tx } from './helpers.js'

const voitureLines = [
  L('<?php'),
  L('class Voiture {'),
  L('    public $couleur;'),
  L(''),
  L('    public function klaxonner() {'),
  L('        return "Bip !";'),
  L('    }'),
  L('}'),
  L(''),
]

const classes = {
  id: 'class', type: 'flow',
  nav: tx('Classe et objet', 'الصنف والكائن'),
  title: tx('Une classe, des objets', 'صنف وكائنات'),
  lead: tx(
    'Une classe est un plan. Un objet est une chose construite avec ce plan. Lancez le code pour voir l’objet naître.',
    'الصنف مخطط، والكائن شيء يبنى انطلاقا من هذا المخطط. شغل الكود لترى كيف يولد الكائن.',
  ),
  source: { label: tx('Syntaxe de base des classes', 'أساسيات الأصناف'), url: DOC + 'language.oop5.basic.php' },
  sourceLabel: 'voiture.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'one', label: tx('Un objet', 'كائن واحد'),
      note: tx(
        '`new` crée un objet. `->` accède à une propriété (`couleur`) ou appelle une méthode (`klaxonner()`).',
        'تنشئ `new` كائنا، ويستعمل `->` للوصول إلى خاصية مثل `couleur` أو لاستدعاء طريقة مثل `klaxonner()`.',
      ),
      lines: [...voitureLines, L('$v = new Voiture();'), L('$v->couleur = "rouge";'), L('echo $v->couleur, " ", $v->klaxonner();', 'a')],
      output: [O('rouge Bip !', 'a')],
      trace: [
        S(2, tx('La classe `Voiture` est définie : un plan avec une propriété et une méthode.', 'يعرف الصنف `Voiture`: مخطط فيه خاصية وطريقة.')),
        S(10, tx('`new Voiture()` crée un objet, rangé dans `$v`.', 'تنشئ `new Voiture()` كائنا يوضع في `$v`.'), { vars: { '$v->couleur': 'null' } }),
        S(11, tx('La propriété `couleur` de `$v` reçoit `"rouge"`.', 'تستقبل الخاصية `couleur` في `$v` القيمة `"rouge"`.'), { vars: { '$v->couleur': '"rouge"' } }),
        S(12, tx('Affiche `rouge` puis une espace.', 'يعرض `rouge` ثم فراغا.'), { vars: { '$v->couleur': '"rouge"' }, out: 'rouge ' }),
        S(5, tx('Appel de la méthode `klaxonner()` sur `$v`.', 'استدعاء الطريقة `klaxonner()` على `$v`.'), { vars: { '$v->couleur': '"rouge"' } }),
        S(6, tx('`return` renvoie `"Bip !"`.', 'ترجع `return` النص `"Bip !"`.'), { vars: { '$v->couleur': '"rouge"' } }),
        S(12, tx('Affiche `Bip !`.', 'يعرض `Bip !`.'), { vars: { '$v->couleur': '"rouge"' }, out: 'Bip !' }),
      ],
    },
    {
      id: 'two', label: tx('Deux objets', 'كائنان'),
      note: tx(
        'Le même plan donne deux objets différents. Chacun garde ses propres valeurs.',
        'المخطط نفسه يعطي كائنين مختلفين، ولكل واحد منهما قيمه الخاصة.',
      ),
      lines: [
        ...voitureLines,
        L('$a = new Voiture();'), L('$b = new Voiture();'),
        L('$a->couleur = "rouge";'), L('$b->couleur = "bleu";'),
        L('echo $a->couleur, " ", $b->couleur;', 'a'),
      ],
      output: [O('rouge bleu', 'a')],
    },
  ],
}

const compteLines = (last, id = 'a', k = 'php') => [
  L('<?php'),
  L('class Compte {'),
  L('    public $titulaire;'),
  L('    private $solde = 0;'),
  L(''),
  L('    public function __construct($titulaire) {'),
  L('        $this->titulaire = $titulaire;'),
  L('    }'),
  L(''),
  L('    public function deposer($montant) {'),
  L('        $this->solde += $montant;'),
  L('        return $this->solde;'),
  L('    }'),
  L('}'),
  L(''),
  L('$c = new Compte("Salma");'),
  L(last, id, k),
]

const objet = { '$c->titulaire': '"Salma"', '$c->solde': '0' }
const constructor = {
  id: 'construct', type: 'flow',
  nav: tx('Constructeur', 'المنشئ'),
  title: tx('Constructeur, $this et visibilité', 'المنشئ و $this والرؤية'),
  lead: tx(
    'Un compte bancaire : son titulaire est public, son solde est privé. Lancez le code, puis essayez de lire le solde.',
    'حساب بنكي: صاحبه عام ورصيده خاص. شغل الكود، ثم حاول قراءة الرصيد.',
  ),
  source: { label: tx('Constructeurs et visibilité', 'المنشئ والرؤية'), url: DOC + 'language.oop5.visibility.php' },
  sourceLabel: 'compte.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'deposit', label: tx('Déposer', 'الإيداع'),
      note: tx(
        '`__construct` s’exécute à la création de l’objet. Dans une méthode, `$this` désigne l’objet lui-même.',
        'تنفذ `__construct` عند إنشاء الكائن، وداخل الطريقة يدل `$this` على الكائن نفسه.',
      ),
      lines: compteLines('echo $c->deposer(100);'),
      output: [O('100', 'a')],
      trace: [
        S(2, tx('La classe `Compte` est définie : c’est un plan, pas encore un objet.', 'يعرف الصنف `Compte`: مخطط وليس كائنا بعد.')),
        S(16, tx('`new Compte("Salma")` crée un objet.', 'تنشئ `new Compte("Salma")` كائنا.')),
        S(6, tx('Le constructeur s’exécute automatiquement, avec `$titulaire = "Salma"`.', 'ينفذ المنشئ تلقائيا مع `$titulaire = "Salma"`.'), { vars: { '$titulaire': '"Salma"' } }),
        S(7, tx('`$this` est l’objet en création : sa propriété `titulaire` reçoit `"Salma"`.', 'يدل `$this` على الكائن قيد الإنشاء، فتستقبل خاصيته `titulaire` القيمة `"Salma"`.'), { vars: { '$this->titulaire': '"Salma"', '$this->solde': '0' } }),
        S(16, tx('L’objet est prêt et rangé dans `$c`.', 'الكائن جاهز ويوضع في `$c`.'), { vars: objet }),
        S(17, tx('Appel de la méthode `deposer(100)` sur `$c`.', 'استدعاء الطريقة `deposer(100)` على `$c`.'), { vars: objet }),
        S(10, tx('Le paramètre `$montant` reçoit 100.', 'يستقبل المعامل `$montant` القيمة 100.'), { vars: { ...objet, '$montant': '100' } }),
        S(11, tx('`$this->solde += 100` : le solde passe de 0 à 100.', 'بعد `$this->solde += 100` ينتقل الرصيد من 0 إلى 100.'), { vars: { ...objet, '$c->solde': '100', '$montant': '100' } }),
        S(12, tx('`return` renvoie le nouveau solde, 100.', 'ترجع `return` الرصيد الجديد، أي 100.'), { vars: { ...objet, '$c->solde': '100' } }),
        S(17, tx('`echo` affiche 100.', 'تعرض `echo` القيمة 100.'), { vars: { ...objet, '$c->solde': '100' }, out: '100' }),
      ],
    },
    {
      id: 'public', label: tx('Lire le titulaire', 'قراءة صاحب الحساب'),
      note: tx('`public` : la propriété se lit depuis l’extérieur de la classe.', 'الخاصية `public` يمكن قراءتها من خارج الصنف.'),
      lines: compteLines('echo $c->titulaire;'),
      output: [O('Salma', 'a')],
    },
    {
      id: 'private', label: tx('Lire le solde', 'قراءة الرصيد'),
      note: tx(
        '`private` : seule la classe elle-même peut lire `$solde`. Depuis l’extérieur, PHP lance une erreur.',
        'الخاصية `private` لا يقرؤها إلا الصنف نفسه، ومن الخارج يظهر PHP خطأ.',
      ),
      lines: compteLines('echo $c->solde;', 'a', 'err'),
      output: [O('Fatal error: Uncaught Error: Cannot access private property Compte::$solde in compte.php on line 17', 'a', 'err')],
    },
  ],
}

const animalLines = [
  L('<?php'),
  L('class Animal {'),
  L('    public function parler() {'),
  L('        return "...";'),
  L('    }'),
  L('}'),
  L(''),
]

const inheritance = {
  id: 'extends', type: 'flow',
  nav: tx('Héritage', 'الوراثة'),
  title: tx('L’héritage', 'الوراثة'),
  lead: tx('Avec `extends`, une classe reprend tout ce que fait une autre, et peut le changer.', 'باستعمال `extends` يأخذ صنف كل ما يفعله صنف آخر، ويمكنه تغييره.'),
  source: { label: tx('Héritage', 'الوراثة'), url: DOC + 'language.oop5.inheritance.php' },
  sourceLabel: 'animaux.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'override', label: tx('Hériter et redéfinir', 'الوراثة وإعادة التعريف'),
      note: tx(
        '`Chat` redéfinit `parler()`, donc il dit `Miaou`. `Chien` ne la redéfinit pas : il utilise celle d’`Animal`.',
        'يعيد `Chat` تعريف `parler()` فيقول `Miaou`، أما `Chien` فلا يعيد تعريفها، فيستعمل طريقة `Animal`.',
      ),
      lines: [
        ...animalLines,
        L('class Chat extends Animal {'), L('    public function parler() {'), L('        return "Miaou";'), L('    }'), L('}'),
        L(''), L('class Chien extends Animal {}'), L(''),
        L('echo (new Chat())->parler(), " ";', 'a'),
        L('echo (new Chien())->parler();', 'b'),
      ],
      output: [O('Miaou ...', ['a', 'b'])],
    },
    {
      id: 'parent', label: tx('`parent::`', '`parent::`'),
      note: tx('`parent::parler()` appelle la méthode de la classe parente, puis `Chat` y ajoute son texte.', 'تستدعي `parent::parler()` طريقة الصنف الأب، ثم يضيف `Chat` نصه إليها.'),
      lines: [
        ...animalLines,
        L('class Chat extends Animal {'), L('    public function parler() {'), L('        return parent::parler() . " Miaou";'), L('    }'), L('}'),
        L(''),
        L('echo (new Chat())->parler();', 'a'),
      ],
      output: [O('... Miaou', 'a')],
    },
  ],
}

const quiz = {
  id: 'oop-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Les classes et les objets', 'الأصناف والكائنات'), url: DOC + 'language.oop5.php' },
  items: [
    { title: tx('Une classe est un plan, un objet est construit avec ce plan.', 'الصنف مخطط، والكائن يبنى انطلاقا منه.'), ok: true, why: tx('`new` crée un objet à partir d’une classe.', 'تنشئ `new` كائنا انطلاقا من صنف.') },
    { title: tx('Deux objets de la même classe partagent leurs valeurs.', 'كائنان من الصنف نفسه يتشاركان القيم.'), ok: false, why: tx('Chaque objet garde ses propres valeurs.', 'لكل كائن قيمه الخاصة.') },
    { title: tx('Une propriété private se lit depuis l’extérieur de la classe.', 'يمكن قراءة خاصية خاصة من خارج الصنف.'), ok: false, why: tx('`private` la réserve à la classe elle-même.', 'تجعلها `private` مقتصرة على الصنف نفسه.') },
    { title: tx('Le constructeur s’exécute à la création de l’objet.', 'ينفذ المنشئ عند إنشاء الكائن.'), ok: true, why: tx('`__construct` est appelé automatiquement par `new`.', 'تستدعي `new` الطريقة `__construct` تلقائيا.') },
    { title: tx('Une classe enfant peut redéfinir une méthode de son parent.', 'يمكن للصنف الابن إعادة تعريف طريقة من الأب.'), ok: true, why: tx('Et elle peut encore appeler celle du parent avec `parent::`.', 'ويمكنه أيضا استدعاء طريقة الأب بـ `parent::`.') },
  ],
}

export const oopModule = {
  id: 'oop',
  title: tx('Classes et objets', 'الأصناف والكائنات'),
  notions: tx('Classe, objet, constructeur, visibilité, héritage', 'الصنف والكائن والمنشئ والرؤية والوراثة'),
  slides: [classes, constructor, inheritance, quiz],
}
