"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

const ContactProfileSeciton = ({ id }: { id: string }) => {
  const { data, isLoading } = api.profile.getProfile.useQuery(id);

  if (isLoading || !data) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <FormContact data={data} id={id} />;
};

export default ContactProfileSeciton;

const FormContact = ({
  data,
  id,
}: {
  data: RouterOutputs["profile"]["getProfile"];
  id: string;
}) => {
  const { mutate, isLoading: isUpdating } = api.profile.update.useMutation();

  const contactSchema = z.object({
    email: z.string().optional().nullable(),
    email2: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    phone2: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  });

  console.log({ data });
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      email: data?.email,
      email2: data?.email2,
      phone: data?.phone,
      phone2: data?.phone2,
      address: data?.address,
    },
    resolver: zodResolver(contactSchema),
  });
  return (
    <div>
      <h1>Contact</h1>
      <span>
        Contact information is important for users to reach out to you.
      </span>

      <form
        className="mt-5 flex max-w-[400px] flex-col gap-3"
        onSubmit={handleSubmit(
          (v) => {
            mutate({
              ...v,
              id,
            });
          },
          (err) => {
            console.log(err);
          },
        )}
      >
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              labelPlacement="outside"
              label="Primary Email"
              placeholder="Enter your primary email"
              value={field.value ?? ""}
              onChange={field.onChange}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="email2"
          render={({ field }) => (
            <Input
              labelPlacement="outside"
              label="Secondary Email"
              placeholder="Enter your secondary email"
              value={field.value ?? ""}
              onChange={field.onChange}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              labelPlacement="outside"
              label="Primary Phone"
              placeholder="Enter your primary phone number"
              value={field.value ?? ""}
              onChange={field.onChange}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="phone2"
          render={({ field }) => (
            <Input
              labelPlacement="outside"
              label="Secondary Phone"
              placeholder="Enter your secondary phone number"
              value={field.value ?? ""}
              onChange={field.onChange}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            // <div id="textarea-wrapper">
            <Textarea
              labelPlacement="outside"
              //  minRows={4}
              label="Address"
              value={field.value ?? ""}
              onChange={field.onChange}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
              placeholder="Enter your address"
            />
            // </div>
          )}
        />

        <Button
          type="submit"
          isLoading={isUpdating}
          color="primary"
          className="mt-3 w-[200px]"
        >
          Save
        </Button>
      </form>
    </div>
  );
};
