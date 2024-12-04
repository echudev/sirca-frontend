"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { LoginFormState, LoginFormSchema } from "@/lib/definitions";
import { useActionState, useState, ChangeEvent, useEffect } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function SubmitButton({
  isPending,
  isValid,
}: {
  isPending: boolean;
  isValid: boolean;
}) {
  return (
    <Button disabled={isPending || !isValid} type="submit" className="w-full">
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
    </Button>
  );
}

export function LoginForm() {
  // Uso useActionState para manejar el estado del formulario
  const [state, action, isPending] = useActionState(login, undefined);
  // isValid y localErrors solo nos sirven para habilitar/deshabilitar el botón de "ingresar"
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [localErrors, setLocalErrors] = useState<LoginFormState>({
    errors: {
      name: [],
      password: [],
    },
  });

  const validateField = (name: string, value: string) => {
    try {
      // Corregimos la validación según el campo específico
      switch (name) {
        case "name":
          LoginFormSchema.pick({ name: true }).parse({ name: value });
          break;
        case "password":
          LoginFormSchema.pick({ password: true }).parse({ password: value });
          break;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));

      setLocalErrors((prev) => ({
        errors: {
          ...prev?.errors,
          [name]: [],
        },
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setLocalErrors((prev) => ({
          errors: {
            ...prev?.errors,
            [name]: error.flatten().fieldErrors[name] || [],
          },
        }));
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    setIsValid(
      LoginFormSchema.safeParse({
        ...formData,
        [name]: value,
      }).success
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      password: "",
    });
    setIsValid(false);
    setLocalErrors({
      errors: {
        name: [],
        password: [],
      },
    });
  };

  // Resetea el formulario cuando se envía la acción
  // los valores de los input los resetea el useActionState.
  useEffect(() => {
    if (state && !state.success) {
      resetForm();
    }
  }, [state]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Bienvenido</CardTitle>
        <CardDescription>Ingresa con tus datos</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Name"
              onChange={handleInputChange}
              className={`w-full ${
                (localErrors?.errors?.name?.length ?? 0 > 0)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {localErrors?.errors?.name?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={handleInputChange}
              className={`w-full ${
                (localErrors?.errors?.password?.length ?? 0 > 0)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {localErrors?.errors?.password?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          <SubmitButton isPending={isPending} isValid={isValid} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!state?.success && (
          <p className="text-sm text-red-500">{state?.message}</p>
        )}
      </CardFooter>
    </Card>
  );
}
