'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Sparkles, Brain, Lightbulb, TrendingUp, Users, Target, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Types for API
type LLMModel = 'GEMINI' | 'CHATGPT';
type NodeShape = 'RECTANGLE' | 'ELLIPSE' | 'DIAMOND' | 'ROUNDED_RECTANGLE';

interface GeneratedNode {
  content: string;
  parentNodeId: number | null;
  positionX: number;
  positionY: number;
  color: string;
  shape: NodeShape;
}

interface GeneratedEdge {
  fromNodeId: number;
  toNodeId: number;
  label: string;
}

interface GenerateMindmapResponse {
  title: string;
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
}

const aiSuggestions = [
  {
    id: '1',
    title: 'Project Planning',
    description: 'Create a comprehensive project plan with timelines and deliverables',
    icon: Target,
    category: 'Business',
  },
  {
    id: '2',
    title: 'Learning Path',
    description: 'Design a structured learning curriculum for any topic',
    icon: Lightbulb,
    category: 'Education',
  },
  {
    id: '3',
    title: 'Marketing Strategy',
    description: 'Develop a complete marketing campaign with channels and tactics',
    icon: TrendingUp,
    category: 'Marketing',
  },
  {
    id: '4',
    title: 'Team Structure',
    description: 'Organize team roles and responsibilities effectively',
    icon: Users,
    category: 'Management',
  },
];

export default function AIPage() {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<LLMModel>('GEMINI');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateMindmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung mô tả mindmap",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedData(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

      const response = await fetch(`${API_BASE_URL}/ai/generate-mindmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add X-User-Id if available from auth context
          // 'X-User-Id': userId,
        },
        body: JSON.stringify({
          prompt: inputText,
          llmModel: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo mindmap. Vui lòng thử lại sau.');
      }

      const data: GenerateMindmapResponse = await response.json();
      console.log('🤖 AI Response:', data);
      console.log('📊 Nodes count:', data.nodes?.length);
      console.log('🔗 Edges count:', data.edges?.length);
      setGeneratedData(data);

      toast({
        title: "Thành công!",
        description: "Đã tạo cấu trúc mindmap thành công",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo mindmap';
      setError(errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSuggestion = (suggestion: any) => {
    setInputText(`Create a mind map for ${suggestion.title.toLowerCase()}: ${suggestion.description}`);
  };

  const createMindMap = () => {
    if (!generatedData) return;

    // Lưu dữ liệu AI vào sessionStorage để sử dụng sau khi tạo mindmap
    sessionStorage.setItem('aiGeneratedMindmap', JSON.stringify({
      title: generatedData.title,
      nodes: generatedData.nodes,
      edges: generatedData.edges,
      prompt: inputText
    }));

    toast({
      title: "Đang chuyển hướng...",
      description: "Chuyển đến trang tạo mindmap",
    });

    // Chuyển đến trang tạo mindmap mới với flag từ AI
    router.push('/mindmaps/new?from=ai');
  };

  const handleRegenerateNew = () => {
    setGeneratedData(null);
    setError(null);
    setInputText('');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">AI Mind Map Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Biến ý tưởng của bạn thành mind map có cấu trúc ngay lập tức với AI.
            Chỉ cần mô tả chủ đề hoặc sử dụng một trong các mẫu của chúng tôi.
          </p>
        </div>

        {/* Input Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Mô tả chủ đề của bạn</CardTitle>
            <CardDescription>
              Cho chúng tôi biết bạn muốn tạo mind map về điều gì. Càng chi tiết càng tốt để có kết quả tốt hơn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn AI Model</label>
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as LLMModel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn AI Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GEMINI">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Google Gemini</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CHATGPT">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>ChatGPT</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Ví dụ: Tạo mind map cho kế hoạch chiến dịch marketing cho một ứng dụng di động mới, bao gồm phân tích đối tượng mục tiêu, các kênh marketing, phân bổ ngân sách và các chỉ số thành công..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {inputText.length} ký tự
              </p>
              <Button
                onClick={handleGenerate}
                disabled={!inputText.trim() || isGenerating}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tạo... (có thể mất 5-15s)
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tạo Mind Map
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isGenerating && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">AI đang tạo mindmap...</h3>
                  <p className="text-sm text-muted-foreground">
                    Quá trình này có thể mất 5-15 giây. Vui lòng đợi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isGenerating && (
          <Card className="max-w-4xl mx-auto border-destructive">
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" onClick={() => setError(null)}>
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Suggestions */}
        {!generatedData && !isGenerating && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Mẫu bắt đầu nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleUseSuggestion(suggestion)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <suggestion.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{suggestion.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {suggestion.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Generated Results */}
        {generatedData && !isGenerating && (
          <Card className="max-w-4xl mx-auto border-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <CardTitle>{generatedData.title}</CardTitle>
              </div>
              <CardDescription>
                AI đã tạo cấu trúc mindmap sau đây. Bạn có thể tạo mindmap ngay hoặc chỉnh sửa nội dung để có kết quả khác.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nodes Preview */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Các Node ({generatedData.nodes.length})</h4>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {generatedData.nodes.map((node, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-white"
                        style={{ backgroundColor: node.color }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words">{node.content}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {node.shape.replace('_', ' ')}
                          </Badge>
                          {node.parentNodeId !== null && (
                            <Badge variant="secondary" className="text-xs">
                              Parent: {node.parentNodeId + 1}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            ({node.positionX}, {node.positionY})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edges Preview */}
              {generatedData.edges.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Các kết nối ({generatedData.edges.length})</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {generatedData.edges.map((edge, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 rounded-lg border bg-card text-sm"
                      >
                        <Badge variant="outline">{edge.fromNodeId + 1}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline">{edge.toNodeId + 1}</Badge>
                        {edge.label && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{edge.label}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleRegenerateNew}
                >
                  Tạo mới
                </Button>
                <Button onClick={createMindMap}>
                  <Brain className="h-4 w-4 mr-2" />
                  Tạo Mind Map
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}