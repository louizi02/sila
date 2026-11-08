import { card, module, no, page, quiz, stage, tx, yes } from './helpers.js'

const project = page('steps', 'project', ['Le projet', 'المشروع'], ['Déployer Sila de bout en bout', 'نشر Sila من البداية إلى النهاية'],
  ['C’est le projet à faire vous-même. Il utilise tout le cours sur une vraie application : Sila. Attention : un serveur cloud peut coûter de l’argent. Créez une alerte de budget, et supprimez tout à la fin.', 'هذا مشروع تنجزه بنفسك، ويستعمل كل الدورة على تطبيق حقيقي هو Sila. انتبه: قد يكلف خادم السحابة مالا، فأنشئ تنبيه ميزانية واحذف كل شيء في النهاية.'],
  ['Dépôt Sila', 'مستودع Sila', 'https://github.com/louizi02/sila'],
  { stages: [
    stage('a', '1. Image', '1. الصورة', 'Docker', 'Écrivez un Dockerfile multi-stage : Node construit le site, Nginx le sert. Le site est construit pour le chemin /sila/.', 'اكتب `Dockerfile` متعدد المراحل: يبني Node الموقع ويقدمه Nginx. الموقع مبني للمسار `/sila/`.', 'FROM node:22 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:1.27\nCOPY --from=build /app/dist /usr/share/nginx/html/sila'),
    stage('b', '2. CI', '2. CI', 'GitHub Actions', 'À chaque pull request : installer, construire et vérifier le site.', 'مع كل طلب دمج: التثبيت والبناء وفحص الموقع.', 'npm ci\nnpm run build'),
    stage('c', '3. Registre', '3. السجل', 'GHCR', 'Publiez l’image, et gardez son digest.', 'انشر الصورة واحتفظ ببصمتها.', 'docker push ghcr.io/louizi02/sila:v1'),
    stage('d', '4. Serveur', '4. الخادم', 'Terraform', 'Créez un petit serveur et ses règles de pare-feu avec Terraform. Vérifiez toujours le plan.', 'أنشئ خادما صغيرا وقواعد جداره الناري بـ Terraform، وتحقق دائما من الخطة.', 'terraform plan\nterraform apply'),
    stage('e', '5. Configuration', '5. الإعداد', 'Ansible', 'Installez Docker sur le serveur avec un playbook. Relancez-le : vous devez voir changed=0.', 'ثبت Docker على الخادم بواسطة Playbook، وأعد تشغيله فيجب أن ترى `changed=0`.', 'ansible-playbook -i inventaire.ini serveur.yml'),
    stage('f', '6. Déploiement', '6. النشر', 'CD', 'Le pipeline déploie le digest sur le serveur, puis vérifie la réponse HTTP.', 'ينشر المسار البصمة على الخادم، ثم يتحقق من جواب HTTP.', 'curl -fsS https://votre-domaine/sila/'),
    stage('g', '7. HTTPS', '7. HTTPS', 'Nginx', 'Mettez Nginx devant le conteneur, avec un certificat valide.', 'ضع Nginx أمام الحاوية مع شهادة صالحة.'),
    stage('h', '8. Surveillance', '8. المراقبة', 'Prometheus', 'Mesurez la disponibilité, et créez une alerte visible par les utilisateurs.', 'قس التوفر وأنشئ تنبيها يعكس ما يراه المستخدمون.'),
    stage('i', '9. Panne volontaire', '9. عطل متعمد', 'rollback', 'Déployez une version cassée. Revenez en arrière, puis écrivez le rapport.', 'انشر إصدارا معطلا، ثم تراجع واكتب التقرير.'),
    stage('j', '10. Présenter', '10. العرض', 'README', 'Expliquez le projet avec un schéma, vos choix et ce que vous amélioreriez.', 'اشرح المشروع برسم بياني واختياراتك وما ستحسنه.'),
  ] })

const doneCheck = page('rules', 'done', ['Terminé ?', 'انتهى؟'], ['Quand le projet est-il vraiment fini ?', 'متى ينتهي المشروع فعلا؟'],
  ['Cliquez sur chaque carte. Vous devez pouvoir prouver chaque point.', 'انقر على كل بطاقة، ويجب أن تستطيع إثبات كل نقطة.'],
  ['DORA : capacités', 'DORA: القدرات', 'https://dora.dev/capabilities/'], { reveal: true, items: [
    card('Reproductible', 'قابل للتكرار', 'Vous pouvez tout supprimer et tout recréer avec vos fichiers.', 'تستطيع حذف كل شيء وإعادة إنشائه بملفاتك.'),
    card('Automatique', 'تلقائي', 'Un git push suffit pour mettre à jour le site.', 'يكفي `git push` لتحديث الموقع.'),
    card('Réversible', 'قابل للتراجع', 'Vous savez revenir en arrière en quelques minutes.', 'تعرف كيف تتراجع في دقائق.'),
    card('Observable', 'قابل للمراقبة', 'Vous savez si le site marche sans l’ouvrir.', 'تعرف هل يعمل الموقع دون فتحه.'),
    card('Sûr', 'آمن', 'Aucun secret dans Git, et le minimum de droits partout.', 'لا أسرار في Git، وأقل الصلاحيات في كل مكان.'),
  ] })

