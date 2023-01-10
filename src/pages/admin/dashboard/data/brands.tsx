import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { InferGetServerSidePropsType } from "next";
import { type GetServerSideProps } from "next";
import React, { useRef, useState } from "react";
import Dashboard from "@ui/dashboard";
import * as XLSX from "xlsx";

import { trpc } from "@utils/trpc";
import BigTitle from "@ui/components/bigTitle";
import type { TableType } from "@ui/components/table";
import MyTable, { ActionTable } from "@ui/components/table";
import type { Brand, User } from "@prisma/client";
import type { ColumnsType } from "antd/es/table";
import { Input, Modal, Tag } from "antd";
import toast from "react-hot-toast";
import { SwitcherData } from ".";
import { InportIcon } from "@ui/icons";
import cx from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import TextArea from "antd/lib/input/TextArea";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log(session?.user);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};
const Brands = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: brands, isLoading, refetch } = trpc.admin.getBrand.useQuery();
  const { mutate: addBrand, isLoading: isAdding } =
    trpc.admin.addBrand.useMutation({
      onError: (err) => {
        console.log("error message",err.message);
        if(err.message.includes("Unique constraint failed on the fields")){
          toast.error("Brand already exists")
        }else{
          toast.error("Error encountered");
        }
          
       
      },
      onSuccess: () => {
        toast.success("Brand(s) added");
        setOpen(false);
        refetch();
      },
    });
  const fileRef = useRef<HTMLInputElement>(null);
  const columns: ColumnsType<Brand> = [
    {
      title: "Id",
      width: "50px",
      dataIndex: "id",
      key: "id",
      render: (v) => (
        <span className="text-[12px] italic text-primary">#{v}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (v) => <h6>{v}</h6>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Models",
      dataIndex: "models",
      key: "models",
      align: "right",
      render: (v) => <Tag>{v.length}</Tag>,
    },
    {
      title: "Actions",

      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, user) => (
        <ActionTable
          id={user.id.toString()}
          onDelete={() => {}}
          onEdit={() => {
            console.log("edit");
          }}
        />
      ),
    },
  ];
  const onPickfile = () => fileRef.current?.click();
  const onImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.files);

    const files = event.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // evt = on_file_select event
        /* Parse data */
        const bstr = e.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        if (wsname) {
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data: any = XLSX.utils.sheet_to_json(ws!);
          /* Update state */
          toast.dismiss();
          const lines = data.map((d: any) => ({
            name: d.name,
            country: d.country,
            description: d.description,
          }));
          console.log(data);
          //  for(let i=0;i<Object.keys(data).length;i++){

          //   if(data[i].name){
          //   lines.push({name:data[i].name,country:data[i].country,description:data[i].description})
          //   }
          //  }
          const init = brands?.map((b) => ({
            name: b.name,
            country: b.country || undefined,
            desription: b.description || undefined,
          }));
          addBrand({ init: init!, brands: lines });
        }
      };
      reader.readAsBinaryString(file);
    }
  };
  const [open, setOpen] = useState<boolean | undefined>(false);
  return (
    <Dashboard type="ADMIN">
      <SwitcherData />

      <div className="mt-6 flex flex-col">
        <div className="flex flex-row items-center justify-end gap-6 py-3">
          <button
            onClick={() => setOpen(true)}
            className="btn-primary btn-sm btn"
          >
            add Brand
          </button>
          <button
            onClick={onPickfile}
            className={cx("btn-sm btn items-center gap-2", {
              loading: isAdding,
            })}
          >
            <input
              onChange={onImport}
              hidden
              ref={fileRef}
              type="file"
              accept=".xlsx, .xls"
            />
            <InportIcon className="text-lg" />
            Import
          </button>
        </div>
        <MyTable
          loading={isLoading}
          data={brands || []}
          // xScroll={1000}

          columns={columns as ColumnsType<TableType>}
          // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
      <ModelBrand
        open={open == undefined ? false : open}
        setOpen={(e) => setOpen(e)}
        onValide={(b: FBrand) => addBrand({ init: [], brands: [b] })}
      />
    </Dashboard>
  );
};

export default Brands;

type ModelBrandProps = {
  onValide: (e: FBrand) => void;
  brand?: Brand;
  open: boolean;
  setOpen: (e: boolean | undefined) => void;
};
type FBrand = {
  name: string;
  country?: string;
  description?: string;
};
const ModelBrand = ({ brand, open, setOpen, onValide }: ModelBrandProps) => {
  const { register, handleSubmit, watch, formState,getValues } = useForm<FBrand>({

  });

  const { errors } = formState;

  const handleCancel = () => {
    setOpen(undefined);
  };

  const onSubmit: SubmitHandler<FBrand> = (data) => onValide(data);

  return (
    <>
      <Modal
        open={open}
        destroyOnClose={true}
        title="Brand"
        onCancel={handleCancel}
        footer={[
          <button
            onClick={() =>
              onValide(getValues())
            }
            className={cx("btn-primary btn-sm btn",{
              "btn-disabled":!watch('name')
            })}
          >
            add
          </button>,
        ]}
      >
        <div className="flex flex-col gap-3 py-3">
        <input type="text" {...register("name", { required: true })} placeholder="Name" className="input w-full input-bordered " />
        <input type="text" {...register("country")} placeholder="Country" className="input w-full input-bordered " />
         
        <textarea className="textarea textarea-bordered w-full" {...register("description")} placeholder="Description" ></textarea>
        </div>
      </Modal>
    </>
  );
};
