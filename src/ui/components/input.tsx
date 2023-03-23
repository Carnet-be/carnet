import React, { useContext, type FunctionComponent, type ReactNode } from "react";
import cx from "classnames";
import { type FieldError } from "react-hook-form";
import { LangCommonContext, useLang } from "../../pages/hooks";

type InputProps = {
  label?: string;
  icon?: ReactNode;
  type?: "text" | "password" | "email";
  placeholder?: string;

  // eslint-disable-next-line @typescript-eslint/ban-types
  props?: Object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  controler: Object;
  error: FieldError | undefined;
};
const Input: FunctionComponent<InputProps> = ({
  label,
  icon,
  type = "text",
  placeholder,
  controler,
  error,
  props,
}) => {
  const {text:common}=useLang(undefined)
  return (
    <div className="w-full ">
      <div
        className={cx(
          "flex w-full  flex-row items-center gap-3 rounded-2xl border py-1 px-3 transition-all hover:border-l-4",
          error
            ? "border-red-500  hover:border-l-red-500"
            : "border-[#C1BBBB]  hover:border-l-primary"
        )}
      >
        <div className="text-2xl text-[#C1BBBB]">{icon}</div>
        <div className="flex flex-grow flex-col">
          <span hidden={!label} className="label-text text-opacity-60">
            {label}
          </span>
          <input
            type={type}
            placeholder={placeholder||common("input.placeholder")}
            {...controler}
            {...props}
            className="text-semibold w-full text-primary"
          />
        </div>
      </div>
      <span className="pl-3 text-sm italic text-red-500">
        {error && error.message}
      </span>
    </div>
  );
};

export default Input;
