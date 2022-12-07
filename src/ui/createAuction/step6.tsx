/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  TextField,
} from "@mui/material";
import Upload from "@ui/components/upload";
import { DatePicker } from "antd";
import { type Data6 } from ".";
import { AddIcon } from '@ui/icons';

const Step6 = ({
  data,
  setData,
  defaultName,
}: {
  data: Data6;
  setData: any;
  defaultName: string;
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
        <Upload />
        <div className="flex flex-row items-center gap-3">
          <TextField
            label="Pricing"
            size="small"
            type="number"
            value={data.pricing}
            className="flex-grow"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{"€"}</InputAdornment>
              ),
            }}
            onChange={(e) => setData({ ...data, pricing: e.target.value })}
          />
          -
          <TextField
            label="Expected Price"
            size="small"
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

        </div>
        <div className="w-full">
        <DatePicker 
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        placeholder="Choisir la date fin"
         allowClear  onChange={(v)=>{
            setData({...data,duration:v?.toDate()})
        }} className="w-full border-black/40 active:border-black text-black/70"/>
     
        </div>
        <TextField
          label="Adresse"
          size="small"
          multiline
          maxRows={2}
          value={data.address}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Step6;
