/* eslint-disable @typescript-eslint/no-explicit-any */
import Upload from '@ui/components/upload'
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';

 const UploadPage = () => {
    const uploadRef=useRef()
    const [images, setimages] = useState<any>([])
  return (
    <div className="p-[300px]">
        <button onClick={()=>(uploadRef.current as any).start()||3} className="btn">
            upload
        </button>
            <Upload
          uploadRef={uploadRef}
       
          value={images}
          setValue={(v) => {
          
            setimages(v)
          }}
        />
        </div>
  )
}

export default UploadPage