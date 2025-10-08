import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListTodo, LogOut, Sparkles } from 'lucide-react';
import { mockAuth } from '@/lib/mockAuth';
import { toast } from '@/hooks/use-toast';

export const Navbar = () => {
  const navigate = useNavigate();
  const user = mockAuth.getCurrentUser();

  const handleLogout = () => {
    mockAuth.logout();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate('/auth');
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Task Scheduler
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
