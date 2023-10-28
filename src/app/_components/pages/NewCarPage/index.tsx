/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import useNewCarHistorique from "~/state/newCarHistorique";
import cx from "classnames";
import { z } from "zod";
import Step1 from "./step1";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
import { SignUp } from "@clerk/nextjs";
import useFormCarStore from "./state";
import CModal from "../../ui/cmodal";
import { api } from "~/trpc/react";
import axios from "axios";
const numSchema = z.number().or(z.string().transform((v) => Number(v) || undefined));
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
  doors: z.string().optional(),
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

export const step6Schema = z.object({
  startingPrice: numSchema.optional(),
  duration: z.enum(["3d", "7d", "14d", "30d"]).optional(),
  expectedPrice: numSchema.optional(),
  minPrice: numSchema.optional(),
  maxPrice: numSchema.optional(),
  price: numSchema.optional(),
  type: z.enum(["direct", "auction"]).default("direct"),
  inRange: z.boolean().optional().default(false),
  description: z.string().optional(),
}).refine((data) => {
  if (data.inRange) {
    return data.minPrice && data.maxPrice;
  } else {
    return true
  }
}, { message: "Please enter a min and max price" }).refine((data) => {
  if (data.type == "auction") {
    return data.duration && data.startingPrice;
  } else {
    return true
  }
}
  , { message: "Please enter a duration and starting price" });


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
  belongsToId,
  isAdmin = false,
}: {
  data: any;
  belongsToId?: string | null;
  isAdmin?: boolean;
}) => {
  const router = useRouter();
  const { form = {
    step1: {
      brand: 0,
      model: 0,
      //year: 0,
      fuel: "gasoline",
      state: "new",

    },
    step2: {},
    step3: {
      options: []
    },
    step4: {},
    step5: {
      images: []
    },
    step6: {
      //duration: "3d",
      inRange: false,
      type: "direct"
    }
  }, setForm, step, setStep } = useFormCarStore()
  const next = () => setStep(step + 1)
  const back = () => setStep(step - 1)
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutate, isLoading, isError } = api.car.addCar.useMutation({
    onSuccess(data) {
      console.log('data', data)
      router.back()
    },
    onError(err) {
      console.log('err', err)
    }
  })

  const { mutateAsync } = api.public.presignedUrl.useMutation()

  return (
    <>
      <div className="space-y-6 p-10">
        <Button radius="sm" variant="faded" onClick={() => router.back()}>
          Annuler
        </Button>
        <div className="center min-h-[60vh] w-full">
          <AnimatePresence>
            {step == 1 &&
              <Step1 data={data} onNext={(value: TStep1) => {
                console.log('value', value)
                next()
                setForm({ ...form, step1: value })
              }
              } value={form.step1} />
            }
            {step == 2 && (

              <Step2 data={data} onNext={(value: TStep2) => {
                next()
                setForm({ ...form, step2: value })
              }
              } value={form.step2} onBack={back} />)}
            {step == 3 &&
              <Step3 data={data} onNext={(value: TStep3) => {
                next()
                setForm({ ...form, step3: value })
              }
              } value={form.step3} onBack={back} />}
            {step == 4 &&
              <Step4 onBack={back} onNext={(value: TStep4) => {
                next()
                setForm({ ...form, step4: value })
              }
              } value={form.step4} />}
            {step == 5 &&
              <Step5 data={data} onNext={(value: TStep5) => {
                next()
                setForm({ ...form, step5: value })
              }
              } value={form.step5} onBack={back} />}
            {step == 6 &&
              <Step6 data={data} onNext={(value: TStep6) => {
                const newForm = { ...form, step6: value }
                Promise.all(newForm.step5.images.map((image: any) => mutateAsync().then((data) => ({ data, image })))).then((values) => {
                  console.log('url signeds', values)
                  axios.all(values.map(({ data, image }) => axios.put(data, image,{
                    headers:{
                      "Access-Control-Allow-Origin": "*",
                    }
                  }))).then((values) => {
                    console.log('upload images', values)
                    //const images = values.map((value) => value.data.url)
                  //  mutate({ ...newForm, step5: { ...newForm.step5, images } })
                  }).catch((err) => {
                    console.log('err', err)
                  })
                  // const images = values.map((value) => value.data.url)
                  //mutate({ ...newForm, step5: { ...newForm.step5, images } })
                }).catch((err) => {
                  console.log('err', err)
                })
                // mutate(newForm)
                // setForm(newForm)
              }
              } value={form.step6} onBack={back} />}

          </AnimatePresence>
        </div>
      </div>
      <Modal
        // backdrop="blur"
        isOpen={isLoading}
      // onOpenChange={setIsOpen}

      >
        <ModalContent>


          <ModalBody className="center py-10">
            <Spinner size="lg" />
          </ModalBody>


        </ModalContent>
      </Modal>
    </>
  );
};

export default NewCarPage;
