import { currentUser } from "@clerk/nextjs";
import { User } from "@nextui-org/react";
import Link from "next/link";

async function UserButton() {
  const user = await currentUser();
  if (!user) {
    return (
      <a
        href="/dashboard"
        className="hover:bg-blue-dark rounded-md bg-primary px-7 py-3 text-base font-medium text-white"
      >
        Get Started
      </a>
    );
  }
  return (
    <Link href="/dashboard">
      <User
        name={`${user.firstName} ${user.lastName}`}
        description={user.username}
        avatarProps={{
          src: user.imageUrl,
        }}
      />
    </Link>
  );
}

export default UserButton;
