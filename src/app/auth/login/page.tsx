"use client"
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { infer, z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
const LoginSchema = z.object({
  email: z.string().min(1, { message: "This field is required" }),
  password: z.string().min(8, { message: "This field is required" }).refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g.test(val), { message: "Password must contain at least one uppercase letter, one lowercase letter and one number" })
})
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema)
  });
  return (
    <div className="flex flex-grow flex-col justify-center gap-2">
      <div className="h-[30px]"></div>

      <h1 className="text-3xl font-semibold  text-primary">
        Sell and buy your car with CarNet
      </h1>

      <p className="py-3 text-opacity-70">Log in to your account</p>
      <div className="h-[30px]"></div>

      <form noValidate onSubmit={handleSubmit((v) => {
        console.log('v', v)
      })} className="flex max-w-lg flex-col">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3 text-opacity-75"></div>
        </div>
        <div className="h-[10px]"></div>
        <Input
          label="Email"
          // placeholder="Enter your email"
          isRequired
          className="max-w-md"
          size="sm"
          isInvalid={errors.email ? true : false}
          errorMessage={errors.email?.message as (string | undefined)}
        />
        <div className="h-[20px]"></div>
        <Input
          label="Password"
          size="sm"
          //  labelPlacement={"outside"}
          // placeholder="Enter your email"
          isRequired
          className="max-w-md"
          isInvalid={errors.password ? true : false}
          errorMessage={errors.password?.message as (string | undefined)}
        />
        <div className="h-[30px]"></div>
        <Button
          fullWidth={false}
          type="submit"
          color="primary"
          variant="flat"
          className="w-[240px]"
        >
          Login
        </Button>
        <div className="h-[20px]"></div>
        <p>
          {"Don't have an account?"}{" "}
          <Link href="/auth/register" className="text-primary">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
