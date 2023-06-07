/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import Lottie from "./lottie";
import animation from "../../../public/animations/car_interest.json";
import { LangCommonContext, useLang, useNotif } from "../../pages/hooks";
import { Button } from "antd";
import Slider from "react-slick";
import { CheckTreePicker, Modal } from "rsuite";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  BodyItem,
  SampleNextArrow,
  SamplePrevArrow,
} from "@ui/createAuction/step3";
import { CARROSSERIE } from "@data/internal";
import { trpc } from "@utils/trpc";
import { router } from "../../server/trpc/trpc";
import { useRouter } from "next/router";
import { Brand } from "@prisma/client";
import Image from "next/image";
import { ValueType } from "rsuite/esm/CheckTreePicker/CheckTreePicker";
const Interest = () => {
  const common = useContext(LangCommonContext);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <li
        onClick={() => {
          setOpen(true);
        }}
        className="relative flex flex-row items-center overflow-hidden rounded-md bg-primary text-white"
      >
        <span>{common("text.interest")}</span>
        <div className="h-[30px] w-[100px] translate-x-[50px]">
          <Lottie animationData={animation} />
        </div>
      </li>

      <DialogInterest open={open} setOpen={setOpen} />
    </>
  );
};

export default Interest;

export const DialogInterest = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) => {
  const { text } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  const { text: t } = useLang({
    file: "dashboard",
    selector: "bidder",
  });
  const [defaultData, setDefaultData] = React.useState<{
    carrosserie: string;
    models: number[];
  }>({
    carrosserie: "",
    models: [],
  });
  const [selectedC, setSelectedC] = React.useState<Array<string>>([]);
  const [selectedB, setSelectedB] = React.useState<ValueType>([]);
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const { data: brands } = trpc.admin.getBrandModel.useQuery(undefined, {
    enabled: open,
  });

  const { isLoading } = trpc.bidder.getInterested.useQuery(undefined, {
    enabled: open,
    onSuccess(data) {
      if (!data) {
        return;
      }
      setSelectedC(data.carrosserie.split("--") || []);
      setSelectedB(data.models.map((o) => o.id) || []);
      setDefaultData({
        carrosserie: data.carrosserie,
        models: data.models.map((o) => o.id),
      });
    },
  });

  const { succes, error: errorNotif } = useNotif();
  const { mutate } = trpc.bidder.setInterested.useMutation({
    onSuccess() {
      handleOk();
      succes();
    },
    onError(error) {
      console.log(error);
      errorNotif();
    },
  });
  const transformBrandToPicker = (
    brands:
      | (Brand & {
          models: {
            id: number;
            name: string;
          }[];
        })[]
      | undefined
  ) => {
    if (!brands) {
      return [];
    }
    return brands.map((o) => {
      return {
        label: o.name,
        value: o.id,
        children: o.models.map((oo) => {
          return {
            label: oo.name,
            value: oo.id,
          };
        }),
      };
    });
  };
  const common = useContext(LangCommonContext);
  const router = useRouter();
  return (
    <Modal className="translate-y-[30%]" open={open} onClose={handleCancel}>
      <Modal.Header>
        <Modal.Title>{t("interest.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-10">
        <Slider {...settings} className="">
          {CARROSSERIE.map((o, i) => {
            const isActive = selectedC.includes(o.title);
            return (
              <BodyItem
                key={i}
                isActive={isActive}
                title={text("carossery." + o.title.toLowerCase())}
                img={o.img}
                onClick={() => {
                  //   setData((prev:string[]) => {
                  //     if (prev.includes(o.title)) {
                  //       return prev.filter((oo) => oo !== o.title);
                  //     } else {
                  //       return [...prev, o];
                  //     }
                  //   });

                  if (isActive) {
                    setSelectedC((prev) => {
                      return prev.filter((oo) => oo !== o.title);
                    });
                  } else {
                    setSelectedC((prev) => {
                      return [...prev, o.title];
                    });
                  }

                  console.log(o);
                }}
              />
            );
          })}
        </Slider>
        <CheckTreePicker
          size="lg"
          locale={router.locale as any}
          placeholder={`${common("table.brand")} & ${common("table.model")}`}
          data={transformBrandToPicker(brands)}
          className="z-[1000] w-full"
          value={selectedB}
          onChange={(value) => {
            setSelectedB(value);
          }}
          renderTreeNode={(nodeData) => {
            return (
              <span className="flex flex-row gap-1">
                <Image
                  onError={(e) => {
                    console.log(e);
                    e.currentTarget.hidden = true;
                  }}
                  src={"/assets/Cars/" + nodeData.label + ".svg"}
                  alt="logo"
                  width={20}
                  height={20}
                />{" "}
                {nodeData.label}
              </span>
            );
          }}
        />
      </Modal.Body>
      <Modal.Footer className="space-x-3">
        <Button onClick={handleCancel} type="text">
          {common("button.cancel")}
        </Button>
        <Button
          loading={isLoading}
          onClick={() => {
            mutate({
              carrosserie: selectedC.join("--"),
              models: selectedB as number[],
            });
          }}
        >
          {common("button.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
