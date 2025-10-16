import { Button } from "@/components/ui/button";
import { 
  Mic, 
  BookOpen, 
  Globe, 
  Users, 
  Star, 
  ArrowRight,
  CheckCircle,
  Brain,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Languages
} from "lucide-react";
import { useEffect, useMemo } from "react";
import TelegramChatButton from "@/components/TelegramChatButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

type Language = 'en' | 'ar' | 'am';

const translations = {
  en: {
    // Hero Section
    heroTitle: "Master Amharic with AI",
    heroSubtitle: "AI-Powered Language Learning Platform",
    heroDescription: "Designed for English, Arabic & Chinese speakers",
    startFreeTrial: "Start Free Trial",
    signIn: "Sign In",
    freeLessons: "First 5 lessons absolutely free",
    
    // Stats
    activeLearners: "Active Learners",
    userRating: "User Rating",
    languages: "Languages",
    
    // Features Section
    whyChoose: "Why Choose AmharicAI?",
    whyChooseDesc: "Experience the most advanced Amharic learning platform powered by artificial intelligence",
    
    // Feature Cards
    aiTutoringTitle: "AI-Powered Tutoring",
    aiTutoringDesc: "Get personalized feedback and guidance from our advanced AI tutor, available 24/7 to help you learn.",
    
    pronunciationTitle: "Pronunciation Practice",
    pronunciationDesc: "Perfect your Amharic pronunciation with real-time voice recognition and instant feedback.",
    
    multilingualTitle: "Multilingual Support",
    multilingualDesc: "Learn in your native language with full support for English, Arabic, and Chinese speakers.",
    
    lessonsTitle: "Structured Lessons",
    lessonsDesc: "Follow a comprehensive curriculum from alphabet basics to advanced conversation skills.",
    
    progressTitle: "Track Your Progress",
    progressDesc: "Monitor your learning journey with detailed analytics and achievement tracking.",
    
    conversationTitle: "Interactive Conversations",
    conversationDesc: "Practice real conversations with our AI tutor and build confidence in speaking.",
    
    // How It Works
    howItWorksTitle: "Start Learning in 3 Simple Steps",
    howItWorksDesc: "Begin your Amharic learning journey today",
    
    step1Title: "Create Your Account",
    step1Desc: "Sign up for free and get instant access to your first 5 lessons",
    
    step2Title: "Choose Your Language",
    step2Desc: "Select your native language (English, Arabic, or Chinese) for personalized lessons",
    
    step3Title: "Start Learning",
    step3Desc: "Begin your journey with interactive lessons and AI-powered guidance",
    
    // CTA Section
    ctaTitle: "Ready to Master Amharic?",
    ctaDesc: "Join thousands of learners who are already speaking Amharic confidently",
    getStartedFree: "Get Started Free",
    ctaNote: "No credit card required • 5 free lessons • Cancel anytime",
    
    // Footer
    copyright: "© 2025 AmharicAI. All rights reserved.",
  },
  ar: {
    // Hero Section
    heroTitle: "تعلم الأمهرية مع الذكاء الاصطناعي",
    heroSubtitle: "منصة تعليم اللغة بالذكاء الاصطناعي",
    heroDescription: "مصممة للمتحدثين بالإنجليزية والعربية والصينية",
    startFreeTrial: "ابدأ التجربة المجانية",
    signIn: "تسجيل الدخول",
    freeLessons: "أول 5 دروس مجانية تماماً",
    
    // Stats
    activeLearners: "متعلم نشط",
    userRating: "تقييم المستخدمين",
    languages: "لغات",
    
    // Features Section
    whyChoose: "لماذا تختار AmharicAI؟",
    whyChooseDesc: "استمتع بأحدث منصة لتعليم اللغة الأمهرية مدعومة بالذكاء الاصطناعي",
    
    // Feature Cards
    aiTutoringTitle: "تدريس بالذكاء الاصطناعي",
    aiTutoringDesc: "احصل على ملاحظات وإرشادات شخصية من معلم الذكاء الاصطناعي المتقدم، المتاح على مدار الساعة لمساعدتك في التعلم.",
    
    pronunciationTitle: "ممارسة النطق",
    pronunciationDesc: "أتقن نطقك للأمهرية مع التعرف الصوتي الفوري والملاحظات الفورية.",
    
    multilingualTitle: "دعم متعدد اللغات",
    multilingualDesc: "تعلم بلغتك الأم مع الدعم الكامل للمتحدثين بالإنجليزية والعربية والصينية.",
    
    lessonsTitle: "دروس منظمة",
    lessonsDesc: "اتبع منهجاً شاملاً من أساسيات الأبجدية إلى مهارات المحادثة المتقدمة.",
    
    progressTitle: "تتبع تقدمك",
    progressDesc: "راقب رحلة تعلمك بتحليلات مفصلة وتتبع الإنجازات.",
    
    conversationTitle: "محادثات تفاعلية",
    conversationDesc: "تدرب على المحادثات الحقيقية مع معلم الذكاء الاصطناعي لدينا وابنِ الثقة في التحدث.",
    
    // How It Works
    howItWorksTitle: "ابدأ التعلم في 3 خطوات بسيطة",
    howItWorksDesc: "ابدأ رحلة تعلم اللغة الأمهرية اليوم",
    
    step1Title: "إنشاء حسابك",
    step1Desc: "سجل مجاناً واحصل على وصول فوري لأول 5 دروس",
    
    step2Title: "اختر لغتك",
    step2Desc: "اختر لغتك الأم (الإنجليزية أو العربية أو الصينية) للحصول على دروس مخصصة",
    
    step3Title: "ابدأ التعلم",
    step3Desc: "ابدأ رحلتك مع دروس تفاعلية وإرشادات مدعومة بالذكاء الاصطناعي",
    
    // CTA Section
    ctaTitle: "هل أنت مستعد لإتقان الأمهرية؟",
    ctaDesc: "انضم إلى آلاف المتعلمين الذين يتحدثون الأمهرية بثقة بالفعل",
    getStartedFree: "ابدأ مجاناً",
    ctaNote: "لا حاجة لبطاقة ائتمان • 5 دروس مجانية • إلغاء في أي وقت",
    
    // Footer
    copyright: "© 2025 AmharicAI. جميع الحقوق محفوظة.",
  },
  am: {
    // Hero Section
    heroTitle: "አማርኛን በ AI ያስተምሩ",
    heroSubtitle: "በ AI የሚሰራ የቋንቋ ትምህርት መድረክ",
    heroDescription: "ለእንግሊዝኛ፣ ዓረብኛ እና ቻይንኛ ተናጋሪዎች የተዘጋጀ",
    startFreeTrial: "ነጻ ሙከራ ይጀምሩ",
    signIn: "ይግቡ",
    freeLessons: "የመጀመሪያዎቹ 5 ትምህርቶች በሙሉ ነጻ",
    
    // Stats
    activeLearners: "ንቁ ተማሪዎች",
    userRating: "የተጠቃሚ ደረጃ",
    languages: "ቋንቋዎች",
    
    // Features Section
    whyChoose: "ለምን AmharicAI ይምረጡ?",
    whyChooseDesc: "በሰው ሰራሽ ብልህነት የተደገፈውን ትምህርት የላቀ የአማርኛ መድረክን ይለማመዱ",
    
    // Feature Cards
    aiTutoringTitle: "በ AI የሚደገፍ ማስተማር",
    aiTutoringDesc: "ከላቀ AI አስተማሪ ግላዊ አስተያየት እና መመሪያ ያግኙ፣ እርስዎ እንዲማሩ ለማገዝ 24/7 ይገኛል።",
    
    pronunciationTitle: "የአጠባበቅ ልምምድ",
    pronunciationDesc: "በእውነተኛ ጊዜ የድምጽ ማወቂያ እና ፈጣን አስተያየት አማርኛ አጠባበቅዎን ያሻሽሉ።",
    
    multilingualTitle: "ባለብዙ ቋንቋ ድጋፍ",
    multilingualDesc: "በእናት ቋንቋዎ ይማሩ ለእንግሊዝኛ፣ ዓረብኛ እና ቻይንኛ ተናጋሪዎች ሙሉ ድጋፍ።",
    
    lessonsTitle: "የተደራጁ ትምህርቶች",
    lessonsDesc: "ከፊደል መሠረታዊ ጀምሮ እስከ ላቀ የውይይት ክህሎት አጠቃላይ ትምህርትን ይከተሉ።",
    
    progressTitle: "እድገትዎን ይከታተሉ",
    progressDesc: "በዝርዝር ትንታኔ እና የእድገት ክትትል የመማር ጉዞዎን ይቆጣጠሩ።",
    
    conversationTitle: "መስተጋብራዊ ውይይቶች",
    conversationDesc: "ከእኛ AI አስተማሪ ጋር እውነተኛ ውይይቶችን ይለማመዱ እና በንግግር ውስጥ በራስ መተማመንን ይገንቡ።",
    
    // How It Works
    howItWorksTitle: "በ3 ቀላል ደረጃዎች ማውጣት ይጀምሩ",
    howItWorksDesc: "የአማርኛ ትምህርት ጉዞዎን ዛሬ ይጀምሩ",
    
    step1Title: "መለያዎን ይፍጠሩ",
    step1Desc: "በነጻ ይመዝገቡ እና ወደ የመጀመሪያዎቹ 5 ትምህርቶች ፈጣን መድረሻ ያግኙ",
    
    step2Title: "ቋንቋዎን ይምረጡ",
    step2Desc: "ለግላዊ ትምህርቶች የእናት ቋንቋዎን (እንግሊዝኛ፣ ዓረብኛ ወይም ቻይንኛ) ይምረጡ",
    
    step3Title: "መማር ይጀምሩ",
    step3Desc: "ጉዞዎን በመስተጋብር ትምህርቶች እና በ AI የሚመራ መመሪያ ይጀምሩ",
    
    // CTA Section
    ctaTitle: "አማርኛን ለማስተማር ዝግጁ ነዎት?",
    ctaDesc: "አስቀድሞ አማርኛ በበራሰ መተማመን እየተናገሩ ካሉ ከሺዎች ተማሪዎች ጋር ይቀላቀሉ",
    getStartedFree: "በነጻ ይጀምሩ",
    ctaNote: "የክሬዲት ካርድ አያስፈልግም • 5 ነጻ ትምህርቶች • በማንኛውም ጊዜ ይሰርዙ",
    
    // Footer
    copyright: "© 2025 AmharicAI. ሁሉም መብቶች የተጠበቁ ናቸው።",
  }
};

