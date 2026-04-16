import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fetchCards, fetchCompanies, type CardSummary, type CompanySummary } from "../../utils/api";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Search, ScanLine, Building2, ChevronRight, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";

export function MobileHomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardItems, companyItems] = await Promise.all([fetchCards(), fetchCompanies()]);
        setCards(cardItems);
        setCompanies(companyItems);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "홈 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return cards;

    return cards.filter((card) =>
      [card.personName, card.companyName, card.departmentName, card.positionName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    );
  }, [cards, searchQuery]);

  const stats = [
    { label: "총 명함", value: cards.length, icon: ScanLine, color: "bg-primary" },
    { label: "등록 회사", value: companies.length, icon: Building2, color: "bg-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Negotium</h1>
            <p className="text-sm opacity-90">명함을 스마트하게 관리하세요</p>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Filter className="size-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            placeholder="이름, 회사, 부서로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-0 h-12 text-base rounded-lg"
          />
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 shadow-md">
                  <div className={`${stat.color} size-10 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="size-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Button
          onClick={() => navigate("/scan")}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-base rounded-lg mb-6 shadow-lg"
        >
          <ScanLine className="size-5 mr-2" />
          명함 스캔하기
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">최근 명함</h2>
            <button
              onClick={() => navigate("/search")}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              전체보기
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredCards.slice(0, 5).map((card, index) => (
              <motion.div
                key={card.cardId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="p-4 active:scale-98 transition-transform cursor-pointer shadow-sm"
                  onClick={() => card.personId && navigate(`/persons/${card.personId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {card.personName?.charAt(0) ?? "?"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-foreground mb-1">
                        {card.personName ?? "분석 대기 중"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {card.positionName ?? card.analysisStatus}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {card.companyName ?? "회사 미확인"}
                        </Badge>
                      </div>
                    </div>

                    <ChevronRight className="size-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {!loading && filteredCards.length === 0 && (
            <Card className="p-8 text-center">
              <ScanLine className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground mb-2">등록된 명함이 없습니다</p>
              <p className="text-sm text-muted-foreground mb-4">첫 명함을 스캔해보세요</p>
              <Button
                onClick={() => navigate("/scan")}
                size="sm"
                className="bg-primary"
              >
                명함 스캔하기
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
