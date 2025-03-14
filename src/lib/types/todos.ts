export interface Task {
  id: string;
  goalId: string;
  text: string;
  isCompleted: boolean;
  lastCompleted?: string | null;
}

export interface Goal {
  id: string;
  name: string;
  tasks: Task[];
  created_at: string;
}
