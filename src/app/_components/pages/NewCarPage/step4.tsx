/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { type RouterInputs } from "~/trpc/shared";
import RatingStar from "../../ui/ratingStar";

type TStep4 = RouterInputs["car"]["addCar"]["step4"];
const Step4 = ({
  value,
  onNext,
  onBack,
}: {
  value: TStep4;
  onNext: (values: TStep4) => void;
  onBack: () => void;
}) => {
  const { handleSubmit, control } = useForm({
    defaultValues: value,
    resolver: zodResolver(
      z.object({
        handling: z.number().optional().nullable(),
        tires: z.number().optional().nullable(),
        exterior: z.number().optional().nullable(),
        interior: z.number().optional().nullable(),
      }),
    ),
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

      <div className="space-y-10">
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid w-full grid-cols-[300px_3px_auto] items-center gap-3">
              <span className="text-end font-semibold">Handling</span>
              <Divider orientation="vertical" />
              <RatingStar
                value={value ?? undefined}
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
                value={value ?? undefined}
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
                value={value ?? undefined}
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
                value={value ?? undefined}
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
