import { Button } from "@nextui-org/react";

const Retry = ({ onClick }: { onClick(): void }) => {
  return (
    <div className="flex w-full items-center justify-center pt-4">
      <Button onClick={onClick}>Retry</Button>
    </div>
  );
};

export default Retry;
