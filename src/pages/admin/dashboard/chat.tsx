/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard, { NavBarFixed } from "@ui/dashboard";
import { trpc } from "@utils/trpc";
import { Button, Divider, Input } from "antd";
import { GetServerSideProps } from "next";
import cx from "classnames";
import { prisma } from "../../../server/db/client";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import Lottie from "@ui/components/lottie";

import animationEmpty from "../../../../public/animations/mo_message.json";
import {
  TMessage,
  deleteDocument,
  getMessages,
  sendMessage,
} from "@repository/index";
import { TRPCClient } from "@trpc/client";
import moment from "moment";
import { AvatarImg } from "@ui/profileCard";
import { debounce } from "lodash";
import { TUser } from "@model/type";
import { HiSearchCircle } from "react-icons/hi";
import toast from "react-hot-toast";

import aucitonaireIcon from "@assets/auctionnaire.png";
import bidderIcon from "@assets/bidder.png";
import Image from "next/image";
import { DeleteIcon } from "@ui/icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangCommonContext, useLang, useNotif } from "../../hooks";
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

const getFirstUser = (messages: TMessage[]) => {
  const users = messages.map((message) => {
    if (message.receiver === "ADMIN") {
      return message.sender;
    } else {
      return message.receiver;
    }
  });
  return users[0];
};
const getUsersId = (messages: TMessage[]) => {
  const msg = messages.map((message) => {
    if (message.receiver === "ADMIN") {
      return message.sender;
    } else {
      return message.receiver;
    }
  });
  const users = [...new Set(msg)];
  return users;
};

