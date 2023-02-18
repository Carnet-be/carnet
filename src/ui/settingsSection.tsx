/* eslint-disable @typescript-eslint/no-explicit-any */
import { type User } from ".prisma/client";
import { TUser } from "@model/type";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { trpc } from "@utils/trpc";
import { Button, Divider, FloatButton, Input } from "antd";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import BigTitle from "./components/bigTitle";
import MyUpload from "./components/myUpload";
import cx from "classnames";
import { CheckIcon, PersonIcon } from "./icons";
import toast from "react-hot-toast";

const UserContext = createContext<TUser | undefined>(undefined);
const Settings = ({ user }: { user: TUser }) => {
  return (
    <UserContext.Provider value={user}>
      <div className="mx-auto max-w-[800px]">
        <BigTitle title="Profile" />
        <div className="h-[30px]"></div>
        <Profile />

        <Divider />
        <BigTitle title="Settings" />
        <div className="h-[30px]"></div>
        {user.type === "ADMIN" && <AdminSettings />}
      </div>
    </UserContext.Provider>
  );
};

const Profile = () => {
  
  const [user,setuser]=useState(useContext(UserContext))
  const {refetch}=trpc.user.get.useQuery(undefined,{
    enabled:false,
    onSuccess:(data)=>{
      setuser(data as TUser|undefined)
    }

  })
  const [isUploading, setIsUploading] = React.useState(false);
  const [profile, setProfile] = React.useState<User>(user as User);
  const [imgKey, setImgKey] = React.useState<string | undefined>(undefined);
  const { mutate: update, isLoading } = trpc.user.update.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Profile updated");
      refetch()
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

  useEffect(() => {
    if (user) {
      if (user.image) {
        setImgKey(user?.image.url || undefined);
      }
    }
  }, [user]);
  const ref = useRef(null);
  if (!user) {
    return <div></div>;
  }

  const isModified = () => {
    if (user.username !== profile.username) {
      return true;
    }
    if (user.email !== profile.email) {
      return true;
    }
    if (user.tel !== profile.tel) {
      return true;
    }
    return false;
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-10">
        <div>
          <MyUpload
            valueUrl={imgKey}
            isUploading={isUploading}
            setUploading={setIsUploading}
            onSuccess={(k) => {
              console.log(k);
            }}
          />
        </div>
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
        <Button>update password</Button>

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

const AdminSettings = () => {
  const user = useContext(UserContext);
  if (!user) {
    return <div></div>;
  }
  return <div></div>;
};

export default Settings;
