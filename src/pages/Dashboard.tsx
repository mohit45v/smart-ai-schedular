import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { AISuggestionPanel } from '@/components/AISuggestionPanel';
import { mockAuth } from '@/lib/mockAuth';
import { Task, AISuggestion, requestNotificationPermission, sendTaskNotification } from '@/lib/taskAI';
import { toast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TASKS_KEY = 'task_scheduler_tasks';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<AISuggestion | null>(null);
  const [pendingTask, setPendingTask] = useState<Omit<Task, 'id' | 'createdAt' | 'completed' | 'priority' | 'category'> | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const user = mockAuth.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load tasks from localStorage
    const savedTasks = localStorage.getItem(`${TASKS_KEY}_${user.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Check notification permission
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, [navigate]);

  const saveTasks = (newTasks: Task[]) => {
    const user = mockAuth.getCurrentUser();
    if (user) {
      localStorage.setItem(`${TASKS_KEY}_${user.id}`, JSON.stringify(newTasks));
    }
  };

  const handleAnalyze = (task: Omit<Task, "id" | "createdAt" | "completed">, suggestion: AISuggestion) => {
    setCurrentSuggestion(suggestion);
    setPendingTask(task);
  };

  const handleTaskSubmit = (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'priority' | 'category'>) => {
    setPendingTask(task);
  };

  const handleAcceptSuggestion = () => {
    if (!currentSuggestion || !pendingTask) return;

    const newTask: Task = {
      ...pendingTask,
      id: crypto.randomUUID(),
      priority: currentSuggestion.priority,
      category: currentSuggestion.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    // Send notification for high priority tasks
    if (newTask.priority === 'high' && notificationsEnabled) {
      sendTaskNotification(newTask);
    }

    toast({
      title: "Task added successfully!",
      description: `Priority: ${currentSuggestion.priority.toUpperCase()} | Category: ${currentSuggestion.category}`,
    });

    setCurrentSuggestion(null);
    setPendingTask(null);
  };

  const handleRejectSuggestion = () => {
    setCurrentSuggestion(null);
    setPendingTask(null);
    toast({
      title: "Suggestion rejected",
      description: "Try analyzing again or add the task manually.",
    });
  };

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      toast({
        title: "Notifications enabled!",
        description: "You'll receive alerts for high priority tasks.",
      });
    } else {
      toast({
        title: "Notifications blocked",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Task Dashboard
          </h1>
          <p className="text-muted-foreground">
            Organize your tasks with AI-powered priority suggestions
          </p>
          
          {!notificationsEnabled && (
            <Button
              onClick={handleEnableNotifications}
              variant="outline"
              className="mt-4 gap-2"
            >
              <Bell className="h-4 w-4" />
              Enable Notifications for High Priority Tasks
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <TaskForm
              onSubmit={handleTaskSubmit}
              onAnalyze={(suggestion, task) => {
                handleAnalyze(task, suggestion);
              }}
            />
            
            <AISuggestionPanel
              suggestion={currentSuggestion}
              onAccept={handleAcceptSuggestion}
              onReject={handleRejectSuggestion}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                Active Tasks
                <span className="text-sm font-normal text-muted-foreground">
                  ({activeTasks.length})
                </span>
              </h2>
              <TaskList
                tasks={activeTasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            </div>

            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  Completed
                  <span className="text-sm font-normal text-muted-foreground">
                    ({completedTasks.length})
                  </span>
                </h2>
                <TaskList
                  tasks={completedTasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
