/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { Chip, Input, Select, SelectItem, Spinner, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, getKeyValue } from '@nextui-org/react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type Key } from 'react';
import { useDebounce } from 'usehooks-ts';
import { api } from '~/trpc/react';
import { type FullCar } from '~/types';
import { getCarImage } from '~/utils/function';




export const CarTypeSwitch = ({ counts }: { counts: { direct: number, auction: number } }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return <Tabs onSelectionChange={(k) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', k.toString())
    router.replace(`${pathname}?${params.toString()}`);

  }} selectedKey={searchParams.get('type') ?? 'direct'} aria-label="Options" color="primary" variant="solid">
    <Tab
      key="direct"
      title={
        <div className="flex items-center space-x-2">

          <span>MarketPlace cars</span>
          <Chip size="sm">{counts.direct}</Chip>
        </div>
      }
    />
    < Tab
      key="auction"
      title={
        < div className="flex items-center space-x-2" >

          <span>Auctions</span>
          <Chip size="sm">{counts.auction}</Chip>
        </div >
      }
    />

  </Tabs >
}
export function TabsSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isDirect = searchParams.get('type') != 'auction'
  const { data } = api.bo.car.getStatusCounts.useQuery({
    search: searchParams.get('search'),
    brand: searchParams.get('brand'),
    model: searchParams.get('model'),
    type: searchParams.get('type') as any ?? 'direct'
  })

  return (
    <div className="flex w-full flex-col">
      {isDirect ? <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        onSelectionChange={(k) => {
          const params = new URLSearchParams(searchParams);
          params.set('status', k.toString())
          router.replace(`${pathname}?${params.toString()}`);

        }} selectedKey={searchParams.get('status') ?? 'published'}
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >

        <Tab
          key="published"
          title={
            <div className="flex items-center space-x-2">

              <span>Published</span>
              <Chip size="sm" variant="faded">
                {data?.published ?? 0}
              </Chip>
            </div>
          }
        />

        <Tab
          key="pending"
          title={
            <div className="flex items-center space-x-2">
              <span>Pending</span>
              <Chip size="sm" variant="faded">
                {data?.pending ?? 0}
              </Chip>
            </div>
          }
        />

      </Tabs> : <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        onSelectionChange={(k) => {
          const params = new URLSearchParams(searchParams);
          params.set('status', k.toString())
          router.replace(`${pathname}?${params.toString()}`);

        }} selectedKey={searchParams.get('status') ?? 'published'}
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >

        <Tab
          key="published"
          title={
            <div className="flex items-center space-x-2">

              <span>Published</span>
              <Chip size="sm" variant="faded">
                {data?.published ?? 0}
              </Chip>
            </div>
          }
        />
        <Tab
          key="paused"
          title={
            <div className="flex items-center space-x-2">

              <span>Paused</span>
              <Chip size="sm" variant="faded">
                {data?.paused ?? 0}
              </Chip>
            </div>
          }
        />
        <Tab
          key="pending"
          title={
            <div className="flex items-center space-x-2">

              <span>Pending</span>
              <Chip size="sm" variant="faded">
                {data?.pending ?? 0}
              </Chip>
            </div>
          }
        />
        <Tab
          key="finished"
          title={
            <div className="flex items-center space-x-2">

              <span>Need Confirmation</span>
              <Chip size="sm" variant="faded">
                {data?.finished ?? 0}
              </Chip>
            </div>
          }
        />
        <Tab
          key="completed"
          title={
            <div className="flex items-center space-x-2">

              <span>Completed</span>
              <Chip size="sm" variant="faded">
                {data?.completed ?? 0}
              </Chip>
            </div>
          }
        />



      </Tabs>
      }
    </div>
  );
}


export const AdminSearchSection = ({ filters }: {
  filters: {
    brands: {
      id: number;
      label: string;
    }[];
    models: {
      id: number;
      label: string;
      brandId: number;
    }[];

  }
}) => {
  const brands = filters.brands ?? []
  const models = filters.models ?? []
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSearch = (key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams);
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(`${pathname}?${params.toString()}`);
  }
  const [searchInput, setSearchInput] = useState<string>(searchParams.get('search') ?? '')
  const debouncedValue = useDebounce<string>(searchInput, 400)
  useEffect(() => {
    console.log('debouncedValue', debouncedValue)
    setSearch('search', debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])
  return <div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <Select
        //variant={variant}
        label="Brand"
        placeholder="Select a brand"
        variant="faded"
        labelPlacement="outside"

        selectedKeys={(searchParams.get('brand') ? [searchParams.get('brand')] : undefined) as any}
        onSelectionChange={(k: any) => {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const value = k?.currentKey?.toString()
          setSearch('brand', value)
        }}
      >
        {brands.map((b) => (
          <SelectItem key={b.id} value={b.id}
          // startContent={<Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />}
          >
            {b.label}

          </SelectItem>
        ))}
      </Select>

      <Select
        //variant={variant}
        label="Models"
        placeholder="Select a model"
        variant="faded"
        labelPlacement="outside"
        selectedKeys={(searchParams.get('model') ? [searchParams.get('model')] : undefined) as any}
        disabled={!searchParams.get('brand')}
        onSelectionChange={(k: any) => {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const value = k?.currentKey?.toString()
          setSearch('model', value)
        }}
      >
        {models.filter((m) => m.brandId.toString() == searchParams.get('brand')).map((b) => (
          <SelectItem key={b.id} value={b.label}>
            {b.label}
          </SelectItem>
        ))}
      </Select>
    </div>
    <div className='flex flex-row items-center justify-end pt-4'>
      <Input
        //variant={variant}
        startContent={
          <Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        placeholder="Search"
        className='w-[400px]'
        isClearable
        value={searchInput}
        onClear={() => setSearchInput('')}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  </div>
}



export const CarsTable = () => {
  const searchParams = useSearchParams();
  const { data: rows, isError, isLoading } = api.bo.car.getCars.useQuery({
    search: searchParams.get('search'),
    brand: searchParams.get('brand'),
    model: searchParams.get('model'),
    type: searchParams.get('type') as any ?? 'direct',
    status: searchParams.get('status') as any ?? 'published'
  }, {
    initialData: []
  })
  //
  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "image",
      label: "IMAGE",
    },
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "state",
      label: "STATE",
    },
    {
      key: "createdAt",
      label: "CREATED AT"
    },
    {
      key: "updatedAt",
      label: "LAST UPDATE"
    }
  ];

  const render = (item: FullCar, columnKey: Key) => {
    const value = getKeyValue(item, columnKey)
    switch (columnKey) {
      case "image":
        return <div
          className="relative w-[120px] flex aspect-[3/2]  flex-col items-center justify-center overflow-hidden rounded-lg border bg-white"
        >
          <Image
            src={getCarImage(item.images[0]?.key)}
            alt="photo"
            layout="fill"
            objectFit="cover"
          />
        </div>
      case "createdAt":
      case "updatedAt":
        return value ? new Date(value).toLocaleDateString() : "-"
      case "state":
        return <Chip variant='faded' size='sm' className='mx-auto'>
          <span className='text-sm'>
            {value}
          </span>
        </Chip>
      default:
        return getKeyValue(item, columnKey)
    }
  }
  return <Table aria-label="Example empty table">
    <TableHeader columns={columns}>
      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
    </TableHeader>
    <TableBody loadingState={isError ? "error" : isLoading ? "loading" : undefined} loadingContent={<Spinner />} emptyContent={"No cars found"} items={rows}>
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => <TableCell>{render((item as any), columnKey)}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
}