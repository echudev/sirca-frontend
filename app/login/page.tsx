import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoginForm } from "@/components/login-form";
import { cn } from "@/lib/utils";
import balogo from "@/public/BA-primary.png";

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
