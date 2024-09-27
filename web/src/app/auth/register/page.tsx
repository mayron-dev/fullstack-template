'use client';
import { Button } from '@/components/ui/button';

import { FcGoogle } from "react-icons/fc";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignupSchema, signupSchema } from '@/validation/signup.schema';
import { Link } from '@/components/link';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const SignupForm = () => {
  const { toast } = useToast();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });
  const { formState, handleSubmit } = form
  const onSubmit = handleSubmit(async (data: SignupSchema) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast({
        title: 'Conta criada',
        description: 'Sua conta foi criada com sucesso',
      })
    }
  })  
  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" loading={formState.isSubmitting} disabled={formState.isSubmitting || !formState.isValid}>
            Criar conta
          </Button>
        </form>

        {/* Sign in with Google */}
        <Button variant="outline" className="w-full mt-2" asChild>
          <Link href="/api/auth/oauth/google">
            <FcGoogle className='w-5 h-5 mr-2' />
            Criar conta com google
          </Link>
        </Button>
      </Form>
    </div>
  );
};

export default SignupForm;
