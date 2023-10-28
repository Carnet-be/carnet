/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef } from "react";
import { type TStep1, step1Schema } from ".";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ScrollShadow, Select, SelectItem } from "@nextui-org/react";
import { type Model, type Brand, type Color } from "~/server/db/schema";
import { YEARS } from "~/utils/constants";
import { motion } from "framer-motion";
import CSelect from "../../ui/CSelect";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import cx from "classnames";
import { invertColor } from "~/utils/function";
const Step1 = ({
  value: defaultValues,
  onNext,
  data,
}: {
  value: TStep1;
  onNext: (values: TStep1) => void;
  data: any;
}) => {
  const brands: Brand[] = data?.brands;
  const models: Model[] = data?.models;
  const colors:Color[]= data?.colors
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(step1Schema)
  });

  console.log('models', models)
  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext, (err) => {
        console.log('err', err)
      })}
      className="flex  w-full max-w-[700px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">
        Start by giving us some information about your car
      </h2>
      <div className="space-y-4">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller  name="brand" control={control} render={({ field: { value, onChange, onBlur } }) => (
          <CSelect error={errors.brand?.message} isInvalid={!!errors.brand} label="Brand" onChange={onChange} onBlur={onBlur} value={value} options={brands.map((b) => ({
            label: b.name,
            value: b.id.toString()
          }))} />
          )} />

        <Controller name="model" control={control} render={({ field: { value, onChange, onBlur } }) => (
          <CSelect isDisabled={!watch("brand")} error={errors.model?.message} isInvalid={!!errors.model} label="Model" onChange={onChange} onBlur={onBlur} value={value} options={models
            .filter((m) => m.brandId.toString() == watch("brand")?.toString()).map((b) => ({
              label: b.name,
              value: b.id.toString()
            }))} />
            )} />
    
        
      </div>
      <div className="flex flex-row items-center gap-4">
      <Controller name="year" control={control} render={({ field: { value, onChange, onBlur } }) => (
          <CSelect label="Year" onChange={onChange} onBlur={onBlur} value={value} options={YEARS.map((b) => ({
              label: b.toString(),
              value: b.toString()
            }))} />
        )} />
     <Controller  name="state" control={control} render={({ field: { value, onChange, onBlur } }) => (
          <CSelect type="text" className="w-[280px]" label="State" onChange={onChange} onBlur={onBlur} value={value} options={["new","used"].map((b) => ({
              label: b.toString(),
              value: b.toString()
            }))} />
        )} />
  
     <Controller name="fuel" control={control} render={({ field: { value, onChange, onBlur } }) => (
          <CSelect label="Fuel" onChange={onChange} onBlur={onBlur} value={value} options={["gasoline", "diesel", "electricity", "hybrid"].map((b) => ({
              label: b.toString(),
              value: b.toString()
            }))} />
        )} />
      </div>
      <ColorSelection
          bodies={colors}
          selectedBody={watch("color")}
          onSelect={(id) => setValue("color", id)}
        />
            </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex-grow"></div>
        <Button

          type="submit"
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

export default Step1;


const ColorSelection = ({
  bodies,
  selectedBody,
  onSelect,
}: {
  bodies: Color[];
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
        className="flex flex-grow flex-row gap-6 overflow-x-hidden"
      >
        {bodies.map((b) => {
          const isSelected = selectedBody == b.id;
          return (
            <div
              key={b.id}
              onClick={() => onSelect(b.id)}
              style={{
                backgroundColor: b.value,
                width: "60px",
                height: "60px",
              }}
              className={cx(
                "w-[60px] relative h-[60px] center rounded-full cursor-pointer   border transition-all duration-300",
                isSelected
                  ? "border-2  text-primary shadow-4xl"
                  : "",
              )}
            >
              <div className="w-[60px] center">
               {isSelected && <Check color={invertColor(b.value)} size={20} className="shadow-xl" />}
              </div>
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
