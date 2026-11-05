const DOC = 'https://www.php.net/manual/fr/'

export const phpCourse = {
  name: 'PHP',
  slides: [
    {
      id: 'variable', type: 'variable',
      nav: { fr: 'Variable', ar: 'المتغير' },
      title: { fr: 'Comment écrire une variable', ar: 'كيف تكتب متغيرا' },
      lead: {
        fr: 'Une variable est un nom qui contient une valeur. Cliquez sur chaque partie du code, puis changez le nom et la valeur.',
        ar: 'المتغير اسم يحمل قيمة. انقر على كل جزء من الكود، ثم غيّر الاسم والقيمة.',
      },
      source: { label: { fr: 'Les bases des variables', ar: 'أساسيات المتغيرات' }, url: DOC + 'language.variables.basics.php' },
      parts: {
        dollar: {
          label: { fr: 'Le signe $', ar: 'الرمز $' },
          text: { fr: 'En PHP, chaque variable commence par $.', ar: 'في PHP يبدأ كل متغير بالرمز $.' },
        },
        name: {
          label: { fr: 'Le nom', ar: 'الاسم' },
          text: {
            fr: 'Il commence par une lettre ou _. Ensuite, il peut contenir des lettres, des chiffres et _, mais pas d’espace.',
            ar: 'يبدأ بحرف أو بالرمز _. بعد ذلك يمكن أن يحتوي على حروف وأرقام والرمز _، لكن بدون فراغ.',
          },
        },
        equal: {
          label: { fr: 'Le signe =', ar: 'الرمز =' },
          text: { fr: 'C’est l’affectation : la valeur de droite est placée dans la variable de gauche.', ar: 'هذا هو الإسناد: توضع القيمة التي على اليمين في المتغير الذي على اليسار.' },
        },
        value: {
          label: { fr: 'La valeur', ar: 'القيمة' },
          text: { fr: 'Un texte s’écrit entre guillemets. Un nombre s’écrit sans guillemets.', ar: 'يكتب النص بين علامتي تنصيص، ويكتب العدد بدونهما.' },
        },
        end: {
          label: { fr: 'Le point-virgule', ar: 'الفاصلة المنقوطة' },
          text: { fr: 'Chaque instruction PHP se termine par un point-virgule.', ar: 'تنتهي كل تعليمة في PHP بفاصلة منقوطة.' },
        },
      },
    },
    {
      id: 'rules', type: 'rules',
      nav: { fr: 'Exercice', ar: 'تمرين' },
      title: { fr: 'Quel nom est correct ?', ar: 'أي اسم صحيح؟' },
      lead: { fr: 'Cliquez sur chaque proposition pour voir si PHP l’accepte.', ar: 'انقر على كل اقتراح لترى هل يقبله PHP.' },
      source: { label: { fr: 'Les bases des variables', ar: 'أساسيات المتغيرات' }, url: DOC + 'language.variables.basics.php' },
      items: [
        { code: '$user_1', ok: true, why: { fr: 'Il commence par une lettre. Les chiffres et _ sont permis ensuite.', ar: 'يبدأ بحرف، والأرقام والرمز _ مسموح بها بعده.' } },
        { code: '$1user', ok: false, why: { fr: 'Un nom ne peut pas commencer par un chiffre.', ar: 'لا يمكن أن يبدأ الاسم برقم.' } },
        { code: '$_age', ok: true, why: { fr: 'Un nom peut commencer par _.', ar: 'يمكن أن يبدأ الاسم بالرمز _.' } },
        { code: '$full name', ok: false, why: { fr: 'L’espace est interdit. Écrivez $full_name.', ar: 'الفراغ غير مسموح. اكتب $full_name.' } },
        { code: 'age', ok: false, why: { fr: 'Il manque le signe $ : ce n’est pas une variable.', ar: 'ينقصه الرمز $، فهو ليس متغيرا.' } },
        { code: '$Age', ok: true, why: { fr: 'Attention : $Age et $age sont deux variables différentes, car PHP distingue les majuscules des minuscules.', ar: 'انتبه: $Age و $age متغيران مختلفان، لأن لغة PHP تميز بين الحروف الكبيرة والصغيرة.' } },
      ],
    },
    {
      id: 'calc', type: 'calc',
      nav: { fr: 'Calculs', ar: 'الحساب' },
      title: { fr: 'Les calculs', ar: 'العمليات الحسابية' },
      lead: { fr: 'Choisissez une opération et déplacez les curseurs. Les lignes montrent d’où vient chaque valeur.', ar: 'اختر عملية وحرّك المؤشرين. تبيّن الخطوط مصدر كل قيمة.' },
      source: { label: { fr: 'Opérateurs arithmétiques', ar: 'العوامل الحسابية' }, url: DOC + 'language.operators.arithmetic.php' },
      ops: [
        { op: '+', name: { fr: 'Addition', ar: 'الجمع' } },
        { op: '-', name: { fr: 'Soustraction', ar: 'الطرح' } },
        { op: '*', name: { fr: 'Multiplication', ar: 'الضرب' } },
        { op: '/', name: { fr: 'Division', ar: 'القسمة' } },
        { op: '%', name: { fr: 'Reste', ar: 'باقي القسمة' } },
        { op: '**', name: { fr: 'Puissance', ar: 'الأس' } },
      ],
    },
    {
      id: 'config', type: 'config',
      nav: { fr: 'Config', ar: 'الإعدادات' },
      title: { fr: 'Config : écrire une seule fois', ar: 'الإعدادات: اكتبها مرة واحدة' },
      lead: {
        fr: 'Cliquez sur un fichier ou une valeur pour voir où elle est utilisée. Changez une valeur dans config.php : tous les fichiers suivent.',
        ar: 'انقر على ملف أو قيمة لترى أين تستعمل. غيّر قيمة في config.php وستتغير في كل الملفات.',
      },
      source: { label: { fr: 'include (valeur de retour)', ar: 'القيمة التي ترجعها include' }, url: DOC + 'function.include.php' },
    },
  ],
}
