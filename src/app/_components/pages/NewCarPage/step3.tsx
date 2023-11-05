/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { type TStep3, step3Schema } from ".";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { type CarOption } from "~/server/db/schema";
import { motion } from "framer-motion";
import cx from "classnames";
const Step3 = ({
  value,
  onNext,
  data,
  onBack,
}: {
  value: TStep3;
  onNext: (values:TStep3) => void;
  onBack: () => void;
  data: any;
}) => {
  const {
    handleSubmit,
    control,
  } = useForm({
    defaultValues: value,
    resolver: zodResolver(step3Schema),
  });
  const options: CarOption[] = data?.carOptions;
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
        Select all the option that your car has
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {options.map((o) => {
        
          return (
            <Controller
              key={o.id}
              control={control}
              render={({field:{value,onChange}}) => (
                <div
                  onClick={() => {
                    if (value?.includes(o.id)) {
                      const newList = value||[];
                      newList.splice(newList.indexOf(o.id), 1);
                      onChange( newList);
                    } else {
                      const newList = value||[];
                      newList.push(o.id);
                      onChange( newList);
                    }
                  }}
                  className={cx(
                    "cursor-pointer text-sm opacity-70 rounded-xl border p-3 transition-all duration-300",
                    value?.includes(o.id)
                      ? " border-primary text-primary shadow-2xl text-opacity-100"
                      : "",
                  )}
                >
                  {o.name}
                </div>
              )}
              name={"options"}
            />
          );
        })}
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

export default Step3;
