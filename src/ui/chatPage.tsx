/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Lottie from "@ui/components/lottie";
import { trpc } from "@utils/trpc";
import { Input } from "antd";
import { InternalMessage } from "@prisma/client";
import cx from "classnames";

import animationEmpty from "../../public/animations/mo_message.json";
import { TMessage, getMessages, sendMessage } from "@repository/index";
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
      sender: id,
      receiver,
    })
      .then((res) => {
        setText("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const [messages, setMessages] = useState<TMessage[]>([]);
  useEffect(() => {
    getMessages({
      id,
      setMessage: (messages) => {
        setMessages(messages);
      },
    });
  }, []);

  return (
    <div
      className={cx({
        "absolute bottom-0 left-0 flex h-[100vh] w-full flex-col-reverse items-center gap-6 py-6 px-10 ":
          !isAdmin,
        "flex h-full w-full flex-col-reverse items-center gap-6 py-6 px-10 overflow-hidden":isAdmin
      })}
    >
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-row items-center  items-center justify-center rounded-md bg-white p-4 shadow-md lg:max-w-[700px]"
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
      <div className={cx("w-full flex-grow overflow-scroll lg:max-w-[700px]")}>
        <DisplayMessage items={messages || []} id={id} />
      </div>
    </div>
  );
};

export const DisplayMessage = ({
  items,
  id,
}: {
  items: TMessage[];
  id: "ADMIN" | string;
}) => {
  return (
    <div className="chaty flex w-full flex-col items-stretch">
      {items.length === 0 && (
        <div className="mx-auto w-[300px]">
          <Lottie animationData={animationEmpty} />
        </div>
      )}
      {items.map((message, i) => {
        return (
          <div
            key={i}
            className={cx("chat", {
              // "snap-proximity": i===0,
              "chat-start": message.receiver === id ? true : false,
              "chat-end": message.receiver === id ? false : true,
            })}
          >
            <div className="chat-bubble">{message.content}</div>
          </div>
        );
      })}

      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col items-start"></div>
      </div>
    </div>
  );
};

export default ChatPage;
