"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SignupFormSchema, FormState } from "@/lib/definitions";
import { useFormStatus } from "react-dom";
import { useActionState, useState, ChangeEvent } from "react";
import { signup } from "@/app/actions/auth";
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : "Ingresar"}
    </Button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined);
  const [localErrors, setLocalErrors] = useState<FormState>({
    errors: {
      name: [],
      email: [],
      password: [],
    },
  });

  const validateField = (name: string, value: string) => {
    try {
      // Corregimos la validación según el campo específico
      switch (name) {
        case "name":
          SignupFormSchema.pick({ name: true }).parse({ name: value });
          break;
        case "email":
          SignupFormSchema.pick({ email: true }).parse({ email: value });
          break;
        case "password":
          SignupFormSchema.pick({ password: true }).parse({ password: value });
          break;
      }

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
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              className={`w-full ${
                (localErrors?.errors?.email?.length ?? 0 > 0)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {localErrors?.errors?.email?.map((error) => (
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
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        hola soy un footer
        {state?.success && <p>Success</p>}
      </CardFooter>
    </Card>
  );
}
