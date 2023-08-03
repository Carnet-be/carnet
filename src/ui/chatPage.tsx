/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Lottie from "@ui/components/lottie";
import { trpc } from "@utils/trpc";
import { Input } from "antd";
import { InternalMessage } from "@prisma/client";
import cx from "classnames";

import animationEmpty from "../../public/animations/mo_message.json";
import type { TMessage} from "@repository/index";
import { getMessages, sendMessage } from "@repository/index";
import { DisplayMessage } from "../pages/admin/dashboard/chat";
import { useLang } from "../pages/hooks";
import { NavBarFixed } from "./dashboard";
const ChatPage = ({
  id,
  receiver = "ADMIN",
  isAdmin = false,
}: {
  id: "ADMIN" | string;
  receiver?: "ADMIN" | string;
  isAdmin?: boolean;
}) => {
  const { text: common } = useLang(undefined);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(text);
    setIsLoading(true);
    sendMessage({
      content: text,
      sender: id,
      receiver: "ADMIN",
    }).then((res) => {
      setText("");
      setIsLoading(false);
    });
  };
  const [messages, setMessages] = useState<TMessage[]>([]);
  useEffect(() => {
    const unsubscribe = getMessages({
      id,
      setMessage: (messages) => {
        setMessages(messages);
      },
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-[100] w-full bg-background">
        <NavBarFixed />
      </div>
      <div
        className={cx(
          "mx-auto flex h-screen w-full flex-col-reverse items-center lg:max-w-[800px]"
        )}
      >
        <form
          onSubmit={onSubmit}
          className="flex w-full w-full flex-row items-center  items-center justify-center rounded-md bg-white p-4 shadow-md lg:max-w-[800px]"
        >
          <Input.Group className="flex w-full flex-grow flex-row items-center gap-3">
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="large"
              placeholder={common("input.placeholder message")}
              className="flex-grow"
              style={{ width: "calc(100% - 200px)" }}
            />
            <button
              className={cx("btn-primary btn", {
                loading: isLoading,
              })}
            >
              {common("button.send")}
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
      </div>
    </div>
  );
};

export default ChatPage;
