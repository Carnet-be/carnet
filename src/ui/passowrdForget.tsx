import React, { useState } from "react";
import { useLang, useNotif } from "../pages/hooks";
import Link from "next/link";
import Lottie from "./components/lottie";
import animationEmail from "../../public/animations/email.json";
import { trpc } from "@utils/trpc";
import toast from "react-hot-toast";
import cx from "classnames";
import { TextField } from "@mui/material";
const PasswordForget = ({ color = "text-primary" }: { color?: string }) => {
  const [sent, setsented] = useState(false);
  const [email, setemail] = useState("");
  const { error } = useNotif();
  const { text: common } = useLang(undefined);
  const { mutate, isLoading } = trpc.auth.sendEmailPasswordForget.useMutation({
    onSuccess: () => {
      setsented(true);
    },
    onError: (err) => {
      if (err.message == "user not found") {
        toast.error(common("toast.auth.user not exist"));
      } else {
        error();
      }
    },
  });

  const { text } = useLang({
    file: "pages",
    selector: "auth",
  });
  // return <Link href="/">{text("forget password")}</Link>;

  return (
    <>
      <label
        htmlFor="my-modal-4"
        className={cx("cursor-pointer  hover:underline", color)}
      >
        {text("forget password")}
      </label>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          {sent ? (
            <>
              {" "}
              <div className="flex h-[300px] items-center justify-center overflow-hidden">
                <Lottie animationData={animationEmail} />
              </div>
              <div className="-translate-y-8 text-center">
                <p>{text("reset password subtitle")}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <TextField
                label={common("input.email")}
                variant="filled"
                className="w-full"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
              <div className="h-[10px]"></div>
              <button
                onClick={() => {
                  mutate(email);
                }}
                className={cx("btn-primary btn-wide btn", {
                  loading: isLoading,
                })}
              >
                {common("button.send")}
              </button>
            </div>
          )}
        </label>
      </label>
    </>
  );
};

export default PasswordForget;
