import { currentUser } from "@clerk/nextjs";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, User } from "@nextui-org/react";
import Link from "next/link";
import { MdDashboard, MdLogout, MdPerson } from "react-icons/md";

async function UserButton() {
  let user;
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
          className="hover:bg-blue-dark rounded-md bg-primary px-7 py-3 text-base font-medium text-white"
        >
          Get Started
        </a>
        <a
          href="/auth/sign-in"
          className="hover:bg-blue-dark  border-2 border-primary rounded-md bg-white px-7 py-3 text-base font-medium text-primary"
        >
          Login
        </a>
      </div>
    );
  }

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
        <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
          <CardHeader className="justify-between">
            <div className="flex gap-3">
              <Avatar isBordered radius="full" size="md" src={user.imageUrl} />
              <div className="flex flex-col items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{`${user.firstName} ${user.lastName}`}</h4>
                {user.username && <h5 className="text-small tracking-tight text-default-500">{`@${user.username}`}</h5>}
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 space-y-1">


            <Link href="/dashboard">
              <Button variant="light" size="sm" fullWidth startContent={<MdDashboard />} className="flex justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="light" size="sm" fullWidth startContent={<MdPerson />} className="flex justify-start">
                Profile
              </Button>
            </Link>


          </CardBody>
          <CardFooter className="gap-3">
            <Button color="danger" variant="flat" size="sm" fullWidth startContent={<MdLogout />} className="flex justify-start">
              Logout
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default UserButton;
