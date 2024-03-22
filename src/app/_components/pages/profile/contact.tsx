import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const ContactProfileSeciton = ({ id }: { id: string }) => {
  const { data, isLoading } = api.profile.getProfile.useQuery(id);

  const { mutate, isLoading: isUpdating } = api.profile.update.useMutation();

  const contactSchema = z.object({
    email: z.string().optional().nullable(),
    email2: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    phone2: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  useEffect(
    () => {
      if (data) {
        reset({
          email: data.email ?? "",
          email2: data.email2 ?? "",
          phone: data.phone ?? "",
          phone2: data.phone2 ?? "",
          address: data.address ?? "",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
        <Input
          labelPlacement="outside"
          label="Primary Email"
          placeholder="Enter your primary email"
          {...register("email")}
          classNames={{
            input: ["placeholder:text-default-700/40"],
          }}
        />
        <Input
          labelPlacement="outside"
          label="Secondary Email"
          placeholder="Enter your secondary email"
          {...register("email2")}
          classNames={{
            input: ["placeholder:text-default-700/40"],
          }}
        />

        <Input
          labelPlacement="outside"
          label="Primary Phone"
          placeholder="Enter your primary phone number"
          {...register("phone")}
          classNames={{
            input: ["placeholder:text-default-700/40"],
          }}
        />

        <Input
          labelPlacement="outside"
          label="Secondary Phone"
          placeholder="Enter your secondary phone number"
          {...register("phone2")}
          classNames={{
            input: ["placeholder:text-default-700/40"],
          }}
        />

        <div id="textarea-wrapper">
          <Textarea
            labelPlacement="outside"
            minRows={6}
            label="Address"
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            placeholder="Enter your address"
            {...register("address")}
          />
        </div>

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

export default ContactProfileSeciton;
