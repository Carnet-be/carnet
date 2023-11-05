/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { type TStep4, step4Schema } from ".";
import RatingStar from "../../ui/ratingStar";
const Step4 = ({
  value,
  onNext,
  onBack,
}: {
  value: TStep4;
  onNext: (values:TStep4) => void;
  onBack: () => void;
}) => {
  const {
    handleSubmit,
    control,
  } = useForm({
    defaultValues: value,
    resolver: zodResolver(step4Schema),
  });
  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext)}
      className="flex w-full max-w-[700px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">Rate each parts of your car</h2>

      <div className="space-y-5">
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid w-full grid-cols-[300px_3px_auto] items-center gap-3">
              <span className="text-end font-semibold">Handling</span>
              <Divider orientation="vertical" />
              <RatingStar
                value={value}
                onChange={onChange}
                tooltips={[
                  "Doesn't start nor drive",
                  "Starts but doesn't drive",
                  "One or more failures are lit on the dashboard",
                  "Only required some maintenance",
                  "Everything still working perfectly!",
                ]}
              />
            </div>
          )}
          name="handling"
        />
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid w-full grid-cols-[300px_3px_auto] items-center gap-3">
              <span className="text-end font-semibold">Exterion</span>
              <Divider orientation="vertical" />
              <RatingStar
                value={value}
                onChange={onChange}
                tooltips={[
                  "Involved in a (serious) accident",
                  "Only tinplate damage, no structural issues",
                  "Scratches or dents",
                  "Slight scratches",
                  "Perfect condition",
                ]}
              />
            </div>
          )}
          name="exterior"
        />
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid w-full grid-cols-[300px_3px_auto] items-center gap-3">
              <span className="text-end font-semibold">Interior</span>
              <Divider orientation="vertical" />
              <RatingStar
                value={value}
                onChange={onChange}
                tooltips={[
                  "Very bad condition (the airbags have gone off …)",
                  "Seats in very bad condition",
                  "Noticeable Stains or fabric damage",
                  "Good condition (Smell of smoking)",
                  "Excellent condition",
                ]}
              />
            </div>
          )}
          name="interior"
        />
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid w-full grid-cols-[300px_3px_auto] items-center gap-3">
              <span className="text-end font-semibold">Tires</span>
              <Divider orientation="vertical" />
              <RatingStar
                value={value}
                onChange={onChange}
                tooltips={[
                  "Required replacement ASAP",
                  "They have little or no tread, but can still be inflated",
                  "Risk of receiving an inspection warning",
                  "They have miles of experience on the track",
                  "Less than 5000 kms and still in perfect condition!",
                ]}
              />
            </div>
          )}
          name="tires"
        />
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

export default Step4;

