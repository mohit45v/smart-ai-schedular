import { Task } from '@/lib/taskAI';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: {
    color: 'bg-priority-high/10 text-priority-high border-priority-high/30',
    icon: AlertCircle,
    label: 'High Priority',
  },
  medium: {
    color: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
    icon: AlertCircle,
    label: 'Medium Priority',
  },
  low: {
    color: 'bg-priority-low/10 text-priority-low border-priority-low/30',
    icon: AlertCircle,
    label: 'Low Priority',
  },
};

export const TaskList = ({ tasks, onToggle, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">
            No tasks yet. Add your first task above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const config = priorityConfig[task.priority];
        const Icon = config.icon;

        return (
          <Card
            key={task.id}
            className={cn(
              'transition-all duration-200 hover:shadow-md animate-fade-in border-l-4',
              task.priority === 'high' && 'border-l-priority-high',
              task.priority === 'medium' && 'border-l-priority-medium',
              task.priority === 'low' && 'border-l-priority-low',
              task.completed && 'opacity-60'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggle(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className={cn(
                        'font-semibold text-lg',
                        task.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task.id)}
                      className="shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={config.color}>
                      <Icon className="mr-1 h-3 w-3" />
                      {config.label}
                    </Badge>
                    <Badge variant="secondary">
                      {task.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
