import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = 'en' | 'ar';

interface TelegramChatButtonProps {
  language?: Language;
}

const translations = {
  en: {
    needHelp: "Need Help?",
    welcome: "👋 Welcome! We're here to help you with any questions or feedback about your Amharic learning journey.",
    clickBelow: "Click below to start chatting with us on Telegram:",
    chatButton: "Chat on Telegram",
  },
  ar: {
    needHelp: "هل تحتاج مساعدة؟",
    welcome: "👋 مرحباً! نحن هنا لمساعدتك في أي أسئلة أو ملاحظات حول رحلتك في تعلم الأمهرية.",
    clickBelow: "انقر أدناه لبدء الدردشة معنا على تيليجرام:",
    chatButton: "الدردشة على تيليجرام",
  }
};

export default function TelegramChatButton({ language: propLanguage }: TelegramChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const telegramUsername = "Kerlangu";
  const telegramLink = `https://t.me/${telegramUsername}`;

  useEffect(() => {
    // If language prop is provided, use it
    if (propLanguage) {
      setLanguage(propLanguage);
    } else {
      // Otherwise, try to get from localStorage (from landing page selection)
      const savedLanguage = localStorage.getItem('landing-language') as Language;
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        setLanguage(savedLanguage);
      }
    }
  }, [propLanguage]);

  const handleOpenTelegram = () => {
    window.open(telegramLink, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <>
      {/* Welcome Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t.needHelp}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{telegramUsername}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                data-testid="button-close-telegram-dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {t.welcome}
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {t.clickBelow}
            </p>
            
            <Button
              onClick={handleOpenTelegram}
              className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white"
              data-testid="button-open-telegram"
            >
              <MessageCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.chatButton}
            </Button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
        data-testid="button-telegram-chat"
        aria-label="Open Telegram chat for help"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </>
        )}
      </button>
    </>
  );
}
