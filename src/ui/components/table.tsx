/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import { DeleteIcon, EditIcon, ViewIcon } from "@ui/icons";
import { Auction, Bid, Brand, Model } from "@prisma/client";
import { TableRowSelection } from "antd/es/table/interface";
import moment from "moment";
import { User } from "next-auth";
import { executeEverySecond } from "./countDown";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading: boolean;
  rowSelection?: TableRowSelection<TableType>;
  options?: Object;
}
export type TableType = Auction | Bid | User | Brand | Model;
const MyTable: React.FC<Props<TableType>> = ({
  columns,
  data,
  loading,
  options,
  rowSelection,
}) => {
  const [parent] = useAutoAnimate(/* optional config */)
  return (
    <Table
      size="small"
      
      className="w-full"
      rowSelection={rowSelection}
      rowKey={(record) => record.id}
      {...options}
      loading={loading}
      columns={columns}
      dataSource={data}
    />
  );
};

export default MyTable;

export const renderDate = (date: string, format="L") => {
  return <Tag color="processing">{moment(date).format(format)}</Tag>; // <div className={cx("rounded-md px-2 py-[1px] flex justify-center",`bg-${color}-100 border border-${color}-500 text-${color}-500`)}>{moment(date).format('L')}</div>
};

export const RenderTimer = ({ date }: { date: Date }) => {
  const [leftTime, setleft] = useState<moment.Duration>(
    executeEverySecond(date)
  );

  useEffect(() => {
    const interval = setInterval(
      () => leftTime.asSeconds() > 0 && setleft(executeEverySecond(date)),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    console.log(leftTime);
  }, [leftTime]);
  return (
    <Tag
      color={leftTime?.asSeconds() <= 0 ? "error" : "default"}
      className="flex flex-row items-end justify-center gap-1 font-semibold"
    >
      {leftTime?.asSeconds() <= 0 ? (
        "Expired"
      ) : (
        <>
          <span>
            {leftTime?.days()}
            <span className="text-sm font-light opacity-70">d</span>
          </span>
          <span>
            {leftTime?.hours()}
            <span className="text-sm font-light opacity-70">h</span>
          </span>
          <span>
            {leftTime?.minutes()}
            <span className="text-sm font-light opacity-70">m</span>
          </span>
        </>
      )}
    </Tag>
  );
};

export const ActionTable = ({
  onView,
  onDelete,
  onEdit,
  id,
}: {
  id?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeleteModal?: () => void;
}) => {
  const ref = useRef<HTMLLabelElement>(null);
  const refDelete = useRef<HTMLLabelElement>(null);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="flex flex-row items-center justify-center gap-1">
     {id && onDelete&& <ConfirmationDelete open={openDelete} setOpen={setOpenDelete} id={id} onDelete={onDelete} />}
      <label ref={ref} hidden={true} htmlFor={id}></label>
      <label ref={refDelete} hidden={true} htmlFor={"delete" + id}></label>
      {onView && (
        <Tooltip
          title="View"
          className="flex flex-row items-center justify-center"
        >
          <Button
            onClick={onView}
            shape="circle"
            icon={<ViewIcon className="text-lg" />}
          />
        </Tooltip>
      )}

      {onEdit && (
        <Tooltip
          title="Edit"
          className="flex flex-row items-center justify-center text-primary"
        >
          <Button
            onClick={() => {
              ref.current?.click();
              onEdit();
            }}
            shape="circle"
            icon={<EditIcon className="text-lg" />}
          />
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip
          title="Delete"
          className="flex flex-row items-center justify-center text-red-500"
        >
          <Button
            onClick={() => {
            setOpenDelete(true)
            }}
            shape="circle"
            icon={<DeleteIcon className="text-lg" />}
          />
        </Tooltip>
      )}


    </div>
  );
};


const  ConfirmationDelete = ({
  id,
  onDelete,
  open,setOpen
}: {
  id: string|number;
  onDelete: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {


  return (
    <>
 
      <Modal okType='danger' title="Warning" open={open} onOk={onDelete} onCancel={()=>setOpen(false)}>
        <p>You are about to delete this element</p>
      </Modal>
    </>
  );
};