/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import SuccessAnimation from "../../../../../public/animations/sucess_button.json";
import Lottie from "../../ui/lottie";
import useFormCarStore from "./state";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
const numSchema = z
  .number()
  .or(z.string().transform((v) => Number(v) || undefined));
export const step1Schema = z.object({
  brand: z.number().min(1, { message: "Please select a brand" }),
  model: z.number().min(1, { message: "Please select a model" }),
  year: z.number().optional(),
  fuel: z.enum(["gasoline", "diesel", "electricity", "hybrid"]).optional(),
  color: z.number().optional(),
  state: z.enum(["new", "used"]).optional(),
});

export const step2Schema = z.object({
  body: z.number().optional(),
  transmission: z.enum(["manual", "automatic", "semi-automatic"]).optional(),
  //transform to number
  mileage: numSchema.optional(),
  doors: z.number().optional(),
  cv: numSchema.optional(),
  cc: numSchema.optional(),
  co2: numSchema.optional(),
  version: z.string().optional(),
});

export const step3Schema = z.object({
  options: z.array(z.number()).default([]),
});

export const step4Schema = z.object({
  handling: z.number().optional(),
  tires: z.number().optional(),
  exterior: z.number().optional(),
  interior: z.number().optional(),
});

export const step5Schema = z.object({
  images: z.array(z.string().or(z.any())),
  country: z.number().optional(),
  city: z.number().optional(),
  address: z.string().optional(),

  pos: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  zipCode: z.string().optional(),
});

export const step6Schema = z
  .object({
    startingPrice: numSchema.optional(),
    duration: z.enum(["3d", "7d", "14d", "30d"]).optional(),
    expectedPrice: numSchema.optional(),
    minPrice: numSchema.optional(),
    maxPrice: numSchema.optional(),
    price: numSchema.optional(),
    type: z.enum(["direct", "auction"]).default("direct"),
    inRange: z.boolean().optional().default(false),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.inRange) {
        return data.minPrice && data.maxPrice;
      } else {
        return true;
      }
    },
    { message: "Please enter a min and max price" },
  )
  .refine(
    (data) => {
      if (data.type == "auction") {
        return data.duration && data.startingPrice;
      } else {
        return true;
      }
    },
    { message: "Please enter a duration and starting price" },
  );

export const carSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});

export type TStep1 = z.infer<typeof step1Schema>;
export type TStep2 = z.infer<typeof step2Schema>;
export type TStep3 = z.infer<typeof step3Schema>;
export type TStep4 = z.infer<typeof step4Schema>;
export type TStep5 = z.infer<typeof step5Schema>;
export type TStep6 = z.infer<typeof step6Schema>;
export type TCar = z.infer<typeof carSchema>;

