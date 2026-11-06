import { DOC, L, O, tx } from './helpers.js'

const values = {
  id: 'expr', type: 'flow',
  nav: tx('Expressions', 'التعابير'),
  title: tx('Tout ce qui a une valeur', 'كل ما له قيمة'),
  lead: tx(
    'En PHP, presque tout ce que vous écrivez est une expression : quelque chose qui a une valeur. Comparez les exemples.',
    'في PHP، كل ما تكتبه تقريبا تعبير، أي شيء له قيمة. قارن بين الأمثلة.',
  ),
  source: { label: tx('Les expressions', 'التعابير'), url: DOC + 'language.expressions.php' },
  sourceLabel: 'expressions.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'calc', label: tx('Un calcul', 'عملية حسابية'),
      note: tx('`5 + 2` est une expression dont la valeur est `7`.', 'العبارة `5 + 2` تعبير قيمته `7`.'),
      lines: [L('<?php'), L('echo 5 + 2;', 'a')],
      output: [O('7', 'a')],
    },
    {
      id: 'assign', label: tx('Une affectation', 'إسناد'),
      note: tx(
        'L’affectation est aussi une expression : `$a = 5` vaut `5`. On peut donc l’afficher directement.',
        'الإسناد أيضا تعبير: قيمة `$a = 5` هي `5`، لذلك يمكن عرضه مباشرة.',
      ),
      lines: [L('<?php'), L('echo $a = 5;', 'a')],
      output: [O('5', 'a')],
    },
    {
      id: 'compare', label: tx('Une comparaison', 'مقارنة'),
      note: tx('Une comparaison vaut `true` ou `false`.', 'قيمة المقارنة إما `true` أو `false`.'),
      lines: [L('<?php'), L('var_dump(5 > 3);', 'a')],
      output: [O('bool(true)', 'a')],
    },
    {
      id: 'ternary', label: tx('Le ternaire', 'الشرط الثلاثي'),
      note: tx(
        '`condition ? a : b` vaut `a` si la condition est vraie, sinon `b`.',
        'قيمة `condition ? a : b` هي `a` إذا كان الشرط صحيحا، وإلا فهي `b`.',
      ),
      lines: [L('<?php'), L('$age = 20;'), L('echo $age >= 18 ? "majeur" : "mineur";', 'a')],
      output: [O('majeur', 'a')],
    },
  ],
}

const quiz = {
  id: 'expr-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Le commentaire dit-il vrai ?', 'هل التعليق صحيح؟'),
  lead: tx('Chaque commentaire annonce ce que PHP affiche. Cliquez pour vérifier.', 'كل تعليق يعلن ما سيعرضه PHP. انقر للتحقق.'),
  source: { label: tx('Les expressions', 'التعابير'), url: DOC + 'language.expressions.php' },
  items: [
    { code: 'echo 2 + 3; // 5', ok: true, why: tx('L’expression `2 + 3` vaut `5`.', 'قيمة التعبير `2 + 3` هي `5`.') },
    { code: 'echo $x = 4; // 4', ok: true, why: tx('Une affectation vaut la valeur affectée.', 'قيمة الإسناد هي القيمة المسندة.') },
    { code: 'var_dump(3 > 5); // bool(true)', ok: false, why: tx('3 n’est pas plus grand que 5 : `bool(false)`.', 'العدد 3 ليس أكبر من 5، فالنتيجة `bool(false)`.') },
    { code: 'echo 10 > 5 ? "oui" : "non"; // oui', ok: true, why: tx('La condition est vraie, donc le ternaire vaut `"oui"`.', 'الشرط صحيح، فقيمة الشرط الثلاثي `"oui"`.') },
  ],
}

export const expressionsModule = {
  id: 'expressions',
  title: tx('Les expressions', 'التعابير'),
  notions: tx('Tout ce qui produit une valeur', 'كل ما ينتج قيمة'),
  slides: [values, quiz],
}
