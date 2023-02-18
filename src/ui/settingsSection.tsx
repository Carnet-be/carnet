/* eslint-disable @typescript-eslint/no-explicit-any */
import { type User } from ".prisma/client";
import { TUser } from "@model/type";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { Button, Divider, FloatButton, Input } from "antd";
import React, { createContext, useContext, useEffect, useRef } from "react";
import BigTitle from "./components/bigTitle";
import MyUpload from "./components/myUpload";
import { CheckIcon, PersonIcon } from "./icons";

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
  const user = useContext(UserContext);
  const [isUploading, setIsUploading] = React.useState(false);
  const [profile, setProfile] = React.useState<User>(user as User);
  const [imgKey, setImgKey] = React.useState<string | undefined>(undefined);
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

        <div className="mt-4 flex flex-row gap-4">
          <Button type={"primary"}>valider</Button>
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
