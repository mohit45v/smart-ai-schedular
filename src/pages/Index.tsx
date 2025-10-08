import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, Zap, Bell } from 'lucide-react';
import { mockAuth } from '@/lib/mockAuth';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (mockAuth.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI Task Scheduler
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let AI help you prioritize your tasks intelligently. Get smart suggestions, 
            organize better, and never miss what matters most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Get Started
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              variant="outline"
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all animate-scale-in">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Smart algorithms analyze your tasks and suggest optimal priorities
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="p-3 rounded-lg bg-success/10 w-fit mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
              <p className="text-muted-foreground">
                Automatic categorization and priority-based color coding
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="p-3 rounded-lg bg-warning/10 w-fit mx-auto mb-4">
                <Bell className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Priority Alerts</h3>
              <p className="text-muted-foreground">
                Get notified about high-priority tasks that need attention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
