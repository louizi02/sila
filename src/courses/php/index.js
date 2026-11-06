import { tx } from './helpers.js'
import { introModule } from './intro.js'
import { commentsSlide, endOfFileSlide, semicolonSlide, syntaxQuiz, tagsSlide } from './syntax.js'
import { typesModule } from './types.js'
import { variablesModule } from './variables.js'
import { constantsModule } from './constants.js'
import { expressionsModule } from './expressions.js'
import { operatorsModule } from './operators.js'
import { controlModule } from './control.js'
import { functionsModule } from './functions.js'

const syntaxModule = {
  id: 'syntax',
  title: tx('Syntaxe de base', 'أساسيات الكتابة'),
  notions: tx('Balises, point-virgule, commentaires', 'الوسوم والفاصلة المنقوطة والتعليقات'),
  slides: [tagsSlide, semicolonSlide, commentsSlide, endOfFileSlide, syntaxQuiz],
}

// Modules de la deuxième partie, annoncés mais pas encore écrits.
const later = (id, fr, ar) => ({ id, title: tx(fr, ar), notions: tx('', ''), slides: [] })

export const phpCourse = {
  name: 'PHP',
  title: tx('Cours PHP', 'دورة PHP'),
  lead: tx('Le cours suit l’ordre de la documentation officielle de PHP.', 'تتبع الدورة ترتيب التوثيق الرسمي للغة PHP.'),
  parts: [
    {
      id: 'fundamentals',
      title: tx('Les fondamentaux', 'الأساسيات'),
      lead: tx('Tout ce qu’il faut pour écrire ses premiers scripts.', 'كل ما تحتاجه لكتابة برامجك الأولى.'),
      modules: [introModule, syntaxModule, typesModule, variablesModule, constantsModule, expressionsModule, operatorsModule, controlModule, functionsModule],
    },
    {
      id: 'further',
      title: tx('Aller plus loin', 'التعمق أكثر'),
      lead: tx('La suite du cours, en préparation.', 'بقية الدورة، قيد الإعداد.'),
      modules: [
        later('oop', 'Classes et objets', 'الأصناف والكائنات'),
        later('namespaces', 'Espaces de noms', 'مساحات الأسماء'),
        later('enums', 'Énumérations', 'التعدادات'),
        later('errors', 'Gestion des erreurs', 'معالجة الأخطاء'),
      ],
    },
  ],
}
