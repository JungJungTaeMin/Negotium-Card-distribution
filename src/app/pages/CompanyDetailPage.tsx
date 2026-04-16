import { useParams, useNavigate } from "react-router";
import { mockCompanies, mockDepartments, mockPersons } from "../utils/mockData";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Building2, Users, ArrowLeft, Network } from "lucide-react";

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.id === companyId);

  if (!company) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <Building2 className="size-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">회사 정보를 찾을 수 없습니다</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const departments = mockDepartments.filter(d => d.company_id === companyId);
  const employees = mockPersons.filter(p => p.company_id === companyId);

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

      {/* Company Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="size-16 bg-blue-500 rounded-xl flex items-center justify-center">
            <Building2 className="size-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="size-4" />
                <span>{employees.length}명</span>
              </div>
              <div className="flex items-center gap-1">
                <Network className="size-4" />
                <span>{departments.length}개 조직</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Departments */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">부서 목록</h2>
        <div className="space-y-2">
          {departments.map((dept) => {
            const deptEmployees = mockPersons.filter(p => p.department_id === dept.id);
            return (
              <div
                key={dept.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/departments/${dept.id}`)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-500">{deptEmployees.length}명의 멤버</p>
                </div>
                <Badge variant="secondary">Level {dept.depth + 1}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate(`/organization/${companyId}`)}
          >
            <Building2 className="size-4 mr-2" />
            조직도 보기
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate("/search")}
          >
            <Users className="size-4 mr-2" />
            인물 검색
          </Button>
        </div>
      </Card>
    </div>
  );
}
