import React, { type FunctionComponent, type ReactNode } from "react";
import cx from "classnames";
import { type FieldError } from "react-hook-form";

type InputProps = {
  label?: string;
  icon?: ReactNode;
  type?: "text" | "password" | "email";
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  controler: Object;
  error: FieldError | undefined;
};
const Input: FunctionComponent<InputProps> = ({
  label,
  icon,
  type = "text",
  placeholder = "Saisir",
  controler,
  error,
}) => {
 
  return (
    <div className="w-full ">
      <div
        className={cx(
          "border w-full  py-1 px-3 rounded-2xl flex flex-row gap-3 transition-all items-center hover:border-l-4",
          error
            ? "border-red-500  hover:border-l-red-500"
            : "border-[#C1BBBB]  hover:border-l-primary"
        )}
      >
        <div className="text-[#C1BBBB] text-2xl">{icon}</div>
        <div className="flex flex-col flex-grow">
          <span hidden={!label} className="label-text text-opacity-60">
            {label}
          </span>
          <input
            type={type}
            placeholder={placeholder}
            {...controler}
            className="text-semibold text-primary w-full"
          />
        </div>
      </div>
      <span className="text-red-500 italic text-sm pl-3">
        {error && error.message}
      </span>
    </div>
  );
};

export default Input;
