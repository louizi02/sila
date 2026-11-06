import { DOC, L, O, tx } from './helpers.js'
import { namesQuiz, variableSlide } from './legacy.js'

const assign = {
  id: 'assign', type: 'flow',
  nav: tx('Affectation', 'الإسناد'),
  title: tx('Changer et copier une valeur', 'تغيير قيمة ونسخها'),
  lead: tx('Une variable peut changer de valeur. Que se passe-t-il quand on la copie ?', 'يمكن أن تتغير قيمة المتغير. فماذا يحدث عندما ننسخه؟'),
  source: { label: tx('Les bases des variables', 'أساسيات المتغيرات'), url: DOC + 'language.variables.basics.php' },
  sourceLabel: 'affectation.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'reassign', label: tx('Réaffecter', 'إعادة الإسناد'),
      note: tx('Une nouvelle affectation remplace l’ancienne valeur.', 'الإسناد الجديد يعوض القيمة القديمة.'),
      lines: [L('<?php'), L('$age = 25;'), L('$age = 26;'), L('echo $age;', 'a')],
      output: [O('26', 'a')],
    },
    {
      id: 'copy', label: tx('Copier', 'النسخ'),
      note: tx(
        'Par défaut, `$b = $a` copie la valeur. Changer `$a` ensuite ne change pas `$b`.',
        'افتراضيا، `$b = $a` ينسخ القيمة. تغيير `$a` بعد ذلك لا يغير `$b`.',
      ),
      lines: [L('<?php'), L('$a = 5;'), L('$b = $a;'), L('$a = 10;'), L('echo $b;', 'a')],
      output: [O('5', 'a')],
    },
  ],
}

const scope = {
  id: 'scope', type: 'flow',
  nav: tx('Portée', 'النطاق'),
  title: tx('La portée d’une variable', 'نطاق المتغير'),
  lead: tx(
    'Une fonction a ses propres variables. Comparez trois façons d’y utiliser un nom. Les fonctions seront détaillées au module 08.',
    'للدالة متغيراتها الخاصة. قارن بين ثلاث طرق لاستعمال اسم داخلها. سنفصل الدوال في الوحدة 08.',
  ),
  source: { label: tx('Portée des variables', 'نطاق المتغيرات'), url: DOC + 'language.variables.scope.php' },
  sourceLabel: 'portee.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'local', label: tx('Sans rien', 'بدون شيء'),
      note: tx(
        'Dans la fonction, `$nom` n’existe pas : la variable du dehors n’est pas visible. PHP affiche un avertissement.',
        'داخل الدالة لا يوجد `$nom`، لأن المتغير الخارجي غير مرئي فيها، فيعرض PHP تحذيرا.',
      ),
      lines: [L('<?php'), L('$nom = "Salma";'), L('function saluer() {'), L('    echo "Bonjour $nom";', 'a', 'err'), L('}'), L('saluer();')],
      output: [O('Warning: Undefined variable $nom in portee.php on line 4', 'a', 'err'), O('Bonjour ')],
    },
    {
      id: 'global', label: tx('Avec global', 'مع global'),
      note: tx(
        '`global $nom;` rend la variable du dehors visible dans la fonction.',
        'التعليمة `global $nom;` تجعل المتغير الخارجي مرئيا داخل الدالة.',
      ),
      lines: [L('<?php'), L('$nom = "Salma";'), L('function saluer() {'), L('    global $nom;'), L('    echo "Bonjour $nom";', 'a'), L('}'), L('saluer();')],
      output: [O('Bonjour Salma', 'a')],
    },
    {
      id: 'param', label: tx('Avec un paramètre', 'مع معامل'),
      note: tx(
        'Le plus clair : donner la valeur à la fonction comme paramètre.',
        'الطريقة الأوضح: إعطاء القيمة للدالة كمعامل.',
      ),
      lines: [L('<?php'), L('function saluer($nom) {'), L('    echo "Bonjour $nom";', 'a'), L('}'), L('saluer("Salma");')],
      output: [O('Bonjour Salma', 'a')],
    },
  ],
}

export const variablesModule = {
  id: 'variables',
  title: tx('Les variables', 'المتغيرات'),
  notions: tx('Noms, affectation, copie, portée', 'الأسماء والإسناد والنسخ والنطاق'),
  slides: [variableSlide, namesQuiz, assign, scope],
}
