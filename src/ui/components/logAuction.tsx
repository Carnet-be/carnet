import React, { useState } from "react";
import { Button, Modal, Tag } from "antd";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { IconButton } from "@mui/material";
import { trpc } from "@utils/trpc";
import toast from "react-hot-toast";
import moment from "moment";
import cx from "classnames";
const LogAuction = ({ id }: { id: string }) => {
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: logs } = trpc.admin.getLogAuctions.useQuery(id, {
    enabled: isModalOpen,
    onError: (err) => {
      console.log(err);
      toast.error("Faild to delete");
      handleCancel();
    },
  });
  return (
    <>
      <IconButton
        onClick={showModal}
        size="small"
        title="logs"
        aria-label="delete"
      >
        <BsFillJournalBookmarkFill />
      </IconButton>
      <Modal
        title="Logs"
        open={isModalOpen}
        onOk={handleOk}
        cancelButtonProps={{ hidden: true }}
        onCancel={handleCancel}
      >  
     {logs?.[0] &&   <div className="my-2">
       <h6>{logs[0].name}</h6>
       <span className="text-[10px] text-primary">#{logs[0].id}</span>
       </div>}
        <div className={cx("flex flex-col items-stretch gap-1",{
            "max-h-96 overflow-y-scroll":true
        })}>
          {logs?.[1]?.map((log, k) => {
            let color = "blue";
            if (log.action === "creation") color = "green";
            if (log.action === "published") color = "orange";
            if (log.action === "pause") color = "red";
            if (log.action === "choice winner") color = "purple";

            if (log.action === "republished") color = "yellow";
            if (log.action === "add time") color = "cyan";
            if (log.action === "cancel winner") color = "geekblue";

            return (
              <div
                key={k}
                className={cx("flex px-2 rounded-sm flex-row items-center justify-between",{
                    "bg-gray-50":true

                })}
              >
                <Tag color={color}>{log.action}</Tag>
              <div className="flex flex-col items-end">
              <span className="text-[11px]">{moment(log.createAt).fromNow()}</span>
              <span className="text-[10px] opacity-70 italic">{moment(log.createAt).format("d/mm/yyyy hh:mm")}</span>
              </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default LogAuction;