export default function Landing() {
  const { currentLanguage } = useLanguage();
  
  // Map context language to landing page language
  const language: Language = useMemo(() => {
    if (currentLanguage === 'arabic') return 'ar';
    if (currentLanguage === 'amharic') return 'am';
    return 'en'; // Default to English
  }, [currentLanguage]);
  
  const t = translations[language];

  useEffect(() => {
    // Set document title and meta description for SEO
    document.title = "Learn Amharic - AI-Powered Language Learning | AmharicAI";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn Amharic with AI-powered lessons designed for English, Arabic, and Chinese speakers. Start your free trial with 5 lessons and join 10,000+ learners mastering Ethiopian language.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn Amharic with AI-powered lessons designed for English, Arabic, and Chinese speakers. Start your free trial with 5 lessons and join 10,000+ learners mastering Ethiopian language.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Switcher - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden min-h-[600px] sm:min-h-[700px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pattern-bg" />
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-8" data-testid="logo-container">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/30 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                  <span className="amharic-text text-4xl sm:text-5xl text-white font-bold drop-shadow-lg">አ</span>
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg" data-testid="title-main">
              {t.heroTitle}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-4 max-w-3xl mx-auto drop-shadow-md font-medium">
              {t.heroSubtitle}
            </p>
            
            <p className="text-base sm:text-lg text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
              {t.heroDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg group"
                data-testid="button-get-started"
              >
                <span>{t.startFreeTrial}</span>
                <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5 group-hover:translate-x-1 transition-transform`} />
              </Button>
              
              <Button
                onClick={handleGetStarted}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/20 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/30 font-medium px-8 py-6 rounded-xl transition-all duration-300 text-lg shadow-lg"
                data-testid="button-sign-in"
              >
                {t.signIn}
              </Button>
            </div>

            {/* Free Trial Badge */}
            <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/40 shadow-lg">
              <CheckCircle className="h-5 w-5 text-green-200" />
              <span className="font-semibold">{t.freeLessons}</span>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center" data-testid="stat-learners">
                <Users className="h-8 w-8 mb-3 mx-auto text-white drop-shadow-md" />
                <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">10,000+</p>
                <p className="text-sm text-white/90 mt-1 font-medium">{t.activeLearners}</p>
              </div>
              <div className="text-center" data-testid="stat-rating">
                <Star className="h-8 w-8 mb-3 mx-auto text-yellow-300 fill-yellow-300 drop-shadow-md" />
                <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">4.9/5</p>
                <p className="text-sm text-white/90 mt-1 font-medium">{t.userRating}</p>
              </div>
              <div className="text-center" data-testid="stat-languages">
                <Globe className="h-8 w-8 mb-3 mx-auto text-white drop-shadow-md" />
                <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">3</p>
                <p className="text-sm text-white/90 mt-1 font-medium">{t.languages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-white dark:text-gray-950"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t.whyChoose}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.whyChooseDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-8 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl" data-testid="feature-ai-tutor">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.aiTutoringTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.aiTutoringDesc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary/10 dark:to-secondary/20 p-8 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl" data-testid="feature-pronunciation">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <Mic className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.pronunciationTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.pronunciationDesc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 dark:from-green-500/10 dark:to-green-500/20 p-8 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-xl" data-testid="feature-multilingual">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.multilingualTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.multilingualDesc}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 dark:from-purple-500/10 dark:to-purple-500/20 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl" data-testid="feature-lessons">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.lessonsTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.lessonsDesc}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 dark:from-orange-500/10 dark:to-orange-500/20 p-8 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-xl" data-testid="feature-progress">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.progressTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.progressDesc}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-500/20 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl" data-testid="feature-conversation">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.conversationTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.conversationDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t.howItWorksTitle}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t.howItWorksDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center" data-testid="step-sign-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.step1Title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.step1Desc}
              </p>
            </div>

            <div className="text-center" data-testid="step-choose-language">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.step2Title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.step2Desc}
              </p>
            </div>

            <div className="text-center" data-testid="step-start-learning">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t.step3Title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pattern-bg" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t.ctaDesc}
          </p>
          
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 font-semibold px-10 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg group"
            data-testid="button-cta-bottom"
          >
            <span>{t.getStartedFree}</span>
            <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5 group-hover:translate-x-1 transition-transform`} />
          </Button>
          
          <p className="text-white/75 mt-6">
            {t.ctaNote}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t.copyright}
          </p>
        </div>
      </footer>

      {/* Telegram Chat Button */}
      <TelegramChatButton />
    </div>
  );
}
