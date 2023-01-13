import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { InferGetServerSidePropsType } from "next";
import { type GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import Dashboard from "@ui/dashboard";
import * as XLSX from "xlsx";

import { trpc } from "@utils/trpc";
import BigTitle from "@ui/components/bigTitle";
import type { TableType } from "@ui/components/table";
import MyTable, { ActionTable } from "@ui/components/table";
import type { Brand, Model, User } from "@prisma/client";
import type { ColumnsType } from "antd/es/table";
import { Button, Input, Modal, Table, Tag } from "antd";
import toast from "react-hot-toast";
import { SwitcherData } from ".";
import { DeleteIcon, InportIcon } from "@ui/icons";
import cx from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import TextArea from "antd/lib/input/TextArea";
import { TableRowSelection } from "antd/es/table/interface";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
const Models = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [edit, setedit] = useState<Model | undefined>(undefined);
  const [open, setOpen] = useState<boolean | undefined>(false);
  const [modal, contextHolder] = Modal.useModal();

  const { data: models, isLoading, refetch } = trpc.admin.getModel.useQuery();

  const { mutate: updateBrand } = trpc.admin.updateBrand.useMutation({
    onError: (err) => {
      console.log("error message", err.message);
      if (err.message.includes("Unique constraint failed on the fields")) {
        toast.error("Brand already exists");
      } else {
        toast.error("Error encountered");
      }
    },
    onSuccess: () => {
      toast.success("Brand updated");
      setedit(undefined);
      refetch();
    },
  });
  const { mutate: removeBrand, isLoading: isRemoving } =
    trpc.admin.removeBrand.useMutation({
      onError: (err) => {
        console.log("error message", err.message);
        toast.error("Error encountered");
      },
      onSuccess: () => {
        toast.success("Brand(s) removed");

        refetch();
      },
    });
  const fileRef = useRef<HTMLInputElement>(null);
  const columns: ColumnsType<Model> = [
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
      width: "150px",
      key: "name",
      render: (v) => <h6>{v}</h6>,
    },
    {
      title: "Year",
      dataIndex: "year",
      width: "150px",
      key: "year",
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (v) => (
        <div>
          <h6>{v.name}</h6>
          <span className="text-[12px] italic text-primary">#{v.id}</span>
        </div>
      ),
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
          onDelete={() => removeBrand([user.id])}
          onEdit={() => {
            setedit(user);
          }}
        />
      ),
    },
  ];
  const onPickfile = () => fileRef.current?.click();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<Brand> = {
    selectedRowKeys,
    // onChange: onSelectChange,
    onSelectInvert: (selectedRowKeys) => {
      console.log("onSelectInvert", selectedRowKeys);
    },
    onChange(selectedRowKeys, selectedRows, info) {
      console.log(selectedRowKeys, selectedRows, info);
      setSelectedRowKeys(selectedRowKeys);
    },

    selections: [Table.SELECTION_ALL],
  };

  return (
    <Dashboard type="ADMIN">
      <SwitcherData />

      <div className="mt-6 flex flex-col">
        <div className="flex flex-row items-center justify-end gap-6 py-3">
          <button
            onClick={() => removeBrand(selectedRowKeys as number[])}
            className={cx("btn-error btn-sm btn", {
              hidden: selectedRowKeys.length === 0,
            })}
          >
            <DeleteIcon className="text-lg" />
          </button>
          <div className="flex-grow"></div>
          {/* <button
            onClick={() => setOpen(true)}
            className="btn-primary btn-sm btn"
          >
            add Brand
          </button> */}
          <ImportModelDialog
            onSuccess={() => {
              refetch();
            }}
          />
        </div>
        <MyTable
          rowSelection={rowSelection as TableRowSelection<TableType>}
          loading={isLoading}
          data={models || []}
          // xScroll={1000}

          columns={columns as ColumnsType<TableType>}
          // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
      {/* <ModelBrand
        open={open == undefined ? false : open}
        onClose={() => setOpen(false)}
        onValide={(b: FBrand) => addBrand({ init: [], brands: [b] })}
      />
      <ModelBrandUpdate open={edit!=undefined}  brand={edit}  onClose={() => setedit(undefined)}   onValide={(b: FBrand) => updateBrand({id:edit?.id!,data:b})}/> */}
    </Dashboard>
  );
};

export default Models;

