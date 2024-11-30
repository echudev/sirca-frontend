"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
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
      Sign Up
    </Button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined);

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
            <Input id="name" name="name" placeholder="Name" />
          </div>
          {state?.errors?.name && <p>{state.errors.name}</p>}
          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Email" />
          </div>
          {state?.errors?.email && <p>{state.errors.email}</p>}
          <div className="flex flex-col space-y-1.5 my-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
