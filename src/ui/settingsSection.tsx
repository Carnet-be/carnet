/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssetImage, type User } from ".prisma/client";
import { TUser } from "@model/type";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { trpc } from "@utils/trpc";
import { Button, Collapse, Divider, FloatButton, Input, Modal } from "antd";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import BigTitle from "./components/bigTitle";
import cx from "classnames";
import { CheckIcon, DeleteIcon, PersonIcon } from "./icons";
import toast from "react-hot-toast";
import UploadButton, { TImage } from "./components/uploadButton";
import Img from "./components/img";
import { confirmPasswordHash } from "../utils/bcrypt";
import { LangCommonContext, LangContext, useNotif } from "../pages/hooks";
import LangSwitcher from "./components/langSwitcher";
const { Panel } = Collapse;
const UserContext = createContext<TUser | undefined>(undefined);
const Settings = ({ user }: { user: TUser }) => {
  const t = useContext(LangCommonContext);
  return (
    <UserContext.Provider value={user}>
      <div className="grid w-full grid-cols-1 px-6 pb-10 lg:grid-cols-2">
        <div>
          <BigTitle title={t("text.profile")} />
          <div className="h-[30px]"></div>
          <Profile usert={user} />
        </div>

        <SettingSide />
      </div>
    </UserContext.Provider>
  );
};

