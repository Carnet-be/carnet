"use client";
import { Autocomplete, AutocompleteItem, Button, Input, cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { api } from "~/trpc/react";
import { FUEL, getListOfYearFrom1990 } from "./_components/pages/NewCarPage/step1";

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
  const { data, isLoading } = api.public.getBrandsModel.useQuery()
  const [brandId, setBrandId] = useState<number | undefined>(undefined)
  const [modelId, setModelId] = useState<number | undefined>(undefined)
  const [year, setYear] = useState<number | undefined>(undefined)
  const [fuel, setFuel] = useState<string | undefined>(undefined)
  const router = useRouter();
  //get years from
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
              isLoading={isLoading}
              selectedKey={brandId}
              onSelectionChange={(value) => {
                setBrandId(value?.valueOf() as number)
                setModelId(undefined)
              }}
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
              {data?.brands?.map((animal) => (
                <AutocompleteItem key={animal.id} value={animal.id}>
                  {animal.name}
                </AutocompleteItem>
              )) ?? []}
            </Autocomplete>
            <Autocomplete
              label="Model"
              isLoading={isLoading}
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
              selectedKey={modelId}
              onSelectionChange={(value) => {
                setModelId(value?.valueOf() as number)
                if (!brandId) {
                  setBrandId(data?.models?.find((m) => m.id == value?.valueOf())?.brandId)
                }
              }}
            >
              {data?.models?.filter((m) => brandId ? m.brandId == brandId : true)?.map((animal) => (
                <AutocompleteItem key={animal.id} value={animal.id}>
                  {animal.name}
                </AutocompleteItem>
              )) ?? []}
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

              selectedKey={year}
              value={year}
              onSelectionChange={(value) => {
                setYear(value?.valueOf() as number)
              }}
            >
              {getListOfYearFrom1990().map((animal) => (
                <AutocompleteItem key={animal} value={animal.toString()}>
                  {animal.toString()}
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

              selectedKey={fuel}
              onSelectionChange={(value) => {
                setFuel(value?.valueOf() as string)
              }}
            >
              {FUEL.map((animal) => (
                <AutocompleteItem key={animal.toLowerCase()} value={animal.toLowerCase()}>
                  {animal}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="flex w-full justify-end pt-4">
            {tab === "buy" && <Button
              onClick={() => {
                const query = new URLSearchParams()
                if (brandId) query.append("brandId", brandId.toString())
                if (modelId) query.append("modelId", modelId.toString())
                if (year) query.append("year", year.toString())
                if (fuel) query.append("fuel", fuel)
                router.push("/dashboard/home?" + query.toString())
              }}
              color="primary" startContent={<BiSearch />}>
              Search Car
            </Button>}
            {tab === "sell" && <Button
              onClick={() => {
                const query = new URLSearchParams()
                if (brandId) query.append("brandId", brandId.toString())
                if (modelId) query.append("modelId", modelId.toString())
                if (year) query.append("year", year.toString())
                if (fuel) query.append("fuel", fuel)
                router.push("/forms/car/new?" + query.toString())
              }}
              color="primary" startContent={<CgAdd />}>
              Sell Car
            </Button>}
          </div>
        </div>
      </div>
    </div >
  )
}
