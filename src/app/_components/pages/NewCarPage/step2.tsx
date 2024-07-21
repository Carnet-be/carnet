/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";

import cx from "classnames";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import { z } from "zod";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";
import CSelect from "../../ui/CSelect";
type TStep2 = RouterInputs["car"]["addCar"]["step2"];

export const numSchema = z
  .number()
  .or(z.string().transform((v) => Number(v) || undefined));

const Step2 = ({
  value,
  onNext,
  data,
  onBack,
}: {
  value: TStep2;
  onNext: (values: TStep2) => void;
  onBack: () => void;
  data: RouterOutputs["public"]["carData"];
}) => {
  const bodies = data?.bodies;
  const c = useTranslations("common");
  const e = useTranslations("error");
  const t = useTranslations("car.step2");
  const step2Schema = z.object({
    body: z.number({ description: e("body") }),
    transmission: z.enum(["manual", "automatic", "semi-automatic"]),
    //transform to number
    mileage: z
      .number({ description: e("mileage") })
      .or(z.string().transform((v) => Number(v) || undefined)),
    doors: numSchema.optional(),
    cv: numSchema.optional(),
    cc: z
      .number({ description: e("engine size") })
      .or(z.string().transform((v) => Number(v) || undefined)),
    co2: numSchema.optional(),
    version: z.string().optional(),
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: value,
    resolver: zodResolver(step2Schema),
  });

  console.log(value);
  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext, (err) => {
        console.log("Step 2", err);
      })}
      className="flex max-w-[700px] flex-col gap-10 p-3 md:gap-20"
    >
      <h2 className="text-center text-xl">{t("title")}</h2>
      <div className="space-y-6">
        <BodySelection
          bodies={bodies}
          selectedBody={watch("body") ?? undefined}
          onSelect={(id) => setValue("body", id)}
        />
        <div className="flex w-full flex-row items-center justify-center gap-3">
          <Controller
            name="transmission"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                type="text"
                label={t("placeholderTransmission")}
                isInvalid={!!errors.transmission}
                error={errors.transmission?.message}
                value={value?.toString()}
                onChange={onChange}
                onBlur={onBlur}
                options={["automatic", "semi-automatic", "manual"].map((t) => ({
                  value: t.toLowerCase(),
                  label: c(t),
                }))}
              />
            )}
          />

          <Input
            label={t("version")}
            placeholder={t("placeholderVersion")}
            {...register("version")}
            isInvalid={!!errors.version}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.version?.message}
          />

          <Controller
            name="doors"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                className="w-[450px] placeholder:opacity-50"
                type="number"
                label={t("placeholderDoors")}
                isInvalid={!!errors.doors}
                error={errors.doors?.message}
                value={value?.toString()}
                onChange={onChange}
                onBlur={onBlur}
                options={[1, 2, 3, 4, 5, 6, 7].map((t) => ({
                  value: t.toString(),
                  label: t.toString(),
                }))}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t("mileageLabel")}
            placeholder={t("mileagePlaceholder")}
            type="number"
            defaultValue={value.mileage?.toString() ?? undefined}
            {...register("mileage")}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            isInvalid={!!errors.mileage}
            errorMessage={errors.mileage?.message}
          />
          <Input
            label={t("engineSizeLabel")}
            type="number"
            placeholder={t("engineSizePlaceholder")}
            defaultValue={value.cc?.toString() ?? undefined}
            {...register("cc")}
            isInvalid={!!errors.cc}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.cc?.message}
          />
          <Input
            label={t("horsePowerLabel")}
            type="number"
            defaultValue={value.cv?.toString() ?? undefined}
            placeholder={t("horsePowerPlaceholder")}
            {...register("cv")}
            isInvalid={!!errors.cv}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.cv?.message}
          />
          <Input
            label={t("co2Label")}
            type="number"
            defaultValue={value.co2?.toString() ?? undefined}
            {...register("co2")}
            placeholder={t("co2Placeholder")}
            isInvalid={!!errors.co2}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.co2?.message}
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[500px] flex-row items-center justify-between">
        <Button onClick={onBack}>{c("back")}</Button>
        <Button
          type={"submit"}
          variant="shadow"
          color="primary"
          className="px-5"
        >
          {c("next")}
        </Button>
      </div>
    </motion.form>
  );
};

export default Step2;

const BodySelection = ({
  bodies,
  selectedBody,
  onSelect,
}: {
  bodies: RouterOutputs["public"]["carData"]["bodies"];
  selectedBody?: number;
  onSelect: (id: number) => void;
}) => {
  // const t = useTranslations("car.step2");
  // const bT = useTranslations("bodyCar");
  const carousel = useRef<HTMLDivElement | null>(null);
  const next = () =>
    (carousel.current as any)?.scrollBy({ left: 300, behavior: "smooth" });
  const prev = () =>
    (carousel.current as any)?.scrollBy({ left: -300, behavior: "smooth" });

  const t = useTranslations("car.step2");
  const tt = useTranslations("bodyCar");
  //TODO: scroll to the element
  return (
    <div>
      <span className="px-20">{t("placeholderBody")}</span>
      <div className="h-3"></div>
      <div className="flex flex-row items-center gap-2">
        <Button variant={"light"} isIconOnly onClick={prev}>
          <ChevronLeft />
        </Button>
        <ScrollShadow
          orientation="horizontal"
          ref={carousel}
          className="flex flex-grow flex-row gap-3 overflow-hidden"
        >
          {bodies.map((b) => {
            const isSelected = selectedBody == b.id;
            return (
              <div
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={cx(
                  "flex min-w-[140px] cursor-pointer flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-300",
                  isSelected
                    ? "border-2 border-primary text-primary shadow-2xl"
                    : "",
                )}
              >
                <Image
                  alt={b.name ?? ""}
                  src={b.logo ?? `/body/${b.name}.svg`}
                  width={100}
                  height={70}
                  className="w-[100px]"
                />
                <span className="whitespace-nowrap text-sm  text-opacity-70">
                  {tt(b.name)}
                </span>
              </div>
            );
          })}
        </ScrollShadow>
        <Button variant={"light"} isIconOnly onClick={next}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
