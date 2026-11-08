import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const UI = {
  home: { fr: 'Accueil', ar: 'الرئيسية' },
  chooseTech: { fr: 'Choisissez une technologie', ar: 'اختر تقنية' },
  tagline: { fr: 'Apprenez en voyant les liens : d’où vient chaque valeur, et où elle va.', ar: 'تعلّم برؤية الروابط: من أين تأتي كل قيمة وإلى أين تذهب.' },
  start: { fr: 'Commencer', ar: 'ابدأ' },
  soon: { fr: 'Bientôt', ar: 'قريبا' },
  slidesCount: { fr: '{x} diapositives', ar: '{x} شرائح' },
  modulesCount: { fr: '{x} modules', ar: '{x} وحدات' },
  modules: { fr: 'Modules', ar: 'الوحدات' },
  clickToOpen: { fr: 'Cliquez pour découvrir', ar: 'انقر للاكتشاف' },
  nextStep: { fr: 'Étape suivante →', ar: 'المرحلة التالية ←' },
  restart: { fr: 'Recommencer ↺', ar: 'إعادة ↺' },
  player: { fr: 'Exécution du code', ar: 'تنفيذ الكود' },
  run: { fr: 'Lancer ▶', ar: 'تشغيل ▶' },
  pause: { fr: 'Pause ⏸', ar: 'إيقاف مؤقت ⏸' },
  stepOnce: { fr: 'Pas à pas ⏭', ar: 'خطوة ⏭' },
  reset: { fr: 'Recommencer ↺', ar: 'إعادة ↺' },
  emptyPage: { fr: '(page vide pour l’instant)', ar: '(الصفحة فارغة حاليا)' },
  serverWork: { fr: 'Traitement sur le serveur', ar: 'المعالجة على الخادم' },
  pressRun: { fr: 'Appuyez sur « Lancer » pour exécuter le code ligne par ligne.', ar: 'اضغط على «تشغيل» لتنفيذ الكود سطرا بسطر.' },
  memory: { fr: 'Mémoire', ar: 'الذاكرة' },
  finish: { fr: 'Terminer ✓', ar: 'إنهاء ✓' },
  nothingSent: { fr: '(rien n’est envoyé)', ar: '(لا يرسل شيء)' },
  prev: { fr: '← Précédent', ar: '→ السابق' },
  next: { fr: 'Suivant →', ar: 'التالي ←' },
  docs: { fr: 'Source : {x}', ar: 'المصدر: {x}' },
  batchSize: { fr: 'Changements par livraison', ar: 'التغييرات في كل تسليم' },
  defectRate: { fr: 'Probabilité de défaut par changement', ar: 'احتمال العيب لكل تغيير' },
  shipBatch: { fr: 'Livrer ce lot', ar: 'تسليم هذه الدفعة' },
  shipFailed: { fr: 'Échec : défauts cachés {x}', ar: 'فشل: عيوب مخفية {x}' },
  shipOk: { fr: 'Livraison réussie, cette fois.', ar: 'نجح التسليم هذه المرة.' },
  deploysPerMonth: { fr: 'Livraisons par mois', ar: 'عمليات التسليم في الشهر' },
  failedPerMonth: { fr: 'Livraisons en échec par mois (attendu)', ar: 'عمليات التسليم الفاشلة في الشهر (متوقع)' },
  suspects: { fr: 'Suspects par échec', ar: 'المشتبه بهم لكل فشل' },
  bisectSteps: { fr: 'Essais de git bisect', ar: 'محاولات git bisect' },
  runnerLogs: { fr: 'Journal du pipeline', ar: 'سجل مسار التسليم' },
  st_idle: { fr: 'en attente', ar: 'في الانتظار' },
  st_running: { fr: 'en cours', ar: 'قيد التنفيذ' },
  st_passed: { fr: 'réussi', ar: 'نجح' },
  st_failed: { fr: 'échec', ar: 'فشل' },
  st_skipped: { fr: 'ignoré', ar: 'تم تجاهله' },
  loadBalancer: { fr: 'Répartiteur de charge', ar: 'موزع الحمل' },
  trafficNew: { fr: 'Trafic vers v42', ar: 'الحركة نحو v42' },
  globalError: { fr: 'Erreur globale (`f × e`)', ar: 'الخطأ الإجمالي (`f × e`)' },
  failedRequests: { fr: 'Requêtes échouées', ar: 'الطلبات الفاشلة' },
  instances: { fr: 'Instances actives', ar: 'النسخ النشطة' },
  rolloutLog: { fr: 'Journal du déploiement', ar: 'سجل النشر' },
  versionBug: { fr: 'v42 a un défaut', ar: 'v42 فيها عيب' },
  versionOk: { fr: 'v42 est saine', ar: 'v42 سليمة' },
  deployLog: { fr: 'Déploiements et délai commit → production', ar: 'عمليات النشر والمدة من الإيداع إلى الإنتاج' },
  chipFailed: { fr: 'Échec', ar: 'فشل' },
  chipHotfix: { fr: 'Non planifié', ar: 'غير مخطط' },
  mLead: { fr: 'Délai de livraison (médiane)', ar: 'مدة التسليم (الوسيط)' },
  mFreq: { fr: 'Fréquence de déploiement', ar: 'تكرار النشر' },
  mRecovery: { fr: 'Temps de rétablissement (médiane)', ar: 'مدة الاستعادة (الوسيط)' },
  mCfr: { fr: 'Taux d’échec des changements', ar: 'نسبة فشل التغييرات' },
  mRework: { fr: 'Taux de reprise', ar: 'نسبة إعادة العمل' },
  onCall: { fr: 'Alerte d’astreinte', ar: 'تنبيه المناوبة' },
  chooseCommand: { fr: 'Choisissez votre première commande.', ar: 'اختر أمرك الأول.' },
  goodMove: { fr: 'Bonne décision', ar: 'قرار جيد' },
  badMove: { fr: 'Temps perdu', ar: 'وقت ضائع' },
  postmortem: { fr: 'Post-mortem', ar: 'تحليل الحادث' },
  incidentTime: { fr: 'Incident résolu en {x}.', ar: 'حل الحادث في {x}.' },
  incidentBest: { fr: 'Le chemin le plus direct prend {x}.', ar: 'أقصر طريق يستغرق {x}.' },
  slidesLabel: { fr: 'Diapositives', ar: 'الشرائح' },
  languageLabel: { fr: 'Langue', ar: 'اللغة' },
  varName: { fr: 'Nom de la variable', ar: 'اسم المتغير' },
  value: { fr: 'Valeur', ar: 'القيمة' },
  nameOk: { fr: 'PHP accepte ce nom', ar: 'PHP يقبل هذا الاسم' },
  nameBad: { fr: 'Nom invalide : il doit commencer par une lettre ou _, sans espace ni symbole', ar: 'اسم غير صحيح: يجب أن يبدأ بحرف أو _ بدون فراغ أو رموز' },
  isNumber: { fr: 'Nombre : sans guillemets', ar: 'عدد: بدون علامات تنصيص' },
  isText: { fr: 'Texte : entre guillemets', ar: 'نص: بين علامتي تنصيص' },
  correct: { fr: 'Correct', ar: 'صحيح' },
  wrong: { fr: 'Incorrect', ar: 'خطأ' },
  clickToCheck: { fr: 'Cliquez pour vérifier', ar: 'انقر للتحقق' },
  result: { fr: 'Résultat', ar: 'النتيجة' },
  keyUsedIn: { fr: '{x} est utilisée dans :', ar: 'أين تستعمل {x}:' },
  fileLinks: { fr: '{x} : liens', ar: 'روابط {x}' },
  requireText: { fr: 'require charge le tableau renvoyé par config.php et le place dans $config.', ar: 'تجلب التعليمة require الجدول الذي يرجعه الملف config.php، ثم تضعه في $config.' },
  usesValue: { fr: 'Utilise {x}, valeur actuelle :', ar: 'يستعمل المفتاح {x}، وقيمته الحالية:' },
}

