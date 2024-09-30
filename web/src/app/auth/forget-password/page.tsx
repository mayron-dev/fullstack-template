'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgetPassword, ForgetPassword } from '@/validation/forget-pasword.schema';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@/components/link';

const ForgetPasswordForm = () => {
  const { toast } = useToast()
  const form = useForm<ForgetPassword>({
    resolver: zodResolver(forgetPassword),
  });
  const { formState, handleSubmit } = form
  const onSubmit = handleSubmit(async (data: ForgetPassword) => {
    const res = await fetch('/api/auth/forget-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast({
        title: 'Email enviado',
        description: `Um email foi enviado para '${data.email}'`,
      })
    }
  });
  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Digite seu email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" loading={formState.isSubmitting} disabled={formState.isSubmitting || !formState.isValid}>
            Proximo
          </Button>
        </form>
      </Form>
      <Link href="/auth/login">Voltar ao login</Link>
    </div>
  );
};

export default ForgetPasswordForm;
