// Rule-based AI for task priority suggestions

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface AISuggestion {
  priority: Priority;
  reasoning: string;
  category: string;
}

const URGENT_KEYWORDS = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'today', 'now'];
const IMPORTANT_KEYWORDS = ['important', 'meeting', 'deadline', 'presentation', 'interview', 'exam'];
const WORK_KEYWORDS = ['work', 'project', 'client', 'boss', 'meeting', 'presentation', 'report'];
const PERSONAL_KEYWORDS = ['doctor', 'appointment', 'family', 'health', 'exercise', 'personal'];
const SHOPPING_KEYWORDS = ['buy', 'shop', 'purchase', 'order', 'grocery', 'shopping'];
const LEARNING_KEYWORDS = ['learn', 'study', 'course', 'read', 'tutorial', 'practice'];

export const analyzeTask = (title: string, description?: string): AISuggestion => {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // Determine priority
  let priority: Priority = 'low';
  let reasoning = '';

  const hasUrgentKeyword = URGENT_KEYWORDS.some(keyword => text.includes(keyword));
  const hasImportantKeyword = IMPORTANT_KEYWORDS.some(keyword => text.includes(keyword));

  if (hasUrgentKeyword) {
    priority = 'high';
    reasoning = 'Contains urgent keywords indicating immediate action required.';
  } else if (hasImportantKeyword) {
    priority = 'high';
    reasoning = 'Contains important keywords suggesting high priority.';
  } else if (text.length > 100) {
    priority = 'medium';
    reasoning = 'Detailed task description suggests moderate complexity and importance.';
  } else if (text.split(' ').length > 10) {
    priority = 'medium';
    reasoning = 'Task complexity indicates medium priority.';
  } else {
    priority = 'low';
    reasoning = 'Simple task that can be scheduled flexibly.';
  }

  // Determine category
  let category = 'General';
  
  if (WORK_KEYWORDS.some(keyword => text.includes(keyword))) {
    category = 'Work';
  } else if (PERSONAL_KEYWORDS.some(keyword => text.includes(keyword))) {
    category = 'Personal';
  } else if (SHOPPING_KEYWORDS.some(keyword => text.includes(keyword))) {
    category = 'Shopping';
  } else if (LEARNING_KEYWORDS.some(keyword => text.includes(keyword))) {
    category = 'Learning';
  }

  return { priority, reasoning, category };
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendTaskNotification = (task: Task) => {
  if (Notification.permission === 'granted') {
    new Notification('High Priority Task Alert', {
      body: `${task.title} - This is a high priority task that needs your attention!`,
      icon: '/favicon.ico',
      tag: task.id,
    });
  }
};
