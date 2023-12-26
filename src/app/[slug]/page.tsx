/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clerkClient } from '@clerk/nextjs';
import Head from 'next/head';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import Share from '../_components/share';

export default async function GaragePagePublic ({params}:any) {

  console.log('params', params)
  const org = await clerkClient.organizations.getOrganization({slug: params.slug!}).catch(_=>null);
  if(!org) return notFound()
  const garage = await api.garage.getGarageByOrgId.query(org.id);
  if(!garage || garage.state!="active")  return notFound()
  console.log('org', org)
  return (
    <div>
    <Head>
      <title>{garage.name}</title>
      <meta
        name="description"
        content={garage.about ?? "Join Carnet"}
      />
      <meta property="og:title" content={garage.name} />
      <meta
        property="og:description"
        content={garage.about ?? "Join Carnet"}
      />
      <meta property="og:image" content={org.imageUrl} />
      {/* <meta property="og:url" content={} /> */}
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content={garage.name} />
      <meta
        name="twitter:description"
        content={garage.about?? "Join us in Carnet"}
      />
      <meta name="twitter:image" content={org.imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />

      <link rel="icon" href={org.imageUrl} className="rounded-full" />

      <meta name="theme-color" content="#ffffff" />

      <link rel="apple-touch-icon" href={org.imageUrl} />

      <meta name="apple-mobile-web-app-title" content={garage.name} />

      {/* for seo */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={garage.name} />
      <meta name="keywords" content={garage.name} />
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
      <meta name="apple-mobile-web-app-title" content={garage.name} />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="default"
      />
      <meta name="mobile-web-app-capable" content="yes" />
    </Head>

    {/* <MyNav /> */}
    <div className="relative h-[350px] w-full ">
      <Image
        fill
        src={garage.cover??"https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"}
        alt={`Cover - ${garage.name}`}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>

    <div className="relative mx-auto flex max-w-[1100px] flex-col gap-10">
      <div className="absolute top-6 right-0 z-50">
        <Share link={`/${org.slug}`} />
      </div>
      <div className="w-full -translate-y-[60px] space-y-6">
        <div className="bg-green-300 relative h-[120px] w-[120px] overflow-hidden rounded-full ring-4 ring-white ring-offset-0">
          <Image
            fill
            src={org.imageUrl}
            alt={`Logo - ${garage.name}`}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <h1 className="text-2xl text-black">{garage.name}</h1>

        <p className="whitespace-pre-line">{garage.about}</p>
      </div>
      <div className="w-full">
        <div className="mockup-window mb-20 flex-grow border bg-base-200">
          {/* <div className="flex flex-row items-center justify-end gap-3">
          <button className="btn-sm btn">contacter</button>
        </div>
        <Divider /> */}
          {/* {noCars ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background">
              <div className="w-1/3">
                <Lottie animationData={NoCardAnimation} />
              </div>
              <span className="-translate-y-[40px]">
                {text("text.empty cars")}
              </span>
            </div>
          ) : (
            <div className="grid h-full w-full grid-cols-3 gap-8 bg-background  px-8 py-5">
              {[...cars].map((a, i) => (
                <CarCardReadOnly key={i} auction={a} />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  </div>
  )
}
