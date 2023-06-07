import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  onAction: () => void;
}>;

const ConfirmationDialog = ({ onAction, children }: Props) => {
  return (
    <div>
      {children}
      <dialog open>
        <button onClick={onAction}>Yes</button>
        <button onClick={onAction}>No</button>
      </dialog>
    </div>
  );
};

export default ConfirmationDialog;
