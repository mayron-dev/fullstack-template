'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SigninSchema, signinSchema } from '@/validation/signin.schema';
import { Link } from '@/components/link';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

const SigninForm = () => {
  const router = useRouter();
  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });
  const { formState, handleSubmit } = form
  const onSubmit = handleSubmit(async (data: SigninSchema) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) router.push('/');
  })  
  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ou nome de usuário</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
                <Link className='block text-right' href="/auth/forget-password">Esqueci minha senha</Link>
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" loading={formState.isSubmitting} disabled={formState.isSubmitting || !formState.isValid}>
            Entrar
          </Button>
        </form>

        {/* Sign in with Google */}
          <Link href="/api/auth/oauth/google" variant="button" className='w-full'>
            <FcGoogle className='w-5 h-5 mr-2' />
            Entrar com google
          </Link>
      </Form>
    </div>
  );
};

export default SigninForm;
