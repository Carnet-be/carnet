import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useContext } from "react";
import { prisma } from "../../server/db/client";
import { Footer, MyNav } from "..";
import { LangCommonContext, LangContext, useLang } from "../hooks";
import type { AssetImage, User, Blog } from "@prisma/client";
import cloudy from "@utils/cloudinary";
import remarkGfm from "remark-gfm";

import {
  AdvancedImage,
  lazyload,
  responsive,
  accessibility,
  placeholder,
} from "@cloudinary/react";
import { Divider, Tag } from "antd";
import moment from "moment";

import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import Share from "@ui/components/share";

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
    .then((blogs) =>
      JSON.parse(
        JSON.stringify(blogs.concat([...blogs, ...blogs, ...blogs, ...blogs]))
      )
    );

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
        <div className="py-[130px]">
          <div className="flex flex-row justify-center gap-10">
            <BlogView blog={blog} />
            {isAdmin ? "" : <BlogsView blogs={blogs} />}
          </div>
        </div>
        {/* <div className="bg-primary">
          <Footer />
        </div> */}
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
    <div className="flex max-w-[800px] flex-col items-center gap-10 px-3">
      <div className="flex w-full flex-col items-center gap-2 ">
        <h1 className=" text-center text-3xl text-primary ">{blog.title}</h1>
        <Divider className="text-xs text-black">
          {moment(blog.createAt).calendar()}
        </Divider>
        <Share link={`/blogs/${blog.id}`} />
      </div>

      <AdvancedImage
        cldImg={cloudy.image(blog.image.fileKey).quality("auto")}
        plugins={[lazyload(), placeholder()]}
      />
      <Divider />
      {/* <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
        {blog.content}
      </ReactMarkdown> */}
      <div className="prose prose-a:text-blue-600 prose-hr:my-8 prose-hr:h-px prose-hr:border-0 prose-hr:bg-blue-200 lg:prose-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const BlogsView = ({
  blogs,
}: {
  blogs: Array<
    Blog & {
      image: AssetImage;
      user: User & {
        image: AssetImage | null;
      };
    }
  >;
}) => {
  const { text } = useLang(undefined);
  return (
    <div className="w-[300px]">
      <span>{text("text.blogs")}</span>
      <Divider />
      <div className="flex flex-col items-center gap-10 ">
        {blogs.map((blog, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-md">
              <AdvancedImage
                cldImg={cloudy.image(blog.image.fileKey).quality("40")}
                plugins={[lazyload(), placeholder()]}
              />
            </div>
            <a
              href={`/blogs/${blog.id}`}
              className="border-l-4 border-primary pl-3 text-black hover:text-primary"
            >
              {blog.title}
            </a>
            <div>
              <Tag className="">{moment(blog.createAt).calendar()}</Tag>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};