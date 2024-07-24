"use client";
import { UserButton, UserProfile, useAuth } from "@clerk/nextjs";
import { Tab, Tabs } from "@nextui-org/react";
import { Dot } from "lucide-react";
import ContactProfileSeciton from "~/app/_components/pages/profile/contact";

const LayoutSettings = () => {
  const { userId, orgId } = useAuth();
  console.log(userId);
  if (!userId) return null;
  return (
    <div>
      <Tabs aria-label="Options">
        {/* {orgId && (
          <Tab key="organization" title="Organization">
            <OrganizationProfile
              //  path="en/dashboard/settings"
              appearance={{
                elements: {
                  card: "shadow-none w-full",
                },
              }}
            >
              <OrganizationSwitcher.OrganizationProfilePage
                label="Contact"
                labelIcon={<Dot size={18} />}
                url="org-contact"
              >
                <ContactProfileSeciton id={orgId} />
              </OrganizationSwitcher.OrganizationProfilePage>
            </OrganizationProfile>
          </Tab>
        )} */}
        <Tab key="personal" title="Profile">
          <UserProfile
            //  path="en/dashboard/settings"
            appearance={{
              elements: {
                card: "shadow-none",
              },
            }}
          >
            <UserButton.UserProfilePage
              label="Contact"
              labelIcon={<Dot size={18} />}
              url="contact"
            >
              <ContactProfileSeciton id={userId!} />
            </UserButton.UserProfilePage>
          </UserProfile>
        </Tab>
      </Tabs>
    </div>
  );
};

export default LayoutSettings;