const NewCarPage = ({
  data,
  car,
}: {
  data: any;
  belongsToId?: string | null;
  isAdmin?: boolean;
  car?: RouterOutputs["car"]["getCarById"];
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const router = useRouter();
  const {
    form = {
      step1: {
        brand: car?.brandId ?? 0,
        model: car?.modelId ?? 0,
        //year: 0,
        fuel: car?.fuel ?? "gasoline",
        state: car?.state ?? "new",
        // color: car?.colorId,
        // year: car?.year,
      },
      step2: {
        body: car?.bodyId ?? undefined,
        transmission: car?.specs?.transmission ?? "manual",
        mileage: car?.specs?.mileage ?? undefined,
        doors: car?.specs?.doors ?? "2",
        cv: car?.specs?.cv ?? undefined,
        cc: car?.specs?.cc ?? undefined,
        co2: car?.specs?.co2 ?? undefined,
        version: car?.specs?.version ?? undefined,
      },
      step3: {
        options: car?.options.map((k) => k.id) ?? [],
      },
      step4: {
        handling: car?.specsRating?.handling ?? undefined,
        tires: car?.specsRating?.tires ?? undefined,
        exterior: car?.specsRating?.exterior ?? undefined,
        interior: car?.specsRating?.interior ?? undefined,
      },
      step5: {
        images: car?.images ?? [],
      },
      step6: {
        //duration: "3d",
        inRange: car?.inRange ?? false,
        startingPrice: car?.detail?.startingPrice ?? undefined,
        duration: car?.detail?.duration ?? "3d",
        expectedPrice: car?.detail?.expectedPrice ?? undefined,
        minPrice: car?.minPrice ?? undefined,
        maxPrice: car?.maxPrice ?? undefined,
        price: car?.price ?? undefined,
        type: car?.type ?? "direct",
        description: car?.description ?? undefined,
      },
    },
    setForm,
    step,
    setStep,
    carId,
    setCarId,
  } = useFormCarStore();
  const { mutateAsync } = api.public.presignedUrl.useMutation();

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);
  const [isOpen, setIsOpen] = React.useState(false);
  const [errorUploading, setErrorUploading] = React.useState<
    string | undefined
  >(undefined);
  const [isUploading, setIsUploading] = React.useState(false);
  const { mutateAsync: setAssets } = api.car.addAssets.useMutation();

  const {
    mutate: mutateCar,
    isLoading,
    isError,
  } = api.car.addCar.useMutation({
    onSuccess: (carId) => {
      setCarId(carId);
      onAddAssets({ carId, images: form.step5.images });
    },
  });

  const onAddCar = (newForm: TCar | undefined = data) => mutateCar(newForm);
  const onAddAssets = async ({
    images = form.step5.images,
    carId,
  }: {
    images?: any[];
    carId: number;
  }) => {
    setIsUploading(true);
    try {
      const presignedUrl = await Promise.all(
        images.map((image: any) =>
          mutateAsync().then((data) => ({ data, image })),
        ),
      );
      console.log("url signeds", presignedUrl);
      const uploadKeys = await axios.all(
        presignedUrl.map(({ data, image }) =>
          axios.put(data.url, image).then(() => data.key),
        ),
      );
      await setAssets({ carId, images: uploadKeys });
      setIsUploading(false);
      setIsSuccess(true);
    } catch (error) {
      console.log("error uploading images", error);
      setIsUploading(false);
      setErrorUploading("Error uploading images");
    }
  };
  return (
    <>
      <div className="space-y-6 p-10">
        <Button radius="sm" variant="faded" onClick={() => router.back()}>
          Annuler
        </Button>
        <div className="center min-h-[60vh] w-full">
          <AnimatePresence>
            {step == 1 && (
              <Step1
                data={data}
                onNext={(value: TStep1) => {
                  console.log("value", value);
                  next();
                  setForm({ ...form, step1: value });
                }}
                value={form.step1}
              />
            )}
            {step == 2 && (
              <Step2
                data={data}
                onNext={(value: TStep2) => {
                  next();
                  setForm({ ...form, step2: value });
                }}
                value={form.step2}
                onBack={back}
              />
            )}
            {step == 3 && (
              <Step3
                data={data}
                onNext={(value: TStep3) => {
                  next();
                  setForm({ ...form, step3: value });
                }}
                value={form.step3}
                onBack={back}
              />
            )}
            {step == 4 && (
              <Step4
                onBack={back}
                onNext={(value: TStep4) => {
                  next();
                  setForm({ ...form, step4: value });
                }}
                value={form.step4}
              />
            )}
            {step == 5 && (
              <Step5
                data={data}
                onNext={(value: TStep5) => {
                  next();
                  setForm({ ...form, step5: value });
                }}
                value={form.step5}
                onBack={back}
              />
            )}
            {step == 6 && (
              <Step6
                data={data}
                onNext={(value: TStep6) => {
                  const newForm = { ...form, step6: value };

                  onAddCar(newForm);
                  setIsOpen(true);
                  setForm(newForm);
                }}
                value={form.step6}
                onBack={back}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <Modal
        // backdrop="blur"
        isOpen={isOpen}
        // onOpenChange={setIsOpen}
        hideCloseButton={!(isLoading || isUploading)}
        isDismissable={!(isLoading || isUploading)}
      >
        <ModalContent>
          <ModalBody className="center py-10">
            {(isLoading || isUploading) && <Spinner size="lg" />}
            <div className="flex flex-col items-center">
              <span>{isLoading && "Publishing your car..."}</span>
              <span>{isUploading && "Uploading your images..."}</span>
              <span>{isError && "Error publishing your car"}</span>
            </div>
            {isSuccess ? (
              <div className="flex flex-col items-center">
                <div className="w-[200px] -translate-y-6 ">
                  <Lottie animationData={SuccessAnimation} />
                </div>
                <div className="flex -translate-y-10 flex-col items-center gap-4">
                  <span className="text-lg ">Your car has been published</span>
                  <Button
                    color="primary"
                    onClick={() => router.push(`car/${carId}`)}
                  >
                    View your car
                  </Button>
                </div>
              </div>
            ) : (
              !errorUploading ||
              (isError && (
                <div>
                  <Button
                    startContent={<RotateCcw size={20} />}
                    fullWidth
                    variant="faded"
                    onClick={() => {
                      if (isError) onAddCar();
                      else if (errorUploading && !!carId)
                        onAddAssets({ carId });
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewCarPage;
