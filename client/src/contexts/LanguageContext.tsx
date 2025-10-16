import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Language = 'english' | 'arabic' | 'amharic';

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations: Record<Language, Translation> = {
  english: {
    common: {
      welcome: "Welcome",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
    },
    navigation: {
      home: "Home",
      lessons: "Lessons",
      practice: "Practice",
      tutor: "AI Tutor",
      progress: "Progress",
      subscription: "Subscription",
      language: "Language",
      settings: "Settings",
    },
    sidebar: {
      profile: "Profile",
      lessonProgress: "Lesson Progress",
      dailyStreak: "Daily Streak",
      completedLessons: "Completed Lessons",
      totalLessons: "Total Lessons",
      days: "days",
      helpSupport: "Help & Support",
      rateUs: "Rate Us",
      contactSupport: "Contact Support",
    },
    home: {
      learningAmharic: "Learn Amharic",
      arabicSpeaker: "Arabic Speaker",
      englishSpeaker: "English Speaker",
      yourProgress: "Your Progress",
      lessons: "Lessons",
      hours: "Hours",
      accuracy: "% Accuracy",
      beginnerLevel: "Beginner Level",
      thisWeek: "This week",
      overallPerformance: "Overall performance",
      upgradeToPro: "Upgrade to Pro",
      quickPractice: "Quick Practice",
      quizChallenge: "Quiz Challenge",
      testYourKnowledge: "Test your knowledge",
      aiTutor: "AI Tutor",
      practiceConversations: "Practice conversations",
      liveTutors: "Live Tutors",
      practiceWithNatives: "Practice with natives",
    },
    quiz: {
      questionOf: "Question {current} of {total}",
      quizTime: "Quiz Time!",
      quizNotAvailable: "Quiz not available",
      backToHome: "Back to Home",
      skip: "Skip",
      nextQuestion: "Next Question",
      finishQuiz: "Finish Quiz",
      hint: "Hint",
      playAudio: "Play Audio",
      score: "{score}% Score",
      excellentWork: "Excellent work!",
      goodJob: "Good job!",
      keepPracticing: "Keep practicing!",
      continueLearning: "Continue Learning",
      retakeQuiz: "Retake Quiz",
    },
    settings: {
      title: "Settings",
      description: "Manage your account preferences",
      appearance: "Appearance",
      appearanceDescription: "Customize how the app looks",
      theme: "Theme",
      themeDescription: "Choose your preferred color scheme",
      systemDefault: "System Default",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      languageRegion: "Language & Region",
      interfaceLanguage: "Interface Language",
      interfaceDescription: "Interface language: ",
      account: "Account",
      accountDescription: "Manage your account settings",
      stayLoggedIn: "Stay Logged In",
      stayLoggedInDescription: "Keep me signed in across sessions",
      privacy: "Privacy & Security",
      privacyDescription: "Control your privacy and security",
      notifications: "Notifications",
      notificationsDescription: "Manage your notification preferences",
      studyReminders: "Study Reminders",
      studyRemindersDescription: "Get reminded to practice daily",
      progressUpdates: "Progress Updates",
      progressUpdatesDescription: "Weekly progress summaries",
    },
    languageSettings: {
      title: "Language & Region",
      description: "Choose your preferred languages",
      interfaceLanguage: "Interface Language",
      interfaceDescription: "Language for menus, buttons, and interface",
      nativeLanguage: "Native Language", 
      nativeDescription: "Your mother tongue for personalized learning",
      englishDescription: "Use English for menus, buttons, and interface elements",
      arabicDescription: "استخدم العربية لعناصر الواجهة والقوائم والأزرار",
      amharicDescription: "ለቅጽበት፣ ቁልፎች እና የማስተጋቢ ነገሮች አማርኛን ይጠቀሙ",
      englishNativeDescription: "I'm a native English speaker learning Amharic",
      arabicNativeDescription: "أنا متحدث أصلي للعربية أتعلم الأمهرية",
      learningOptimization: "Learning Optimization",
      unsavedChanges: "Unsaved Changes",
      savePreferences: "Save your language preferences",
      reset: "Reset",
      saveChanges: "Save Changes",
      saving: "Saving...",
    },
  },
  arabic: {
    common: {
      welcome: "مرحباً",
      loading: "جاري التحميل...",
      error: "خطأ",
      save: "حفظ",
      cancel: "إلغاء",
      close: "إغلاق",
      settings: "الإعدادات",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
    },
    navigation: {
      home: "الرئيسية",
      lessons: "الدروس",
      practice: "التمارين",
      tutor: "المعلم الذكي",
      progress: "التقدم",
      subscription: "الاشتراك",
      language: "اللغة",
      settings: "الإعدادات",
    },
    sidebar: {
      profile: "الملف الشخصي",
      lessonProgress: "تقدم الدرس",
      dailyStreak: "السلسلة اليومية",
      completedLessons: "الدروس المكتملة",
      totalLessons: "مجموع الدروس",
      days: "أيام",
      helpSupport: "المساعدة والدعم",
      rateUs: "قيمنا",
      contactSupport: "اتصل بالدعم",
    },
    home: {
      learningAmharic: "تعلم الأمهرية",
      arabicSpeaker: "متحدث عربي",
      englishSpeaker: "متحدث إنجليزي",
      yourProgress: "تقدمك",
      lessons: "الدروس",
      hours: "ساعات",
      accuracy: "% الدقة",
      beginnerLevel: "المستوى المبتدئ",
      thisWeek: "هذا الأسبوع",
      overallPerformance: "الأداء العام",
      upgradeToPro: "الترقية إلى النسخة الاحترافية",
      quickPractice: "تمرين سريع",
      quizChallenge: "تحدي الاختبار",
      testYourKnowledge: "اختبر معرفتك",
      aiTutor: "المعلم الذكي",
      practiceConversations: "تمرن على المحادثات",
      liveTutors: "معلمون مباشرون",
      practiceWithNatives: "تمرن مع الناطقين الأصليين",
    },
    quiz: {
      questionOf: "السؤال {current} من {total}",
      quizTime: "وقت الاختبار!",
      quizNotAvailable: "الاختبار غير متوفر",
      backToHome: "العودة للرئيسية",
      skip: "تخطي",
      nextQuestion: "السؤال التالي",
      finishQuiz: "إنهاء الاختبار",
      hint: "تلميح",
      playAudio: "تشغيل الصوت",
      score: "النتيجة {score}%",
      excellentWork: "عمل ممتاز!",
      goodJob: "أحسنت!",
      keepPracticing: "استمر في التمرين!",
      continueLearning: "متابعة التعلم",
      retakeQuiz: "إعادة الاختبار",
    },
    settings: {
      title: "الإعدادات",
      description: "إدارة تفضيلات حسابك",
      appearance: "المظهر",
      appearanceDescription: "تخصيص شكل التطبيق",
      theme: "السمة",
      themeDescription: "اختر نظام الألوان المفضل لديك",
      systemDefault: "افتراضي النظام",
      lightMode: "الوضع الفاتح",
      darkMode: "الوضع المظلم",
      languageRegion: "اللغة والمنطقة",
      interfaceLanguage: "لغة الواجهة",
      interfaceDescription: "لغة الواجهة: ",
      account: "الحساب",
      accountDescription: "إدارة إعدادات حسابك",
      stayLoggedIn: "البقاء مسجل الدخول",
      stayLoggedInDescription: "ابقني مسجل الدخول عبر الجلسات",
      privacy: "الخصوصية والأمان",
      privacyDescription: "تحكم في الخصوصية والأمان",
      notifications: "الإشعارات",
      notificationsDescription: "إدارة تفضيلات الإشعارات",
      studyReminders: "تذكيرات الدراسة",
      studyRemindersDescription: "تلقي تذكيرات للممارسة اليومية",
      progressUpdates: "تحديثات التقدم",
      progressUpdatesDescription: "ملخصات التقدم الأسبوعية",
    },
    languageSettings: {
      title: "اللغة والمنطقة",
      description: "اختر لغاتك المفضلة",
      interfaceLanguage: "لغة الواجهة",
      interfaceDescription: "لغة القوائم والأزرار والواجهة",
      nativeLanguage: "اللغة الأم",
      nativeDescription: "لغتك الأم للتعلم المخصص",
      englishDescription: "استخدم الإنجليزية لعناصر القوائم والأزرار والواجهة",
      arabicDescription: "استخدم العربية لعناصر الواجهة والقوائم والأزرار",
      amharicDescription: "ለቅጽበት፣ ቁልፎች እና የማስተጋቢ ነገሮች አማርኛን ይጠቀሙ",
      englishNativeDescription: "أنا متحدث أصلي للإنجليزية أتعلم الأمهرية",
      arabicNativeDescription: "أنا متحدث أصلي للعربية أتعلم الأمهرية",
      learningOptimization: "تحسين التعلم",
      unsavedChanges: "تغييرات غير محفوظة",
      savePreferences: "احفظ تفضيلات اللغة",
      reset: "إعادة تعيين",
      saveChanges: "حفظ التغييرات",
      saving: "جاري الحفظ...",
    },
  },
  amharic: {
    common: {
      welcome: "እንኳን በደህና መጡ",
      loading: "በመጫን ላይ...",
      error: "ስህተት",
      save: "አስቀምጥ",
      cancel: "ሰርዝ",
      close: "ዝጋ",
      settings: "ቅንብሮች",
      profile: "መገለጫ",
      logout: "ውጣ",
    },
    navigation: {
      home: "መኖሪያ",
      lessons: "ትምህርቶች",
      practice: "ልምምድ",
      tutor: "AI አስተማሪ",
      progress: "እድገት",
      subscription: "ምዝገባ",
      language: "ቋንቋ",
      settings: "ቅንብሮች",
    },
    sidebar: {
      profile: "መገለጫ",
      lessonProgress: "የትምህርት እድገት",
      dailyStreak: "የዕለት ተከታታይነት",
      completedLessons: "የተጠናቀቁ ትምህርቶች",
      totalLessons: "ጠቅላላ ትምህርቶች",
      days: "ቀናት",
      helpSupport: "እርዳታ እና ድጋፍ",
      rateUs: "ደረጃ ስጡን",
      contactSupport: "ድጋፍን ያነጋግሩ",
    },
    settings: {
      title: "ቅንብሮች",
      description: "የመለያ ምርጫዎችዎን ያቀናብሩ",
      appearance: "ወጣ ባህሪ",
      appearanceDescription: "የመተግበሪያውን መልክ ያበጁ",
      theme: "ጭብጥ",
      themeDescription: "የምትወደውን የቀለም እቅድ ምረጥ",
      systemDefault: "የስርዓት ነባሪ",
      lightMode: "የብርሃን ሁነታ",
      darkMode: "የጨለማ ሁነታ",
      languageRegion: "ቋንቋ እና አካባቢ",
      interfaceLanguage: "የበርሽ ቋንቋ",
      interfaceDescription: "የበርሽ ቋንቋ: ",
      account: "መለያ",
      accountDescription: "የመለያ ቅንብሮችዎን ያቀናብሩ",
      stayLoggedIn: "ገብተው ይቆዩ",
      stayLoggedInDescription: "በክፍለ ጊዜዎች ውስጥ ገብተው ያቆዩኝ",
      privacy: "ግላዊነት እና ደህንነት",
      privacyDescription: "ግላዊነት እና ደህንነትን ይቆጣጠሩ",
      notifications: "ማሳወቂያዎች",
      notificationsDescription: "የማሳወቂያ ምርጫዎችዎን ያቀናብሩ",
      studyReminders: "የጥናት ማስታወሻዎች",
      studyRemindersDescription: "በየቀኑ እንድትለማመድ ታስታወስ",
      progressUpdates: "የእድገት ዝመናዎች",
      progressUpdatesDescription: "ሳምንታዊ የእድገት ማጠቃለያዎች",
    },
    languageSettings: {
      title: "ቋንቋ እና አካባቢ",
      description: "ተመራጭ ቋንቋዎችዎን ይምረጡ",
      interfaceLanguage: "የበርሽ ቋንቋ",
      interfaceDescription: "ለሜኑዎች፣ ቁልፎች እና በርሽ ቋንቋ",
      nativeLanguage: "የእናት ቋንቋ",
      nativeDescription: "ለልዩ ትምህርት የእናት ቋንቋዎ",
      englishDescription: "ለሜኑዎች፣ ቁልፎች እና በርሽ ንጥሎች እንግሊዝኛን ተጠቀሙ",
      arabicDescription: "استخدم العربية لعناصر الواجهة والقوائم والأزرار",
      amharicDescription: "ለቅጽበት፣ ቁልፎች እና የማስተጋቢ ነገሮች አማርኛን ይጠቀሙ",
      englishNativeDescription: "እኔ የእንግሊዝኛ ቋንቋ ተናጋሪ ነኝ አማርኛ እየተማርኩ ነው",
      arabicNativeDescription: "أنا متحدث أصلي للعربية أتعلم الأمهرية",
      learningOptimization: "የትምህርት ማሻሻያ",
      unsavedChanges: "ያልተቀመጡ ለውጦች",
      savePreferences: "የቋንቋ ምርጫዎችዎን ያስቀምጡ",
      reset: "ዳግም አስጀምር",
      saveChanges: "ለውጦችን አስቀምጥ",
      saving: "በማስቀመጥ ላይ...",
    },
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('app-language') as Language;
    if (saved === 'english' || saved === 'arabic' || saved === 'amharic') {
      return saved;
    }
    return 'english';
  });

  // Update language based on user preferences (when logged in)
  useEffect(() => {
    if (user?.interfaceLanguage) {
      const userLang = user.interfaceLanguage as Language;
      setCurrentLanguage(userLang);
      localStorage.setItem('app-language', userLang);
    }
  }, [user?.interfaceLanguage]);

  // Apply RTL and language attributes to document
  useEffect(() => {
    const html = document.documentElement;
    if (currentLanguage === 'arabic') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      html.classList.add('rtl');
    } else {
      html.setAttribute('dir', 'ltr');
      html.classList.remove('rtl');
      if (currentLanguage === 'amharic') {
        html.setAttribute('lang', 'am');
      } else {
        html.setAttribute('lang', 'en');
      }
    }
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    // Try to get value from current language
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }
    
    // If found and is string, return it
    if (typeof value === 'string') {
      return value;
    }
    
    // Try fallback to English if current language doesn't have the key
    if (currentLanguage !== 'english') {
      let englishValue: any = translations.english;
      for (const k of keys) {
        if (englishValue && typeof englishValue === 'object' && k in englishValue) {
          englishValue = englishValue[k];
        } else {
          englishValue = null;
          break;
        }
      }
      
      if (typeof englishValue === 'string') {
        return englishValue;
      }
    }
    
    // Return fallback or key as last resort
    return fallback || key;
  };

  const isRTL = currentLanguage === 'arabic';

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      isRTL,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}