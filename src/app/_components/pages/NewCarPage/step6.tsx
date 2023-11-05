/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { step6Schema, type TStep6 } from ".";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Switch, Tab, Tabs, Textarea } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import cx from "classnames";
import { Banknote, Signpost } from "lucide-react";
const Step6 = ({
    value,
    onNext,
    onBack,
}: {
    value: TStep6;
    onNext: (values: TStep6) => void;
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
        resolver: zodResolver(step6Schema),
    });

    return (
        <motion.form
            initial={{ opacity: 0.2, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            exit={{ opacity: 0.2, y: 100 }}
            onSubmit={handleSubmit(onNext, console.log)}
            className="flex w-full max-w-[500px] flex-col gap-10 md:gap-20"
        >
            <h2 className="text-center text-xl">
                  Describe your car and finally choose the type of selling
            </h2>

            <div>

            <div id='textarea-wrapper'>
               <Textarea labelPlacement="outside" minRows={6} label="Description" {...register("description")} />
               </div>
              
                <div className="h-2 "></div>
                <Tabs

                    size="md"
                    aria-label="Tabs form"
                    selectedKey={watch("type")}
                    onSelectionChange={(r) => {

                        setValue("type", r.valueOf()?.toString() as any)
                    }}
                >
                    <Tab key="direct" title={
                        <div className="flex items-center space-x-2">
                            <Banknote />
                            <span>
                                Normal selling
                            </span>
                            <div className="w-2" />

                        </div>
                    }>
                        <div className="space-y-3 pt-2">
                            <Controller name="inRange" control={control} render={({ field: { value, onChange } }) => {
                                return <Switch isSelected={value} onValueChange={onChange}>
                                    I want to sell my car in a price range
                                </Switch>
                            }
                            }
                            />
                            <AnimatePresence>
                                {
                                    watch('inRange') ? <motion.div
                                        initial={{ opacity: 0.4 }}
                                        animate={{ opacity: 1, }}
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
                                                        <span className="text-default-400 text-small">$</span>
                                                    </div>
                                                }
                                            />
                                            <div className="h-1 bg-gray-300 rounded-md"></div>
                                            <Input
                                                label="Maximum Price"
                                                type="number"
                                                {...register("maxPrice")}
                                                isInvalid={!!errors.maxPrice}
                                                errorMessage={errors.maxPrice?.message}
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">$</span>
                                                    </div>
                                                }
                                            />
                                        </div>

                                    </motion.div> : <motion.div
                                        initial={{ opacity: 0.4 }}
                                        animate={{ opacity: 1, }}
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
                                                    <span className="text-default-400 text-small">$</span>
                                                </div>
                                            }
                                        />
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    </Tab>
                    <Tab key="auction" title={
                        <div className="flex items-center space-x-2">
                            <Signpost />
                            <span>
                                Auction selling
                            </span>
                            <div className="w-2" />

                        </div>
                    }>
                        <div className="space-y-4 pt-5">
                            <Input
                                label="Starting price"
                                type="number"
                                {...register("startingPrice")}
                                isInvalid={!!errors.startingPrice}
                                errorMessage={errors.startingPrice?.message}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">$</span>
                                    </div>
                                }
                            />

                            <Controller name="duration" control={control} render={({ field: { value, onChange } }) => {
                                return <div className="space-y-1">
                                    <span className="text-sm">Duration</span>
                                    <div className="flex flex-wrap gap-3">{["3d", "7d", "14d", "30d"].map((v) => {
                                        const selected = v == value
                                        const day = parseInt(v.replace("d", ""))
                                        const isDisabled = day > 3
                                        return <div onClick={() => {
                                            if (!isDisabled) {
                                                onChange(v)
                                            }
                                        }} key={v} className={cx(
                                            " text-sm opacity-90 rounded-xl border p-3 transition-all duration-300",
                                            selected
                                                ? " border-primary text-primary shadow-2xl text-opacity-100"
                                                : "", isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"

                                        )}>
                                            {v.replace("d", " Days")}
                                        </div>
                                    })}
                                    </div>
                                </div>
                            }
                            } />

                        </div>
                    </Tab>
                </Tabs>
                <span className="text-red-500 my-2">{((errors as any)?.[""])?.message}</span>
            </div>

            <div className="mx-auto flex w-full max-w-[500px] flex-row items-center justify-between">
                <Button onClick={onBack}>Back</Button>

                <Button
                    type="submit"
                    variant="shadow"
                    color="primary"
                    className="px-5"
                >
                   Publish your car
                </Button>
            </div>
        </motion.form>
    );
};

export default Step6;
