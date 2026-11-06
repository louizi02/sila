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
import { oopModule } from './oop.js'
import { namespacesModule } from './namespaces.js'
import { enumsModule } from './enums.js'
import { errorsModule } from './errors.js'

const syntaxModule = {
  id: 'syntax',
  title: tx('Syntaxe de base', 'أساسيات الكتابة'),
  notions: tx('Balises, point-virgule, commentaires', 'الوسوم والفاصلة المنقوطة والتعليقات'),
  slides: [tagsSlide, semicolonSlide, commentsSlide, endOfFileSlide, syntaxQuiz],
}

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
      lead: tx('Organiser un vrai projet : objets, espaces de noms, énumérations et erreurs.', 'تنظيم مشروع حقيقي: الكائنات ومساحات الأسماء والتعدادات والأخطاء.'),
      modules: [oopModule, namespacesModule, enumsModule, errorsModule],
    },
  ],
}
