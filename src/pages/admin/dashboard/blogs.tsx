import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps } from "next";
import { prisma } from "../../../server/db/client";
import Dashboard from "@ui/dashboard";
import { LangCommonContext, LangContext, useLang, useNotif } from "../../hooks";
import { AssetImage, Blog } from "@prisma/client";
import { ColumnsType } from "antd/es/table";
import MyTable, {
  ActionTable,
  TableType,
  renderDate,
} from "@ui/components/table";
import { Button, Input, Modal, Radio, Tag, Tooltip } from "antd";
import { DeleteIcon, EditIcon, ViewIcon } from "@ui/icons";
import BigTitle from "@ui/components/bigTitle";
import { trpc } from "@utils/trpc";
import Image from "next/image";
import UploadButton, { TImage } from "@ui/components/uploadButton";
import { Lang } from "@model/type";
import toast from "react-hot-toast";
import { AdvancedImage } from "@cloudinary/react";
import cloudy from "@utils/cloudinary";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  return {
    props: {
      user,
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
const Blogs = () => {
  //  const [value, setValue] = useState("**Hello world!!!**");
  const { loading, error, succes } = useNotif();
  const { data: bids, isLoading, refetch } = trpc.blog.getBlogs.useQuery();
  const { text: common } = useLang(undefined);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const { mutate: deleteBlog } = trpc.blog.deleteBlog.useMutation({
    onSuccess: () => {
      succes();
      refetch();
    },
    onError: (e) => {
      error();
      console.log(e);
    },
  });
  const tab = (s: string) => common(`table.${s}`);
  const columns: ColumnsType<Blog> = [
    {
      title: tab("id"),
      width: "50px",
      dataIndex: "id",
      key: "id",
      render: (v) => (
        <span className="text-[12px] italic text-primary">#{v}</span>
      ),
    },
    {
      title: tab("image"),
      dataIndex: "image",
      key: "image",
      width: "140px",
      render: (v) => (
        <AdvancedImage cldImg={cloudy.image(v.fileKey)} quality={30} />
      ),
    },
    {
      title: tab("title"),
      dataIndex: "title",
      responsive: ["md"],
      key: "title",
      render: (v) => <span className="line-clamp-2">{v}</span>,
    },
    {
      title: tab("date"),

      dataIndex: "createAt",

      width: "60px",
      key: "createAt",
      align: "center",
      render: (v) => renderDate(v, "d/MM/yyyy HH:mm"),
    },
    {
      title: tab("lang"),

      dataIndex: "locale",
      key: "locale",
      align: "center",

      width: "40px",
      render: (v) => (
        <Tag>
          {
            v ? common("text." + v) : "---" //  common("text.undefined")
          }
        </Tag>
      ),
    },
    {
      title: tab("actions"),

      dataIndex: "actions",

      width: "140px",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, b) => (
        <ActionTable
          id={b.id}
          onDelete={() => {
            console.log("delete");
            deleteBlog({ id: b.id });
          }}
          onEdit={() => {
            console.log("edit");
          }}
          //   onView={() => {
          //     console.log("view");
          //   }}
        />
      ),
    },
  ];

  return (
    <LangCommonContext.Provider value={common}>
      <LangContext.Provider value={text}>
        <Dashboard type="ADMIN">
          <div className="flex flex-row items-center justify-between">
            <BigTitle title={text("text.blog page title")} />
            <AddBlog
              onSuccess={() => {
                refetch();
              }}
            />
          </div>
          <div className="flex flex-col">
            {/* <Select
      mode="multiple"
      allowClear
     className="min-w-[300px]"
      placeholder="Please select"
      defaultValue={options}
      onChange={(value: string[]) => {
      setoptions(value)

      }}
      
      options={columns.map((c)=>({label:c.title,value:c.key}))}
    /> */}
            <MyTable
              loading={isLoading}
              data={bids || []}
              // xScroll={1000}

              columns={columns as ColumnsType<TableType>}
              // columns={columns.filter((c)=>options.includes(c.key))}
            />
          </div>
        </Dashboard>
      </LangContext.Provider>
    </LangCommonContext.Provider>
  );
};

//<MDEditor value={value} onChange={(v) => setValue(v || "")} />

export default Blogs;

const AddBlog = ({ onSuccess }: { onSuccess: () => void }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const common = useContext(LangCommonContext);
  const { error, loading, succes } = useNotif();
  const [img, setImg] = React.useState<TImage | undefined>(undefined);
  const [asset, setAsset] = useState<TImage | undefined>(undefined);
  const [size, setSize] = useState<Lang | undefined>(undefined);
  const text = useContext(LangContext);
  const { mutate: addBlog } = trpc.blog.addBlog.useMutation({
    onMutate: () => {
      loading();
    },
    onSuccess: () => {
      toast.dismiss();
      succes();
      setOpen(false);
      onSuccess();
    },
    onError: (e) => {
      toast.dismiss();
      error();
      console.log(e);
    },
  });

  const onAdd = () => {
    if (asset && title && value) {
      addBlog({
        blog: {
          title,
          locale: size,
          content: value,
        },
        image: {
          url: asset.url,
          fileKey: asset.fileKey,
          name: asset.name,
        },
      });
      return;
    }
    toast.error(common("input.fill all fields"));

    // addBlog({
    //   title: value,
    //   content: value,
    //   image: ,
    // });
  };
  //   const [img, setImg] = React.useState<TImage | undefined>(
  //     user?.image || undefined
  //   );
  // default is 'middle'

  return (
    <>
      <button className="btn-primary btn" onClick={() => setOpen(true)}>
        {common("button.new blog")}
      </button>
      <Modal
        title={common("button.new blog")}
        centered
        open={open}
        destroyOnClose
        maskClosable={false}
        closable={false}
        onOk={() => onAdd()}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <div className="space-y-5 py-3">
          <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
            <Radio.Button value={undefined}>
              {common("text.undefined")}
            </Radio.Button>
            <Radio.Button value="fr">{common("text.fr")}</Radio.Button>
            <Radio.Button value="en">{common("text.en")}</Radio.Button>
          </Radio.Group>
          <Input
            placeholder={common("input.title")}
            size="large"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold"
          />
          <div
            style={{ backgroundImage: `url(${img?.url})` }}
            className="relative h-[240px] border border-dashed bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute bottom-2 right-2 rounded-md bg-white">
              <UploadButton
                aspect={2.35 / 1}
                setPreviewImage={(k) => {
                  console.log("preview", k);
                  setImg(k);
                }}
                onSuccess={(k) => {
                  console.log("succes", k);
                  setAsset(k);
                }}
              />
            </div>
          </div>
          <MDEditor
            onLoad={(e) => {
              console.log(e);
            }}
            value={value}
            onChange={(s) => setValue(s || "")}
          />
        </div>
      </Modal>
    </>
  );
};