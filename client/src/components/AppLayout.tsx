import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Hamburger Button */}
      {!sidebarOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300"
          data-testid="button-open-sidebar"
        >
          <Menu className="w-5 h-5 text-primary-foreground" />
        </Button>
      )}

      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : ''}`}>
        {children}
      </div>
    </div>
  );
}