import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../utils/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("로그인되었습니다.");
      navigate("/");
    } catch (error) {
      toast.error("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-20 bg-primary rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <ScanLine className="size-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Negotium</h1>
          <p className="text-muted-foreground">명함을 스마트하게 관리하세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-12"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-base"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Signup link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:text-primary/80 font-semibold"
            >
              회원가입
            </button>
          </p>
        </div>

        {/* Demo info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center">
            데모 버전: 아무 이메일과 비밀번호로 로그인하세요
          </p>
        </div>
      </div>
    </div>
  );
}