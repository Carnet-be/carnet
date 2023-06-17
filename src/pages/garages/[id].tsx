import { Garage } from "@prisma/client";
import { prisma } from "../../server/db/client";
import { TCar, TUser } from "@model/type";
import { userAgent } from "next/server";
function Garage(props: { garage: Garage; cars: TCar[]; user: TUser }) {
  return (
    <div>
      <h1>{props.garage.name}</h1>
      <h2>{props.garage.description}</h2>
    </div>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps({ params }: { params: { id: string } }) {
  const user = await prisma.user
    .findUnique({
      where: {
        id: params.id,
      },
      include: {
        garage: true,
        image: true,
        Car: {
          include: {
            images: true,
          },
        },
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  const garage = user.garage;
  const cars = user.Car;
  return {
    props: {
      garage,
      cars,
      user,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res: Garage[] = await prisma.garage
    .findMany({
      select: {
        user_id: true,
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  // Get the paths we want to pre-render based on posts
  const paths = res.map((post) => ({
    params: { id: post.user_id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default Garage;
