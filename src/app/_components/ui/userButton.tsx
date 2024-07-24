import { currentUser } from "@clerk/nextjs/server";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiCar } from "react-icons/bi";
import { MdDashboard, MdPerson } from "react-icons/md";
import { GarageIcon } from "../icons";
import LogoutButton from "./logoutButton";

async function UserButton() {
  let user;
  const c = useTranslations("common");
  try {
    user = await currentUser();
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    return (
      <div className="flex gap-3">
        <a
          href="/auth/sign-up"
          className="hover:bg-blue-dark rounded-md bg-primary px-7 py-1 text-base font-medium text-white"
        >
          {c("get started")}
        </a>
        <a
          href="/auth/sign-in"
          className="hover:bg-blue-dark  rounded-md border-2 border-primary bg-white px-7 py-1 text-base font-medium text-primary"
        >
          {c("login")}
        </a>
      </div>
    );
  }

  const isAdmin = user.privateMetadata?.role === "admin";

  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <User
          as="button"
          name={`${user.firstName} ${user.lastName}`}
          description={user.username}
          avatarProps={{
            src: user.imageUrl,
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <Card shadow="none" className="w-[300px] border-none bg-transparent">
          <CardHeader className="justify-between">
            <div className="flex gap-3">
              <Avatar isBordered radius="full" size="md" src={user.imageUrl} />
              <div className="flex flex-col items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{`${user.firstName} ${user.lastName}`}</h4>
                {user.username && (
                  <h5 className="text-small tracking-tight text-default-500">{`@${user.username}`}</h5>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-1 px-3 py-0">
            {isAdmin ? (
              <Link href="/dashboard/admin">
                <Button
                  variant="light"
                  size="sm"
                  fullWidth
                  startContent={<MdDashboard />}
                  className="flex justify-start"
                >
                  {c("dashboard")}
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/home">
                <Button
                  variant="light"
                  size="sm"
                  fullWidth
                  startContent={<MdDashboard />}
                  className="flex justify-start"
                >
                  {c("marketplace")}
                </Button>
              </Link>
            )}
            <Link
              href={isAdmin ? "/dashboard/admin/garages" : "/dashboard/garages"}
            >
              <Button
                variant="light"
                size="sm"
                fullWidth
                startContent={<GarageIcon />}
                className="flex justify-start"
              >
                {c("garages")}
              </Button>
            </Link>
            {isAdmin ? (
              <Link href="/dashboard/admin/cars">
                <Button
                  variant="light"
                  size="sm"
                  fullWidth
                  startContent={<BiCar />}
                  className="flex justify-start"
                >
                  {c("cars")}
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/my-cars">
                <Button
                  variant="light"
                  size="sm"
                  fullWidth
                  startContent={<BiCar />}
                  className="flex justify-start"
                >
                  {c("my cars")}
                </Button>
              </Link>
            )}
            <Link href="/dashboard/settings">
              <Button
                variant="light"
                size="sm"
                fullWidth
                startContent={<MdPerson />}
                className="flex justify-start"
              >
                {c("profile")}
              </Button>
            </Link>
          </CardBody>
          <CardFooter className="gap-3">
            <LogoutButton />
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default UserButton;
