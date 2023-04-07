import React from "react";
import { prisma } from "../../server/db/client";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const blog = await prisma.blog
    .findFirst({
      where: {
        OR: [{ locale: locale }, { locale: null }],
      },
      orderBy: {
        createAt: "desc",
      },
    })
    .then((blog) => JSON.parse(JSON.stringify(blog)));

  if (!blog) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/blogs/${blog.id}`,
      permanent: false,
    },
  };
};
const Blogs = () => {
  return <div>Blogs</div>;
};

export default Blogs;
