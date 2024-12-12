import { LoginForm } from "../components/login-form";

export default function WelcomePage() {
  return (
    <main className="flex flex-1 flex-col items-center p-4 md:p-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">SIRCA</h1>
        <p className="text-sm text-gray-500">
          Sistema Integrado de la Red de Calidad del Aire
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
