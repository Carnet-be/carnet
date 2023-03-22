/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Lottie from "@ui/components/lottie";
import { trpc } from "@utils/trpc";
import { Input } from "antd";
import { InternalMessage } from "@prisma/client";
import cx from "classnames";

import animationEmpty from "../../public/animations/mo_message.json";
import { TMessage, getMessages, sendMessage } from "@repository/index";
import { DisplayMessage } from "../pages/admin/dashboard/chat";
const ChatPage = ({
  id,
  receiver = "ADMIN",
  isAdmin = false,
}: {
  id: "ADMIN" | string;
  receiver?: "ADMIN" | string;
  isAdmin?: boolean;
}) => {

  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(text);
    setIsLoading(true);
    sendMessage({
      content: text,
      sender:id,
      receiver: "ADMIN",
    }).then((res) => {
      setText("");
      setIsLoading(false);
    });
  };
  const [messages, setMessages] = useState<TMessage[]>([]);
  useEffect(() => {
    const unsubscribe= getMessages({
      id,
      setMessage: (messages) => {
        setMessages(messages);
      },
    });
    return ()=>{
      unsubscribe()
    }
  }, []);
  return (
    <div className={cx("flex mx-auto h-screen w-full lg:max-w-[800px] flex-col-reverse items-center")}>
      <form
        onSubmit={onSubmit}
        className="flex w-full w-full lg:max-w-[800px] flex-row  items-center items-center justify-center rounded-md bg-white p-4 shadow-md"
      >
        <Input.Group className="flex w-full flex-grow flex-row items-center gap-3">
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="large"
            placeholder="Type your message here..."
            className="flex-grow"
            style={{ width: "calc(100% - 200px)" }}
          />
          <button
            className={cx("btn-primary btn", {
              loading: isLoading,
            })}
          >
            send
          </button>
        </Input.Group>
      </form>
      <div className={cx("w-fullflex-grow w-full overflow-scroll px-4")}>
        <DisplayMessage
          user={undefined}
          isAdmin
          items={messages || []}
          id={id}
        />
      </div>
    </div>)
};

export default ChatPage;
