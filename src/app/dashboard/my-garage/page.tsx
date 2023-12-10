import React from "react";
import FormMyGarage from "./_components";
import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function MyGaragePage() {
  const orgId = auth().orgId;
  if(!orgId) redirect('/dashboard/home');
  const org = await clerkClient.organizations.getOrganization({organizationId: orgId});
  return (
    <div className="">
      <FormMyGarage org={{
        name: org.name,
        slug: org.slug??"",
      }}/>
    </div>
  );
}

export default MyGaragePage;