"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import { useTranslations } from "next-intl";
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
  const c = useTranslations("common");
  const e = useTranslations("error");
  const t = useTranslations("dashboard.text");
  const contactSchema = z.object({
    email: z.string({ description: e("email") }),
    email2: z.string().optional().nullable(),
    phone: z.string({ description: e("phone") }),
    phone2: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  });

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
      <h1>{t("contact title")}</h1>
      <span>{t("description")}</span>

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
              label={t("primary email")}
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
              label={t("secondary email")}
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
              label={t("primary phone")}
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
              label={t("secondary phone")}
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
              label={t("address")}
              value={field.value ?? ""}
              onChange={field.onChange}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
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
          {c("save")}
        </Button>
      </form>
    </div>
  );
};
