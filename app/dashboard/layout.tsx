import Sidebar from "../../components/Sidebar";

export const metadata = {
  title: "SIRCA - Inicio",
  description: "Sistema de Gestion de la Red de Calidad del Aire.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full">
      <Sidebar />
      <main className="flex w-full flex-col bg-gray-50 rounded m-3 shadow-md shadow-black/80">
        {children}
      </main>
    </div>
  );
}
