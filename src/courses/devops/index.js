import { foundationsModule } from './foundations.js'

const tx = (fr, ar) => ({ fr, ar })
const later = (id, title, notions) => ({ id, title, notions, slides: [] })

export const devopsCourse = {
  name: 'DevOps',
  title: tx('Devenir ingénieur DevOps', 'كن مهندس DevOps'),
  lead: tx(
    'Pour les développeurs qui connaissent les bases. On travaille les compromis, les pannes et les décisions réelles.',
    'للمطورين الذين يعرفون الأساسيات. نشتغل على المفاضلات والأعطال والقرارات الحقيقية.',
  ),
  parts: [
    {
      id: 'understand', title: tx('Comprendre', 'الفهم'),
      lead: tx('Le problème que DevOps résout, avant les outils.', 'المشكلة التي يحلها DevOps قبل الأدوات.'),
      modules: [foundationsModule],
    },
    {
      id: 'base', title: tx('Le socle système', 'الأساس النظامي'),
      lead: tx('Ce qu’il faut maîtriser pour diagnostiquer une panne.', 'ما يجب إتقانه لتشخيص عطل.'),
      modules: [
        later('linux', tx('Linux en production', 'Linux في الإنتاج'), tx('Processus, signaux, systemd, descripteurs, permissions, journaux', 'العمليات والإشارات و systemd والواصفات والصلاحيات والسجلات')),
        later('network', tx('Réseau pour le diagnostic', 'الشبكة للتشخيص'), tx('TCP, DNS, HTTP, TLS, ports, pannes typiques', 'TCP و DNS و HTTP و TLS والمنافذ والأعطال الشائعة')),
        later('git', tx('Git en équipe', 'Git ضمن فريق'), tx('Trunk-based, rebase, bisect, revert, protections', 'Trunk-based و rebase و bisect و revert والحماية')),
        later('bash', tx('Scripts fiables', 'برامج نصية موثوقة'), tx('Bash strict, idempotence, codes de sortie, erreurs', 'Bash الصارم والتكرار الآمن ورموز الخروج والأخطاء')),
      ],
    },
    {
      id: 'ship', title: tx('Construire et livrer', 'البناء والتسليم'),
      lead: tx('Du code source à l’artefact déployé en sécurité.', 'من الكود المصدري إلى حزمة منشورة بأمان.'),
      modules: [
        later('docker', tx('Docker en profondeur', 'Docker بعمق'), tx('Namespaces, cgroups, couches, multi-stage, digest', 'Namespaces و cgroups والطبقات و multi-stage والبصمة')),
        later('compose', tx('Compose et registres', 'Compose والسجلات'), tx('Réseaux, volumes, santé, registres, signatures', 'الشبكات والأقراص والصحة والسجلات والتوقيعات')),
        later('ci', tx('Intégration continue', 'التكامل المستمر'), tx('Cache, matrices, secrets, tests instables, GitLab CI', 'التخزين المؤقت والمصفوفات والأسرار والاختبارات غير المستقرة و GitLab CI')),
        later('cd', tx('Déploiement continu', 'النشر المستمر'), tx('Stratégies, migrations expand/contract, feature flags, rollback', 'الاستراتيجيات وترحيل expand/contract ومفاتيح الميزات والتراجع')),
      ],
    },
    {
      id: 'infra', title: tx('Infrastructure', 'البنية التحتية'),
      lead: tx('Une infrastructure reproductible, décrite comme du code.', 'بنية تحتية قابلة لإعادة الإنشاء، موصوفة ككود.'),
      modules: [
        later('nginx', tx('Nginx et reverse proxy', 'Nginx والوسيط العكسي'), tx('Upstreams, TLS, délais, 502 et 504, équilibrage', 'Upstreams و TLS والمهل و 502 و 504 وموازنة الحمل')),
        later('cloud', tx('Le cloud', 'السحابة'), tx('IAM, VPC, calcul, stockage, coûts, zones', 'IAM و VPC والحوسبة والتخزين والتكاليف والمناطق')),
        later('terraform', tx('Terraform', 'Terraform'), tx('State, plan, modules, dérive, verrouillage, OpenTofu', 'الحالة والخطة والوحدات والانحراف والقفل و OpenTofu')),
        later('ansible', tx('Ansible', 'Ansible'), tx('Inventaires, idempotence, rôles, secrets', 'المخزون والتكرار الآمن والأدوار والأسرار')),
      ],
    },
    {
      id: 'production', title: tx('Production', 'الإنتاج'),
      lead: tx('Faire tourner et réparer des systèmes à l’échelle.', 'تشغيل الأنظمة وإصلاحها على نطاق واسع.'),
      modules: [
        later('k8s', tx('Kubernetes', 'Kubernetes'), tx('Contrôleurs, pods, services, sondes, ressources, diagnostic', 'المتحكمات و pods والخدمات والمسابير والموارد والتشخيص')),
        later('gitops', tx('Helm et GitOps', 'Helm و GitOps'), tx('Charts, réconciliation, Argo CD, promotion', 'Charts والمزامنة و Argo CD والترقية')),
        later('observability', tx('Observabilité', 'قابلية المراقبة'), tx('Métriques, logs, traces, Prometheus, alertes sur symptômes', 'المقاييس والسجلات والتتبع و Prometheus والتنبيه على الأعراض')),
        later('devsecops', tx('DevSecOps', 'DevSecOps'), tx('Secrets, moindre privilège, scans, chaîne d’approvisionnement, SLSA', 'الأسرار وأقل الصلاحيات والفحص وسلسلة التوريد و SLSA')),
        later('sre', tx('SRE et incidents', 'SRE والحوادث'), tx('SLO, budget d’erreur, astreinte, post-mortem', 'SLO وميزانية الأخطاء والمناوبة وتحليل الحوادث')),
      ],
    },
    {
      id: 'professional', title: tx('Devenir professionnel', 'الاحتراف'),
      lead: tx('Prouver ce que vous savez faire.', 'إثبات ما تستطيع فعله.'),
      modules: [
        later('project', tx('Projet complet', 'مشروع كامل'), tx('Déployer et exploiter Sila de bout en bout', 'نشر Sila وتشغيله من البداية إلى النهاية')),
        later('career', tx('Portfolio et entretiens', 'ملف الأعمال والمقابلات'), tx('Certifications, questions de conception, scénarios de panne', 'الشهادات وأسئلة التصميم وسيناريوهات الأعطال')),
      ],
    },
  ],
}
