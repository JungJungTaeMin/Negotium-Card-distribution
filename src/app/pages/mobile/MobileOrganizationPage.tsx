import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchCompanies, fetchCompanyTree, type CompanySummary, type OrgCompanyTree, type OrgDepartment, type OrgPerson } from "../../utils/api";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ChevronRight, ChevronDown, Building2, User, Users, ArrowLeft } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../components/ui/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function MobileOrganizationPage() {
  const navigate = useNavigate();
  const { companyId: urlCompanyId } = useParams();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(urlCompanyId || "");
  const [tree, setTree] = useState<OrgCompanyTree | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const items = await fetchCompanies();
        setCompanies(items);
        if (!selectedCompanyId && items[0]) {
          setSelectedCompanyId(String(items[0].companyId));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "회사 목록을 불러오지 못했습니다.");
      }
    };

    void loadCompanies();
  }, [selectedCompanyId]);

  useEffect(() => {
    if (!selectedCompanyId) return;

    const loadTree = async () => {
      try {
        const result = await fetchCompanyTree(Number(selectedCompanyId));
        setTree(result);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "조직도를 불러오지 못했습니다.");
      }
    };

    void loadTree();
  }, [selectedCompanyId]);

  const selectedCompany = companies.find((company) => String(company.companyId) === selectedCompanyId);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    navigate(`/organization/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-primary text-primary-foreground px-4 py-6 mb-4">
        <div className="flex items-center gap-3 mb-2">
          {urlCompanyId && (
            <button
              onClick={() => navigate(-1)}
              className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{tree?.companyName || selectedCompany?.companyName || "조직도"}</h1>
            <p className="text-sm opacity-90">회사별 조직 구조를 확인하세요</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <Card className="p-4 shadow-md">
          <label className="text-sm text-muted-foreground mb-2 block">회사 선택</label>
          <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="회사를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.companyId} value={String(company.companyId)}>
                  {company.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCompany && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">총 인원</p>
                  <p className="font-semibold">{selectedCompany.personCount}명</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <div className="size-10 bg-accent rounded-lg flex items-center justify-center">
                  <Users className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">부서 수</p>
                  <p className="font-semibold">{selectedCompany.departmentCount}개</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {tree && tree.departments.length > 0 ? (
          <div className="space-y-2">
            {tree.departments.map((department) => (
              <DepartmentNode key={department.departmentId} department={department} level={0} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Building2 className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-2">조직 데이터가 없습니다</p>
            <p className="text-sm text-muted-foreground">명함을 스캔하면 자동으로 조직도가 생성됩니다</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function DepartmentNode({ department, level }: { department: OrgDepartment; level: number }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const hasChildren = department.children.length > 0 || department.persons.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden shadow-sm", level > 0 && "ml-4")}>
        <div
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          className="p-4 flex items-center gap-3 active:bg-muted/50 transition-colors"
        >
          {hasChildren && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="size-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-5 text-muted-foreground" />
              )}
            </div>
          )}

          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center flex-shrink-0",
              level === 0 ? "bg-primary" : level === 1 ? "bg-accent" : "bg-muted"
            )}
          >
            <Building2 className={cn("size-5", level <= 1 ? "text-white" : "text-muted-foreground")} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{department.departmentName}</h3>
            <p className="text-xs text-muted-foreground">
              {department.persons.length}명
              {department.children.length > 0 && ` · ${department.children.length}개 하위 조직`}
            </p>
          </div>

          <Badge variant="secondary" className="text-xs flex-shrink-0">
            Lv.{level + 1}
          </Badge>
        </div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {department.persons.length > 0 && (
                <div className="border-t border-border bg-muted/30">
                  {department.persons.map((person) => (
                    <PersonRow key={person.personId} person={person} onClick={() => navigate(`/persons/${person.personId}`)} />
                  ))}
                </div>
              )}

              {department.children.length > 0 && (
                <div className="p-2 space-y-2 bg-muted/20">
                  {department.children.map((child) => (
                    <DepartmentNode key={child.departmentId} department={child} level={level + 1} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

function PersonRow({ person, onClick }: { person: OrgPerson; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 flex items-center gap-3 border-b border-border last:border-0 active:bg-white/50 transition-colors"
    >
      <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="size-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{person.name}</p>
        <p className="text-xs text-muted-foreground">{person.positionName}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
    </div>
  );
}
