import { AISuggestion } from '@/lib/taskAI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISuggestionPanelProps {
  suggestion: AISuggestion | null;
  onAccept: () => void;
  onReject: () => void;
}

const priorityColors = {
  high: 'bg-priority-high/10 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/10 text-priority-low border-priority-low/30',
};

export const AISuggestionPanel = ({ suggestion, onAccept, onReject }: AISuggestionPanelProps) => {
  if (!suggestion) {
    return null;
  }

  return (
    <Card className="border-2 border-accent/30 shadow-xl animate-scale-in bg-gradient-to-br from-card to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Sparkles className="h-5 w-5" />
          AI Analysis Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Priority:</span>
            <Badge 
              variant="outline" 
              className={cn("uppercase", priorityColors[suggestion.priority])}
            >
              {suggestion.priority}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Category:</span>
            <Badge variant="secondary">
              {suggestion.category}
            </Badge>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Reasoning: </span>
            {suggestion.reasoning}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept & Add Task
          </Button>
          <Button 
            onClick={onReject}
            variant="outline"
            className="flex-1"
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
