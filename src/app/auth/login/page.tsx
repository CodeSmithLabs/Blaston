// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { SupabaseSignIn } from '@/lib/API/Services/supabase/auth';
import config from '@/lib/config/auth';

// Zod schema for form validation (adjust fields as needed)
import { authFormSchema, authFormValues } from '@/lib/types/validations';

// UI components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/Form';
import { Icons } from '@/components/Icons';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // React Hook Form setup
  const form = useForm<authFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting }
  } = form;

  // On submit, call SupabaseSignIn
  const onSubmit = async (values: authFormValues) => {
    const { data, error } = await SupabaseSignIn(values.email, values.password);

    if (error) {
      // Show the error message in the form
      reset({ email: values.email, password: '' });
      setError('email', {
        type: 'root.serverError',
        message: error.message
      });
      setError('password', { type: 'root.serverError', message: '' });
      return;
    }

    // If successful, navigate to the dashboard (or any callback URL)
    router.push(config.redirects.callback);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lockedin-purple-dark">
      <Card className="w-full max-w-md bg-white shadow-md">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-2xl text-lockedin-purple-dark">Login to LockedIn</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your email and password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        className="border-gray-300"
                        {...register('email')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Your Password"
                          className="border-gray-300 pr-10"
                          {...register('password')}
                          {...field}
                        />
                        <span
                          className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <Icons.EyeOffIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Icons.EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-lockedin-purple hover:bg-lockedin-purple-light text-white"
                disabled={isSubmitting}
              >
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-lockedin-purple font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
