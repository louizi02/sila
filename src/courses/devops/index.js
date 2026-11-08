import { tx } from './helpers.js'
import { foundationsModule } from './foundations.js'
import { linuxModule } from './linux.js'
import { networkModule } from './network.js'
import { gitModule } from './git.js'
import { scriptsModule } from './scripts.js'
import { cdModule, ciModule, composeModule, dockerModule } from './ship.js'
import { ansibleModule, cloudModule, nginxModule, terraformModule } from './infra.js'
import { devsecopsModule, gitopsModule, k8sModule, observabilityModule, sreModule } from './production.js'
import { careerModule, projectModule } from './career.js'

export const devopsCourse = {
  name: 'DevOps',
  title: tx('Devenir ingénieur DevOps', 'كن مهندس DevOps'),
  lead: tx(
    'Un parcours complet, étape par étape, avec des exercices sur de vraies situations.',
    'مسار كامل، خطوة بخطوة، مع تمارين على مواقف حقيقية.',
  ),
  parts: [
    { id: 'understand', title: tx('Comprendre', 'الفهم'), lead: tx('Le problème que DevOps résout, avant les outils.', 'المشكلة التي يحلها DevOps قبل الأدوات.'), modules: [foundationsModule] },
    { id: 'base', title: tx('Les bases du serveur', 'أساسيات الخادم'), lead: tx('Ce qu’il faut savoir pour comprendre et réparer une panne.', 'ما يجب معرفته لفهم العطل وإصلاحه.'), modules: [linuxModule, networkModule, gitModule, scriptsModule] },
    { id: 'ship', title: tx('Construire et livrer', 'البناء والتسليم'), lead: tx('Du code source jusqu’à la mise en ligne sans danger.', 'من الكود المصدري إلى النشر الآمن.'), modules: [dockerModule, composeModule, ciModule, cdModule] },
    { id: 'infra', title: tx('Infrastructure', 'البنية التحتية'), lead: tx('Créer ses serveurs avec du code, pour pouvoir tout refaire.', 'إنشاء الخوادم بالكود لإعادة كل شيء عند الحاجة.'), modules: [nginxModule, cloudModule, terraformModule, ansibleModule] },
    { id: 'production', title: tx('Production', 'الإنتاج'), lead: tx('Faire tourner, surveiller et réparer de vrais systèmes.', 'تشغيل أنظمة حقيقية ومراقبتها وإصلاحها.'), modules: [k8sModule, gitopsModule, observabilityModule, devsecopsModule, sreModule] },
    { id: 'professional', title: tx('Devenir professionnel', 'الاحتراف'), lead: tx('Prouver ce que vous savez faire.', 'إثبات ما تستطيع فعله.'), modules: [projectModule, careerModule] },
  ],
}
