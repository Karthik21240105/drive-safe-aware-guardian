
import { Bell, Cpu, Menu, Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  toggleSettings: () => void;
}

const Header = ({ toggleSettings }: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };
  
  useEffect(() => {
    // Get theme preference from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = savedTheme || systemTheme;
    
    setTheme(currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, []);
  
  return (
    <header className="flex items-center justify-between border-b border-border bg-card p-4">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">DriveSafe™</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSettings}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
