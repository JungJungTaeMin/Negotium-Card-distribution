import { useState } from "react";
import { useParams } from "react-router";
import { mockCompanies, buildDepartmentTree } from "../utils/mockData";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { OrganizationTree } from "../components/OrganizationTree";
import { Building2, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";

export function OrganizationPage() {
  const { companyId: routeCompanyId } = useParams();
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    routeCompanyId || mockCompanies[0]?.id || ""
  );

  const selectedCompany = mockCompanies.find(c => c.id === selectedCompanyId);
  const departmentTree = selectedCompanyId ? buildDepartmentTree(selectedCompanyId) : [];

  const getTotalEmployees = () => {
    // This would normally come from API
    return selectedCompanyId === "1" ? 8 : selectedCompanyId === "2" ? 2 : 1;
  };

  const getTotalDepartments = () => {
    const countDepts = (depts: any[]): number => {
      return depts.reduce((count, dept) => {
        return count + 1 + (dept.children ? countDepts(dept.children) : 0);
      }, 0);
    };
    return countDepts(departmentTree);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">조직도</h1>
        <p className="text-gray-500">회사별 조직 구조와 인물 관계를 확인하세요</p>
      </div>

      {/* Company Selector */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-500 mb-2 block">회사 선택</label>
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="회사를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedCompany && (
          <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="size-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Building2 className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">회사명</p>
                <p className="font-semibold text-gray-900">{selectedCompany.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">총 인원</p>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">{getTotalEmployees()}명</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">조직 수</p>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">{getTotalDepartments()}개</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Organization Tree */}
      {selectedCompany && departmentTree.length > 0 ? (
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">조직 구조</h2>
            <p className="text-sm text-gray-500">
              클릭하여 조직을 펼치거나 접을 수 있습니다
            </p>
          </div>

          <OrganizationTree
            departments={departmentTree}
            companyId={selectedCompanyId}
          />
        </Card>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Building2 className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">조직 데이터가 없습니다</p>
            <p className="text-sm text-gray-400">
              명함을 등록하면 자동으로 조직도가 생성됩니다
            </p>
          </div>
        </Card>
      )}

      {/* Legend */}
      {departmentTree.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">조직도 범례</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-blue-100 rounded flex items-center justify-center">
                <Building2 className="size-3 text-blue-600" />
              </div>
              <span className="text-gray-600">부서/조직</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="size-3 text-gray-600" />
              </div>
              <span className="text-gray-600">인물</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Level</Badge>
              <span className="text-gray-600">조직 깊이</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
