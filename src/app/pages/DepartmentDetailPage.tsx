import { useParams, useNavigate } from "react-router";
import { mockDepartments, mockPersons, mockCompanies, mockPositions } from "../utils/mockData";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Building2, Users, ArrowLeft, User } from "lucide-react";

export function DepartmentDetailPage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const department = mockDepartments.find(d => d.id === departmentId);

  if (!department) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <Building2 className="size-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">부서 정보를 찾을 수 없습니다</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const company = mockCompanies.find(c => c.id === department.company_id);
  const parentDept = department.parent_id 
    ? mockDepartments.find(d => d.id === department.parent_id)
    : null;
  const childDepts = mockDepartments.filter(d => d.parent_id === departmentId);
  const members = mockPersons.filter(p => p.department_id === departmentId);

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

      {/* Department Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="size-16 bg-blue-100 rounded-xl flex items-center justify-center">
            <Building2 className="size-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{department.name}</h1>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary">Level {department.depth + 1}</Badge>
              <span className="text-sm text-gray-500">{company?.name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="size-4" />
                <span>{members.length}명의 멤버</span>
              </div>
              {childDepts.length > 0 && (
                <div className="flex items-center gap-1">
                  <Building2 className="size-4" />
                  <span>{childDepts.length}개 하위 조직</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parent Department */}
        {parentDept && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">상위 조직</p>
            <button
              onClick={() => navigate(`/departments/${parentDept.id}`)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {parentDept.name}
            </button>
          </div>
        )}
      </Card>

      {/* Members */}
      {members.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">멤버</h2>
          <div className="space-y-2">
            {members.map((person) => {
              const position = mockPositions.find(p => p.id === person.position_id);
              return (
                <div
                  key={person.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/persons/${person.id}`)}
                >
                  <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="size-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-500">{position?.name}</p>
                  </div>
                  <Badge variant="outline">{person.email}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Child Departments */}
      {childDepts.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">하위 조직</h2>
          <div className="space-y-2">
            {childDepts.map((dept) => {
              const deptMembers = mockPersons.filter(p => p.department_id === dept.id);
              return (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{deptMembers.length}명의 멤버</p>
                  </div>
                  <Badge variant="secondary">Level {dept.depth + 1}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate(`/organization/${department.company_id}`)}
          >
            <Building2 className="size-4 mr-2" />
            조직도 보기
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate(`/companies/${department.company_id}`)}
          >
            <Building2 className="size-4 mr-2" />
            회사 정보
          </Button>
        </div>
      </Card>
    </div>
  );
}
