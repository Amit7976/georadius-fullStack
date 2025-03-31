"use server";

import { signIn } from "@/src/auth";



export async function handleSignIn() {
  await signIn("google");
}
