import { useState } from "react";
import { useNavigate } from "react-router";
import { mockCards, mockPersons, mockCompanies, mockDepartments, mockPositions } from "../utils/mockData";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card as UICard } from "../components/ui/card";
import { Upload, Search, Building2, Users, TrendingUp } from "lucide-react";
import { Badge } from "../components/ui/badge";

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getPersonInfo = (personId: string) => {
    const person = mockPersons.find(p => p.id === personId);
    if (!person) return null;

    const company = mockCompanies.find(c => c.id === person.company_id);
    const department = mockDepartments.find(d => d.id === person.department_id);
    const position = mockPositions.find(p => p.id === person.position_id);

    return { person, company, department, position };
  };

  const filteredCards = mockCards.filter(card => {
    const info = getPersonInfo(card.person_id);
    if (!info) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      info.person.name.toLowerCase().includes(query) ||
      info.company?.name.toLowerCase().includes(query) ||
      info.department?.name.toLowerCase().includes(query)
    );
  });

  const stats = [
    { label: "총 명함", value: mockCards.length, icon: Users, color: "bg-blue-500" },
    { label: "등록 회사", value: mockCompanies.length, icon: Building2, color: "bg-green-500" },
    { label: "조직도", value: mockCompanies.length, icon: TrendingUp, color: "bg-purple-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">명함 관리</h1>
        <p className="text-gray-500">명함을 등록하고 조직도를 자동으로 생성하세요</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <UICard key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} size-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </UICard>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button
          onClick={() => navigate("/upload")}
          className="h-24 bg-blue-600 hover:bg-blue-700 text-lg"
          size="lg"
        >
          <Upload className="size-6 mr-2" />
          명함 등록하기
        </Button>
        <Button
          onClick={() => navigate("/organization")}
          variant="outline"
          className="h-24 text-lg"
          size="lg"
        >
          <Building2 className="size-6 mr-2" />
          조직도 보기
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            placeholder="이름, 회사, 부서로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">최근 등록 명함</h2>
          <p className="text-sm text-gray-500">{filteredCards.length}개</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const info = getPersonInfo(card.person_id);
            if (!info) return null;

            return (
              <UICard
                key={card.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/persons/${card.person_id}`)}
              >
                <div className="aspect-[16/9] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={card.image_url}
                    alt="Business card"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {info.person.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {info.position?.name}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {info.company?.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {info.department?.name}
                    </Badge>
                  </div>
                </div>
              </UICard>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <Users className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">등록된 명함이 없습니다</p>
            <Button
              onClick={() => navigate("/upload")}
              variant="outline"
              className="mt-4"
            >
              명함 등록하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