export const Profile = ({ usert }: { usert: User }) => {
  const { data: user, refetch } = trpc.user.get.useQuery(undefined, {
    onSuccess: (data) => {
      if (data) {
        setImg((data as any).image as TImage | undefined);
        setProfile(data);
      }
    },
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [profile, setProfile] = React.useState<User>(usert);
  const { error, loading, succes } = useNotif();
  const [img, setImg] = React.useState<TImage | undefined>(
    user?.image || undefined
  );
  const { mutate: update, isLoading } = trpc.user.update.useMutation({
    onSuccess: (data) => {
      console.log(data);

      succes();
      refetch();
    },
    onError: (e) => {
      console.log(e);
      error();
    },
  });
  const { mutate: removeImage } = trpc.user.removePhoto.useMutation({
    onSuccess: (data) => {
      console.log(data);
      succes();
      refetch();
    },
    onError: (e) => {
      console.log(e);
      error();
    },
  });

  const { mutate: updatePhoto } = trpc.user.addPhoto.useMutation({
    onSuccess: (data) => {
      console.log(data);
      succes();
    },
    onError: (e) => {
      console.log(e);
      error();
    },
  });

  const isModified = () => {
    if (user?.username !== profile.username) {
      return true;
    }
    if (user?.email !== profile.email) {
      return true;
    }
    if (user?.tel !== profile.tel) {
      return true;
    }
    if (
      user?.country !== profile.country ||
      user?.city !== profile.city ||
      user?.address !== profile.address
    ) {
      return true;
    }
    return false;
  };

  const t = useContext(LangCommonContext);
  return (
    <div className="space-y-6">
      <div className="flex flex-row items-end gap-4">
        <div>
          <Img src={img} />
        </div>
        <UploadButton
          setPreviewImage={setImg}
          onSuccess={(k) => {
            console.log(k);
            updatePhoto(k);
          }}
        />
        <Button
          onClick={() => removeImage()}
          disabled={!user?.image ? true : false}
          type="primary"
          danger
        >
          <DeleteIcon />
        </Button>
      </div>
      <div className="flex w-[400px] flex-col items-stretch justify-between gap-6">
        <FormControl required className="flex-grow">
          <InputLabel htmlFor="model">{t("input.username")}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-weight"
            label={t("input.username")}
            value={profile?.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
        </FormControl>
        <FormControl required className="flex-grow">
          <InputLabel htmlFor="model">{t("input.email")}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-weight"
            label={t("input.email")}
            disabled
            value={profile?.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </FormControl>

        <FormControl required className="flex-grow">
          <InputLabel htmlFor="model">{t("input.tel")}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-weight"
            label={t("input.tel")}
            value={profile?.tel}
            onChange={(e) => setProfile({ ...profile, tel: e.target.value })}
          />
        </FormControl>
        {user ? <UpdatePassowrd current={user.password} /> : <></>}
        <Collapse>
          <Panel header={t("text.address")} key="1">
            <div className="space-y-4">
              <FormControl required className="w-full">
                <InputLabel htmlFor="model">{t("table.country")}</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  label={t("table.country")}
                  value={profile?.country}
                  onChange={(e) =>
                    setProfile({ ...profile, country: e.target.value })
                  }
                />
              </FormControl>

              <div className="flex flex-row gap-3">
                <FormControl required className="w-full">
                  <InputLabel htmlFor="model">{t("table.city")}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    label={t("table.city")}
                    value={profile?.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl required className="w-full">
                  <InputLabel htmlFor="model">{t("table.zip")}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    label={t("table.zip")}
                    value={profile?.zipCode}
                    onChange={(e) =>
                      setProfile({ ...profile, zipCode: e.target.value })
                    }
                  />
                </FormControl>
              </div>

              <FormControl required className="w-full">
                <InputLabel htmlFor="model">{t("text.address")}</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  label={t("text.address")}
                  value={profile?.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </FormControl>
            </div>
          </Panel>
        </Collapse>
        <div
          className={cx("mt-4 flex flex-row gap-4", {
            hidden: !isModified(),
          })}
        >
          <Button
            onClick={() => {
              update({
                username: profile.username,
                email: profile.email,
                tel: profile.tel,
                country: profile.country,
                city: profile.city,
                address: profile.address,
                zipCode: profile.zipCode,
              });
            }}
            type={"primary"}
          >
            {t("button.save")}
          </Button>
          <Button type="text">{t("button.cancel")}</Button>
        </div>
      </div>
    </div>
  );
};

const UpdatePassowrd = ({ current }: { current: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pwd, setpwd] = useState({ old: "", new: "", confirm: "" });
  const t = useContext(LangCommonContext);
  const { error, loading, succes } = useNotif();
  const { mutate, isLoading } = trpc.user.changePwd.useMutation({
    onSuccess: () => {
      succes();
      setIsModalOpen(false);
    },
    onError: (e) => {
      error();
      console.log(e);
    },
  });
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (pwd.old === "" || pwd.new === "" || pwd.confirm === "") {
      toast.error(t("input.fill all fields"));
      return;
    }
    if (pwd.new.length < 6) {
      toast.error(t("input.min6"));
      return;
    }

    if (pwd.new !== pwd.confirm) {
      toast.error(t("input.no conform"));
      return;
    }
    mutate({ newPwd: pwd.new, current, old: pwd.old });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>{t("button.update password")}</Button>

      <Modal
        destroyOnClose
        okButtonProps={{ loading: isLoading }}
        title={t("text.update your password")}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col items-stretch gap-2 py-5">
          <FormControl required className="flex-grow">
            <InputLabel htmlFor="model">{t("input.old password")}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              type="password"
              label={t("input.old password")}
              value={pwd.old}
              onChange={(e) => setpwd({ ...pwd, old: e.target.value })}
            />
          </FormControl>

          <FormControl required className="flex-grow">
            <InputLabel htmlFor="model">{t("input.new password")}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              label={t("input.new password")}
              type="password"
              value={pwd.new}
              onChange={(e) => setpwd({ ...pwd, new: e.target.value })}
            />
          </FormControl>
          <FormControl required className="flex-grow">
            <InputLabel htmlFor="model">
              {t("input.confirm password")}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              label={t("input.confirm password")}
              type="password"
              value={pwd.confirm}
              onChange={(e) => setpwd({ ...pwd, confirm: e.target.value })}
            />
          </FormControl>
        </div>
      </Modal>
    </>
  );
};

const SettingSide = () => {
  const { error, succes, loading } = useNotif();
  const [settings, setsettings] = useState({
    confirmNewBidderAccount: true,
  });
  const { data: s, refetch } = trpc.settings.get.useQuery(undefined, {
    onSuccess(data) {
      if (data)
        setsettings({
          confirmNewBidderAccount: data.confirmNewBidderAccount,
        });
    },
  });
  const { mutate: updateAppSetting } = trpc.settings.update.useMutation({
    onSuccess: () => {
      succes();
      refetch();
    },
    onError: (e) => {
      error();
      console.log(e);
    },
  });

  const user = useContext(UserContext) as TUser;
  const t = useContext(LangCommonContext);
  const text = useContext(LangContext);
  const onChangeSetting = (e: any) => {
    updateAppSetting({ ...settings, [e.target.name]: e.target.checked });
  };

  return (
    <div>
      <BigTitle title={t("text.settings")} />
      <div className="h-[30px]"></div>
      <div className="flex w-full flex-col items-stretch gap-3 ">
        <ConfirmNewBidderAccount />
        <LangueChanger />
      </div>
    </div>
  );

  function LangueChanger() {
    return (
      <div className=" flex w-full flex-row items-center justify-between rounded-lg bg-gray-100 px-2 py-4">
        {text("language")}
        <LangSwitcher />
      </div>
    );
  }
  function ConfirmNewBidderAccount() {
    return (
      <div
        hidden={
          user.type !== "ADMIN"
          //TODO: review
          //&& user.type !== "STAFF"
        }
        className="form-control"
      >
        <label className="label cursor-pointer rounded-lg bg-gray-100 px-2">
          <span className="label-text max-w-[300px]">{text("new bidder")}</span>
          <input
            onClick={onChangeSetting}
            type="checkbox"
            name="confirmNewBidderAccount"
            className="toggle-primary toggle"
            checked={settings.confirmNewBidderAccount}
          />
        </label>
      </div>
    );
  }
};

export default Settings;
