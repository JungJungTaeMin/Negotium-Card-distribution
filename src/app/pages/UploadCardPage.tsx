import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Upload, Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";

export function UploadCardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("이미지 업로드 완료");

      // Simulate YOLO detection
      setUploading(false);
      setAnalyzing(true);
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("영역 탐지 완료");

      // Simulate OCR
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("텍스트 추출 완료");

      // Simulate parsing and organization creation
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock analysis result
      const result = {
        person: {
          name: "김민수",
          email: "minsu.kim@samsung.com",
          phone: "010-1234-5678",
        },
        company: "Samsung Electronics",
        department: "Cloud Platform Team",
        position: "Director",
      };

      setAnalysisResult(result);
      setProgress(100);
      toast.success("분석 완료!");

    } catch (error) {
      toast.error("분석 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    toast.success("명함이 저장되었습니다!");
    navigate("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">명함 등록</h1>
        <p className="text-gray-500">명함 사진을 업로드하면 자동으로 분석하여 조직도를 생성합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">이미지 업로드</h2>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">클릭하여 이미지 업로드</p>
                <p className="text-sm text-gray-400">또는 이미지를 드래그하세요</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 size-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {!analysisResult && (
                  <Button
                    onClick={handleUploadAndAnalyze}
                    disabled={uploading || analyzing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading || analyzing ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        {uploading ? "업로드 중..." : "분석 중..."}
                      </>
                    ) : (
                      <>
                        <Camera className="size-4 mr-2" />
                        분석 시작
                      </>
                    )}
                  </Button>
                )}

                {(uploading || analyzing) && (
                  <div>
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      {progress < 30 && "이미지 업로드 중..."}
                      {progress >= 30 && progress < 60 && "영역 탐지 중 (YOLO)..."}
                      {progress >= 60 && progress < 90 && "텍스트 추출 중 (OCR)..."}
                      {progress >= 90 && "조직 정보 생성 중..."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Analysis Result */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">분석 결과</h2>

            {!analysisResult ? (
              <div className="text-center py-12">
                <Camera className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">이미지를 업로드하고 분석을 시작하세요</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 className="size-5" />
                  <span className="font-medium">분석 완료</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">이름</label>
                    <p className="text-lg font-semibold">{analysisResult.person.name}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">직책</label>
                    <p className="text-lg font-semibold">{analysisResult.position}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">회사</label>
                    <p className="text-lg font-semibold">{analysisResult.company}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">부서</label>
                    <p className="text-lg font-semibold">{analysisResult.department}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">이메일</label>
                    <p className="text-lg font-semibold">{analysisResult.person.email}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">전화번호</label>
                    <p className="text-lg font-semibold">{analysisResult.person.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    저장하기
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    다시 촬영
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
