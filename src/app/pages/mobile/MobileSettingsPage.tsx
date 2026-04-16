import { useNavigate } from "react-router";
import { logout, getCurrentUser } from "../../utils/auth";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText,
  LogOut,
  ChevronRight,
  Mail,
  Building2
} from "lucide-react";
import { toast } from "sonner";

export function MobileSettingsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다");
    navigate("/login");
  };

  const settingsSections = [
    {
      title: "계정",
      items: [
        { icon: User, label: "프로필 설정", onClick: () => toast.info("준비 중입니다") },
        { icon: Mail, label: "이메일 변경", onClick: () => toast.info("준비 중입니다") },
        { icon: Shield, label: "비밀번호 변경", onClick: () => toast.info("준비 중입니다") },
      ]
    },
    {
      title: "앱 설정",
      items: [
        { icon: Bell, label: "알림 설정", onClick: () => toast.info("준비 중입니다") },
        { icon: Building2, label: "조직도 설정", onClick: () => toast.info("준비 중입니다") },
      ]
    },
    {
      title: "지원",
      items: [
        { icon: HelpCircle, label: "도움말", onClick: () => toast.info("준비 중입니다") },
        { icon: FileText, label: "이용약관", onClick: () => toast.info("준비 중입니다") },
        { icon: FileText, label: "개인정보처리방침", onClick: () => toast.info("준비 중입니다") },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-6 mb-4">
        <h1 className="text-2xl font-bold mb-2">설정</h1>
        <p className="text-sm opacity-90">계정 및 앱 설정을 관리하세요</p>
      </div>

      <div className="px-4 space-y-4">
        {/* User Profile Card */}
        <Card className="p-4 shadow-md">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">{user?.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-muted-foreground px-1 mb-2">
              {section.title}
            </h2>
            <Card className="overflow-hidden shadow-sm">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 active:bg-muted transition-colors ${
                      index !== section.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <Icon className="size-5 text-muted-foreground" />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card className="p-4 shadow-sm">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-5 mr-3" />
            로그아웃
          </Button>
        </Card>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-1">Negotium Card</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
