import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BackButton from "~/app/_components/ui/backButton";
import { db } from "~/server/db";
import { garages } from "~/server/db/schema";
import FormMyGarage from "./_components";

async function MyGaragePage({
  admin = false,
  orgId,
}: {
  admin?: boolean;
  orgId: string;
}) {
  const org = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  });
  const [garage] = await db
    .select()
    .from(garages)
    .where(eq(garages.orgId, orgId));
  if (!garage) redirect("/dashboard/home");
  return (
    <div className="">
      <BackButton />
      <FormMyGarage
        garage={garage}
        org={{
          name: org.name,
          slug: org.slug ?? "",
        }}
      />
    </div>
  );
}

export default MyGaragePage;
