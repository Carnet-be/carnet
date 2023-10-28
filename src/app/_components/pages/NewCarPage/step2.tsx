/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useRef } from "react";
import { type TStep1, step1Schema, type TStep2, step2Schema } from ".";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {  type Body } from "~/server/db/schema";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import cx from "classnames";
import CSelect from "../../ui/CSelect";
const Step2 = ({
  value,
  onNext,
  data,
  onBack,
}: {
  value: TStep2;
  onNext: (values:TStep2) => void;
  onBack: () => void;
  data: any;
}) => {
  const bodies: Body[] = data?.bodies;

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
      onSubmit={handleSubmit(onNext,(err)=>{
        console.log("Step 2",err)
      })}
      className="flex max-w-[700px] flex-col gap-10 p-3 md:gap-20"
    >
      <h2 className="text-center text-xl">
        Additional informations about your car
      </h2>
      <div className="space-y-6">
        <BodySelection
          bodies={bodies}
          selectedBody={watch("body")}
          onSelect={(id) => setValue("body", id)}
        />
        <div className="flex w-full flex-row items-center justify-center gap-3">
       
          <Controller name="transmission" control={control} render={({ field:{value,onChange,onBlur} }) => (
            <CSelect type="text" label="Transmission" isInvalid={!!errors.transmission}
            error={errors.transmission?.message} value={value} onChange={onChange} onBlur={onBlur} options={["automatic", "semi-automatic", "manual"].map((t)=>({value:t,label:t}))} />
          )} />

          <Input
            label="Version"
            {...register("version")}
            isInvalid={!!errors.version}
            errorMessage={errors.version?.message}
          />
      
          <Controller name="doors" control={control} render={({ field:{value,onChange,onBlur} }) => (
            <CSelect className="w-[220px]" type="text" label="Doors" isInvalid={!!errors.transmission}
            error={errors.transmission?.message} value={value} onChange={onChange} onBlur={onBlur} options={["1", "2", "3", "4", "5", "6", "7"].map((t)=>({value:t,label:t}))} />
          )} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Mileage"
            type="number"
            {...register("mileage")}
            
            isInvalid={!!errors.mileage}
            errorMessage={errors.mileage?.message}
          />
          <Input
            label="Engine Size"
            type="number"
            {...register("cc")}
            isInvalid={!!errors.cc}
            errorMessage={errors.cc?.message}
          />
          <Input
            label="Horse Power"
            type="number"
            {...register("cv")}
            isInvalid={!!errors.cv}
            errorMessage={errors.cv?.message}
          />
          <Input
            label="CO2 Emissions"
            type="number"
            {...register("co2")}
            isInvalid={!!errors.co2}
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
  bodies: Body[];
  selectedBody?: number;
  onSelect: (id: number) => void;
}) => {
  const carousel = useRef<HTMLDivElement | null>(null);
  const next = () =>
    carousel.current?.scrollBy({ left: 300, behavior: "smooth" });
  const prev = () =>
    carousel.current?.scrollBy({ left: -300, behavior: "smooth" });
  //TODO: scroll to the element
  return (
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
                alt={b.name}
                src={`/body/${b.logo}.svg`}
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
  );
};
