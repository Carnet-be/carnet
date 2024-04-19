/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete, AutocompleteItem,
  Button,
  ScrollShadow,
  Select,
  SelectItem,
  SelectSection,
} from "@nextui-org/react";
import cx from "classnames";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";
import { invertColor } from "~/utils/function";

import { z } from "zod";
import CSelect from "../../ui/CSelect";

export const FUEL = ["Gasoline", "Diesel", "Electricity", "Hybrid"]

export const getListOfYearFrom1990 = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 1990; i--) {
    years.push(i);
  }
  return years;
};

const Step1 = ({
  value: defaultValues,
  onNext,
  data,
}: {
  value: RouterInputs["car"]["addCar"]["step1"];
  onNext: (values: RouterInputs["car"]["addCar"]["step1"]) => void;
  data: RouterOutputs["public"]["carData"];
}) => {
  const brands = data?.brands;
  const models = data?.models;
  const colors = data?.colors;
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(
      z.object({
        brand: z.number().min(1, { message: "Please select a brand" }),
        model: z.number().min(1, { message: "Please select a model" }),
        fuel: z
          .enum(["gasoline", "diesel", "electricity", "hybrid"])
          .optional()
          .nullable(),
        color: z.number().optional().nullable(),
        state: z.enum(["new", "used"]).optional().nullable(),
      }),
    ),
  });

  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext, (err) => {
        console.log("err", err);
      })}
      className="flex  w-full max-w-[700px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">
        Start by giving us some information about your car
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="brand"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                required
                error={errors.brand?.message}
                isInvalid={!!errors.brand}
                label={!watch("brand") ? "Select a brand (Required)" : "Brand"}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={brands.map((b) => ({
                  label: b.name,
                  value: b.id.toString(),
                }))}
              />
            )}
          />

          <Controller
            name="model"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (


              <CSelect
                isDisabled={!watch("brand")}
                error={errors.model?.message}
                isInvalid={!!errors.model}

                label={
                  watch("model")
                    ? "Model"
                    : watch("brand")
                      ? `Select a model of ${brands.find((b) => b.id == watch("brand"))?.name
                      }`
                      : "Select a model (Required)"
                }
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                options={models
                  .filter((m) => m.brandId == watch("brand"))
                  .map((m) => ({
                    label: m.name,
                    value: m.id.toString(),
                  }))}
              />
              // <Select
              //   isDisabled={!watch("brand")}
              //   errorMessage={errors.model?.message}
              //   isInvalid={!!errors.model}
              //   scrollShadowProps={{
              //     isEnabled: false,
              //   }}
              //   label={
              //     watch("model")
              //       ? "Model"
              //       : watch("brand")
              //         ? `Select a model of ${brands.find((b) => b.id == watch("brand"))?.name
              //         }`
              //         : "Select a model (Required)"
              //   }
              //   onChange={(e) => {
              //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              //     onChange(parseInt((e.target as any).value) ?? undefined);
              //   }}
              //   onBlur={onBlur}
              //   value={value}
              //   startContent={
              //     <span className="whitespace-nowrap text-[14px]">
              //       {watch("brand")
              //         ? models.find((b) => b.id == watch("model"))?.name
              //         : ""}
              //     </span>
              //   }
              // >
              //   {models
              //     .filter((m) => m.brandId == watch("brand"))
              //     .map((m) => (
              //       <SelectSection
              //         title={m.name}
              //         key={`${m.name} ${m.brandId}`}
              //         classNames={{
              //           heading:
              //             "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small",
              //         }}
              //       >
              //         {models.map((y) => (
              //           <SelectItem key={y.id} value={y.id}>
              //             {y.year?.toString()}
              //           </SelectItem>
              //         ))}
              //       </SelectSection>
              //     ))}
              // </Select>
            )}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Controller
            name="year"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                type="number"
                className="w-[500px]"
                label={
                  watch("year")
                    ? "Year of the car"
                    : "Select the year of your car"
                }
                onChange={onChange}
                onBlur={onBlur}
                value={value?.toString()}
                options={getListOfYearFrom1990().map((b) => ({
                  label: b.toString(),
                  value: b.toString(),
                }))}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                type="text"
                className="w-[400px]"
                label={
                  "State of the car"
                }
                onChange={onChange}
                onBlur={onBlur}
                value={value?.toString()}
                options={["new", "used"].map((b) => ({
                  label: b === "new" ? "New car" : "Used car",
                  value: b.toString(),
                }))}
              />
            )}
          />

          <Controller
            name="fuel"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                type="text"
                label={
                  watch("fuel") ? "Fuel" : "Select the type of fuel (Required)"
                }
                onChange={onChange}
                onBlur={onBlur}
                value={value?.toString()}
                options={FUEL.map(
                  (b) => ({
                    label: b.toString(),
                    value: b.toString().toLowerCase(),
                  }),
                )}
              />
            )}
          />
        </div>
        <ColorSelection
          bodies={colors}
          selectedBody={watch("color") ?? undefined}
          onSelect={(id) => setValue("color", id)}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex-grow"></div>
        <Button type="submit" variant="shadow" color="primary" className="px-5">
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
  bodies: RouterOutputs["public"]["carData"]["colors"];
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
                "center relative h-[60px] w-[60px] cursor-pointer rounded-full   border transition-all duration-300",
                isSelected ? "shadow-4xl  border-2 text-primary" : "",
              )}
            >
              <div className="center w-[60px]">
                {isSelected && (
                  <Check color={invertColor(b.value)} size={30} className="" />
                )}
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
