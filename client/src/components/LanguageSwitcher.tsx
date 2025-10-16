import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages = [
    { value: 'english' as const, label: 'English', flag: '🇬🇧' },
    { value: 'arabic' as const, label: 'العربية', flag: '🇸🇦' },
    { value: 'amharic' as const, label: 'አማርኛ', flag: '🇪🇹' },
  ];

  const currentLangData = languages.find(l => l.value === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-sm font-medium"
          data-testid="button-language-switcher"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLangData.label}</span>
          <span className="sm:hidden">{currentLangData.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={`cursor-pointer ${
              currentLanguage === lang.value ? 'bg-accent' : ''
            }`}
            data-testid={`menu-language-${lang.value}`}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
