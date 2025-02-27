'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { authFormSchema, authFormValues } from '@/lib/types/validations';
import config from '@/lib/config/auth';

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

  const onSubmit = async (values: authFormValues) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Login failed');
        reset({ email: values.email, password: '' });
        setError('email', { type: 'root.serverError', message: data.error });
        setError('password', { type: 'root.serverError', message: '' });
        return;
      }

      // Success
      toast.success('Login successful!');
      router.push(config.redirects.toDashboard);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className="md:w-96">
        <Card className="bg-background-light dark:bg-background-dark">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login to LockedIn</CardTitle>
            <CardDescription>Enter your email and password below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="bg-background-light dark:bg-background-dark"
                          {...field}
                          {...register('email')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
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
                            placeholder="Password"
                            className="bg-background-light dark:bg-background-dark"
                            {...field}
                            {...register('password')}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer">
                            {showPassword ? (
                              <Icons.EyeOffIcon
                                className="h-6 w-6"
                                onClick={togglePasswordVisibility}
                              />
                            ) : (
                              <Icons.EyeIcon
                                className="h-6 w-6"
                                onClick={togglePasswordVisibility}
                              />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  <Icons.Lock className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col">
              <div className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="leading-7 text-indigo-600 hover:text-indigo-500"
                >
                  Sign up here.
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
