/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonGroup, InputAdornment, TextField } from "@mui/material";
import Upload from "@ui/components/upload";
import { Button, DatePicker } from "antd";
import { type MutableRefObject } from "react";
import { type Data6 } from ".";
import cx from 'classnames'
const Step6 = ({
  data,
  setData,
  defaultName,
  uploadRef,
}: {
  data: Data6;
  setData: any;
  defaultName: string;
  uploadRef: MutableRefObject<undefined>;
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-[86%] flex-col items-stretch gap-4">
        <TextField
          label="Nom de l'auction"
          defaultValue={defaultName}
          size="small"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <Upload
          uploadRef={uploadRef}
          value={data.images}
          setValue={(v) => setData({ ...data, images: v })}
        />
        <div className="flex flex-row items-center gap-3">
          <TextField
            label="Expected Price"
            type="number"
            value={data.expected_price}
            className="flex-grow"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{"€"}</InputAdornment>
              ),
            }}
            onChange={(e) =>
              setData({ ...data, expected_price: e.target.value })
            }
          />

          <div className="flex w-1/2 flex-col gap-1">
            <span className="text-sm">Auction Duration</span>
            <div className="flex flex-row gap-2">
              {["3 days","1 week","2 weeks"].map((n,i)=>{
                return  <button key={i} onClick={()=>setData({...data,duration:n})} className={cx("btn btn-sm rounded-md font-semibold",{
               //   "btn-disabled":n!=="3 days",
                  "btn-outline":data.duration!==n
                })}>{n}</button>
              })}
             
              
            </div>
          </div>
        </div>

        <TextField
          label="Adresse"
          size="small"
          multiline
          minRows={2}
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Step6;
