import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const UI = {
  home: { fr: 'Accueil', ar: 'الرئيسية' },
  chooseTech: { fr: 'Choisissez une technologie', ar: 'اختر تقنية' },
  tagline: { fr: 'Apprenez en voyant les liens : d’où vient chaque valeur, et où elle va.', ar: 'تعلّم برؤية الروابط: من أين تأتي كل قيمة وإلى أين تذهب.' },
  start: { fr: 'Commencer', ar: 'ابدأ' },
  soon: { fr: 'Bientôt', ar: 'قريبا' },
  slidesCount: { fr: '{x} diapositives', ar: '{x} شرائح' },
  prev: { fr: '← Précédent', ar: '→ السابق' },
  next: { fr: 'Suivant →', ar: 'التالي ←' },
  docs: { fr: 'Documentation officielle : {x}', ar: 'التوثيق الرسمي: {x}' },
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
const LATIN_TERM = /(\$?[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)*|\$|=)/g

// Affiche un texte traduit. En arabe, chaque terme latin est isolé pour garder
// le bon ordre de lecture, y compris la ponctuation qui le suit.
export function T({ v, x }) {
  const { lang } = useLang()
  const t = useT()
  const text = t(v).replace('{x}', x ?? '')
  if (lang !== 'ar') return text
  return text.split(LATIN_TERM).map((part, i) =>
    i % 2 === 1 ? <bdi key={i} dir="ltr" className="term">{part}</bdi> : part,
  )
}
