/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Switch, Tab, Tabs, Textarea } from "@nextui-org/react";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Signpost } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { type RouterInputs } from "~/trpc/shared";
import ProTag from "../../ui/proTag";
import { numSchema } from "./step2";

type TStep6 = RouterInputs["car"]["addCar"]["step6"];
const Step6 = ({
  value,
  onNext,
  onBack,
  onUpdate,
}: {
  value: TStep6;
  onNext: (values: TStep6) => void;
  onUpdate?: (values: TStep6) => void;
  onBack: () => void;
  data: any;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: value,
    resolver: zodResolver(
      z
        .object({
          startingPrice: numSchema.optional().nullable(),
          duration: z.enum(["3d", "7d", "14d", "30d"]).optional().nullable(),
          expectedPrice: numSchema.optional().nullable(),
          minPrice: numSchema.optional().nullable(),
          maxPrice: numSchema.optional().nullable(),
          price: numSchema.optional().nullable(),
          type: z.enum(["direct", "auction"]).default("direct"),
          inRange: z.boolean().optional().nullable().default(false),
          description: z.string().optional().nullable(),
        })
        .refine(
          (data) => {
            if (data.type == "auction") {
              return data.duration && data.startingPrice;
            } else {
              return true;
            }
          },
          { message: "Please enter a duration and starting price" },
        )
        .refine(
          (data) => {
            if (data.inRange) {
              return data.minPrice && data.maxPrice;
            } else {
              return true;
            }
          },
          { message: "Please enter a min and max price" },
        ),
    ),
  });

  return (
    <motion.form
      initial={{ opacity: 0.2, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      exit={{ opacity: 0.2, y: 100 }}
      onSubmit={handleSubmit(onUpdate ? onUpdate : onNext, console.log)}
      className="flex w-full max-w-[500px] flex-col gap-10 md:gap-20"
    >
      <h2 className="text-center text-xl">
        Describe your car and finally choose the type of selling
      </h2>

      <div className="space-y-3">
        <div id="textarea-wrapper">
          <Textarea
            labelPlacement="outside"
            minRows={6}
            label="Describe your car"
            placeholder="What caracterize your car? What is its history? Feel free to tell us everything about it!"
            {...register("description")}
          />
        </div>

        <div className="h-2 "></div>
        <Tabs
          size="md"
          aria-label="Tabs form"
          selectedKey={watch("type")}
          onSelectionChange={(r) => {
            setValue("type", r.valueOf()?.toString() as any);
          }}
        >
          <Tab
            key="direct"
            title={
              <div className="flex items-center space-x-2">
                <Banknote />
                <span>Normal selling</span>
                <div className="w-2" />
              </div>
            }
          >
            <span className=" text-[13px] opacity-60">
              You will be able to sell your car directly to a buyer, When the
              buyer will be interested in your car, he will contact you.
            </span>
            <div className="space-y-3 pt-2">
              <Controller
                name="inRange"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Switch
                      isSelected={value ?? undefined}
                      onValueChange={onChange}
                    >
                      I want to sell my car in a price range
                    </Switch>
                  );
                }}
              />
              <AnimatePresence>
                {watch("inRange") ? (
                  <motion.div
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    exit={{ opacity: 0.4 }}
                  >
                    <div className="grid grid-cols-[auto_20px_auto] items-center gap-1">
                      <Input
                        label="Mininum Price"
                        type="number"
                        {...register("minPrice")}
                        isInvalid={!!errors.minPrice}
                        errorMessage={errors.minPrice?.message}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-small text-default-400">
                              $
                            </span>
                          </div>
                        }
                      />
                      <div className="h-1 rounded-md bg-gray-300"></div>
                      <Input
                        label="Maximum Price"
                        type="number"
                        {...register("maxPrice")}
                        isInvalid={!!errors.maxPrice}
                        errorMessage={errors.maxPrice?.message}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-small text-default-400">
                              $
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    exit={{ opacity: 0.4 }}
                  >
                    <Input
                      label="Price"
                      type="number"
                      {...register("price")}
                      isInvalid={!!errors.price}
                      errorMessage={errors.price?.message}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-small text-default-400">$</span>
                        </div>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tab>
          <Tab
            key="auction"
            title={
              <div className="flex items-center space-x-2">
                <Signpost />
                <span>Auction selling</span>
                <div className="w-2" />
              </div>
            }
          >
            <span className=" text-[13px] opacity-60">
              You will be able to sell your car through an auction, You will be
              able to choose the duration of the auction and the starting price.
              When the auction will be finished, the highest bidder will be able
              to buy your car.
            </span>
            <div className="space-y-4 pt-5">
              <Input
                label="Starting price"
                type="number"
                {...register("startingPrice")}
                isInvalid={!!errors.startingPrice}
                errorMessage={errors.startingPrice?.message}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">$</span>
                  </div>
                }
              />

              <Controller
                name="duration"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <div className="space-y-1">
                      <span className="text-sm">Duration</span>
                      <div className="flex flex-wrap gap-3">
                        {["3d", "7d", "14d"].map((v) => {
                          const selected = v == value;
                          const day = parseInt(v.replace("d", ""));
                          const isDisabled = day > 3;
                          return (
                            <div
                              onClick={() => {
                                if (!isDisabled) {
                                  onChange(v);
                                }
                              }}
                              key={v}
                              className={cx(
                                " relative rounded-xl border p-3 text-sm transition-all duration-300",
                                selected
                                  ? " border-primary border-opacity-100 text-primary text-opacity-100 shadow-2xl"
                                  : "",
                                isDisabled
                                  ? "cursor-not-allowed  text-opacity-20"
                                  : "cursor-pointer",
                              )}
                            >
                              {v.replace("d", " Days")}
                              {v != "3d" && <ProTag />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </Tab>
        </Tabs>
        <span className="my-2 text-red-500">
          {(errors as any)?.[""]?.message}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-[500px] flex-row items-center justify-between">
        <Button onClick={onBack}>Back</Button>

        <Button type="submit" variant="shadow" color="primary" className="px-5">
          {onUpdate ? "Update your car" : "Publish your car"}
        </Button>
      </div>
    </motion.form>
  );
};

export default Step6;
