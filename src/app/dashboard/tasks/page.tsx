import TasksManager from '@/components/TasksManager';

export default function TasksPage() {
  return (
    <section className="rounded-md shadow p-4 bg-card text-card-foreground">
      <h2 className="text-2xl font-bold mb-4">My Goals & Tasks</h2>
      <TasksManager />
    </section>
  );
}
