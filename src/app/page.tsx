import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard/tasks');
  return null; // This won't be rendered since we're redirecting
}
