/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import { Button, Tab, Tabs, Textarea } from "@nextui-org/react";
import axios from "axios";
import { type InferSelectModel } from "drizzle-orm";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GoIssueDraft } from "react-icons/go";
import { MdOutlinePublic } from "react-icons/md";
import { type garages } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { getCarImage } from "~/utils/function";

const FormMyGarage = ({
  org,
  garage,
}: {
  org: {
    name: string;
    slug: string;
  };

  garage: InferSelectModel<typeof garages>;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { register, setValue, watch, handleSubmit } = useForm<{
    about: string | null;
    cover: string | File | null;
    state: InferSelectModel<typeof garages>["state"];
  }>({
    defaultValues: {
      about: garage.about,
      state: garage.state,
      cover: garage.cover,
    },
  });
  const { mutateAsync: getPreassign } = api.public.presignedUrl.useMutation();
  const { mutate, isLoading: isUpdating } = api.garage.updateGarage.useMutation(
    {
      onSuccess: () => {
        toast.success("Garage updated");
      },
      onError: (err) => {
        console.log("error updating garage", err);
        toast.error("Error updating garage");
      },
    },
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const getPreview = (file: File | string) => {
    if (typeof file === "string") return getCarImage(file);
    return URL.createObjectURL(file);
  };
  if (garage.state == "expired")
    return (
      <div className="flex h-[200px] w-full flex-col items-center justify-center gap-5 p-5">
        <X size={50} color="red" />
        <h2 className="max-w-[500px] text-center">
          Your subscription has expired, please renew it to continue using our
          services
        </h2>
      </div>
    );
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        let cover: string | null = null;
        if (v.cover === null) {
          toast.error("Cover is required");
          return;
        }
        if (typeof v.cover !== "string") {
          setIsUploading(true);
          const url = await getPreassign();
          const uploadKey = await axios
            .put(url.url, v.cover)
            .then(() => url.key);
          cover = uploadKey;
        } else {
          cover = v.cover;
        }
        setIsUploading(false);
        if (cover === null) {
          toast.error("Error uploading cover");
          return;
        }
        mutate({ id: garage.id, ...v, cover });
      })}
      className="mx-auto grid max-w-4xl grid-cols-2 gap-7 py-3"
    >
      <div className="col-span-2 pb-3">
        <h1 className="text-2xl font-bold">My Garage</h1>
        <p className="text-gray-500">
          Create your own garage and start selling your cars
        </p>
      </div>
      <div className="flex flex-row items-end">
        <Tabs
          aria-label="Options"
          selectedKey={watch("state")}
          onSelectionChange={(e) => {
            setValue("state", e.toString() as any);
          }}
        >
          <Tab
            key="published"
            onClick={() => {
              setValue("state", "published");
            }}
            title={
              <div className="flex items-center space-x-2">
                <MdOutlinePublic />
                <span>Published</span>
              </div>
            }
          />
          <Tab
            key="draft"
            title={
              <div className="flex items-center space-x-2">
                <GoIssueDraft />
                <span>Draft</span>
              </div>
            }
          />
        </Tabs>
      </div>
      <div className="col-span-2 ">
        <span className="text-sm">Cover</span>
        <div className="relative aspect-[3] w-full rounded-lg border-2 border-dashed bg-[#F4F4F5]">
          {watch("cover") != null && (
            <Image
              alt="cover"
              src={getPreview(watch("cover")!)}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          )}
          <div className="absolute bottom-2 right-2 flex flex-row items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                setValue("cover", e.target.files?.[0] ?? null);
              }}
            />
            <Button
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              Change
            </Button>
            {watch("cover") != null && (
              <Button
                color="danger"
                onClick={() => {
                  setValue("cover", null);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div id="textarea-wrapper" className="col-span-2">
        {" "}
        <Textarea
          minRows={8}
          type="text"
          variant="faded"
          label="About"
          placeholder="Tell us about your garage"
          {...register("about")}
        />
      </div>
      <div className="col-span-2 flex items-center justify-end pb-16 pt-4">
        <Button
          type="submit"
          isLoading={isUpdating || isUploading}
          color="primary"
          className="px-10"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default FormMyGarage;
