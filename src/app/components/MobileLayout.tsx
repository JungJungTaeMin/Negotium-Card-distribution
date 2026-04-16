import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { Home, ScanLine, Network, User } from "lucide-react";
import { cn } from "./ui/utils";

export function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const navItems = [
    { path: "/", icon: Home, label: "계기반" },
    { path: "/scan", icon: ScanLine, label: "주사" },
    { path: "/organization", icon: Network, label: "조직도" },
    { path: "/settings", icon: User, label: "윤곽" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    // translate="no" 속성을 추가하여 브라우저 자동 번역에 의한 DOM 파괴를 방지합니다.
    <div className="h-screen flex flex-col bg-background overflow-hidden max-w-md mx-auto shadow-2xl relative" translate="no">
      
      <main className="flex-1 overflow-y-auto pb-20">
        {/* key를 최상위 div에 부여하여 페이지 전환 시 강제로 DOM을 새로 고침합니다. */}
        <div key={location.key || location.pathname} className="min-h-full">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 max-w-md mx-auto">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all active:scale-95",
                  active ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}