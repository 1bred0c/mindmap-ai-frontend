'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Sparkles, Brain, Lightbulb, TrendingUp, Users, Target, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/language-context';

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

export default function AIPage() {
  const { t } = useLanguage()
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<LLMModel>('GEMINI');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateMindmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [canGenerate, setCanGenerate] = useState(false); // 🟢 có thể bấm nút tạo hay không
  const [trialCount, setTrialCount] = useState(0);       // 🟢 số trial còn lại
  
  const aiSuggestions = [
    {
      id: '1',
      title: t('ai.suggestions.projectPlanning.title'),
      description: t('ai.suggestions.projectPlanning.description'),
      icon: Target,
      category: 'Business',
    },
    {
      id: '2',
      title: t('ai.suggestions.learningPath.title'),
      description: t('ai.suggestions.learningPath.description'),
      icon: Lightbulb,
      category: 'Education',
    },
    {
      id: '3',
      title: t('ai.suggestions.marketingStrategy.title'),
      description: t('ai.suggestions.marketingStrategy.description'),
      icon: TrendingUp,
      category: 'Marketing',
    },
    {
      id: '4',
      title: t('ai.suggestions.teamStructure.title'),
      description: t('ai.suggestions.teamStructure.description'),
      icon: Users,
      category: 'Management',
    },
  ];


  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        const userId = parsedUser?.userId;
        if (!userId) return;

        const today = new Date().toISOString().split('T')[0];

        // 🔹 1️⃣ Kiểm tra Premium còn hạn
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('userid', userId)
          .gte('enddate', today)
          .maybeSingle();

        if (subError) throw subError;

        if (subData) {
          // User đang có Premium còn hạn
          setCanGenerate(true);
          return;
        }

        // 🔹 2️⃣ Kiểm tra trial trong users
        const { data: userRow, error: userError } = await supabase
          .from('users')
          .select('trial')
          .eq('userid', userId)
          .maybeSingle();

        if (userError) throw userError;

        if (userRow && userRow.trial > 0) {
          setTrialCount(userRow.trial);
          setCanGenerate(true);
        } else {
          setCanGenerate(false);
        }
      } catch (err) {
        console.error('Error checking subscription/trial:', err);
        setCanGenerate(false);
      }
    };

    checkUserAccess();
  }, []);


  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: t('ai.error'),
        description: t('ai.errorDescription'),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedData(null);
    // 🟢 Giảm trial nếu không có Premium
    if (!canGenerate && trialCount > 0) {
      const userData = localStorage.getItem('user');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const userId = parsedUser?.userId;

      if (userId) {
        const newTrial = trialCount - 1;
        await supabase.from('users').update({ trial: newTrial }).eq('userid', userId);
        setTrialCount(newTrial);
      }
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const userData = localStorage.getItem('user');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const userId = parsedUser?.userId ?? 1;
      const response = await fetch(`${API_BASE_URL}/ai/generate-mindmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add X-User-Id if available from auth context
          'X-User-Id': userId,
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
        title: t('ai.success'),
        description: t('ai.successDescription'),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo mindmap';
      setError(errorMessage);
      toast({
        title: t('ai.error'),
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
      title: t('ai.redirecting'),
      description: t('ai.redirectDescription'),
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
          <h1 className="text-3xl font-bold">{t('ai.title')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('ai.description')}
          </p>
        </div>

        {/* Input Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t('ai.inputTitle')}</CardTitle>
            <CardDescription>
              {t('ai.inputDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('ai.selectModel')}</label>
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as LLMModel)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('ai.selectModel')} />
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
              placeholder={t('ai.placeholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex flex-col gap-2 justify-end items-end">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-muted-foreground">
                  {inputText.length} {t('ai.characters')}
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={!inputText.trim() || isGenerating || !canGenerate} // 🟢 ADD
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('ai.generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('ai.generate')}
                    </>
                  )}
                </Button>
              </div>

              {/* 🟢 ADD: Thông báo lượt dùng thử */}
              {!canGenerate && trialCount === 0 && (
                <p className="text-sm text-destructive text-right">
                  {t('ai.noTrialsLeft')}
                </p>
              )}
              {trialCount > 0 && (
                <p className="text-sm text-muted-foreground text-right">
                  {t('ai.trialsRemaining')} {trialCount}
                </p>
              )}
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
                  <h3 className="text-lg font-semibold">{t('ai.generatingTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('ai.generatingDescription')}
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
                  <h3 className="text-lg font-semibold">{t('ai.errorTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" onClick={() => setError(null)}>
                  {t('ai.tryAgain')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Suggestions */}
        {!generatedData && !isGenerating && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">{t('ai.quickStart')}</h2>
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
                {t('ai.resultDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nodes Preview */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t('ai.nodes')} ({generatedData.nodes.length})</h4>
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
                  <h4 className="font-semibold text-sm">{t('ai.connections')} ({generatedData.edges.length})</h4>
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
                  {t('ai.createNew')}
                </Button>
                <Button onClick={createMindMap}>
                  <Brain className="h-4 w-4 mr-2" />
                  {t('ai.createMindMap')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}