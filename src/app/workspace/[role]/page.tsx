import { redirect } from 'next/navigation'
import React from 'react'

const RoleHome = ({params}:Page) => {
    console.log('params', params)
    if(params.role==='') redirect('/workspace/admin')
 
    return <div>
        <span>
            Hello, world!
        </span>
    </div>
}

export default RoleHome