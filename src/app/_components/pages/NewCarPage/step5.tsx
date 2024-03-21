/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";
import { getCarImage } from "~/utils/function";
import CSelect from "../../ui/CSelect";
import Map from "../../ui/map";

type TStep5 = RouterInputs["car"]["addCar"]["step5"];
const Step5 = ({
  value,
  onNext,
  onBack,
  data,
  images,
  onChangeImages,
}: {
  value: TStep5;
  onNext: (values: TStep5) => void;
  onBack: () => void;
  data: RouterOutputs["public"]["carData"];
  images: Array<File | string>;
  onChangeImages: (images: Array<File | string>) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: value,
    resolver: zodResolver(
      z.object({
        images: z.array(z.string()).default([]),
        country: z.number().optional().nullable(),
        city: z.number().optional().nullable(),
        address: z.string().optional().nullable(),
        pos: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional()
          .nullable(),
        zipCode: z.string().optional().nullable(),
      }),
    ),
  });
  const countries = data?.countries;
  const cities = data?.cities;
  console.log("Images", images);
  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext, (err) => {
        console.log("Error Step5", err);
      })}
      className="flex w-full max-w-[700px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">
        Add some pictures of your car and tell us where it is located
      </h2>

      <div className="space-y-5">
        <Uploader value={images} onChange={onChangeImages} />

        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="country"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                label="Country"
                placeholder="Where is your car located?"
                isInvalid={!!errors.country}
                error={errors.country?.message}
                value={value?.toString()}
                onChange={onChange}
                onBlur={onBlur}
                options={countries.map((m) => ({
                  value: m.id.toString(),
                  label: m.name,
                }))}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CSelect
                label={
                  watch("country")
                    ? `Select a city of ${countries.find(
                        (c) => c.id == watch("country"),
                      )?.name}`
                    : `City`
                }
                isDisabled={!watch("country")}
                isInvalid={!!errors.city}
                error={errors.city?.message}
                value={value?.toString()}
                onChange={onChange}
                onBlur={onBlur}
                options={cities
                  .filter((m) => m.countryId == watch("country"))
                  .map((m) => ({ value: m.id.toString(), label: m.name }))}
              />
            )}
          />

          <div className="space-y-3">
            <Input
              label="Address"
              placeholder="Where is exactly your car located? (optional)"
              {...register("address")}
              isInvalid={!!errors.address}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
              errorMessage={errors.address?.message}
            />
            <Input
              label="Zip Code"
              placeholder="What is the zip code of your car? (optional)"
              {...register("zipCode")}
              isInvalid={!!errors.zipCode}
              classNames={{
                input: ["placeholder:text-default-700/40"],
              }}
              errorMessage={errors.zipCode?.message}
            />
          </div>

          <Controller
            name="pos"
            control={control}
            render={({ field }) => {
              return (
                <Map
                  center={
                    field?.value
                      ? {
                          lat: field?.value.lat,
                          lng: field?.value.lng,
                        }
                      : undefined
                  }
                  className="overflow-hidden rounded-xl"
                  onClick={(pos) => field.onChange(pos)}
                  markers={
                    field.value?.lat && field.value?.lng
                      ? [
                          {
                            lat: field.value.lat,
                            lng: field.value.lng,
                          },
                        ]
                      : undefined
                  }
                />
              );
            }}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[500px] flex-row items-center justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button type="submit" variant="shadow" color="primary" className="px-5">
          Next
        </Button>
      </div>
    </motion.form>
  );
};

export default Step5;

const Uploader = ({
  value = [],
  onChange,
  errorMessage,
}: {
  value?: Array<File | string>;
  onChange?: (file: Array<File | string>) => void;
  errorMessage?: string;
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const previewUrl = (file: File | string): string =>
    typeof file === "string" ? getCarImage(file) : URL.createObjectURL(file);
  return (
    <div>
      <div>
        <input
          multiple
          //accept only image
          accept="image/*"
          type="file"
          onChange={(e) => {
            const newfiles = Array.from(
              (e.target as any).files ?? [],
            ) as File[];
            onChange?.([...value, ...newfiles]);
          }}
          ref={inputRef}
          className="hidden"
        />
        <div className="grid grid-cols-4 items-center gap-3">
          {value.map((f, i) => {
            const url = previewUrl(f);
            return (
              <div
                key={url}
                className="group relative aspect-[3/2] overflow-hidden rounded-md border"
              >
                <Image alt="image" src={url} layout="fill" objectFit="cover" />
                <div
                  onClick={() => {
                    const newfiles = [...value];
                    newfiles.splice(i, 1);
                    onChange?.(newfiles);
                  }}
                  className="absolute left-0 top-0 hidden h-full w-full cursor-pointer  items-center justify-center bg-white/50 text-red-500 backdrop-blur-sm transition-all group-hover:flex"
                >
                  <div className="rounded-full bg-white p-2">
                    <Trash2 size={17} />
                  </div>
                </div>
              </div>
            );
          })}
          <div
            key={"button"}
            onClick={() => (inputRef.current as any)?.click()}
            className="center aspect-[3/2] cursor-pointer rounded-md border"
          >
            <ImagePlus size={20} />
          </div>
        </div>
      </div>
      <span className="my-2 text-red-500">{errorMessage}</span>
    </div>
  );
};