const LangContext = createContext(null)

function savedLang() {
  try {
    const v = localStorage.getItem('lang')
    return v === 'ar' || v === 'fr' ? v : 'fr'
  } catch {
    return 'fr'
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(savedLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // La langue reste valable pour cette visite.
    }
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

// t('next') lit UI ; t({ fr, ar }) lit un texte du cours.
export function useT() {
  const { lang } = useLang()
  return useCallback((x) => (typeof x === 'string' ? UI[x][lang] : x[lang]), [lang])
}

// Termes latins et symboles de code à isoler dans une phrase arabe.
const LATIN_TERM = /(<\?php|<\?=|\?>|\/\*|\*\/|\/\/|\$?[A-Za-z_][A-Za-z0-9_-]*(?:\.[A-Za-z0-9_]+)*|\$|=|;|#)/g

const term = (key, part) => <bdi key={key} dir="ltr" className="term">{part}</bdi>

// Affiche un texte traduit.
// - `code` entre accents graves devient un seul bloc de code, dans les deux langues.
// - En arabe, chaque autre terme latin est isolé pour garder le bon ordre de lecture.
export function T({ v, x }) {
  const { lang } = useLang()
  const t = useT()
  const text = t(v).replace('{x}', x ?? '')
  return text.split(/`([^`]+)`/).flatMap((chunk, i) => {
    if (i % 2 === 1) return [term('c' + i, chunk)]
    if (lang !== 'ar') return [chunk]
    return chunk.split(LATIN_TERM).map((part, j) => (j % 2 === 1 ? term(i + '-' + j, part) : part))
  })
}
