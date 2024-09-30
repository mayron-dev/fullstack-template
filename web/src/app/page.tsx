import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// selecao
export default function Select() {
  // verificar se existe o cookie com codigo da organizacao
  // se existir, redirecionar para o dashboard da organizacao
  const organizationCookie = cookies().get("organization-code");
  if (organizationCookie) {
    redirect("/app")
  }
  // pega as organizacoes do usuario e as lista
  return (
    <div></div>
  );
}