const portfolio = page('rules', 'portfolio', ['Portfolio', 'ملف الأعمال'], ['Montrer ce que vous savez faire', 'إظهار ما تستطيع فعله'],
  ['Un recruteur croit ce qu’il peut vérifier. Cliquez sur les cartes.', 'يصدق المسؤول عن التوظيف ما يستطيع التحقق منه. انقر على البطاقات.'],
  ['roadmap.sh : DevOps', 'roadmap.sh: DevOps', 'https://roadmap.sh/devops'], { reveal: true, items: [
    card('Un vrai dépôt', 'مستودع حقيقي', 'Votre projet avec son pipeline, son historique et un bon README.', 'مشروعك مع مساره وتاريخه و `README` جيد.'),
    card('Des décisions', 'القرارات', 'Expliquez pourquoi vous avez choisi cette solution, et ce que vous avez refusé.', 'اشرح لماذا اخترت هذا الحل وما الذي رفضته.'),
    card('Une panne racontée', 'عطل محكي', 'Un rapport de panne clair montre un vrai niveau professionnel.', 'تقرير عطل واضح يظهر مستوى احترافيا حقيقيا.'),
    card('Des chiffres', 'الأرقام', 'Temps du pipeline, temps de déploiement, temps de retour en arrière.', 'زمن المسار وزمن النشر وزمن التراجع.'),
    card('CKA', 'CKA', 'Examen pratique en ligne de 2 heures, en ligne de commande. La partie dépannage compte pour 30 %.', 'امتحان عملي عبر الإنترنت لمدة ساعتين بسطر الأوامر، ويمثل قسم الإصلاح 30%.'),
  ] })

const interview = page('rules', 'interview', ['Entretien', 'المقابلة'], ['Questions d’entretien', 'أسئلة المقابلة'],
  ['Essayez de répondre à voix haute, puis cliquez pour voir les points importants.', 'حاول الإجابة بصوت عال، ثم انقر لرؤية النقاط المهمة.'],
  ['Google SRE Book', 'كتاب Google SRE', 'https://sre.google/sre-book/table-of-contents/'], { reveal: true, items: [
    card('Le site est lent. Que faites-vous ?', 'الموقع بطيء. ماذا تفعل؟', 'Depuis quand ? Un changement récent ? Regardez latence, trafic, erreurs et saturation, puis suivez une requête lente.', 'منذ متى؟ هل حدث تغيير حديث؟ انظر إلى التأخر والحركة والأخطاء والتشبع، ثم تتبع طلبا بطيئا.'),
    card('Comment déployer sans panne ?', 'كيف تنشر دون عطل؟', 'Sondes de disponibilité, canary ou rolling, migrations compatibles, rollback testé.', 'مسابير الجاهزية و `canary` أو `rolling` وترحيل متوافق وتراجع مختبر.'),
    card('Un secret a fuité. Que faites-vous ?', 'تسرب سر. ماذا تفعل؟', 'Changer le secret d’abord, vérifier s’il a été utilisé, puis empêcher que cela recommence.', 'غير السر أولا، وتحقق هل تم استعماله، ثم امنع تكرار ذلك.'),
    card('Pod en CrashLoopBackOff ?', '`Pod` في `CrashLoopBackOff`؟', 'kubectl describe, kubectl logs --previous, code de sortie, puis mémoire et configuration.', '`kubectl describe` و `kubectl logs --previous` ورمز الخروج ثم الذاكرة والإعدادات.'),
    card('Terraform veut détruire la base ?', 'Terraform يريد تدمير القاعدة؟', 'Ne pas appliquer. Lire le plan, trouver la raison, utiliser moved si c’est un renommage.', 'لا تطبق. اقرأ الخطة وابحث عن السبب، واستعمل `moved` إذا كان تغيير اسم.'),
  ] })

const finalQuiz = quiz('final-quiz', ['DORA : capacités', 'DORA: القدرات', 'https://dora.dev/capabilities/'], [
  yes('Un projet prouvé vaut mieux qu’une liste d’outils.', 'مشروع مثبت أفضل من قائمة أدوات.', 'On voit ce que vous savez vraiment faire.', 'يظهر ما تستطيع فعله حقا.'),
  no('Un certificat suffit pour savoir réparer une panne.', 'تكفي الشهادة لمعرفة إصلاح عطل.', 'Il faut aussi de la pratique sur de vrais systèmes.', 'يلزم أيضا تدريب على أنظمة حقيقية.'),
  yes('Expliquer une erreur que vous avez faite peut être un point fort.', 'شرح خطأ ارتكبته قد يكون نقطة قوة.', 'Cela montre ce que vous avez appris.', 'يظهر ذلك ما تعلمته.'),
])

export const projectModule = module('project', ['Projet complet', 'مشروع كامل'], ['Déployer et exploiter Sila', 'نشر Sila وتشغيله'], [project, doneCheck])
export const careerModule = module('career', ['Portfolio et entretiens', 'ملف الأعمال والمقابلات'], ['Prouver, certifier, répondre', 'الإثبات والشهادة والإجابة'], [portfolio, interview, finalQuiz])
