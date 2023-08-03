/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { GetServerSideProps } from "next";
import { prisma } from "../../../server/db/client";
import Dashboard from "@ui/dashboard";
import { LangCommonContext, LangContext, useLang, useNotif } from "../../hooks";
import type { AssetImage, Blog, Language } from "@prisma/client";
import type { ColumnsType } from "antd/es/table";
import type {
  TableType} from "@ui/components/table";
import MyTable, {
  ActionTable,
  renderDate,
} from "@ui/components/table";
import { Button, Input, Modal, Radio, Tag, Tooltip } from "antd";
import { DeleteIcon, EditIcon, ViewIcon } from "@ui/icons";
import BigTitle from "@ui/components/bigTitle";
import { trpc } from "@utils/trpc";
import Image from "next/image";
import type { TImage } from "@ui/components/uploadButton";
import UploadButton from "@ui/components/uploadButton";
import type { Lang } from "@model/type";
import toast from "react-hot-toast";
import { AdvancedImage } from "@cloudinary/react";
import cloudy from "@utils/cloudinary";
import { useRouter } from "next/router";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
  const {
    data: bids,
    isLoading,
    refetch,
  } = trpc.blog.getBlogs.useQuery(undefined, {
    onSuccess(data) {
      console.log("fetching blogs");
    },
  });
  const { text: common } = useLang(undefined);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const router = useRouter();
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
  const [blog, setBlog] = useState<(Blog & { image: AssetImage }) | undefined>(
    undefined
  );
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
            setBlog({ ...b, image: (b as any).image as AssetImage });
          }}
          onView={() => {
            router.push(`/blogs/${b.id}?type=ADMIN`);
          }}
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
              blog={blog}
              onSuccess={() => {
                refetch();
              }}
              onClose={() => {
                setBlog(undefined);
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

const AddBlog = ({
  onSuccess,
  blog,
  onClose,
}: {
  onSuccess: () => void;
  blog?: Blog & {
    image: AssetImage;
  };
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState(blog?.title || "");
  const common = useContext(LangCommonContext);
  const { error, loading, succes } = useNotif();
  const [img, setImg] = React.useState<AssetImage | TImage | undefined>(
    blog ? blog.image : undefined
  );
  const [asset, setAsset] = React.useState<AssetImage | TImage | undefined>(
    blog ? blog.image : undefined
  );
  const [size, setSize] = useState<Language | undefined>(
    blog ? (blog.locale as Language) : undefined
  );
  const text = useContext(LangContext);

  const clear = () => {
    setTitle("");
    setValue(EditorState.createEmpty());
    setAsset(undefined);
    setSize(undefined);
    setImg(undefined);
  };

  const { mutate: addBlog } = trpc.blog.addBlog.useMutation({
    onMutate: () => {
      loading();
    },
    onSuccess: () => {
      toast.dismiss();
      succes();

      handleClose();
      onSuccess();
    },
    onError: (e) => {
      toast.dismiss();
      error();
      console.log(e);
    },
  });

  const { mutate: updateBlog } = trpc.blog.updateBlog.useMutation({
    onMutate: () => {
      loading();
    },
    onSuccess: () => {
      toast.dismiss();
      succes();
      handleClose();
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
      if (blog) {
        updateBlog({
          blog: {
            id: blog.id,
            title,
            locale: size,
            content: JSON.stringify(convertToRaw(value.getCurrentContent())),
          },
          image: {
            url: asset.url,
            fileKey: asset.fileKey,
            name: asset.name,
          },
        });
      } else {
        addBlog({
          blog: {
            title,
            locale: size,
            content: JSON.stringify(convertToRaw(value.getCurrentContent())),
          },
          image: {
            url: asset.url,
            fileKey: asset.fileKey,
            name: asset.name,
          },
        });
      }
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
  const { locale } = useRouter();
  const handleClose = () => {
    setOpen(false);
    clear();
    onClose && onClose();
  };
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setValue(
        EditorState.createWithContent(convertFromRaw(JSON.parse(blog.content)))
      );
      setImg(blog.image);
      setAsset(blog.image);
      setSize(blog.locale ? (blog.locale as Lang) : undefined);
    }
  }, [blog]);
  const [load, setLoad] = useState(false);

  return (
    <>
      <button className="btn-primary btn" onClick={() => setOpen(true)}>
        {common("button.new blog")}
      </button>
      <Modal
        title={blog ? common("button.edit blog") : common("button.new blog")}
        centered
        open={open || blog ? true : false}
        destroyOnClose
        maskClosable={false}
        closable={false}
        onOk={() => onAdd()}
        onCancel={handleClose}
        width={1000}
      >
        <div className="grid grid-cols-[2fr_1fr] gap-3 py-3">
          <div className="space-y-2">
            <Input
              placeholder={common("input.title")}
              size="large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold"
            />

            <div>
              <Editor
                locale={locale}
                editorState={value}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => {
                  console.log("e.", e);
                  setValue(e);
                }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
              <Radio.Button value={undefined}>
                {common("text.undefined")}
              </Radio.Button>
              <Radio.Button value="fr">{common("text.fr")}</Radio.Button>
              <Radio.Button value="en">{common("text.en")}</Radio.Button>
            </Radio.Group>
            <div
              style={{ backgroundImage: `url(${img?.url})` }}
              className="relative h-[200px] border border-dashed bg-cover bg-center bg-no-repeat"
            ></div>
            <div className="mx-auto rounded-md bg-white">
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
        </div>
      </Modal>
    </>
  );
};
