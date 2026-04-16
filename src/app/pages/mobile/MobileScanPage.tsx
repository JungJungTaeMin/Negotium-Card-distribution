import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { analyzeCard, fetchCompanies, uploadCard, type CompanySummary } from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Camera, Upload, CheckCircle2, Loader2, X, Maximize2, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "../../components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface BoundingBox {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

type AnalysisStage = 
  | "detecting" // YOLO detection
  | "extracting" // OCR text extraction
  | "parsing" // Data parsing & structuring
  | "complete";

interface CardData {
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  position: string;
}

export function MobileScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage | null>(null);
  const [progress, setProgress] = useState(0);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [analysisResult, setAnalysisResult] = useState<CardData | null>(null);
  const [editedData, setEditedData] = useState<CardData | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setCompanies(await fetchCompanies());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "회사 목록을 불러오지 못했습니다.");
      }
    };

    void loadCompanies();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    abortControllerRef.current = new AbortController();
    setAnalyzing(true);
    setAnalysisStage("detecting");
    setProgress(0);
    setBoundingBoxes([]);

    try {
      const uploadResult = await uploadCard(file);
      setProgress(10);
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("Analysis cancelled");
      }

      const response = await analyzeCard(uploadResult.cardId);

      const boxes: BoundingBox[] = response.yolo_results.map((item, index) => ({
        id: `${index}`,
        label: item.class_name,
        x: item.box.x1,
        y: item.box.y1,
        width: Math.max(item.box.x2 - item.box.x1, 0),
        height: Math.max(item.box.y2 - item.box.y1, 0),
        confidence: item.confidence,
      }));

      setBoundingBoxes(boxes);
      setProgress(33);
      toast.success("영역 탐지 완료");

      setAnalysisStage("extracting");
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("Analysis cancelled");
      }

      setProgress(66);
      toast.success("텍스트 추출 완료");

      setAnalysisStage("parsing");
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("Analysis cancelled");
      }

      setProgress(100);

      const result: CardData = {
        name: response.parsed_data?.name || "",
        email: response.parsed_data?.email || "",
        phone: response.parsed_data?.phone || "",
        company: response.parsed_data?.company || "",
        department: response.parsed_data?.department || "",
        position: response.parsed_data?.position || "",
      };

      setAnalysisResult(result);
      setEditedData(result);
      setAnalysisStage("complete");
      toast.success("분석 완료!");

    } catch (error: any) {
      if (error.message === "Analysis cancelled") {
        toast.info("분석이 취소되었습니다");
      } else {
        toast.error("분석 중 오류가 발생했습니다.");
      }
      setBoundingBoxes([]);
      setProgress(0);
    } finally {
      setAnalyzing(false);
      setAnalysisStage(null);
    }
  };

  const handleCancelAnalysis = () => {
    abortControllerRef.current?.abort();
    setAnalyzing(false);
    setAnalysisStage(null);
    setProgress(0);
    setBoundingBoxes([]);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setEditedData(null);
    setBoundingBoxes([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!editedData) return;
    toast.success("명함 분석이 저장되었습니다.");
    navigate("/");
  };

  const getSimilarCompanies = (input: string) => {
    if (!input || input.length < 2) return [];
    const lower = input.toLowerCase();
    return companies
      .filter((c) => c.companyName.toLowerCase().includes(lower))
      .slice(0, 5);
  };

  const similarCompanies = editedData ? getSimilarCompanies(editedData.company) : [];

  const getStageInfo = (stage: AnalysisStage | null) => {
    switch (stage) {
      case "detecting":
        return { title: "영역 탐지 중...", desc: "YOLO로 명함 필드를 감지하고 있습니다", icon: Loader2 };
      case "extracting":
        return { title: "텍스트 추출 중...", desc: "OCR로 텍스트를 읽고 있습니다", icon: Loader2 };
      case "parsing":
        return { title: "데이터 구조화 중...", desc: "정보를 분석하고 정리하고 있습니다", icon: Loader2 };
      default:
        return { title: "분석 중...", desc: "잠시만 기다려주세요", icon: Loader2 };
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">명함 스캔</h1>
          {preview && !analysisResult && (
            <button
              onClick={handleReset}
              className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <p className="text-sm opacity-90">AI가 자동으로 명함 정보를 추출합니다</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Camera/Upload Area */}
        {!preview ? (
          <Card className="overflow-hidden shadow-lg">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
              <div className="text-center">
                <Camera className="size-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">명함을 촬영하세요</p>
                
                <div className="space-y-3 px-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                  >
                    <Camera className="size-5 mr-2" />
                    카메라로 촬영
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <Upload className="size-5 mr-2" />
                    갤러리에서 선택
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Preview with Bounding Boxes */}
            <Card className="overflow-hidden shadow-lg">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full"
                />
                
                {/* YOLO Bounding Boxes Overlay */}
                <AnimatePresence>
                  {boundingBoxes.map((box) => (
                    <motion.div
                      key={box.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute border-2 border-accent rounded shadow-lg"
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                        backgroundColor: 'rgba(59, 89, 152, 0.1)',
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-accent text-white px-2 py-0.5 rounded text-xs font-medium shadow">
                        {box.label} {(box.confidence * 100).toFixed(0)}%
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Enhanced Analysis Loading Overlay */}
                {analyzing && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-[280px] w-full mx-4 shadow-2xl">
                      {(() => {
                        const stageInfo = getStageInfo(analysisStage);
                        const Icon = stageInfo.icon;
                        return (
                          <>
                            <div className="flex items-center justify-center mb-4">
                              <div className="relative">
                                <Icon className="size-12 text-primary animate-spin" />
                                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                              </div>
                            </div>
                            
                            <h3 className="font-semibold text-center mb-2 text-foreground">
                              {stageInfo.title}
                            </h3>
                            <p className="text-xs text-center text-muted-foreground mb-4">
                              {stageInfo.desc}
                            </p>

                            {/* Stage Progress Indicators */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                              {(["detecting", "extracting", "parsing"] as AnalysisStage[]).map((stage, idx) => {
                                const isActive = analysisStage === stage;
                                const isCompleted = ["detecting", "extracting", "parsing"].indexOf(analysisStage || "detecting") > idx;
                                
                                return (
                                  <div
                                    key={stage}
                                    className={`size-2 rounded-full transition-all ${
                                      isCompleted ? "bg-accent scale-110" :
                                      isActive ? "bg-primary scale-125 animate-pulse" :
                                      "bg-muted"
                                    }`}
                                  />
                                );
                              })}
                            </div>

                            <Progress value={progress} className="h-2 mb-4" />
                            
                            <Button
                              onClick={handleCancelAnalysis}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <X className="size-4 mr-2" />
                              취소
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Card Info Editor */}
            {analysisResult && editedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="p-5 shadow-lg border-2 border-accent/20">
                  <div className="flex items-center gap-2 text-accent mb-4">
                    <CheckCircle2 className="size-5" />
                    <span className="font-semibold">분석 완료 - 정보 확인</span>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        이름 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="h-11 bg-white"
                        placeholder="홍길동"
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        직책 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={editedData.position}
                        onChange={(e) => setEditedData({ ...editedData, position: e.target.value })}
                        className="h-11 bg-white"
                        placeholder="Director"
                      />
                    </div>

                    {/* Company with Autocomplete */}
                    <div className="relative">
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        회사명 <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          value={editedData.company}
                          onChange={(e) => {
                            setEditedData({ ...editedData, company: e.target.value });
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          className="h-11 bg-white pr-10"
                          placeholder="Samsung Electronics"
                        />
                        {similarCompanies.length > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <AlertCircle className="size-4 text-accent" />
                          </div>
                        )}
                      </div>
                      
                      {/* Company Suggestions */}
                      <AnimatePresence>
                        {showSuggestions && similarCompanies.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden"
                          >
                            <div className="px-3 py-2 bg-muted/50 border-b border-border">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                기존에 등록된 유사한 회사가 있습니다
                              </p>
                            </div>
                            {similarCompanies.map((company) => (
                              <button
                              key={company.companyId}
                              onClick={() => {
                                  setEditedData({ ...editedData, company: company.companyName });
                                  setShowSuggestions(false);
                                }}
                                className="w-full px-3 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group"
                              >
                                <span className="text-sm font-medium">{company.companyName}</span>
                                <Check className="size-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                            <button
                              onClick={() => setShowSuggestions(false)}
                              className="w-full px-3 py-2 text-xs text-center text-muted-foreground hover:bg-muted/50 border-t border-border"
                            >
                              새 회사로 등록
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Department */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        부서
                      </Label>
                      <Input
                        value={editedData.department}
                        onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                        className="h-11 bg-white"
                        placeholder="Cloud Platform Team"
                      />
                    </div>

                    <div className="h-px bg-border" />

                    {/* Email */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        이메일
                      </Label>
                      <Input
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        className="h-11 bg-white"
                        placeholder="example@company.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        전화번호
                      </Label>
                      <Input
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        className="h-11 bg-white"
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12"
                  >
                    다시 촬영
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="h-12 bg-primary hover:bg-primary/90"
                    disabled={!editedData.name || !editedData.company || !editedData.position}
                  >
                    <CheckCircle2 className="size-5 mr-2" />
                    저장 & 조직도 생성
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Analyze Button */}
            {!analysisResult && !analyzing && (
              <Button
                onClick={handleAnalyze}
                className="w-full h-12 bg-primary hover:bg-primary/90"
              >
                <Maximize2 className="size-5 mr-2" />
                AI 분석 시작
              </Button>
            )}
          </>
        )}

        {/* Tips */}
        {!preview && (
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2 text-sm">촬영 팁</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 명함이 화면에 가득 차도록 촬영하세요</li>
              <li>• 조명이 밝은 곳에서 촬영하세요</li>
              <li>• 명함이 평평하게 놓여있는지 확인하세요</li>
              <li>• 반사광이 없는지 확인하세요</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