type ImportDialogProps = {
  onSuccess: () => void;
};
const ImportModelDialog = ({ onSuccess }: ImportDialogProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { data: brands, isLoading: isGettingBrands } =
    trpc.admin.getBrand.useQuery();
  const { mutate: addModel, isLoading: isAdding } =
    trpc.admin.addModel.useMutation({
      onError: (err) => {
        console.log("error message", err.message);
        if (err.message.includes("Unique constraint failed on the fields")) {
          toast.error("Brand already exists");
        } else {
          toast.error("Error encountered");
        }
      },
      onSuccess: () => {
        toast.success("Brand(s) added");
        onSuccess();
        handleCancel()
      },
    });
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
            name: (d.name||"blank").toString(),
            year: d.year,
            description: d.description,
          }));
          console.log(data);
    
    
          addModel({ brandId:brandSelected?.id!,models: lines });
        }
      };
      reader.readAsBinaryString(file);
    }
  };
  const [brandSelected, setbrandSelected] = useState<Brand | undefined>(
    undefined
  );
  const [search, setsearch] = useState("")
  const onPickfile = () => fileRef.current?.click();

  return (
    <>
      <button
        onClick={showModal}
        className={cx("btn-sm btn items-center gap-2", {})}
      >
        <InportIcon className="text-lg" />
        Import
      </button>
      <Modal
        title="Choose Brand"
        open={isModalOpen}
       
        destroyOnClose={false}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
         cancel
        </Button>,
          <Button
          type="primary"
            onClick={onPickfile}
            disabled={!brandSelected}
           >
            <input
              onChange={onImport}
              hidden
              ref={fileRef}
              type="file"
              accept=".xlsx, .xls"
            />
           
           confirm
          </Button>
        ]}
        
      >
        <Input value={search} onChange={(e)=>setsearch(e.target.value)} width={"200px"} placeholder="Search" />
        <div className="mx-auto my-3 flex w-[90%]  flex-wrap items-center gap-3 border-dashed">
          {brands&& brands.filter((b)=>b.name.includes(search)).map((b, i) => {
              return (
                <Tag
                  onClick={() => setbrandSelected(b)}
                  color={
                    brandSelected && brandSelected.id == b.id
                      ? "blue"
                      : "magenta"
                  }
                  className="my-0 cursor-pointer"
                >
                  {b.name}
                </Tag>
              );
            })}
        </div>
      </Modal>
    </>
  );
};

type ModelBrandProps = {
  onValide: (e: FBrand) => void;
  brand?: Brand;
  open: boolean;

  onClose: () => void;
};
type FBrand = {
  name: string;
  country?: string;
  description?: string;
};
const ModelBrand = ({ brand, open, onClose, onValide }: ModelBrandProps) => {
  const { register, handleSubmit, watch, formState, getValues } =
    useForm<FBrand>({});

  const { errors } = formState;

  const onSubmit: SubmitHandler<FBrand> = (data) => onValide(data);

  return (
    <>
      <Modal
        open={open}
        destroyOnClose={true}
        title="Brand"
        onCancel={onClose}
        footer={[
          <button
            onClick={() => onValide(getValues())}
            className={cx("btn-primary btn-sm btn", {
              "btn-disabled": !watch("name"),
            })}
          >
            add
          </button>,
        ]}
      >
        <div className="flex flex-col gap-3 py-3">
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Name"
            className="input-bordered input w-full "
          />
          <input
            type="text"
            {...register("country")}
            placeholder="Country"
            className="input-bordered input w-full "
          />

          <textarea
            className="textarea-bordered textarea w-full"
            {...register("description")}
            placeholder="Description"
          ></textarea>
        </div>
      </Modal>
    </>
  );
};

const ModelBrandUpdate = ({
  brand,
  open,
  onClose,
  onValide,
}: ModelBrandProps) => {
  const defaultValues = {
    name: brand?.name,
    country: brand?.country!,
    description: brand?.description!,
  };
  const { register, watch, formState, getValues, setValue } = useForm<FBrand>({
    defaultValues,
  });

  const { errors } = formState;

  useEffect(() => {
    if (brand) {
      console.log("brand", brand);
      setValue("name", brand.name);
      setValue("country", brand.country || undefined);
      setValue("description", brand.description || undefined);
    }
  }, [brand]);

  const onSubmit: SubmitHandler<FBrand> = (data) => onValide(data);
  const isEditable = () => {
    if (watch("name") !== defaultValues.name) {
      return true;
    }
    if (watch("country") !== defaultValues.country) {
      return true;
    }
    if (watch("description") !== defaultValues.description) {
      return true;
    }
  };
  return (
    <>
      <Modal
        open={open}
        destroyOnClose={true}
        title="Brand"
        onCancel={onClose}
        footer={[
          <button
            onClick={() => onValide(getValues())}
            className={cx("btn-primary btn-sm btn", {
              "btn-disabled": !isEditable(),
            })}
          >
            update
          </button>,
        ]}
      >
        <div className="flex flex-col gap-3 py-3">
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Name"
            className="input-bordered input w-full "
          />
          <input
            type="text"
            {...register("country")}
            placeholder="Country"
            className="input-bordered input w-full "
          />

          <textarea
            className="textarea-bordered textarea w-full"
            {...register("description")}
            placeholder="Description"
          ></textarea>
        </div>
      </Modal>
    </>
  );
};
