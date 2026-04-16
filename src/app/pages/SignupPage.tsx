import { useState } from "react";
import { useNavigate } from "react-router";
import { login, sendSignupCode, signup, verifySignupCode } from "../utils/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("이메일을 먼저 입력해주세요.");
      return;
    }

    setSendingCode(true);
    try {
      await sendSignupCode(email);
      setCodeSent(true);
      setVerified(false);
      toast.success("인증번호를 전송했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "인증번호 전송에 실패했습니다.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!email || !code) {
      toast.error("이메일과 인증번호를 입력해주세요.");
      return;
    }

    setVerifyingCode(true);
    try {
      await verifySignupCode(email, code);
      setVerified(true);
      toast.success("이메일 인증이 완료되었습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "인증번호 확인에 실패했습니다.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    if (!verified) {
      toast.error("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      await login(email, password);
      toast.success("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
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
          <h1 className="text-3xl font-bold text-foreground mb-2">회원가입</h1>
          <p className="text-muted-foreground">Negotium과 함께 시작하세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-12"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm">이메일</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                disabled={verified}
              />
              <Button
                type="button"
                variant="outline"
                className="h-12 shrink-0"
                onClick={handleSendCode}
                disabled={sendingCode || verified}
              >
                {sendingCode ? "전송 중..." : verified ? "인증 완료" : "인증번호"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="code" className="text-sm">인증번호</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="code"
                type="text"
                placeholder="6자리 인증번호"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12"
                disabled={!codeSent || verified}
              />
              <Button
                type="button"
                variant="outline"
                className="h-12 shrink-0"
                onClick={handleVerifyCode}
                disabled={!codeSent || verifyingCode || verified}
              >
                {verifyingCode ? "확인 중..." : verified ? "완료" : "확인"}
              </Button>
            </div>
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
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80 font-semibold"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
