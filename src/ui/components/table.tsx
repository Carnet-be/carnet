/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState,useEffect, useRef } from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames'


interface Props<T>{
    columns: ColumnsType<T>,
    data:T[],
    loading:boolean,
    options?:Object
}
export type TableType=Auction|Bid|User|Brand| Model
const MyTable: React.FC<Props<TableType>> = ({columns,data,loading,options}) => <Table 
   size='small'
   className='w-full'
  {...options}
  loading={loading}  columns={columns} dataSource={data} />;

export default MyTable;

export const renderDate=(date:string,color='blue')=>{
    
    return   <Tag color="processing">{moment(date).format('L')}</Tag>// <div className={cx("rounded-md px-2 py-[1px] flex justify-center",`bg-${color}-100 border border-${color}-500 text-${color}-500`)}>{moment(date).format('L')}</div>
}

export const RenderTimer=({date}:{date:Date})=>{
    const [leftTime, setleft] = useState<moment.Duration>(executeEverySecond(date));


    useEffect(() => {
        const interval = setInterval(() =>leftTime.asSeconds()>0&& setleft(executeEverySecond(date)), 1000);
        return () => {
          clearInterval(interval);
        };
      }, []);
      useEffect(() => {
       console.log(leftTime)
      }, [leftTime]);
    return   <Tag color={leftTime?.asSeconds()<=0?"error":"default"} className='flex flex-row items-end justify-center font-semibold gap-1'>
       
       {leftTime?.asSeconds()<=0?"Expired":<>
       <span>
        {leftTime?.days()}
        <span className="text-sm font-light opacity-70">d</span>
      </span>
      <span>
        {leftTime?.hours()}
        <span className="text-sm font-light opacity-70">h</span>
      </span>
      <span>
        {leftTime?.minutes()}
        <span className="text-sm font-light opacity-70">m</span>
      </span>
       </>}

      </Tag> 
}


export const ActionTable=({onView,onDelete,onEdit,id}:{id?:string,onView?:()=>void,onEdit?:()=>void,onDelete?:()=>void})=>{
  const ref=useRef<HTMLLabelElement>(null)
  const refDelete=useRef<HTMLLabelElement>(null)

  return <div className="flex flex-row items-center justify-center gap-1">
{id&&onDelete &&    <ConfirmationDelete id={id} onDelete={onDelete}/>}
   <label ref={ref} hidden={true}  htmlFor={id}></label>
   <label ref={refDelete} hidden={true}  htmlFor={"delete"+id}></label>
  {onView&& <Tooltip title="View" className="flex flex-row items-center justify-center">
    <Button onClick={onView} shape="circle" icon={<ViewIcon className="text-lg"/>} />
  </Tooltip>}

 {onEdit&&  <Tooltip title="Edit" className="flex flex-row items-center justify-center text-primary">
    <Button onClick={()=>{
      ref.current?.click()
      onEdit()
    }} shape="circle" icon={<EditIcon className="text-lg"/>} />
  </Tooltip>}

 {onDelete&&  <Tooltip title="Delete" className="flex flex-row items-center justify-center text-red-500">
    <Button onClick={()=>{
      refDelete.current?.click()
 
      }} shape="circle" icon={<DeleteIcon className="text-lg"/>} />
  </Tooltip>}

</div>
}


export const ConfirmationDelete=({id,onDelete}:{id:string,onDelete:()=>void})=>{
  const key="delete"
  const ref=useRef<HTMLLabelElement>(null)
  return <>
  <input type="checkbox" id={key+id} className="modal-toggle" />
<div className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg  flex flex-col items-start">You are about to delete it</h3>
    {/* <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p> */}
    <div className="modal-action flex flex-row justify-between items-center">
    <label ref={ref} htmlFor={key+id} className="btn btn-ghost btn-sm">cancel</label>
      <button onClick={()=>{
        onDelete()
        ref.current?.click()
      }} className="btn btn-error btn-sm">delete</button>
    </div>
  </div>
  </div>
  </>
}
// /* eslint-disable @typescript-eslint/ban-types */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useWindowHeight } from '@react-hook/window-size';
// import Dashboard from '@ui/dashboard'
// import React, { useState } from 'react'
// import { Table, Pagination } from 'rsuite';
// import Users from "../../../mocks/users.json"
// import { useEffect } from 'react';
// import type{ TAuction } from '@model/type';
import { TAuction } from '@model/type';
import type { Auction, Brand, Model, User } from '@prisma/client';
import moment from 'moment';
import { executeEverySecond } from './countDown';
import type { Bid } from '@prisma/client';
import { ViewIcon, EditIcon, DeleteIcon } from '@ui/icons';

// const { Column, HeaderCell, Cell } = Table;

// export type Column={
//     title:string,
//     field:string,
//     options:Object
// }
// interface Props{
//     data:TAuction[],
//     columns:Column[],
//     isLoading?:boolean

// }
// const MyTable = ({data,columns,isLoading}:Props) => {
//     const [limit, setLimit] = React.useState(10);
//     const [page, setPage] = React.useState(1);
  
//     const handleChangeLimit = (dataKey:any) => {
//       setPage(1);
//       setLimit(dataKey);
//     };
  
//     const dataLimit = data.filter((v, i) => {
//       const start = limit * (page - 1);
//       const end = start + limit;
//       return i >= start && i < end;
//     });
  
//     const onlyHeight=useWindowHeight()
//     const [height, setheight] = useState(onlyHeight)
//     useEffect(() => {
//        setheight(onlyHeight)
//     }, [onlyHeight])
    
//   return (

//     <div>
//           <Table autoHeight 
//           //height={height}
//           loading={isLoading}
//            className='h-[77vh]' data={dataLimit}>
//             {columns.map((c,i)=>{
//                 return  <Column key={i} {...c.options}>
//                 <HeaderCell>{c.title}</HeaderCell>
//                 <Cell dataKey={c.field} rowData={(r:any)=>r.name} />
                
//               </Column>
//             })}
//       </Table>
//       <div style={{ padding: 20 }}>
//         <Pagination
//           prev
//           next
//           first
//           last
//           ellipsis
//           boundaryLinks
//           maxButtons={5}
//           size="md"
//           layout={['total', '-', 'limit', '|', 'pager']}
//           total={data.length}
//           limitOptions={[10, 30, 50,data.length]}
//           limit={limit}
//           activePage={page}
//           onChangePage={setPage}
//           onChangeLimit={handleChangeLimit}
//         />
//       </div>
//     </div>
 
//   )
// }




// export default MyTable