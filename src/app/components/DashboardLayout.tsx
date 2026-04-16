import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { isAuthenticated, logout, getCurrentUser } from "../utils/auth";
import { Button } from "./ui/button";
import { 
  Building2, 
  Home, 
  Upload, 
  Search, 
  LogOut, 
  Menu,
  Users,
  X
} from "lucide-react";
import { cn } from "./ui/utils";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/upload", icon: Upload, label: "명함 등록" },
    { path: "/organization", icon: Building2, label: "조직도" },
    { path: "/search", icon: Search, label: "검색" },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <button
        onClick={() => {
          navigate(item.path);
          setSidebarOpen(false);
        }}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
          isActive 
            ? "bg-blue-50 text-blue-600" 
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <Icon className="size-5" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-blue-600" />
            <span className="font-semibold text-lg">Negotium</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="size-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="size-6" />
          </button>
          <div className="ml-4 flex items-center gap-2">
            <Users className="size-5 text-blue-600" />
            <span className="font-semibold">Negotium</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
