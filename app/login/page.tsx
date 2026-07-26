import { LoginForm } from "@/app/login/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import balogo from "@/public/BA-primary.png";

// El CSP de proxy.ts usa un nonce por request. Prerenderizada, esta página se
// serviría con su HTML congelado en build y sus scripts inline sin nonce, así que
// el navegador los bloquearía todos y el formulario quedaría inerte. Renderizando
// por request, Next les inyecta el nonce del CSP. Es la única ruta estática con
// interactividad: "/" siempre redirige desde el proxy antes de servirse.
export const dynamic = "force-dynamic";

export default function WelcomePage() {
  return (
    <main className="flex flex-1 h-screen w-full flex-col items-center p-4 md:p-6 bg-primary">
      <div className="flex items-center mb-8">
        <Avatar className="h-11 w-11 rounded-sm">
          <AvatarImage
            src={balogo.src}
            alt="logo"
            className={cn("bg-accent")}
          />
          <AvatarFallback>BA</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ml-3 text-primary-foreground">
          <span className="font-medium">APrA</span>
          <span className="text-sm">Red de Calidad del Aire</span>
        </div>
      </div>
      <LoginForm />
    </main>
  );
}
