"use client";
import { SignIn, useUser } from "@clerk/nextjs";
 
export default function Example() {
  const { isLoaded, isSignedIn, user } = useUser();

 
  return <SignIn/>
}