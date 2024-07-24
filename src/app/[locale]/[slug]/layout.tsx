/* eslint-disable @typescript-eslint/no-explicit-any */
import { clerkClient } from "@clerk/nextjs/server";
import { Divider } from "@nextui-org/react";

import Head from "next/head";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MdEmail, MdMap, MdPhone } from "react-icons/md";
import { NavbarPublic } from "~/app/_components/navbarPublic";
import Share from "~/app/_components/share";
import { api } from "~/trpc/server";
import { getImage } from "~/utils/function";

async function LayoutGarage({ children, params }: any) {
  const org = await clerkClient.organizations
    .getOrganization({ slug: params.slug! })
    .catch((_) => null);
  if (!org) return notFound();
  const garage = await api.garage.getGarageByOrgId.query(org.id);
  if (!garage || garage.state != "published") return notFound();

  const name = org.name;

  // const cars = garage.cars ?? [];

  return (
    <div>
      <NavbarPublic />
      <div className="min-h-screen">
        <Head>
          <title>{org.name}</title>
          <meta name="description" content={garage.about ?? "Join Carnet"} />
          <meta property="og:title" content={name} />
          <meta
            property="og:description"
            content={garage.about ?? "Join Carnet"}
          />
          <meta property="og:image" content={org.imageUrl} />
          {/* <meta property="og:url" content={} /> */}
          <meta property="og:type" content="website" />

          <meta name="twitter:title" content={name} />
          <meta
            name="twitter:description"
            content={garage.about ?? "Join us in Carnet"}
          />
          <meta name="twitter:image" content={org.imageUrl} />
          <meta name="twitter:card" content="summary_large_image" />

          <link rel="icon" href={org.imageUrl} className="rounded-full" />

          <meta name="theme-color" content="#ffffff" />

          <link rel="apple-touch-icon" href={org.imageUrl} />

          <meta name="apple-mobile-web-app-title" content={name} />

          {/* for seo */}
          <meta name="robots" content="index, follow" />
          <meta name="author" content={name} />
          <meta name="keywords" content={name} />
          <meta name="distribution" content="web" />
          <meta name="revisit-after" content="7 days" />
          <meta name="language" content="EN" />
          <meta name="generator" content="Carnet" />
          <meta name="rating" content="general" />
          {/* <meta name="url" content={url} />
        <meta name="identifier-URL" content={url} /> */}
          <meta name="coverage" content="Worldwide" />
          <meta name="distribution" content="Global" />
          <meta name="rating" content="General" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content={name} />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="mobile-web-app-capable" content="yes" />
        </Head>

        {/* <MyNav /> */}
        <div className="relative min-h-[300px] w-full ">
          <Image
            fill
            src={getImage(garage.cover)}
            alt={`Cover - ${name}`}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="relative mx-auto flex max-w-[1100px] flex-col">
          <div className="absolute right-0 top-6 z-50">
            <Share link={`/${org.slug}`} />
          </div>
          <div className="w-full -translate-y-[60px] space-y-3">
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full bg-green-300 ring-4 ring-white ring-offset-0">
              <Image
                fill
                src={org.imageUrl}
                alt={`Logo - ${name}`}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>

            <h1 className="text-2xl text-black">{name}</h1>

            <p className="max-w-[600px] whitespace-pre-line">{garage.about}</p>

            <div className="max-w-[500px] space-y-1 rounded-md bg-white/80 p-4">
              <div className="flex items-center space-x-2">
                <MdEmail className="text-primary" />
                <span className="text-sm text-gray-500">
                  {garage.contact?.email ?? "---"}{" "}
                  {garage.contact?.email2 && ` / ${garage.contact?.email2}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MdPhone className="text-primary" />
                <span className="text-sm text-gray-500">
                  {garage.contact?.phone ?? "---"}{" "}
                  {garage.contact?.phone2 && ` / ${garage.contact?.phone2}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MdMap className="text-primary" />
                <span className="text-sm text-gray-500">
                  {garage.contact?.address}
                </span>
              </div>
            </div>
          </div>
          <Divider />
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutGarage;
