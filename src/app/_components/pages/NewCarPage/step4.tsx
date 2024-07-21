/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";

import { useTranslations } from "next-intl";
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
  const c = useTranslations("common");
  const t = useTranslations("car.step4");
  const { handleSubmit, control } = useForm({
    defaultValues: value,
    resolver: zodResolver(
      z.object({
        handling: z.number(),
        tires: z.number(),
        exterior: z.number(),
        interior: z.number(),
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
      <h2 className="text-center text-xl">{t("title")}</h2>

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
                  t("handling.1"),
                  t("handling.2"),
                  t("handling.3"),
                  t("handling.4"),
                  t("handling.5"),
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
                  t("exterior.1"),
                  t("exterior.2"),
                  t("exterior.3"),
                  t("exterior.4"),
                  t("exterior.5"),
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
                  t("interior.1"),
                  t("interior.2"),
                  t("interior.3"),
                  t("interior.4"),
                  t("interior.5"),
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
                  t("tires.1"),
                  t("tires.2"),
                  t("tires.3"),
                  t("tires.4"),
                  t("tires.5"),
                ]}
              />
            </div>
          )}
          name="tires"
        />
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

export default Step4;
