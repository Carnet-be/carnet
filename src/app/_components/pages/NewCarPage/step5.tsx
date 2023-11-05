/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import { type TStep5, step5Schema } from ".";
import { Trash2, ImagePlus } from "lucide-react";
import Image from "next/image";
import { type City, type Country } from "~/server/db/schema";
import Map from "../../ui/map";
import CSelect from "../../ui/CSelect";
const Step5 = ({
  value,
  onNext,
  onBack,
  data
}: {
  value: TStep5;
  onNext: (values:TStep5) => void;
  onBack: () => void;
  data:any
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: value,
    resolver: zodResolver(step5Schema),
  });
  const countries:Country[]= data?.countries
  const cities:City[]= data?.cities
  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext)}
      className="flex w-full max-w-[700px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">
        Add some pictures of your car and tell us where it is located
      </h2>

      <div className="space-y-5">
        <Controller name="images" control={control} render={({ field }) => {
          return <Uploader {...field} />
        }
        } />
        <div className="grid grid-cols-2 gap-6">
       
        <Controller name="country" control={control} render={({ field:{value,onChange,onBlur} }) => (
        
         <CSelect label="Country" isInvalid={!!errors.country}
         error={errors.country?.message} value={value} onChange={onChange} onBlur={onBlur} options={countries.map((m)=>({value:m.id.toString(),label:m.name}))}/>
        )
        } />

        <Controller name="city" control={control} render={({ field:{value,onChange,onBlur} }) => (
        
        <CSelect label="City" isDisabled={!watch("country")}   isInvalid={!!errors.city}
        error={errors.city?.message} value={value} onChange={onChange} onBlur={onBlur} options={cities
          .filter((m) => m.countryId == watch("country")).map((m)=>({value:m.id.toString(),label:m.name}))}/>
       )
       } />

        <div className="space-y-3">
  
        <Input
            label="Address"
            {...register("address")}
            isInvalid={!!errors.address}
            errorMessage={errors.address?.message}
          />
         <Input
            label="Zip Code"
            {...register("zipCode")}
            isInvalid={!!errors.zipCode}
            errorMessage={errors.zipCode?.message}
          />
        </div>

    <Controller name="pos" control={control} render={({ field }) => {
          return  <Map  
          center={ field?.value &&{
              lat: field?.value.lat,
              lng:  field?.value.lng,
            }}
            className="rounded-xl overflow-hidden"
            onClick={(pos)=>field.onChange(pos)}
            markers={(field.value?.lat && field.value?.lng) ? [{
              lat: field.value.lat,
              lng: field.value.lng
            }]: undefined}
            
            />
        }
        } />
        
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[500px] flex-row items-center justify-between">
        <Button onClick={onBack}>Back</Button>
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

export default Step5;



const Uploader = ({ value = [], onChange }: { value?: Array<File | string>, onChange?: (file: Array<File | string>) => void }) => {

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const previewUrl = (file: File | string): string => typeof file === "string" ? file : URL.createObjectURL(file);
  return <div>
    <input multiple
      //accept only image
      accept="image/*"
      type="file" onChange={(e) => {
        const newfiles = Array.from(e.target.files ?? []);
        onChange?.([...value, ...newfiles]);
      }} ref={inputRef} className="hidden" />
    <div  className="grid grid-cols-4 gap-3 items-center">
      {value.map((f, i) => {
        const url = previewUrl(f)
        return <div key={url} className="aspect-[3/2] group overflow-hidden rounded-md border relative">
          <Image alt="image" src={url} layout="fill" objectFit="cover" />
          <div onClick={() => {
            const newfiles = [...value];
            newfiles.splice(i, 1);
            onChange?.(newfiles);
          }} className="absolute transition-all text-red-500 hidden group-hover:flex justify-center items-center  cursor-pointer top-0 left-0 h-full w-full bg-white/50 backdrop-blur-sm">
            <div className="p-2 rounded-full bg-white">
              <Trash2 size={17} />
            </div>
          </div>
        </div>
      })}
      <div key={"button"} onClick={() => inputRef.current?.click()} className="aspect-[3/2] cursor-pointer rounded-md border center">

        <ImagePlus size={20} />

      </div>
    </div>
  </div>
}