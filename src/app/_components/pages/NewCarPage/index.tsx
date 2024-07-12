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
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";
import SuccessAnimation from "../../../../../public/animations/sucess_button.json";
import Lottie from "../../ui/lottie";
import useFormCarStore from "./state";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";

const NewCarPage = ({
  car,
  data,
}: {
  belongsToId?: string | null;
  isAdmin?: boolean;
  data: RouterOutputs["public"]["carData"];
  car?: RouterOutputs["car"]["getCarById"];
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const getForm = () => {
    const brand = searchParams.get("brand")
      ? parseInt(searchParams.get("brand") ?? "")
      : undefined ?? car?.brandId ?? data.brands[0]?.id ?? 0;
    const model = searchParams.get("model")
      ? parseInt(searchParams.get("model") ?? "")
      : undefined ??
        car?.modelId ??
        data.models.filter((k) => k.brandId == brand)[0]?.id ??
        0;
    const year = searchParams.get("year")
      ? parseInt(searchParams.get("year") ?? "")
      : undefined ?? car?.year ?? undefined;
    const fuel =
      (searchParams.get("fuel") as
        | "gasoline"
        | "diesel"
        | "electricity"
        | "hybrid") ??
      car?.fuel ??
      "gasoline";
    return {
      step1: {
        brand,
        model,
        //year: 0,
        fuel,
        state: car?.state,
        color: car?.color?.id,
        year,
      },
      step2: {
        body: car?.bodyId ?? undefined,
        transmission: car?.transmission ?? "manual",
        mileage: car?.kilometrage ?? undefined,
        cv: car?.cv ?? undefined,
        cc: car?.cc ?? undefined,
        co2: car?.co2 ?? undefined,
        version: car?.version ?? undefined,
        doors: car?.doors ?? undefined,
      },
      step3: {
        options: car?.options?.map((k) => (k as any).id) ?? [],
      },
      step4: {
        handling: car?.handling ?? undefined,
        tires: car?.tires ?? undefined,
        exterior: car?.exterior ?? undefined,
        interior: car?.interior ?? undefined,
      },
      step5: {
        images: car?.images,
        country: car?.countryId ?? data.countries[0]?.id,
        city: car?.cityId ?? undefined,
        address: car?.address ?? undefined,
        pos:
          car?.lat && car?.lon ? { lat: car?.lat, lng: car?.lon } : undefined,
      },
      step6: {
        //duration: "3d",
        inRange: car?.inRange ?? undefined,
        startingPrice: car?.startingPrice ?? undefined,
        duration: car?.duration ?? "3d",
        expectedPrice: car?.expectedPrice ?? undefined,
        minPrice: car?.minPrice ?? undefined,
        maxPrice: car?.maxPrice ?? undefined,
        price: car?.price ?? undefined,
        type: car?.type ?? "direct",
        description: car?.description ?? undefined,
      },
    };
  };
  const {
    form = getForm(),
    setForm,

    setCarId,
  } = useFormCarStore();
  const { mutateAsync } = api.public.presignedUrl.useMutation();
  const [step, setStep] = useState(1);
  const [images, setImages] = React.useState<Array<File | string>>(
    car?.images ?? [],
  );

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);
  const [isOpen, setIsOpen] = React.useState(false);
  const [errorUploading, setErrorUploading] = React.useState<
    string | undefined
  >(undefined);
  const [isUploading, setIsUploading] = React.useState(false);
  const { mutateAsync: setAssets } = api.car.addAssets.useMutation();
  useEffect(() => {
    setForm(getForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car]);

  const {
    mutate: mutateCar,
    isLoading,
    isError,
  } = api.car.addCar.useMutation({
    onSuccess: (carId) => {
      setCarId(carId);
      onAddAssets({ carId });
    },
    onError: (error) => {
      console.log("error adding car", error);
      toast.error("Error adding car");
    },
  });
  const { mutate: updateCar, isLoading: isUpdaing } =
    api.car.updateCar.useMutation({
      onSuccess: async () => {
        setCarId(car?.id ?? 0);
        await onAddAssets({ carId: car?.id ?? 0 });
        router.back();
      },
      onError: (error) => {
        console.log("error updating car", error);
        toast.error("Error updating car");
      },
    });
  const onAddCar = (
    newForm: RouterInputs["car"]["addCar"] | undefined = form,
  ) => mutateCar(newForm);
  const onAddAssets = async ({ carId }: { carId: number }) => {
    const alreadyDeployed: string[] = [];
    const needToBeDeployed: File[] = [];
    images.forEach((image) => {
      if (typeof image === "string") {
        alreadyDeployed.push(image);
      } else {
        needToBeDeployed.push(image);
      }
    });

    try {
      if (needToBeDeployed.length > 0) {
        setIsUploading(true);
        const presignedUrl = await Promise.all(
          needToBeDeployed.map((image: any) =>
            mutateAsync().then((data) => ({ data, image })),
          ),
        );
        console.log("url signeds", presignedUrl);
        const uploadKeys = await axios.all(
          presignedUrl.map(({ data, image }) =>
            axios.put(data.url, image).then(() => data.key),
          ),
        );
        await setAssets({ carId, images: [...alreadyDeployed, ...uploadKeys] });
      } else {
        await setAssets({ carId, images: alreadyDeployed });
      }

      setIsUploading(false);
      if (car) {
        toast.success("Car updated successfully");
      } else {
        setIsSuccess(true);
      }
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
                onNext={(value) => {
                  next();
                  //

                  setForm({ ...form, step1: value });
                }}
                value={form.step1}
              />
            )}
            {step == 2 && (
              <Step2
                data={data}
                onNext={(value) => {
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
                onNext={(value) => {
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
                onNext={(value) => {
                  next();
                  setForm({ ...form, step4: value });
                }}
                value={form.step4}
              />
            )}
            {step == 5 && (
              <Step5
                data={data}
                images={images}
                onChangeImages={setImages}
                onNext={(value) => {
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
                onNext={(value) => {
                  const newForm = { ...form, step6: value };
                  onAddCar(newForm);
                  setIsOpen(true);
                  setForm(newForm);
                }}
                onUpdate={
                  car
                    ? (value) => {
                        const newForm = { ...form, step6: value };
                        updateCar({
                          ...newForm,
                          id: car.id!,
                        });
                        setIsOpen(true);
                        setForm(newForm);
                      }
                    : undefined
                }
                value={form.step6}
                onBack={back}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <Modal
        // backdrop="blur"
        isOpen={isLoading || isUploading || isUpdaing}
        // onOpenChange={setIsOpen}

        isDismissable={!(isLoading || isUploading || isUpdaing)}
        hideCloseButton={!(isLoading || isUploading || isUpdaing)}
      >
        <ModalContent>
          <ModalBody className="center p-10">
            {(isLoading || isUploading || isUpdaing) && <Spinner size="lg" />}
            <div className="flex flex-col items-center">
              <span>{isLoading && "Publishing your car..."}</span>
              <span>{isUploading && "Uploading your images..."}</span>
              <span>{isError && "Error publishing your car"}</span>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        // backdrop="blur"
        isDismissable={false}
        isOpen={isSuccess}
        hideCloseButton={true}
        // onClose={() => {
        //   setIsSuccess(false);
        // }}
      >
        <ModalContent>
          <ModalBody className="center p-10">
            <div className="flex flex-col items-center">
              <div className="w-[200px] -translate-y-6 ">
                <Lottie animationData={SuccessAnimation} />
              </div>
              <div className="flex -translate-y-10 flex-col items-center gap-4">
                <span className="text-lg ">Your car has been published</span>
                <div className="flex w-full items-end justify-around gap-4">
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<Plus />}
                    onClick={() => {
                      setStep(1);
                      router.replace(`/forms/car/new`);
                    }}
                  >
                    Add another car
                  </Button>
                  <Button
                    variant="flat"
                    size="sm"
                    onClick={() => router.push(`/dashboard/my-cars`)}
                  >
                    View yours cars
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewCarPage;
