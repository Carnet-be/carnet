import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useContext } from "react";
import { prisma } from "../../server/db/client";
import { MyNav } from "..";
import { LangCommonContext, LangContext, useLang } from "../hooks";
import { AssetImage, User,Blog } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;
  const paramId = context.params?.id;
  const id = paramId ? parseInt(paramId.toString()) : null;
  if (!id) {
    return {
      redirect: {
        destination: "/blogs",
        permanent: false,
      },
    };
  }
  const blog = await prisma.blog
    .findUnique({
      where: {
        id: id,
      },
      include: {
        image: true,
        author: {
          include: {
            image: true,
          },
        },
      },
    })
    .then((blog) => JSON.parse(JSON.stringify(blog)));

  if (!blog) {
    return {
      redirect: {
        destination: "/blogs",
        permanent: false,
      },
    };
  }
  const blogs = await prisma.blog
    .findMany({
      take: 5,
      include: {
        image: true,
        author: {
          include: {
            image: true,
          },
        },
      },
    })
    .then((blogs) => JSON.parse(JSON.stringify(blogs)));

  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common", "pages"])),
      blog,
      blogs,
      isAdmin: context.query.type === "ADMIN",
    },
  };
};
const BlogPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { blog, blogs, isAdmin } = props;

  console.log("blog", blog);
  const { text } = useLang({
    file: "pages",
    selector: "home",
  });
  return (
    <LangContext.Provider value={text}>
      <main>
        <MyNav />
      </main>
    </LangContext.Provider>
  );
};

export default BlogPage;

const BlogView = ({
  blog,
}: {
  blog: Blog & {
    image: AssetImage;
    user: User & {
      image: AssetImage | null;
    };
  };
}) => {
  const { text } = useLang({
    file: "pages",
    selector: "blog",
  });
  // const {text:comm}
  return (
    <div className="max-w-[800px] px-3">
      <span>{text("blog")}</span>
      <h1>{{ blog.tile }}</h1>
    </div>
  );
};
