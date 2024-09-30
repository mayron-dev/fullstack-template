'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResetPassword, resetPassword } from '@/validation/reset-password.schema';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation'; 
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Link } from '@/components/link';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const form = useForm<ResetPassword>({
    resolver: zodResolver(resetPassword),
  });
  const { formState, handleSubmit } = form
  const onSubmit = handleSubmit(async (data: ResetPassword) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password: data.password
      }),
    });

    if (res.ok) {
      toast({
        title: 'Alterar senha',
        description: `Senha alterada com sucesso`,
        action: <GoToLoginButton />
      })
    }
  });
  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} type='password'/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <Input {...field} type='password'/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" loading={formState.isSubmitting} disabled={formState.isSubmitting || !formState.isValid}>
            Trocar senha
          </Button>
        </form>
      </Form>
    </div>
  );
};

const GoToLoginButton = () => {
  return (
    <ToastAction asChild altText="Ir para login">
      <Link href="/auth/login" variant="button">
        Ir para login
      </Link>
    </ToastAction>
  )
}
export default ResetPasswordForm;
