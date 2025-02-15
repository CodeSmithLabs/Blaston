import TasksManager from '@/components/TasksManager';

export default function TasksPage() {
  return (
    <section className="bg-white rounded-md shadow p-4">
      <h2 className="text-2xl font-bold mb-4">My Goals & Tasks</h2>
      <TasksManager />
    </section>
  );
}
