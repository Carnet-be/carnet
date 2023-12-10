/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { Badge, Chip, Select, SelectItem, TableCell, TableRow, getKeyValue } from '@nextui-org/react'
import React, { type Key } from 'react'

import { Table, TableBody, TableColumn, TableHeader } from "@nextui-org/react";
import { type FullCar } from '~/types';
import { MdMoney, MdPending } from 'react-icons/md';
import { AuctionIcon } from '~/app/_components/icons';
import { Car, CircleDollarSign, GalleryHorizontal, Music, Pause, VideoIcon } from 'lucide-react';
import Image from 'next/image';
import { getCarImage } from '~/utils/function';



import {Tabs, Tab,} from "@nextui-org/react";
import { Body } from '~/server/db/schema/bodies';
import { Brand } from '~/server/db/schema/brands';
import { Model } from '~/server/db/schema/models';


export  function TabsSection() {
  return (
    <div className="flex w-full flex-col">
      <Tabs 
        aria-label="Options" 
        color="primary" 
        variant="underlined"
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
              <Chip size="sm" variant="faded">9</Chip>
            </div>
          }
        />
        <Tab
          key="paused"
          title={
            <div className="flex items-center space-x-2">
             
              <span>Paused</span>
              <Chip size="sm" variant="faded">3</Chip>
            </div>
          }
        />
        <Tab
          key="pending"
          title={
            <div className="flex items-center space-x-2">
              
              <span>Pending</span>
              <Chip size="sm" variant="faded">1</Chip>
            </div>
          }
        />
          <Tab
          key="need_confirmation"
          title={
            <div className="flex items-center space-x-2">
              
              <span>Need Confirmation</span>
              <Chip size="sm" variant="faded">1</Chip>
            </div>
          }
        />
          <Tab
          key="completed"
          title={
            <div className="flex items-center space-x-2">
              
              <span>Completed</span>
              <Chip size="sm" variant="faded">1</Chip>
            </div>
          }
        />
      </Tabs>
    </div>  
  );
}


export const AdminSearchSection = ({ data }: { data: any }) => {
    const bodies: Body[] = data?.bodies ?? []
    const brands: Brand[] = data?.brands ?? []
    const models: Model[] = data?.models ?? []

    return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select
            //variant={variant}
            label="Body Type"
            placeholder="Select a body type"
            variant="faded"
            labelPlacement="outside"
        >
            {bodies.map((b) => (
                <SelectItem key={b.id} value={b.name}>
                    {b.name}
                </SelectItem>
            ))}
        </Select>
        <Select
            //variant={variant}
            label="Brand"
            placeholder="Select a brand"
            variant="faded"
            labelPlacement="outside"
        >
            {brands.map((b) => (
                <SelectItem key={b.id} value={b.name}>
                    {b.name}
                </SelectItem>
            ))}
        </Select>

        <Select
            //variant={variant}
            label="Models"
            placeholder="Select a model"
            variant="faded"
            labelPlacement="outside"
        >
            {models.map((b) => (
                <SelectItem key={b.id} value={b.name}>
                    {b.name}
                </SelectItem>
            ))}
        </Select>
    </div>
}



export const CarsTable = ({ children }: { children: FullCar[] }) => {
    const rows = children.map((car) => ({...car, key: car.id}))

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
            key:"type",
            label:"TYPE"
        },
        {
            key:"createdAt",
            label:"CREATED AT"
        },
        {
            key:"updatedAt",
            label:"LAST UPDATE"
        }
    ];

    const render=(item:FullCar, columnKey:Key)=>{
        const value=getKeyValue(item, columnKey)
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
                return value? new Date(value).toLocaleDateString() : "-"
            case "state":
                return <Chip variant='faded' size='sm' className='mx-auto'>
                    <span className='text-sm'>
                    {value}
                    </span>
                </Chip>
            case "type":
                return value==="direct"? <CircleDollarSign size={22} /> : <AuctionIcon size={22}/>
            default:
                return getKeyValue(item, columnKey)
        }
    }
    return <Table aria-label="Example empty table">
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={"No cars found"} items={rows}>
            {(item) => (
                <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{render(item, columnKey)}</TableCell>}
                </TableRow>
            )}
        </TableBody>
    </Table>
}