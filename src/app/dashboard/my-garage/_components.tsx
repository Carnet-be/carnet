"use client"
import { Organization } from '@clerk/nextjs/dist/types/server/clerkClient'
import { Button, Input, Textarea } from '@nextui-org/react'

import React from 'react'
import { useForm } from 'react-hook-form'

const FormMyGarage = ({org}:{org:{
    name: string,
    slug: string,
}}) => {
const {register} =useForm(
    {
        defaultValues: {
            name: org.name,
            slug: org.slug,
            description: ""
        }
    
    }
)
    return (
        <div className='grid grid-cols-2 gap-7 py-3 max-w-4xl mx-auto'>
            <div className='pb-3 col-span-2'>
                <h1 className='text-2xl font-bold'>My Garage</h1>
                <p className='text-gray-500'>
                    Create your own garage and start selling your cars
                </p>
            </div>
            <div className='border-dashed border-2 rounded-lg col-span-2 aspect-[3] bg-[#F4F4F5] relative'>
                <div className='absolute bottom-2 right-2'>
                    <Button>
                        Change
                    </Button>
                </div>
            </div>
            <Input type="text" variant='faded' label="Name" placeholder="Enter the name" {...register("name")}/>
            <Input type="text" variant='faded' label="Slug" placeholder="Enter the slug" {...register("slug")}/>
            <div id='textarea-wrapper' className='col-span-2'> <Textarea  minRows={6} type="text" variant='faded' label="About" placeholder="Tell us about your garage" /></div>
            <div className='col-span-2 pt-4 pb-16 flex justify-end items-center'>
                <Button color='primary' className='px-10'>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default FormMyGarage