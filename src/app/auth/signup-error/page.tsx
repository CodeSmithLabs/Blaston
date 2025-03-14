//app/auth/signup-error/page.tsx
import Link from 'next/link';

export default function SignupErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Signup Issue</h1>
        <p className="mb-6 text-gray-600">
          Something went wrong during your signup process. Try confirming your email again or
          contact support.
        </p>

        <Link
          href="/auth/confirm"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors block text-center"
        >
          Retry Email Confirmation
        </Link>

        <div className="mt-4">
          <p className="text-gray-600">Need help?</p>
          <a
            href="https://wa.me/2349074577147"
            target="_blank"
            className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Contact Developer on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
