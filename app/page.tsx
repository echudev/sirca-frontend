import { SignupForm } from "@/components/SignupForm";

export default async function WelcomePage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">SIRCA</h1>
        <p className="text-sm text-gray-500">
          Sistema Integral de la Red de Calidad del Aire
        </p>
      </div>
      <p>Inicia sesión</p>
      <SignupForm />
    </main>
  );
}
