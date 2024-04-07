"use client";
import { Autocomplete, AutocompleteItem, Button, Input, cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";

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


export const InteractCard = () => {
  const [tab, setTab] = useState<"buy" | "sell">("buy")
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => setTab("buy")}


          className={cn("rounded-b-none", tab === "buy" ? "bg-[#E4EDF6]" : "bg-primary text-white")}

        >
          Buy
        </Button>
        <Button
          onClick={() => setTab("sell")}
          className={cn("rounded-b-none", tab === "sell" ? "bg-[#E4EDF6]" : "bg-primary text-white")}
        >
          Sell
        </Button>
      </div>
      <div className="flex backdrop-shadow-md py-10 px-5 flex-col gap-2 bg-[#E4EDF6] w-full rounded-md rounded-tl-none">

        <div>

          <div className="grid grid-cols-2 gap-3">
            <Autocomplete
              label="Brand"
              placeholder="Search a brand"
              inputProps={{
                classNames: {

                  inputWrapper: " bg-white",
                },
              }}
              labelPlacement="outside"

              // className="max-w-xs"
              scrollShadowProps={{
                isEnabled: false,

              }}
            >
              {[].map((animal) => (
                <AutocompleteItem key={animal} value={animal}>
                  {animal}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label="Model"
              inputProps={{
                classNames: {

                  inputWrapper: " bg-white",
                },
              }}
              placeholder="Search a model"

              labelPlacement="outside"
              // className="max-w-xs"
              scrollShadowProps={{
                isEnabled: false
              }}
            >
              {[].map((animal) => (
                <AutocompleteItem key={animal} value={animal}>
                  {animal}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Autocomplete
              label="Year"
              placeholder="Search a year"
              inputProps={{
                classNames: {

                  inputWrapper: " bg-white",
                },
              }}
              labelPlacement="outside"

              // className="max-w-xs"
              scrollShadowProps={{
                isEnabled: false
              }}
            >
              {[].map((animal) => (
                <AutocompleteItem key={animal} value={animal}>
                  {animal}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Autocomplete
              label="Fuel"
              placeholder="Search a brand"
              inputProps={{
                classNames: {

                  inputWrapper: " bg-white",
                },
              }}
              labelPlacement="outside"

              // className="max-w-xs"
              scrollShadowProps={{
                isEnabled: false
              }}
            >
              {["gasoline", "diesel", "electricity", "hybrid"].map((animal) => (
                <AutocompleteItem key={animal} value={animal}>
                  {animal}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="flex w-full justify-end pt-4">
            {tab === "buy" && <Button
              onClick={() => router.push("/dashboard/home")}
              color="primary" startContent={<BiSearch />}>
              Search Car
            </Button>}
            {tab === "sell" && <Button
              onClick={() => router.push("/forms/car/new")}
              color="primary" startContent={<CgAdd />}>
              Sell Car
            </Button>}
          </div>
        </div>
      </div>
    </div >
  )
}
