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
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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
  const router = useRouter();
  const getForm = () => ({
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
      transmission: car?.transmission ?? "manual",
      mileage: car?.kilometrage ?? undefined,
      cv: car?.cv ?? undefined,
      cc: car?.cc ?? undefined,
      co2: car?.co2 ?? undefined,
      version: car?.version ?? undefined,
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
      country: car?.countryId ?? undefined,
      city: car?.cityId ?? undefined,
      address: car?.address ?? undefined,
      pos: car?.lat && car?.lon ? { lat: car?.lat, lng: car?.lon } : undefined,
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
  });
  const {
    form = getForm(),
    setForm,
    step,
    setStep,
    setCarId,
  } = useFormCarStore();
  const { mutateAsync } = api.public.presignedUrl.useMutation();
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
      onSuccess: () => {
        setCarId(car?.id ?? 0);
        onAddAssets({ carId: car?.id ?? 0 });
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
        isDismissable={false}
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
        isOpen={isSuccess}
        onClose={() => {
          setIsSuccess(false);
        }}
      >
        <ModalContent>
          <ModalBody className="center p-10">
            <div className="flex flex-col items-center">
              <div className="w-[200px] -translate-y-6 ">
                <Lottie animationData={SuccessAnimation} />
              </div>
              <div className="flex -translate-y-10 flex-col items-center gap-4">
                <span className="text-lg ">Your car has been published</span>
                <Button
                  color="primary"
                  onClick={() => router.push(`/dashboard/my-cars`)}
                >
                  View yours cars
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewCarPage;
