import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import balogo from "@/public/BA-primary.png";

export default function WelcomePage() {
  return (
    <main className="flex flex-1 flex-col h-screen items-center p-4 md:p-6 bg-primary">
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
    </main>
  );
}
