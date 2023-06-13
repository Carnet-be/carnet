/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, InputNumber, Modal, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import { DeleteIcon, EditIcon, ViewIcon } from "@ui/icons";
import { Auction, Bid, Blog, Brand, Model } from "@prisma/client";
import { TableRowSelection } from "antd/es/table/interface";
import moment from "moment";
import { User } from "next-auth";
import { executeEverySecond } from "./countDown";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GrResume } from "react-icons/gr";
import { BsFillPlayFill } from "react-icons/bs";
import { MdRestartAlt } from "react-icons/md";
import { LangCommonContext, useLang } from "../../pages/hooks";
const { Option } = Select;
interface Props<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading: boolean;
  rowSelection?: TableRowSelection<TableType>;
  options?: Object;
}
export type TableType = Auction | Bid | User | Brand | Model | Blog;
const MyTable: React.FC<Props<TableType>> = ({
  columns,
  data,
  loading,
  options,
  rowSelection,
}) => {
  const [parent] = useAutoAnimate(/* optional config */);
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

export const renderDate = (date: string, format = "L") => {
  return <Tag color="processing">{moment(date).format(format)}</Tag>; // <div className={cx("rounded-md px-2 py-[1px] flex justify-center",`bg-${color}-100 border border-${color}-500 text-${color}-500`)}>{moment(date).format('L')}</div>
};

export const RenderTimer = ({
  date,
  state,
  init,
  onAddTime,
}: {
  date: Date;
  state: "pause" | "published" | "pending";
  init: Date | undefined;
  onAddTime?: (value: number, hour: number) => void;
}) => {
  const { text: common } = useLang(undefined);
  const [leftTime, setleft] = useState<moment.Duration>(
    executeEverySecond(date, init)
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        state == "published" &&
        leftTime.asSeconds() > 0 &&
        setleft(executeEverySecond(date)),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    console.log(leftTime);
  }, [leftTime]);
  const [value, setValue] = useState(0);
  const [hour, setHour] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    onAddTime && onAddTime(value, hour);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Tag
        onClick={showModal}
        color={
          leftTime?.asSeconds() <= 0
            ? "error"
            : state == "pause"
            ? "yellow"
            : state == "published"
            ? "green"
            : "default"
        }
        className="flex cursor-pointer flex-row items-end justify-center gap-1 font-semibold"
      >
        {leftTime?.asSeconds() <= 0 ? (
          common("table.expired")
        ) : state == "pending" ? (
          <span className="">Pending</span>
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
            <span>
              {leftTime?.seconds()}
              <span className="text-sm font-light opacity-70">s</span>
            </span>
          </>
        )}
      </Tag>
      <Modal
        title={common("text.add time")}
        open={onAddTime ? isOpen : false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-row gap-4">
          <InputNumber
            addonAfter={common("text.days")}
            defaultValue={0}
            value={value}
            onChange={(e) => setValue(e || 0)}
          />
          <InputNumber
            addonAfter={common("text.hours")}
            defaultValue={0}
            value={hour}
            onChange={(e) => setHour(e || 0)}
          />
        </div>
      </Modal>
    </>
  );
};

export const ActionTable = ({
  onView,
  onDelete,
  onEdit,
  id,
  onPlay,
  onCustom,
  onRepublish,
  onCustom2,
}: {
  id?: string | number;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeleteModal?: () => void;
  onCustom?: () => {
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
  };
  onCustom2?: () => {
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
  };
  onPlay?: () => void;
  onRepublish?: () => void;
}) => {
  const { text: common } = useLang(undefined);
  const ref = useRef<HTMLLabelElement>(null);
  const refDelete = useRef<HTMLLabelElement>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEdit2, setOpenEdit2] = useState(false);
  const [openPlay, setOpenPlay] = useState(false);
  return (
    <div className="flex flex-row items-center justify-center gap-1">
      {id && onDelete && (
        <ConfirmationDelete
          open={openDelete}
          setOpen={setOpenDelete}
          id={id}
          onDelete={onDelete}
        />
      )}
      {id && onCustom && (
        <ConfirmationPause
          open={openEdit}
          setOpen={setOpenEdit}
          id={id}
          onValide={onCustom().onClick}
        />
      )}
      {id && onCustom2 && (
        <ConfirmationPause
          open={openEdit2}
          setOpen={setOpenEdit2}
          id={id}
          onValide={onCustom2().onClick}
        />
      )}
      {id && onPlay && (
        <ConfirmationPause
          open={openPlay}
          setOpen={setOpenPlay}
          id={id}
          onValide={() => onPlay()}
        />
      )}
      <label
        ref={ref}
        hidden={true}
        htmlFor={id ? id.toString() : undefined}
      ></label>
      <label ref={refDelete} hidden={true} htmlFor={"delete" + id}></label>
      {onRepublish && (
        <Tooltip
          title={common("button.republish")}
          className="flex flex-row items-center justify-center"
        >
          <Button
            onClick={onRepublish}
            shape="circle"
            icon={<MdRestartAlt className="text-lg" />}
          />
        </Tooltip>
      )}
      {onPlay && (
        <Tooltip
          title={common("button.resume")}
          className="flex flex-row items-center justify-center"
        >
          <Button
            onClick={() => {
              setOpenPlay(true);
            }}
            shape="circle"
            icon={<BsFillPlayFill className="text-lg" />}
          />
        </Tooltip>
      )}
      {onView && (
        <Tooltip
          title={common("button.view")}
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
          title={common("button.edit")}
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
      {onCustom && (
        <Tooltip
          title={onCustom().tooltip}
          className="flex flex-row items-center justify-center text-primary"
        >
          <Button
            onClick={() => {
              setOpenEdit(true);
            }}
            shape="circle"
            icon={onCustom().icon}
          />
        </Tooltip>
      )}
      {onCustom2 && (
        <Tooltip
          title={onCustom2().tooltip}
          className="flex flex-row items-center justify-center text-primary"
        >
          <Button
            onClick={() => {
              setOpenEdit2(true);
            }}
            shape="circle"
            icon={onCustom2().icon}
          />
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip
          title={common("button.delete")}
          className="flex flex-row items-center justify-center text-red-500"
        >
          <Button
            onClick={() => {
              setOpenDelete(true);
            }}
            shape="circle"
            icon={<DeleteIcon className="text-lg" />}
          />
        </Tooltip>
      )}
    </div>
  );
};

const ConfirmationDelete = ({
  id,
  onDelete,
  open,
  setOpen,
}: {
  id: string | number;
  onDelete: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const common = useContext(LangCommonContext);
  return (
    <>
      <Modal
        okType="danger"
        title={common("text.warning")}
        open={open}
        onOk={onDelete}
        onCancel={() => setOpen(false)}
      >
        <p>{common("text.modal delete")}</p>
      </Modal>
    </>
  );
};

const ConfirmationPause = ({
  id,
  onValide,
  open,
  setOpen,
}: {
  id: string | number;
  onValide: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const common = useContext(LangCommonContext);
  return (
    <>
      <Modal
        title={common("text.warning")}
        open={open}
        onOk={onValide}
        onCancel={() => setOpen(false)}
      >
        <p>{common("text.modal confirm")}</p>
      </Modal>
    </>
  );
};
