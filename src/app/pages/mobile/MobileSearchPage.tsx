import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fetchCompanies, searchPersons, type CompanySummary, type SearchPerson } from "../../utils/api";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Building2, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function MobileSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [persons, setPersons] = useState<SearchPerson[]>([]);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [companyItems, personItems] = await Promise.all([
          fetchCompanies(),
          searchPersons({ page: "0", size: "100" }),
        ]);
        setCompanies(companyItems);
        setPersons(personItems.content);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "검색 데이터를 불러오지 못했습니다.");
      }
    };

    void load();
  }, []);

  const positionOptions = useMemo(
    () =>
      Array.from(new Set(persons.map((person) => person.positionName).filter(Boolean) as string[])).sort(),
    [persons]
  );

  const filteredPersons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return persons.filter((person) => {
      const matchesSearch =
        !query ||
        [person.name, person.email, person.companyName, person.departmentName, person.positionName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      const matchesCompany = companyFilter === "all" || person.companyName === companyFilter;
      const matchesPosition = positionFilter === "all" || person.positionName === positionFilter;
      return matchesSearch && matchesCompany && matchesPosition;
    });
  }, [persons, searchQuery, companyFilter, positionFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setCompanyFilter("all");
    setPositionFilter("all");
  };

  const hasActiveFilters = companyFilter !== "all" || positionFilter !== "all";

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-primary text-primary-foreground px-4 py-6 mb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="size-5" />
          </button>
          <h1 className="text-xl font-bold">검색</h1>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            placeholder="이름, 회사, 부서로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-0 h-12 text-base rounded-lg"
          />
        </div>

        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className={`w-full h-10 justify-between ${hasActiveFilters ? "border-white/50" : "border-white/20"} ${showFilters ? "bg-white/10" : "bg-white/5"} text-white hover:bg-white/20 hover:text-white`}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            필터
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 bg-white/90 text-primary">
                {(companyFilter !== "all" ? 1 : 0) + (positionFilter !== "all" ? 1 : 0)}
              </Badge>
            )}
          </span>
          <ChevronRight className={`size-4 transition-transform ${showFilters ? "rotate-90" : ""}`} />
        </Button>
      </div>

      <div className="px-4 space-y-4">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 shadow-md">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">회사</label>
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.companyId} value={company.companyName}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">직책</label>
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {positionOptions.map((positionName) => (
                          <SelectItem key={positionName} value={positionName}>
                            {positionName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {hasActiveFilters && (
                    <Button onClick={handleReset} variant="outline" className="w-full h-10">
                      필터 초기화
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <h2 className="font-semibold">검색 결과</h2>
          <Badge variant="secondary">{filteredPersons.length}명</Badge>
        </div>

        <div className="space-y-3">
          {filteredPersons.map((person, index) => (
            <motion.div
              key={person.personId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-4 active:scale-98 transition-transform cursor-pointer shadow-sm"
                onClick={() => navigate(`/persons/${person.personId}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{person.name.charAt(0)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">{person.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{person.positionName}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="size-3" />
                      <span className="truncate">{person.companyName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{person.departmentName}</p>
                  </div>

                  <ChevronRight className="size-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPersons.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-2">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground mb-4">다른 검색어나 필터를 사용해보세요</p>
            {hasActiveFilters && (
              <Button onClick={handleReset} variant="outline" size="sm">
                필터 초기화
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
