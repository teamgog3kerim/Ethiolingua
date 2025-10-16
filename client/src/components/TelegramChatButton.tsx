import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  english: {
    needHelp: "Need Help?",
    welcome: "👋 Welcome! We're here to help you with any questions or feedback about your Amharic learning journey.",
    clickBelow: "Click below to start chatting with us on Telegram:",
    chatButton: "Chat on Telegram",
    dragToMove: "Drag to reposition",
  },
  arabic: {
    needHelp: "هل تحتاج مساعدة؟",
    welcome: "👋 مرحباً! نحن هنا لمساعدتك في أي أسئلة أو ملاحظات حول رحلتك في تعلم الأمهرية.",
    clickBelow: "انقر أدناه لبدء الدردشة معنا على تيليجرام:",
    chatButton: "الدردشة على تيليجرام",
    dragToMove: "اسحب لإعادة الموضع",
  },
  amharic: {
    needHelp: "እርዳታ ያስፈልግዎታል?",
    welcome: "👋 እንኳን በደህና መጡ! ስለ አማርኛ የመማር ጉዞዎ ማንኛውም ጥያቄዎች ወይም አስተያየቶች እንዲያቀርቡ እዚህ ነን።",
    clickBelow: "በቴሌግራም ላይ ከእኛ ጋር ለመወያየት ከታች ይጫኑ:",
    chatButton: "በቴሌግራም ይወያዩ",
    dragToMove: "ቦታ ለመቀየር ይጎትቱ",
  }
};

const STORAGE_KEY = 'telegram-button-position';
const MIN_BOTTOM = 24;
const MAX_BOTTOM_OFFSET = 100;

export default function TelegramChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(24);
  const [showDragHint, setShowDragHint] = useState(false);
  const dragStartY = useRef(0);
  const startBottomPosition = useRef(24);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const { currentLanguage, isRTL } = useLanguage();
  const telegramUsername = "Kerlangu";
  const telegramLink = `https://t.me/${telegramUsername}`;

  useEffect(() => {
    const savedPosition = localStorage.getItem(STORAGE_KEY);
    if (savedPosition) {
      setBottomPosition(parseInt(savedPosition, 10));
    }
  }, []);

  const savePosition = (position: number) => {
    localStorage.setItem(STORAGE_KEY, position.toString());
  };

  const handleOpenTelegram = () => {
    window.open(telegramLink, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    setIsOpen(false);
    setShowDragHint(false);
    dragStartY.current = clientY;
    startBottomPosition.current = bottomPosition;
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = dragStartY.current - clientY;
    const newBottom = Math.max(
      MIN_BOTTOM,
      Math.min(
        window.innerHeight - 100,
        startBottomPosition.current + deltaY
      )
    );
    
    setBottomPosition(newBottom);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(bottomPosition);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    longPressTimer.current = setTimeout(() => {
      handleDragStart(e.clientY);
      setShowDragHint(true);
    }, 500);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    handleDragMove(e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      if (!isDragging) {
        setIsOpen(!isOpen);
      }
    }
    handleDragEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      longPressTimer.current = setTimeout(() => {
        if (e.touches.length === 1) {
          handleDragStart(touch.clientY);
          setShowDragHint(true);
        }
      }, 500);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientY);
    }
  };

  const handleTouchEndButton = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      if (!isDragging) {
        setIsOpen(!isOpen);
      }
    }
    handleDragEnd();
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, bottomPosition]);

  const t = translations[currentLanguage];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-300"
          style={{ bottom: `${bottomPosition + 72}px` }}
        >
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

      <div
        className={`fixed right-4 sm:right-6 z-50 transition-all duration-200 ${
          isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
        }`}
        style={{ bottom: `${bottomPosition}px` }}
      >
        {showDragHint && isDragging && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
            {t.dragToMove}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
        
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndButton}
          onTouchCancel={handleTouchEndButton}
          className={`relative w-14 h-14 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group ${
            isDragging ? 'opacity-80 shadow-lg' : 'hover:scale-110'
          }`}
          data-testid="button-telegram-chat"
          aria-label="Telegram chat button - long press to drag"
        >
          {isDragging ? (
            <GripVertical className="h-6 w-6" />
          ) : isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </>
          )}
        </button>

        {!isDragging && !isOpen && (
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </>
  );
}
