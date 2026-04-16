import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getPersonWithRelations, mockMemos, mockTags } from "../utils/mockData";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Tag,
  MessageSquare,
  Plus,
  ArrowLeft,
  Edit
} from "lucide-react";
import { toast } from "sonner";

export function PersonDetailPage() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const person = personId ? getPersonWithRelations(personId) : null;

  const [memos, setMemos] = useState(mockMemos.filter(m => m.person_id === personId));
  const [newMemo, setNewMemo] = useState("");
  const [tags, setTags] = useState(mockTags.slice(0, 2)); // Mock assigned tags
  const [isEditing, setIsEditing] = useState(false);

  if (!person) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <User className="size-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">인물 정보를 찾을 수 없습니다</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddMemo = () => {
    if (!newMemo.trim()) return;

    const memo = {
      id: Date.now().toString(),
      person_id: personId!,
      content: newMemo,
      created_at: new Date().toISOString(),
    };

    setMemos([...memos, memo]);
    setNewMemo("");
    toast.success("메모가 추가되었습니다");
  };

  const handleAddTag = (tag: typeof mockTags[0]) => {
    if (tags.find(t => t.id === tag.id)) {
      toast.error("이미 추가된 태그입니다");
      return;
    }
    setTags([...tags, tag]);
    toast.success("태그가 추가되었습니다");
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(t => t.id !== tagId));
    toast.success("태그가 제거되었습니다");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        뒤로 가기
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Person Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="size-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
                  <p className="text-gray-500">{person.position?.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="size-4 mr-2" />
                수정
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="size-5 text-gray-400" />
                <span>{person.email}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="size-5 text-gray-400" />
                <span>{person.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Building2 className="size-5 text-gray-400" />
                <div>
                  <p className="font-medium">{person.company?.name}</p>
                  <p className="text-sm text-gray-500">{person.department?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="size-5 text-gray-400" />
                <span>{person.position?.name} (Level {person.position?.level})</span>
              </div>
            </div>
          </Card>

          {/* Memos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">메모</h2>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {memos.map((memo) => (
                <div key={memo.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{memo.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(memo.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}

              {memos.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  메모가 없습니다
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="새 메모를 입력하세요..."
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <Button
                onClick={handleAddMemo}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                메모 추가
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="size-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">태그</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  style={{ backgroundColor: tag.color }}
                  className="text-white cursor-pointer hover:opacity-80"
                  onClick={() => handleRemoveTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}

              {tags.length === 0 && (
                <p className="text-sm text-gray-500">태그가 없습니다</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-2">태그 추가</p>
              <div className="flex flex-wrap gap-2">
                {mockTags
                  .filter(t => !tags.find(tag => tag.id === t.id))
                  .map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleAddTag(tag)}
                    >
                      <Plus className="size-3 mr-1" />
                      {tag.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/organization/${person.company_id}`)}
              >
                <Building2 className="size-4 mr-2" />
                조직도에서 보기
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/companies/${person.company_id}`)}
              >
                <Building2 className="size-4 mr-2" />
                회사 정보
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
