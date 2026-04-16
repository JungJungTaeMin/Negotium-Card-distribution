import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { addPersonTag, createMemo, fetchPersonDetail, type PersonDetail, updatePerson } from "../../utils/api";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  Tag as TagIcon,
  Plus,
  Share2,
  MoreVertical,
  CreditCard,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export function MobilePersonDetailPage() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [newMemo, setNewMemo] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showMemoInput, setShowMemoInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showOriginalCard, setShowOriginalCard] = useState(false);

  useEffect(() => {
    if (!personId) return;

    const load = async () => {
      try {
        setPerson(await fetchPersonDetail(Number(personId)));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "인물 정보를 불러오지 못했습니다.");
      }
    };

    void load();
  }, [personId]);

  if (!person) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">인물 정보를 불러오는 중입니다</p>
          <Button onClick={() => navigate("/")} className="bg-primary">
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddMemo = async () => {
    if (!newMemo.trim()) return;
    try {
      await createMemo(person.personId, newMemo.trim());
      setPerson(await fetchPersonDetail(person.personId));
      setNewMemo("");
      setShowMemoInput(false);
      toast.success("메모가 추가되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "메모 추가에 실패했습니다.");
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await addPersonTag(person.personId, newTag.trim());
      setPerson(await fetchPersonDetail(person.personId));
      setNewTag("");
      setShowTagInput(false);
      toast.success("태그가 추가되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "태그 추가에 실패했습니다.");
    }
  };

  const handleUpdateContact = async (field: "email" | "phone", value: string) => {
    try {
      await updatePerson(person.personId, { [field]: value });
      setPerson({ ...person, [field]: value });
      toast.success("인물 정보가 수정되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "인물 정보 수정에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-primary text-primary-foreground px-4 py-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-xl font-bold">인물 정보</h1>
        </div>

        <Card className="p-4 bg-white shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="size-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">{person.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-1">{person.name}</h2>
              <p className="text-base text-muted-foreground">{person.positionName}</p>
            </div>
            <button className="size-9 rounded-full bg-muted flex items-center justify-center">
              <MoreVertical className="size-5 text-muted-foreground" />
            </button>
          </div>

          {person.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {person.tags.map((tag) => (
                <Badge key={tag.tagId} variant="secondary">
                  {tag.tagName}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-10"
              onClick={() => person.phone && (window.location.href = `tel:${person.phone}`)}
            >
              <Phone className="size-4 mr-2" />
              전화
            </Button>
            <Button
              variant="outline"
              className="h-10"
              onClick={() => person.email && (window.location.href = `mailto:${person.email}`)}
            >
              <Mail className="size-4 mr-2" />
              이메일
            </Button>
          </div>
        </Card>
      </div>

      <div className="px-4 space-y-4">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="size-5 text-primary" />
            연락처 정보
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">이메일</p>
                <Input
                  value={person.email ?? ""}
                  onBlur={(e) => handleUpdateContact("email", e.target.value)}
                  placeholder="example@company.com"
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">전화번호</p>
                <Input
                  value={person.phone ?? ""}
                  onBlur={(e) => handleUpdateContact("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">소속</p>
                <p className="text-sm font-medium">{person.companyName}</p>
                <p className="text-sm text-muted-foreground">{person.departmentName}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              메모
            </h3>
            {!showMemoInput && (
              <button
                onClick={() => setShowMemoInput(true)}
                className="text-sm text-primary font-medium flex items-center gap-1"
              >
                <Plus className="size-4" />
                추가
              </button>
            )}
          </div>

          {showMemoInput && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-3">
              <Textarea
                placeholder="메모를 입력하세요..."
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                className="resize-none mb-2"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={handleAddMemo} className="flex-1 h-9 bg-primary" size="sm">
                  저장
                </Button>
                <Button
                  onClick={() => {
                    setShowMemoInput(false);
                    setNewMemo("");
                  }}
                  variant="outline"
                  className="flex-1 h-9"
                  size="sm"
                >
                  취소
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            {person.memos.map((memo) => (
              <motion.div
                key={memo.memoId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-muted/50 rounded-lg"
              >
                <p className="text-sm mb-2">{memo.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(memo.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </motion.div>
            ))}

            {person.memos.length === 0 && !showMemoInput && (
              <p className="text-sm text-muted-foreground text-center py-4">메모가 없습니다</p>
            )}
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TagIcon className="size-5 text-primary" />
            태그 추가
          </h3>

          {!showTagInput ? (
            <Button onClick={() => setShowTagInput(true)} variant="outline" className="w-full h-10">
              <Plus className="size-4 mr-2" />
              새 태그 추가
            </Button>
          ) : (
            <div className="space-y-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="예: 핵심인물"
                className="h-10"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddTag} className="flex-1 h-9 bg-primary" size="sm">
                  저장
                </Button>
                <Button
                  onClick={() => {
                    setShowTagInput(false);
                    setNewTag("");
                  }}
                  variant="outline"
                  className="flex-1 h-9"
                  size="sm"
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-3">빠른 작업</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => setShowOriginalCard(true)}
              disabled={!person.imageUrl}
            >
              <CreditCard className="size-5 mr-3" />
              원본 명함 보기
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => person.companyId && navigate(`/organization/${person.companyId}`)}
              disabled={!person.companyId}
            >
              <Building2 className="size-5 mr-3" />
              조직도에서 보기
            </Button>
            <Button variant="outline" className="w-full justify-start h-11">
              <Share2 className="size-5 mr-3" />
              공유하기
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={showOriginalCard} onOpenChange={setShowOriginalCard}>
        <DialogContent className="max-w-[90vw] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span>원본 명함</span>
              <button
                onClick={() => setShowOriginalCard(false)}
                className="size-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="size-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-0">
            <div className="bg-muted rounded-lg overflow-hidden">
              {person.imageUrl ? (
                <img src={person.imageUrl} alt="Original Business Card" className="w-full" />
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">원본 명함 이미지가 없습니다.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
