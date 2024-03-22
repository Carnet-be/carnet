"use client";
import { UserButton, UserProfile } from "@clerk/nextjs";
import { DotIcon } from "lucide-react";

const SettingPage = () => {
  return (
    <div className="">
      {/* <UserProfile /> */}
      <UserButton afterSignOutUrl="/">
        {/* You can pass the content as a component */}
        <UserButton.UserProfilePage
          label="Custom Page"
          url="custom"
          labelIcon={<DotIcon />}
        >
          <UserProfile />
        </UserButton.UserProfilePage>

        {/* You can also pass the content as direct children */}
        <UserButton.UserProfilePage
          label="Terms"
          labelIcon={<DotIcon />}
          url="terms"
        >
          <div>
            <h1>Custom Terms Page</h1>
            <p>This is the custom terms page</p>
          </div>
        </UserButton.UserProfilePage>
      </UserButton>
    </div>
  );
};

export default SettingPage;
