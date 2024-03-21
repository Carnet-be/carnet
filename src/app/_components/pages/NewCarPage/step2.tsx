/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import cx from "classnames";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";
import CSelect from "../../ui/CSelect";

type TStep2 = RouterInputs["car"]["addCar"]["step2"];

export const numSchema = z
  .number()
  .or(z.string().transform((v) => Number(v) || undefined));

const step2Schema = z.object({
  body: z.number().optional().nullable(),
  transmission: z
    .enum(["manual", "automatic", "semi-automatic"])
    .optional()
    .nullable(),
  //transform to number
  mileage: numSchema.optional().nullable(),
  doors: z.string().optional().nullable(),
  cv: numSchema.optional().nullable(),
  cc: numSchema.optional().nullable(),
  co2: numSchema.optional().nullable(),
  version: z.string().optional().nullable(),
});
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
      <h2 className="text-center text-xl">
        Additional informations about your car
      </h2>
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
                label="Transmission (Optional)"
                placeholder="What is the transmission of your car?"
                isInvalid={!!errors.transmission}
                error={errors.transmission?.message}
                value={value?.toString()}
                onChange={onChange}
                onBlur={onBlur}
                options={["automatic", "semi-automatic", "manual"].map((t) => ({
                  value: t,
                  label: t,
                }))}
              />
            )}
          />

          <Input
            label="Version (Optional)"
            placeholder="What is the version of your car?"
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
                type="text"
                label="Doors (Optional)"
                isInvalid={!!errors.transmission}
                error={errors.transmission?.message}
                value={value?.toString()}
                onChange={onChange}
                onBlur={onBlur}
                options={["1", "2", "3", "4", "5", "6", "7"].map((t) => ({
                  value: t,
                  label: t,
                }))}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Mileage (km) (Required)"
            placeholder="How many kilometers has your car driven?"
            type="number"
            {...register("mileage")}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            isInvalid={!!errors.mileage}
            errorMessage={errors.mileage?.message}
          />
          <Input
            label="Engine Size (cc)"
            type="number"
            placeholder="How many engine size has your car?"
            {...register("cc")}
            isInvalid={!!errors.cc}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.cc?.message}
          />
          <Input
            label="Horse Power (CV)"
            type="number"
            placeholder="How many horse power has your car?"
            {...register("cv")}
            isInvalid={!!errors.cv}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.cv?.message}
          />
          <Input
            label={watch("co2") ? undefined : "CO2 Emissions (g/km)"}
            type="number"
            {...register("co2")}
            placeholder="How many CO2 emissions has your car?"
            isInvalid={!!errors.co2}
            classNames={{
              input: ["placeholder:text-default-700/40"],
            }}
            errorMessage={errors.co2?.message}
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[500px] flex-row items-center justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button
          type={"submit"}
          variant="shadow"
          color="primary"
          className="px-5"
        >
          Next
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
  const carousel = useRef<HTMLDivElement | null>(null);
  const next = () =>
    (carousel.current as any)?.scrollBy({ left: 300, behavior: "smooth" });
  const prev = () =>
    (carousel.current as any)?.scrollBy({ left: -300, behavior: "smooth" });
  //TODO: scroll to the element
  return (
    <div>
      <span className="px-20">
        Select the body type of your car (Optional):
      </span>
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
                  {b.name}
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
