import { phpCourse } from './php.js'

// Catalogue affiché sur l'accueil. Une technologie sans `course` apparaît « Bientôt ».
export const catalog = [
  {
    id: 'php', name: 'PHP', color: 'var(--pink)', snippet: '$age = 25;', course: phpCourse,
    blurb: { fr: 'Les fondamentaux, de la syntaxe de base aux fonctions.', ar: 'الأساسيات، من قواعد الكتابة إلى الدوال.' },
  },
  {
    id: 'javascript', name: 'JavaScript', color: 'var(--amber)', snippet: 'const age = 25;',
    blurb: { fr: 'Le langage des pages web interactives.', ar: 'لغة صفحات الويب التفاعلية.' },
  },
  {
    id: 'python', name: 'Python', color: 'var(--lime)', snippet: 'age = 25',
    blurb: { fr: 'Un langage lisible pour les scripts et les données.', ar: 'لغة سهلة القراءة للبرامج النصية والبيانات.' },
  },
  {
    id: 'sql', name: 'SQL', color: 'var(--cyan)', snippet: 'SELECT age FROM users;',
    blurb: { fr: 'Lire et modifier les données d’une base.', ar: 'قراءة بيانات قاعدة البيانات وتعديلها.' },
  },
  {
    id: 'react', name: 'React', color: 'var(--cyan)', snippet: '<Profil age={25} />',
    blurb: { fr: 'Construire une interface avec des composants.', ar: 'بناء الواجهات باستعمال المكونات.' },
  },
  {
    id: 'docker', name: 'Docker', color: 'var(--pink)', snippet: 'docker compose up',
    blurb: { fr: 'Lancer une application dans des conteneurs.', ar: 'تشغيل التطبيقات داخل الحاويات.' },
  },
]
