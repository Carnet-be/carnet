/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssetImage, type User } from ".prisma/client";
import { TUser } from "@model/type";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { trpc } from "@utils/trpc";
import { Button, Divider, FloatButton, Input, Modal } from "antd";
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

const UserContext = createContext<TUser | undefined>(undefined);
const Settings = ({ user }: { user: TUser }) => {
  return (
    <UserContext.Provider value={user}>
      <div className="mx-auto max-w-[800px]">
        <BigTitle title="Profile" />
        <div className="h-[30px]"></div>
        <Profile usert={user} />

        <Divider />
        {user.type === "ADMIN" && <AdminSettings />}
      </div>
    </UserContext.Provider>
  );
};

export const Profile = ({ usert }: { usert: User }) => {
  const { data: user, refetch } = trpc.user.get.useQuery(undefined, {
    onSuccess: (data) => {
      if (data) {
        setImg(data.image as TImage | undefined);
        setProfile(data);
      }
    },
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [profile, setProfile] = React.useState<User>(usert as User);
  const [img, setImg] = React.useState<TImage | undefined>(
    user?.image || undefined
  );
  const { mutate: update, isLoading } = trpc.user.update.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Profile updated");
      refetch();
    },
    onError: (e) => {
      console.log(e);
      toast.error("Error");
    },
  });
  const { mutate: removeImage } = trpc.user.removePhoto.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Photo updated");
      refetch();
    },
    onError: (e) => {
      console.log(e);
      toast.error("Error");
    },
  });

  const { mutate: updatePhoto } = trpc.user.addPhoto.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Photo updated");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Error");
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
    return false;
  };

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
          <InputLabel htmlFor="model">Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-weight"
            label="Username"
            value={profile?.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
        </FormControl>
        <FormControl required className="flex-grow">
          <InputLabel htmlFor="model">Email</InputLabel>
          <OutlinedInput
            id="outlined-adornment-weight"
            label="Email"
            disabled
            value={profile?.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </FormControl>

        <FormControl required className="flex-grow">
          <InputLabel htmlFor="model">Tel</InputLabel>
          <OutlinedInput
            id="outlined-adornment-weight"
            label="Tel"
            value={profile?.tel}
            onChange={(e) => setProfile({ ...profile, tel: e.target.value })}
          />
        </FormControl>
        {user ? <UpdatePassowrd current={user.password} /> : <></>}
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
              });
            }}
            type={"primary"}
          >
            valider
          </Button>
          <Button type="text">annuler</Button>
        </div>
      </div>
    </div>
  );
};

const UpdatePassowrd = ({ current }: { current: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pwd, setpwd] = useState({ old: "", new: "", confirm: "" });
  const { mutate, isLoading } = trpc.user.changePwd.useMutation({
    onSuccess: () => {
      toast.success("password updated");
      setIsModalOpen(false);
    },
    onError: (e) => {
      toast.error(e.message);
      console.log(e);
    },
  });
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (pwd.old === "" || pwd.new === "" || pwd.confirm === "") {
      toast.error("please fill all fields");
      return;
    }
    if (pwd.new.length < 6) {
      toast.error("password must be at least 8 characters");
      return;
    }

    if (pwd.new !== pwd.confirm) {
      toast.error("passwords don't match");
      return;
    }
    mutate({ newPwd: pwd.new, current, old: pwd.old });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>update password</Button>

      <Modal
        destroyOnClose
        okButtonProps={{ loading: isLoading }}
        title="Update your passowrd"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col items-stretch gap-2 py-5">
          <FormControl required className="flex-grow">
            <InputLabel htmlFor="model">Old password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              type="password"
              label="Old password"
              value={pwd.old}
              onChange={(e) => setpwd({ ...pwd, old: e.target.value })}
            />
          </FormControl>

          <FormControl required className="flex-grow">
            <InputLabel htmlFor="model">New password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              label="New password"
              type="password"
              value={pwd.new}
              onChange={(e) => setpwd({ ...pwd, new: e.target.value })}
            />
          </FormControl>
          <FormControl required className="flex-grow">
            <InputLabel htmlFor="model">Confirmation</InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              label="Confirmation"
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

const AdminSettings = () => {
  const [settings, setsettings] = useState({
    confirmNewBidderAccount: true,
  });
  const {
    data: s,
    isLoading,
    refetch,
  } = trpc.settings.get.useQuery(undefined, {
    onSuccess(data) {
      if (data)
        setsettings({
          confirmNewBidderAccount: data.confirmNewBidderAccount,
        });
    },
  });
  const { mutate } = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("settings updated");
      refetch();
    },
    onError: (e) => {
      toast.error(e.message);
      console.log(e);
    },
  });

  const isModified = () => {
    if (s?.confirmNewBidderAccount !== settings.confirmNewBidderAccount)
      return true;

    return false;
  };

  return (
    <div>
      <BigTitle title="Settings" />
      <div className="h-[30px]"></div>
      <div className="flex w-full flex-col items-stretch gap-3 lg:w-[540px]">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              New Bidders must be confirmed by an admin
            </span>
            <input
              onClick={(e) =>{
                console.log(settings,s)
                setsettings({
                  ...settings,
                  confirmNewBidderAccount: e.currentTarget.checked,
                })
              }
              
              }
              type="checkbox"
              className="toggle-primary toggle"
              checked={settings.confirmNewBidderAccount}
            />
          </label>
        </div>
      </div>
      <div
        className={cx("mt-4 flex flex-row gap-4", {
          hidden: !isModified(),
        })}
      >
        <Button
          onClick={() => {
            mutate({
              confirmNewBidderAccount: settings.confirmNewBidderAccount,
            });
          }}
          type={"primary"}
        >
          valider
        </Button>
        <Button type="text">annuler</Button>
      </div>
    </div>
  );
};

export default Settings;
