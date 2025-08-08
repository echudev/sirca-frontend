"use client";

import { z } from "zod";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import {
  RegisterFormSchema,
  RegisterFormState,
} from "@/lib/auth/form-validations";
import { useActionState, useState, useEffect, ChangeEvent } from "react";
import { register } from "@/app/actions/auth/";
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

type FieldName = "name" | "lastName" | "email" | "password" | "role";

export function RegisterForm() {
  // Uso useActionState para manejar el estado del formulario
  const [state, action, isPending] = useActionState(register, undefined);
  // isValid y localErrors solo nos sirven para habilitar/deshabilitar el botón de "ingresar"
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [localErrors, setLocalErrors] = useState<RegisterFormState>({
    errors: {
      name: [],
      lastName: [],
      email: [],
      password: [],
      role: [],
    },
  });

  const validateField = (name: FieldName, value: string) => {
    try {
      // Corregimos la validación según el campo específico
      switch (name) {
        case "name":
          RegisterFormSchema.pick({ name: true }).parse({ name: value });
          break;
        case "lastName":
          RegisterFormSchema.pick({ lastName: true }).parse({
            lastName: value,
          });
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
        const { fieldErrors } = error.flatten((issue) => issue.message) as {
          fieldErrors: Partial<Record<FieldName, string[]>>;
          formErrors: string[];
        };
        setLocalErrors((prev) => ({
          errors: {
            ...prev?.errors,
            [name]: fieldErrors[name] || [],
          },
        }));
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as FieldName, value);
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
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
    setIsValid(false);
    setLocalErrors({
      errors: {
        name: [],
        lastName: [],
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
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="Jhon"
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
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              onChange={handleInputChange}
              className={`w-full ${
                (localErrors?.errors?.lastName?.length ?? 0 > 0)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {localErrors?.errors?.lastName?.map((error) => (
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

          <div className="relative flex flex-col space-y-1.5 my-4">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              onChange={handleInputChange}
              className={`w-full ${
                (localErrors?.errors?.password?.length ?? 0 > 0)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
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
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
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
