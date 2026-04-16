import { useState } from "react";
import { useNavigate } from "react-router";
import { mockPersons, mockCompanies, mockDepartments, mockPositions } from "../utils/mockData";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, User, Building2, Filter } from "lucide-react";
import { Button } from "../components/ui/button";

export function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  const filteredPersons = mockPersons.filter(person => {
    const query = searchQuery.toLowerCase();
    const company = mockCompanies.find(c => c.id === person.company_id);
    const department = mockDepartments.find(d => d.id === person.department_id);
    const position = mockPositions.find(p => p.id === person.position_id);

    // Text search
    const matchesSearch = 
      person.name.toLowerCase().includes(query) ||
      person.email.toLowerCase().includes(query) ||
      company?.name.toLowerCase().includes(query) ||
      department?.name.toLowerCase().includes(query) ||
      position?.name.toLowerCase().includes(query);

    // Company filter
    const matchesCompany = companyFilter === "all" || person.company_id === companyFilter;

    // Position filter
    const matchesPosition = positionFilter === "all" || person.position_id === positionFilter;

    return matchesSearch && matchesCompany && matchesPosition;
  });

  const handleReset = () => {
    setSearchQuery("");
    setCompanyFilter("all");
    setPositionFilter("all");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">인물 검색</h1>
        <p className="text-gray-500">이름, 회사, 부서, 직책으로 인물을 찾아보세요</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500 mb-2 block">검색어</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="이름, 이메일, 회사, 부서..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Company Filter */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">회사</label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position Filter */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">직책</label>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {mockPositions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {(companyFilter !== "all" || positionFilter !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <Filter className="size-4 text-gray-400" />
            <span className="text-sm text-gray-500">필터:</span>
            {companyFilter !== "all" && (
              <Badge variant="secondary">
                {mockCompanies.find(c => c.id === companyFilter)?.name}
              </Badge>
            )}
            {positionFilter !== "all" && (
              <Badge variant="secondary">
                {mockPositions.find(p => p.id === positionFilter)?.name}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="ml-auto"
            >
              초기화
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">검색 결과</h2>
          <p className="text-sm text-gray-500">{filteredPersons.length}명</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersons.map((person) => {
            const company = mockCompanies.find(c => c.id === person.company_id);
            const department = mockDepartments.find(d => d.id === person.department_id);
            const position = mockPositions.find(p => p.id === person.position_id);

            return (
              <Card
                key={person.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/persons/${person.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="size-6 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {position?.name}
                    </p>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Building2 className="size-3" />
                        <span className="truncate">{company?.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {department?.name}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {person.email}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredPersons.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Search className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-400">
                다른 검색어나 필터를 사용해보세요
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
