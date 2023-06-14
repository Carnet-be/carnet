import React, { useContext, useEffect, useState } from "react";
import { Button, Divider, Modal } from "antd";
import { LangCommonContext } from "../pages/hooks";
import Price from "./components/price";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { LoadingSpin } from "./loading";
import cx from "classnames";
const amount = 20;
const PaymentDialog = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const router = useRouter();
  const common = useContext(LangCommonContext);

  const [locale, setLocale] = useState("fr_FR");
  useEffect(() => {
    if (router.locale === "fr") {
      setLocale("fr_FR");
    } else {
      setLocale("en_US");
    }
  }, [router.locale]);

  return (
    <>
      <Modal
        title={common("payment.dialog title")}
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        onCancel={handleCancel}
      >
        <PayPalScriptProvider
          options={{
            clientId: "test",
            currency: "EUR",
            intent: "capture",
            locale,
          }}
        >
          <ContentPayment />
        </PayPalScriptProvider>
      </Modal>
    </>
  );
};

export default PaymentDialog;

const ContentPayment = () => {
  const common = useContext(LangCommonContext);

  const [months, setMonths] = useState(1);
  const [{ isPending }] = usePayPalScriptReducer();
  return (
    <>
      <p>{common("payment.dialog description")}</p>
      <div className="my-6 rounded bg-background p-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h6>Add Months</h6>
            <span>
              {common("payment.each month is")}{" "}
              <Price value={amount} textStyle="font-bold" />
            </span>
          </div>
          <div className="flex flex-row items-center gap-1 overflow-hidden rounded border">
            <button
              onClick={() => {
                if (months > 1) setMonths(months - 1);
              }}
              className="btn-ghost btn-sm btn rounded-none"
            >
              -
            </button>
            <span className="px-3">{months}</span>
            <button
              onClick={() => {
                setMonths(months + 1);
              }}
              className="btn-ghost btn-sm btn rounded-none"
            >
              +
            </button>
          </div>
        </div>
        <Divider />
        <div className="flex flex-row items-center justify-between text-primary">
          <h6>{common("payment.total")}</h6>
          <Price value={months * amount} textStyle="font-bold" />
        </div>
      </div>
      {isPending ? (
        <div className={cx("flex w-full items-center justify-center py-4")}>
          <LoadingSpin />
        </div>
      ) : (
        <PayPalButtons
          style={{ layout: "vertical" }}
          forceReRender={[amount]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: `${months * amount}`,
                  },
                },
              ],
            });
          }}
          // onApprove={(data, actions) => {
          //   if(actions.order)
          //     return actions.order?.capture().then((details) => {
          //         const name = details.payer.name?.given_name;
          //         alert(`Transaction completed by ${name}`);
          //     });
          // }}
        />
      )}
    </>
  );
};
