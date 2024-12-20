"use client";

import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth/";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      disabled={isPending}
      type="submit"
      className={cn(
        "font-bold w-full bg-[var(--button-bkg)] hover:bg-[var(--button-hover)] hover:border-[var(--button-hover-border)] border border-secondary text-primary"
      )}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card
      className={cn(
        "w-[350px] border-[var(--card-border)] bg-[var(--card)] shadow-md"
      )}
    >
      <CardHeader>
        <CardTitle className="text-center">Ingresa con tus datos</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="name">Nombre de Usuario</Label>
            <Input id="name" name="name" placeholder="Username" />
          </div>

          <div className="relative flex flex-col space-y-1.5 my-4">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
            />
            <button
              type="button"
              className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <SubmitButton isPending={isPending} />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        {(state?.errors || !state?.success) && (
          <p className="text-sm text-red-500 font-bold">
            Nombre o Contraseña incorrectos
          </p>
        )}
        <p className="text-sm text-gray-600">
          <Button variant="link" className="text-xs p-0 w-full" type="button">
            ¿Olvidaste tu contraseña?
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
