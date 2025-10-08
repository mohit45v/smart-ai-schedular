// Mock authentication system using localStorage

export interface User {
  id: string;
  email: string;
  name: string;
}

const USERS_KEY = 'task_scheduler_users';
const CURRENT_USER_KEY = 'task_scheduler_current_user';

export const mockAuth = {
  signup: (email: string, password: string, name: string): { success: boolean; error?: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true };
  },

  login: (email: string, password: string): { success: boolean; user?: User; error?: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },
};