type UserMessage = {
  user: TUser;
  messages: TMessage[];
};
const Chat = (props: { user: any }) => {
  const { text: common } = useLang(undefined);
  const { error, succes, loading } = useNotif();
  const { user } = props;
  const [users, setusers] = useState<UserMessage[]>([]);
  const [selected, setselected] = useState<TUser | undefined>(undefined);
  const [usersId, setusersId] = useState<string[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);

  const { data, refetch } = trpc.user.getUsersFromMessages.useQuery(usersId, {
    enabled: usersId.length > 0,
    onSettled: () => {
      console.log("refetch");
      // setIsLoading(false);
    },
    onError: () => {
      toast.dismiss();
      error();
    },
    onSuccess: (data) => {
      toast.dismiss();
      console.log(data);
      const users = data.map((user) => ({
        user: user as TUser,
        messages: messages.filter((message) => {
          if (message.receiver === "ADMIN") {
            return message.sender === user.id;
          } else {
            return message.receiver === user.id;
          }
        }),
      }));
      if (!selected) setselected(users[0]?.user);

      const index = users.map((user) => {
        const ind = messages.findIndex((message) => {
          if (message.receiver === "ADMIN") {
            return message.sender === user.user.id;
          } else {
            return message.receiver === user.user.id;
          }
        });
        return { ind, user };
      });
      setusers(index.sort((a, b) => b.ind - a.ind).map((item) => item.user));
    },
  });

  useEffect(() => {
    const unsubscribe = getMessages({
      id: "ADMIN",
      setMessage: (messages) => {
        setMessages(messages);

        setusersId(getUsersId(messages));
        refetch();
      },
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onSelectedUser = (user: TUser) => {
    setselected(user);
  };
  return (
    <LangCommonContext.Provider value={common}>
      <Dashboard type={"ADMIN"} hideNav>
        <div className="relative flex h-screen flex-row items-stretch">
          <div className="absolute top-0  right-0 z-[1000] w-full  bg-background backdrop-blur-md">
            <NavBarFixed />
          </div>
          <div className="min-w-[330px]  max-w-[330px] border-l  border-r pt-[60px]">
            <LeftSide
              usersMessages={users}
              onClick={onSelectedUser}
              selectedUserId={selected?.id}
            />
          </div>

          <RightSide
            userMessage={
              selected
                ? {
                    user: selected,
                    messages: messages.filter((message) => {
                      if (message.receiver === "ADMIN") {
                        return message.sender === selected.id;
                      } else {
                        return message.receiver === selected.id;
                      }
                    }),
                  }
                : undefined
            }
          />
        </div>
      </Dashboard>
    </LangCommonContext.Provider>
  );
};

export default Chat;

const LeftSide = ({
  usersMessages,
  onClick,
  selectedUserId,
}: {
  usersMessages: UserMessage[];
  onClick: (s: TUser) => void;
  selectedUserId: string | undefined;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seach, setseach] = useState("");
  const [users, setusers] = useState<UserMessage[]>([]);
  const common = useContext(LangCommonContext);
  const { succes, error, loading } = useNotif();
  const { refetch } = trpc.user.search.useQuery(seach, {
    enabled: seach ? true : false,

    onError: () => {
      toast.dismiss();
      error();
    },
    onSuccess: (data) => {
      toast.dismiss();
      const u: UserMessage[] = data.map((user) => ({
        user: user as TUser,
        messages: (
          usersMessages.filter((message) => message.user.id === user.id)[0] || {
            messages: [],
          }
        ).messages,
      }));
      setusers(u);
    },
  });

  useEffect(() => {
    users.length === 0 && setusers(usersMessages);
  }, [usersMessages]);

  const onSearch = (event: any) => {
    const { value } = event.target;

    loading();
    if (value) {
      refetch();
    } else {
      setusers(usersMessages);
      toast.dismiss();
    }
  };
  const debouncedChangeHandler = useCallback(debounce(onSearch, 500), []);
  return (
    <div className="w-full">
      <div className="p-3">
        <Input
          onChange={debouncedChangeHandler}
          placeholder={common("input.search for user")}
          size="large"
        />
      </div>
      <div>
        {users.length === 0 && (
          <div className="mx-auto w-[300px]">
            <span className="py-2 italic text-red-300">Empty box</span>
          </div>
        )}
        {users.map((u, i) => {
          const { user: user, messages } = u;
          console.log("messages[0]", messages[0]);
          return (
            <button
              key={i}
              onClick={() => onClick(user)}
              className={cx(
                "flex w-full cursor-pointer flex-row items-center gap-4 border-b border-gray-200 px-2 py-1 text-left ",
                selectedUserId === user.id
                  ? "bg-white"
                  : "opacity-80 hover:bg-gray-100"
              )}
            >
              <AvatarImg img={user.image} size={40} />
              <div className="flex w-full flex-col items-stretch">
                <div className="flex flex-row items-center gap-2">
                  <Image
                    src={user.type === "AUC" ? aucitonaireIcon : bidderIcon}
                    alt="type"
                    width={20}
                    height={30}
                  />
                  <div className="">
                    <div className="text-sm font-semibold ">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                {messages.length > 0 && (
                  <>
                    <hr className="my-[2px]" />
                    <span className="text-xs line-clamp-2">
                      {messages[messages.length - 1]?.content || ""}
                    </span>
                    <span className="self-end text-xs italic opacity-40 ">
                      {moment(messages[messages.length - 1]?.date).fromNow()}
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const RightSide = ({
  userMessage: user,
}: {
  userMessage: UserMessage | undefined;
}) => {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const common = useContext(LangCommonContext);
  const { succes, error, loading } = useNotif();
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(text);
    setIsLoading(true);
    sendMessage({
      content: text,
      sender: "ADMIN",
      receiver: user?.user.id || "ADMIN",
    }).then((res) => {
      setText("");
      setIsLoading(false);
    });
  };
  return (
    <div className={cx(" flex h-full w-full flex-col-reverse items-center")}>
      <form
        hidden={user === undefined}
        onSubmit={onSubmit}
        className="flex w-full w-full flex-row  items-center items-center justify-center rounded-md bg-white p-4 shadow-md"
      >
        <Input.Group className="flex w-full flex-grow flex-row items-center gap-3">
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="large"
            placeholder={common("input.type message")}
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
          user={user?.user}
          items={user?.messages || []}
          id={"ADMIN"}
        />
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export const DisplayMessage = ({
  items,
  id,
  user,
  isAdmin,
}: {
  items: TMessage[];
  id: "ADMIN" | string;
  isAdmin?: boolean;
  user: TUser | undefined;
}) => {
  const lastId = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lastId.current) {
      lastId.current.scrollIntoView();
    }
  }, [items]);
  return (
    <div className="flex w-full flex-col items-stretch justify-end">
      {items.length === 0 && (
        <div className="mx-auto w-[60%]">
          <Lottie animationData={animationEmpty} />
        </div>
      )}
      {items.map((message, i) => {
        const mine = message.sender === id ? true : false;

        return (
          <div
            key={i}
            ref={i === items.length - 1 ? lastId : null}
            className={cx(
              "group chat bg-opacity-20",
              mine ? "chat-end" : "chat-start"
            )}
          >
            <div className="chat-image avatar ">
              {!mine && (
                <div className="chat-image avatar">
                  {message.sender === "ADMIN" ? (
                    <Image
                      src="/assets/big_logo.png"
                      width={35}
                      height={35}
                      alt="admin"
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarImg img={user?.image} size={40} />
                  )}
                </div>
              )}
            </div>
            <div className="chat-header flex flex-row items-center gap-4">
              <span className="text-primary" hidden={mine}>
                {user?.username || "CARNET"}
              </span>
              <time className="text-xs opacity-50">
                {moment(message.date).fromNow()}
              </time>
            </div>
            <div className="chat-bubble">{message.content}</div>
            {/* <div hidden={!mine} className="chat-footer opacity-50">
              {message.receiverRead ? "seen" : "delivered"}
            </div> */}
          </div>
        );
      })}

      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col items-start"></div>
      </div>
    </div>
  );
};
