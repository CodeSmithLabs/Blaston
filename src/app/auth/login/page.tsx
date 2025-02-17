// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SupabaseSignIn } from '@/lib/API/Services/supabase/auth';
import { authFormSchema, authFormValues } from '@/lib/types/validations';
import config from '@/lib/config/auth';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
    const { data, error } = await SupabaseSignIn(values.email, values.password);

    if (error) {
      reset({ email: values.email, password: '' });
      setError('email', {
        type: 'root.serverError',
        message: error.message
      });
      setError('password', { type: 'root.serverError', message: '' });
      return;
    }

    router.push(config.redirects.toDashboard);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <Card className="w-full max-w-md bg-gray-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Login to LockedIn</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...register('email')}
                        {...field}
                        className="border-gray-300"
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
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...register('password')}
                          {...field}
                          className="border-gray-300"
                        />
                        <span
                          className="absolute right-2 top-2 cursor-pointer text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Icons.EyeOffIcon /> : <Icons.EyeIcon />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-lockedin-purple text-white hover:bg-lockedin-purple-dark"
              >
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
