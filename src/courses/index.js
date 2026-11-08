import { phpCourse } from './php/index.js'
import { devopsCourse } from './devops/index.js'

// Catalogue affiché sur l'accueil. Une technologie sans `course` apparaît « Bientôt ».
export const catalog = [
  {
    id: 'php', name: 'PHP', color: 'var(--pink)', snippet: '$age = 25;', anim: 'php', course: phpCourse,
    blurb: { fr: 'Le langage qui fabrique les pages web sur le serveur. Les fondamentaux sont prêts.', ar: 'اللغة التي تصنع صفحات الويب على الخادم. الأساسيات جاهزة.' },
  },
  {
    id: 'devops', name: 'DevOps', color: 'var(--amber)', snippet: 'git push', anim: 'devops', course: devopsCourse,
    blurb: { fr: 'CI/CD, conteneurs, infrastructure, production et incidents, au niveau professionnel.', ar: 'CI/CD والحاويات والبنية التحتية والإنتاج والحوادث، بمستوى احترافي.' },
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
]
