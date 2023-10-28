"use client"
import { CreateOrganization } from '@clerk/nextjs'
import { Building, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Organisation = () => {
    const [isOrg, setIsOrg] = React.useState(false)
    const router= useRouter()
    return (
        <div>
            {isOrg ? <CreateOrganization appearance={{
                elements: {
                    card: 'shadow-xl border'
                }
            }} /> : <div className='w-[600px] space-y-10'>
                <h1 className='text-center text-xl font-semibold text-black max-w-[400px] mx-auto'>
                    Choose the type of account you want to create
                </h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
                    <button onClick={()=>router.replace("/dashboard")} className='shadow-xl border bg-white center flex-col p-10 rounded-2xl gap-3'>
                        <User />
                        <span>
                            Personal Account
                        </span>
                    </button>

                    <button onClick={()=>setIsOrg(true)} className='shadow-xl bg-white border center flex-col p-10 rounded-2xl gap-3'>
                        <Building />
                        <span>
                            Organisation Account
                        </span>
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default Organisation