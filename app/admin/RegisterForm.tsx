"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { RegisterFormSchema, RegisterFormState } from "@/lib/definitions";
import { useActionState, useState, useEffect, ChangeEvent } from "react";
import { register } from "@/app/actions/auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmitButton({
  isPending,
  isValid,
}: {
  isPending: boolean;
  isValid: boolean;
}) {
  return (
    <Button disabled={isPending || !isValid} type="submit" className="w-full">
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registrar"}
    </Button>
  );
}

export function RegisterForm() {
  // Uso useActionState para manejar el estado del formulario
  const [state, action, isPending] = useActionState(register, undefined);
  // isValid y localErrors solo nos sirven para habilitar/deshabilitar el botón de "ingresar"
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [localErrors, setLocalErrors] = useState<RegisterFormState>({
    errors: {
      name: [],
      email: [],
      password: [],
      role: [],
    },
  });

  const validateField = (name: string, value: string) => {
    try {
      // Corregimos la validación según el campo específico
      switch (name) {
        case "name":
          RegisterFormSchema.pick({ name: true }).parse({ name: value });
          break;
        case "email":
          RegisterFormSchema.pick({ email: true }).parse({ email: value });
          break;
        case "password":
          RegisterFormSchema.pick({ password: true }).parse({
            password: value,
          });
          break;
        case "role":
          RegisterFormSchema.pick({ role: true }).parse({ role: value });
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
      RegisterFormSchema.safeParse({
        ...formData,
        [name]: value,
      }).success
    );
  };

  const handleSelectChange = (value: string) => {
    validateField("role", value);
    setIsValid(
      RegisterFormSchema.safeParse({
        ...formData,
        role: value,
      }).success
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setIsValid(false);
    setLocalErrors({
      errors: {
        name: [],
        email: [],
        password: [],
        role: [],
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
      <CardHeader className="text-center">
        <CardTitle>ADMIN</CardTitle>
        <CardDescription>Registra un nuevo usuario</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="name">Nombre de Usuario</Label>
            <Input
              id="name"
              name="name"
              placeholder="username1234"
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
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              placeholder="correo@ejemplo.com"
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
              placeholder="********"
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

          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="role">Permisos de acceso</Label>
            <Select
              name="role"
              defaultValue={formData.role}
              onValueChange={(value) => handleSelectChange(value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="USER">Usuario</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {localErrors?.errors?.role?.map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>

          <SubmitButton isPending={isPending} isValid={isValid} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {state?.success && <p>Bienvenido! {state.data?.name}</p>}
        {!state?.success && (
          <p className="text-sm text-red-500">{state?.message}</p>
        )}
      </CardFooter>
    </Card>
  );
}
