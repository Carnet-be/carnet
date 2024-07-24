import { SignIn } from "@clerk/nextjs";

const login = () => {
  return (
    <SignIn
      appearance={{
        elements: {
          card: "shadow-xl border",
        },
      }}
    />
  );
};

export default login;
