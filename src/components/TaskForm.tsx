import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { analyzeTask, type Task, type AISuggestion } from '@/lib/taskAI';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onAnalyze: (suggestion: AISuggestion, task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const TaskForm = ({ onSubmit, onAnalyze }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!title.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestion = analyzeTask(title, description);
      onAnalyze(suggestion, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority: 'medium', // or default priority
        category: '', // or default category
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const handleSubmit = (priority: 'high' | 'medium' | 'low', category: string) => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
    });

    setTitle('');
    setDescription('');
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base"
          />
        </div>
        <div>
          <Textarea
            placeholder="Task description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!title.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
        </Button>
      </CardContent>
    </Card>
  );
};
