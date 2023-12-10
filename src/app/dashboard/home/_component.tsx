/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"
import { Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import { Body } from '~/server/db/schema/bodies'
import { Brand } from '~/server/db/schema/brands'
import { Model } from '~/server/db/schema/models'

export const CarsSections = () => {
    return (
        <div>_component</div>
    )
}


export const SearchSection = ({data}:{data:any}) => {
    const bodies:Body[] = data?.bodies??[]
    const brands: Brand[] = data?.brands??[]
    const models:Model[] = data?.models??[]

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
