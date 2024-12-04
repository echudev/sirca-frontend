import Sidebar from "./Sidebar";
import { verifySession } from "@/lib/session";
import { CookieDTO } from "@/domain/user/dto";

export const metadata = {
  title: "SIRCA - Inicio",
  description: "Sistema de Gestion de la Red de Calidad del Aire.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie: CookieDTO = await verifySession();
  const userName = cookie.data.userName;

  return (
    <div className="flex flex-row h-full">
      <Sidebar userName={userName} />
      <main className="flex w-full flex-col bg-gray-50 rounded m-3 shadow-md shadow-black/80">
        {children}
      </main>
    </div>
  );
}
