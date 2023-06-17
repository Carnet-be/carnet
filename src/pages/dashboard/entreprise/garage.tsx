/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import { type GetServerSideProps, type NextPage } from "next";
import { BannierAddAuction } from ".";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Divider, Form, Input } from "antd";
import { AssetImage, Garage } from "@prisma/client";
import { useForm } from "react-hook-form";
import UploadButton, { TImage } from "@ui/components/uploadButton";
import { useState } from "react";
import Image from "next/image";
import { AddPhotoIcon } from "@ui/icons";
import TextArea from "antd/lib/input/TextArea";
import cx from "classnames";
import { trpc } from "@utils/trpc";
import { useNotif } from "../../hooks";
import { toast } from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GoLinkExternal } from "react-icons/go";
import { prisma } from "../../../server/db/client";
import { HiClipboardCopy } from "react-icons/hi";
import { useRouter } from "next/router";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const user = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
      include: {
        garage: true,
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  const { locale } = ctx;
  return {
    props: {
      user_id: user.id,
      garage: user.garage,
      ...(await serverSideTranslations(locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};

type TGarage = {
  name: string;
  description: string;
  cover?: string;
  logo?: string;
};
const Home = (props: { user_id: string; garage: Garage | undefined }) => {
  const { user_id, garage } = props;
  const [canCopy, setCanCopy] = useState(garage !== undefined);
  const [defaultValues, setdefaultValues] = useState<TGarage>({
    name: garage?.name || "",
    description: garage?.description || "",
    cover: garage?.cover,
    logo: garage?.logo,
  });
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<TGarage>({
      defaultValues,
    });
  const [assetCover, setAssetCover] = useState<string | undefined>(
    garage?.cover
  );
  const [assetLogo, setAssetLogo] = useState<string | undefined>(garage?.logo);
  const { errors } = formState;

  const isEdited = () => {
    return (
      watch("name") !== defaultValues.name ||
      watch("description") !== defaultValues.description ||
      assetCover !== defaultValues.cover ||
      assetLogo !== defaultValues.logo
    );
  };
  const { error, succes, loading } = useNotif();
  const { mutate } = trpc.entreprise.setGarage.useMutation({
    onSuccess: (garage, v) => {
      succes();
      setdefaultValues(v);
      setCanCopy(true);
    },

    onError: (e) => {
      console.log("e", e);
      error();
    },
  });
  const onSave = () => {
    if (
      !watch("name") ||
      !watch("description") ||
      !watch("cover") ||
      !watch("logo")
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    mutate({
      name: watch("name"),
      description: watch("description"),
      cover: watch("cover")!,
      logo: watch("logo")!,
      user_id,
    });
  };

  const router = useRouter();
  const { asPath, pathname } = router;

  // Extracting the base URL
  const baseURL = asPath.replace(pathname, "");
  const copyText = `${baseURL}/garages/${user_id}`;
  const handleOpenNewTab = () => {
    console.log("asPath.replace(pathname,)", asPath.replace(pathname, ""));
    const newTabUrl = `${asPath.replace(pathname, "")}/garages/${user_id}`; // Replace with your desired URL
    window.open(newTabUrl, "_blank");
  };
  return (
    <Dashboard type="AUC">
      <div>
        <div className="flex flex-row items-center justify-between gap-3">
          <button
            onClick={onSave}
            className={cx("btn-primary btn", {
              hidden: !isEdited(),
            })}
          >
            Save
          </button>
          <div className="flex-grow"></div>
          <CopyToClipboard
            text={window.location.origin + `/garages/${user_id}`}
            onCopy={() => toast.success("Copied to clipboard")}
          >
            <button className="btn-outline btn gap-2">
              <HiClipboardCopy className="text-lg" />
              Copy and share
            </button>
          </CopyToClipboard>

          <button onClick={handleOpenNewTab} className="btn-outline btn gap-2">
            <GoLinkExternal className="text-lg" />
            Visit
          </button>
        </div>
        <Divider />
        <Form.Item
          label="Cover"
          rules={[{ required: true }]}
          labelAlign="left"
          labelCol={{
            span: 2,
          }}
        >
          <div className="relative h-[300px] w-full rounded-md border-2 border-dashed bg-white">
            {assetCover ? (
              <Image
                src={assetCover || ""}
                alt="logo"
                //height={300}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center opacity-50">
                <AddPhotoIcon className="text-lg" />
              </div>
            )}
            <div className="absolute bottom-3 right-3">
              <UploadButton
                aspect={2.35 / 1}
                setPreviewImage={(k) => {
                  setAssetCover(k.url);
                }}
                onSuccess={(k) => {
                  setValue("cover", k.url);
                }}
              />
            </div>
          </div>
        </Form.Item>

        <Form.Item
          label="Logo"
          rules={[{ required: true }]}
          labelAlign="left"
          labelCol={{
            span: 2,
          }}
        >
          <div className="flex flex-row items-end gap-3">
            <div className="h-[100px] w-[100px] rounded-md border-2 border-dashed bg-white">
              {assetLogo ? (
                <Image
                  src={assetLogo || ""}
                  alt="logo"
                  height={100}
                  width={100}
                />
              ) : (
                <div className="flex h-full items-center justify-center opacity-50">
                  <AddPhotoIcon className="text-lg" />
                </div>
              )}
            </div>
            <UploadButton
              aspect={1}
              setPreviewImage={(k) => {
                setAssetLogo(k.url);
              }}
              onSuccess={(k) => {
                setValue("logo", k.url);
              }}
            />
          </div>
        </Form.Item>

        <Form.Item
          label="Name"
          rules={[{ required: true }]}
          labelAlign="left"
          labelCol={{
            span: 2,
          }}
        >
          <Input
            value={watch("name")}
            onChange={(e) => {
              setValue("name", e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          labelAlign="left"
          labelCol={{
            span: 2,
          }}
        >
          <TextArea
            rows={6}
            value={watch("description")}
            onChange={(e) => {
              setValue("description", e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          label=" "
          labelAlign="left"
          labelCol={{
            span: 2,
          }}
        >
          <button
            onClick={onSave}
            className={cx("btn-primary btn", {
              hidden: !isEdited(),
            })}
          >
            Save
          </button>
        </Form.Item>
      </div>
    </Dashboard>
  );
};

export default Home;
