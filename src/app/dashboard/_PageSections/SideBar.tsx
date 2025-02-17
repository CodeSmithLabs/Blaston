import Link from 'next/link';

export default function SideBar() {
  return (
    <aside className="bg-lockedin-purple-dark text-white w-64 min-h-screen hidden md:block">
      <div className="p-4 text-xl font-bold">LockedIn</div>
      <nav className="mt-6 flex flex-col gap-4">
        <Link href="/dashboard/tasks" className="px-4 py-2 hover:bg-lockedin-purple-light">
          Dashboard
        </Link>
        <Link href="/dashboard/tasks" className="px-4 py-2 hover:bg-lockedin-purple-light">
          My Tasks
        </Link>
      </nav>
    </aside>
  );
}
