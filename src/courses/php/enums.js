import { DOC, L, O, tx } from './helpers.js'

const pureLines = [
  L('<?php'),
  L('enum Statut {'),
  L('    case Actif;'),
  L('    case Inactif;'),
  L('}'),
  L(''),
]

const pure = {
  id: 'enum', type: 'flow',
  nav: tx('Énumération', 'التعداد'),
  title: tx('Une liste fermée de valeurs', 'قائمة مغلقة من القيم'),
  lead: tx(
    'Une énumération liste toutes les valeurs possibles, et rien d’autre. Elle existe depuis PHP 8.1.',
    'يسرد التعداد كل القيم الممكنة ولا شيء غيرها، وهو موجود منذ PHP 8.1.',
  ),
  source: { label: tx('Énumérations de base', 'التعدادات الأساسية'), url: DOC + 'language.enumerations.basics.php' },
  sourceLabel: 'statut.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'use', label: tx('Utiliser un cas', 'استعمال حالة'),
      note: tx(
        '`Statut::Actif` est un cas de l’énumération. On le compare avec `===`, et `->name` donne son nom.',
        'تمثل `Statut::Actif` حالة من التعداد، ونقارنها بـ `===`، وتعطي `->name` اسمها.',
      ),
      lines: [...pureLines, L('$s = Statut::Actif;'), L('var_dump($s === Statut::Actif);', 'a'), L('echo $s->name;', 'b')],
      output: [O('bool(true)', 'a'), O('Actif', 'b')],
    },
    {
      id: 'unknown', label: tx('Un cas inexistant', 'حالة غير موجودة'),
      note: tx(
        'Un cas qui n’est pas dans la liste n’existe pas : PHP lance une erreur. C’est ce qui rend l’énumération sûre.',
        'الحالة غير الموجودة في القائمة لا وجود لها، فيظهر PHP خطأ. وهذا ما يجعل التعداد آمنا.',
      ),
      lines: [...pureLines, L('$s = Statut::Supprime;', 'a', 'err')],
      output: [O('Fatal error: Uncaught Error: Undefined constant Statut::Supprime in statut.php on line 7', 'a', 'err')],
    },
  ],
}

const backed = {
  id: 'backed', type: 'flow',
  nav: tx('Avec valeur', 'مع قيمة'),
  title: tx('Énumérations avec valeur', 'تعدادات مع قيمة'),
  lead: tx('Chaque cas peut porter une valeur, par exemple le texte enregistré dans une base de données.', 'يمكن لكل حالة أن تحمل قيمة، مثل النص المحفوظ في قاعدة البيانات.'),
  source: { label: tx('Énumérations avec valeur de base', 'التعدادات ذات القيمة'), url: DOC + 'language.enumerations.backed.php' },
  sourceLabel: 'statut.php',
  outputLabel: tx('Résultat', 'النتيجة'),
  variants: [
    {
      id: 'values', label: tx('`value` et `tryFrom`', '`value` و `tryFrom`'),
      note: tx(
        '`->value` donne la valeur d’un cas. `tryFrom()` retrouve le cas à partir d’une valeur, ou renvoie `NULL` si aucun cas ne correspond.',
        'تعطي `->value` قيمة الحالة، وتجد `tryFrom()` الحالة انطلاقا من قيمة، أو ترجع `NULL` إذا لم تطابق أي حالة.',
      ),
      lines: [
        L('<?php'),
        L('enum Statut: string {'),
        L("    case Actif = 'actif';"),
        L("    case Inactif = 'inactif';"),
        L('}'),
        L(''),
        L('echo Statut::Actif->value, "\\n";', 'a'),
        L("var_dump(Statut::tryFrom('inactif'));", 'b'),
        L("var_dump(Statut::tryFrom('supprime'));", 'c'),
      ],
      output: [O('actif', 'a'), O('enum(Statut::Inactif)', 'b'), O('NULL', 'c')],
    },
  ],
}

const quiz = {
  id: 'enum-quiz', type: 'rules',
  nav: tx('Exercice', 'تمرين'),
  title: tx('Vrai ou faux ?', 'صحيح أم خطأ؟'),
  lead: tx('Cliquez sur chaque phrase pour vérifier.', 'انقر على كل جملة للتحقق.'),
  source: { label: tx('Les énumérations', 'التعدادات'), url: DOC + 'language.enumerations.php' },
  items: [
    { title: tx('Une énumération accepte n’importe quelle valeur.', 'يقبل التعداد أي قيمة.'), ok: false, why: tx('Seuls les cas listés existent.', 'لا توجد إلا الحالات المسرودة.') },
    { title: tx('->name donne le nom du cas.', 'تعطي ->name اسم الحالة.'), ok: true, why: tx('`Statut::Actif->name` vaut `"Actif"`.', 'قيمة `Statut::Actif->name` هي `"Actif"`.') },
    { title: tx('tryFrom renvoie NULL pour une valeur inconnue.', 'ترجع tryFrom القيمة NULL لقيمة غير معروفة.'), ok: true, why: tx('`tryFrom` ne lance pas d’erreur, contrairement à `from`.', 'لا تظهر `tryFrom` خطأ، على عكس `from`.') },
  ],
}

export const enumsModule = {
  id: 'enums',
  title: tx('Énumérations', 'التعدادات'),
  notions: tx('enum, cas, valeurs, tryFrom', 'enum والحالات والقيم و tryFrom'),
  slides: [pure, backed, quiz],
}
