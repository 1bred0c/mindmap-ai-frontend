'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Sparkles, Brain, Lightbulb, TrendingUp, Users, Target } from 'lucide-react';

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

const mockGeneratedNodes = [
  { id: '1', label: 'Central Topic', color: '#3b82f6', level: 0 },
  { id: '2', label: 'Key Concept 1', color: '#10b981', level: 1 },
  { id: '3', label: 'Key Concept 2', color: '#f59e0b', level: 1 },
  { id: '4', label: 'Detail A', color: '#ef4444', level: 2 },
  { id: '5', label: 'Detail B', color: '#8b5cf6', level: 2 },
  { id: '6', label: 'Supporting Idea', color: '#06b6d4', level: 2 },
];

export default function AIPage() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNodes, setGeneratedNodes] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    // Mock AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedNodes(mockGeneratedNodes);
    setIsGenerating(false);
  };

  const handleUseSuggestion = (suggestion: any) => {
    setInputText(`Create a mind map for ${suggestion.title.toLowerCase()}: ${suggestion.description}`);
  };

  const createMindMap = () => {
    // In a real app, this would create a new mindmap with the generated nodes
    console.log('Creating mindmap with nodes:', generatedNodes);
    // Redirect to mindmap editor with the generated data
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
            Transform your ideas into structured mind maps instantly using AI.
            Just describe your topic or use one of our templates.
          </p>
        </div>

        {/* Input Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Describe Your Topic</CardTitle>
            <CardDescription>
              Tell us what you want to create a mind map about. Be as detailed as possible for better results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: Create a mind map for planning a marketing campaign for a new mobile app, including target audience analysis, marketing channels, budget allocation, and success metrics..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {inputText.length} characters
              </p>
              <Button 
                onClick={handleGenerate} 
                disabled={!inputText.trim() || isGenerating}
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Mind Map'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Quick Start Templates</h2>
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

        {/* Generated Results */}
        {generatedNodes.length > 0 && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Generated Mind Map Structure</CardTitle>
              <CardDescription>
                AI has generated the following structure for your mind map. You can create it now or modify the input for different results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {generatedNodes.map((node) => (
                  <div 
                    key={node.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border"
                    style={{ marginLeft: `${node.level * 24}px` }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className={`${node.level === 0 ? 'font-semibold text-lg' : 'text-sm'}`}>
                      {node.label}
                    </span>
                    {node.level === 0 && (
                      <Badge variant="outline">Central Node</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setGeneratedNodes([])}>
                  Generate New
                </Button>
                <Button onClick={createMindMap}>
                  <Brain className="h-4 w-4 mr-2" />
                  Create Mind Map
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}