import React, { type ReactNode } from "react";
import Error from "./components/error";
import cx from "classnames";

type LayoutStateProps = {
  children: ReactNode;
  isLoading: boolean;
  isError: boolean;
  length: number;
  hasData:boolean
};
const LayoutState = ({
  isError,
  isLoading,
  length,
  children,
  hasData
}: LayoutStateProps) => {
  // if (isLoading) {
  //   return (
  //     <button className={cx("btn-ghost btn loading btn-lg")}></button>
  //   );
  // }
  // if (isError) {
  //   return <Error />;
  // }

  // if (hasData) {
  //   return children
  // }
  return (
    <>
      {isLoading && (
        <div className="flex w-full items-center justify-center py-5">
          <button className={cx("loading btn-ghost btn-lg btn")}></button>
        </div>
      )}
      {isError && <Error />}
      {hasData && (length > 0 ? (
        children
      ) : (
        <div className="flex w-full items-center justify-center py-5">
          <span className="text-sm italic opacity-60">Aucune donnée</span>
        </div>
      ))}
    </>
  );
};

export default LayoutState;
