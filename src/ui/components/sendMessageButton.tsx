import React, { useState } from "react";
import { useLang, useNotif } from "../../pages/hooks";
import { Button, Tooltip } from "antd";
import { EmailIcon } from "@ui/icons";
import cx from "classnames";
import { sendMessage } from "@repository/index";
import { toast } from "react-hot-toast";
type Props = {
  sender?: string;
  receiver: string;
};
const SendMessageButton = ({ sender, receiver }: Props) => {
  const { text: common } = useLang(undefined);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { succes, loading, error } = useNotif();
  const [isLoading, setIsLoading] = useState(false);
  const onSend = () => {
    loading();
    setOpen(false);
    sendMessage({
      content: message,
      sender: sender || "ADMIN",
      receiver,
    })
      .then(() => {
        setMessage("");
        toast.dismiss();
        succes();
      })
      .catch((e) => {
        toast.dismiss();
        error();
        console.log("e", e);
      });
  };
  return (
    <div className="relative flex flex-row items-center justify-center text-primary">
      <Button
        onClick={() => setOpen(true)}
        shape="circle"
        icon={<EmailIcon className="mx-auto text-lg" />}
      />
      <div
        className={cx(
          "absolute left-[-200px] top-0 z-[100] flex w-[300px] flex-col gap-3 rounded-lg bg-white p-3 shadow-lg",
          {
            hidden: !open,
          }
        )}
      >
        <textarea
          placeholder={common("input.placeholder")}
          rows={5}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="rounded-md border p-1"
        ></textarea>
        <div className="flex flex-row items-center justify-between">
          <button
            onClick={() => setOpen(false)}
            className="btn-ghost btn-xs btn "
          >
            {common("button.cancel")}
          </button>
          <button onClick={onSend} className="btn-primary btn-xs btn ">
            {common("button.send")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageButton;
