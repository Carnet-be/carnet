"use client";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SearchButton = () => {
  const nouter = useRouter();
  const [search, setSearch] = useState("");
  return (
    <div className="flex w-full items-center gap-3">
      <Input
        size="lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        className="w-[300px] grow"
      />
      <Button
        onClick={() => {
          if (search) {
            nouter.push(`/dashboard/home?q=${search}`);
          }
        }}
        size="lg"
        color="primary"
      >
        Search
      </Button>
    </div>
  );
};
