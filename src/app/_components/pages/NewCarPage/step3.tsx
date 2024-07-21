/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import cx from "classnames";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";

type TStep3 = RouterInputs["car"]["addCar"]["step3"];
const Step3 = ({
  value,
  onNext,
  data,
  onBack,
}: {
  value: TStep3;
  onNext: (values: TStep3) => void;
  onBack: () => void;
  data: RouterOutputs["public"]["carData"];
}) => {
  const { handleSubmit, control } = useForm({
    defaultValues: value,
    resolver: zodResolver(
      z.object({
        options: z.array(z.number()).default([]),
      }),
    ),
  });
  const c = useTranslations("common");
  const t = useTranslations("car.step3");
  const oT = useTranslations("optionCar");
  const options = data?.carOptions;
  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onNext, (e) => {
        console.log(e);
      })}
      className="flex w-full max-w-[700px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">{t("title")}</h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {options.map((o) => {
          return (
            <Controller
              key={o.id}
              control={control}
              render={({ field: { value, onChange } }) => (
                <div
                  onClick={() => {
                    if (value?.includes(o.id)) {
                      const newList = value || [];
                      newList.splice(newList.indexOf(o.id), 1);
                      onChange(newList);
                    } else {
                      const newList = value ?? [];
                      newList.push(o.id);
                      onChange(newList);
                    }
                  }}
                  className={cx(
                    "cursor-pointer rounded-xl border p-3 text-sm opacity-70 transition-all duration-300",
                    value?.includes(o.id)
                      ? " border-primary text-primary text-opacity-100 shadow-2xl"
                      : "",
                  )}
                >
                  {oT(o.name)}
                </div>
              )}
              name={"options"}
            />
          );
        })}
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

export default Step3;
