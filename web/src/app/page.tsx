import { cookies } from "next/headers";

export default function Home() {
  const cookiesList = cookies().getAll();
  return (
    <pre>
      {
        cookiesList
          .map((cookie) => `${cookie.name}: ${cookie.value}`)
          .join("\n")
      }
    </pre>
  );
}
