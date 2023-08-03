/* eslint-disable @next/next/no-img-element */
import React from "react";
import { prisma } from "../../server/db/client";
import type { GetServerSideProps } from "next";
import type { AssetImage, Blog, Language } from "@prisma/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { TUser } from "@model/type";
import { LangContext, useLang } from "../hooks";
import { MyNav } from "..";
import { Divider } from "antd";
import { AdvancedImage } from "@cloudinary/react";
import cloudy from "@utils/cloudinary";
import { AiTwotoneCalendar } from "react-icons/ai";
import moment from "moment";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const blogs = await prisma.blog
    .findMany({
      where: {
        // locale: locale as (Language|undefined) || "fr",
        OR: [
          {
            locale: (locale as Language | undefined) || "fr",
          },
          {
            locale: null,
          },
          {
            locale: undefined,
          },
        ],
      },
      include: {
        image: true,
        author: {
          include: {
            image: true,
          },
        },
      },
      orderBy: {
        createAt: "desc",
      },
    })
    .then((blog) => JSON.parse(JSON.stringify(blog)));

  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common", "pages"])),

      blogs: [...blogs],
      isAdmin: context.query.type === "ADMIN",
    },
  };
};
const Blogs = (prop: {
  blogs: Array<Blog & { image: AssetImage; author: TUser }>;
}) => {
  const { blogs } = prop;
  const { text } = useLang({
    file: "pages",
    selector: "blog",
  });
  const { text: t } = useLang({
    file: "pages",
    selector: "home",
  });
  const router = useRouter();
  return (
    <LangContext.Provider value={t}>
      <main>
        <MyNav />
        <div className="container mx-auto flex max-w-[1000px] flex-col items-center gap-5 py-[130px]">
          <h3 className="text-primary">{text("our blogs")}</h3>
          <Divider />
          {blogs.length < 1 ? (
            <span className="opacite-50">{text("no blogs")}</span>
          ) : (
            <div className="grid grid-cols-3 items-center justify-center gap-10">
              {blogs.map((blog, i) => (
                <div
                  key={i}
                  onClick={() => {
                    router.push("/blogs/" + blog.id);
                  }}
                  className="group flex cursor-pointer flex-col items-center gap-4 bg-white transition-all duration-300"
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="relative w-full overflow-hidden rounded">
                      <img
                        src={cloudy
                          .image(blog.image.fileKey)
                          .quality(20)
                          .toURL()}
                        alt={blog.title}
                        className="h-full w-full  object-cover transition-all duration-300 group-hover:rotate-1 group-hover:scale-105"
                      />
                    </div>
                    <div
                      className="
                      flex flex-row 
                    "
                    >
                      <div
                        className="
                     w-0 rounded bg-primary transition-all
                     duration-300
                     group-hover:mr-2 group-hover:w-2
                     "
                      ></div>
                      <div className="flex-grow">
                        <h6 className="transition-all duration-300 group-hover:text-primary">
                          {blog.title}
                        </h6>
                        <span className="flex flex-row items-center gap-3 opacity-60">
                          <AiTwotoneCalendar />
                          <span className="text-xs">
                            {moment(blog.createAt).format("DD MMMM YYYY")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div className="bg-primary">
      <Footer />
    </div> */}
      </main>
    </LangContext.Provider>
  );
};

export default Blogs;
