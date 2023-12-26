"use client"
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { GrFacebookOption, GrLinkedinOption } from "react-icons/gr";
import { RiWhatsappFill } from "react-icons/ri";

const twitterUrl = "https://twitter.com/intent/tweet?url=";
const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
const linkedinUrl = "https://www.linkedin.com/sharing/share-offsite/?url=";
const whatsappUrl = "https://api.whatsapp.com/send?text=";

type Social = {
  icon: ReactNode;
  url: string;
};

const socials: Social[] = [
  {
    icon: <BsTwitter />,
    url: twitterUrl,
  },
  {
    icon: <GrFacebookOption />,
    url: facebookUrl,
  },
  {
    icon: <GrLinkedinOption />,
    url: linkedinUrl,
  },
  {
    icon: <RiWhatsappFill />,
    url: whatsappUrl,
  },
];

const Share = ({ link }: { link: string }) => {
  const [base, setBase] = useState("");

  useEffect(() => {
    const host = window.location.host;
    const baseUrl = `https://${host}`;
    setBase(baseUrl);
  }, []);
  const onShare = (url: string) => {
    window.open(url + base + link, "_blank");
  };
  return (
    <div className="flex flex-row items-center gap-3">
      {socials.map((social, index) => (
        <button
          key={index}
          onClick={() => onShare(social.url)}
          className="flex items-center justify-center rounded-lg bg-primary p-2 text-white"
        >
          {social.icon}
        </button>
      ))}
    </div>
  );
};

export default Share;
