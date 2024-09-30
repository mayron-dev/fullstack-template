import { env } from '@/env';
import React from 'react';

const handleActiveAccount = async (key: string) => {
  const response = await fetch(`${env.SERVER_URL}/auth/active`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({key}),
  })
  return response.ok
}
const ActiveAccount = async ({ searchParams }: { searchParams: { key: string } }) => {

  const success = await handleActiveAccount(searchParams.key);

  if (!success) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Ocorreu um erro ao ativar sua conta</h1>
        <p>Tente fazer login para receber um novo link</p>      
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Conta ativa</h1>      
    </div>
  );
};

export default ActiveAccount;
