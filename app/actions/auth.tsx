import { SignupFormSchema, FormState } from "@/lib/definitions";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    //wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
    };
  }

  //return {
  //   success: true,
  // };
  // Call the provider or db to create a user...
}
