/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { type Data5 } from ".";
import { LangCommonContext, LangContext } from "../../pages/hooks";

// handling?: number;
// tires?: number;
// exterior?: number;
// interior?:number

// const text: any = {
//   airco: "Airco",
//   electric_windows: "Electric Windows",
//   climate_control: "Climate Control",
//   panoramic_roof_or_open_roof: "Panoramic Roof or Open Roof",
//   central_locking: "Central locking",
//   xenon_lighting: "Xenon lighting",
//   light_alloy_wheels: "Light Alloy wheels",
//   four_by_four: "4x4",
//   power_steering: "Power Steering",
//   cruise_control: "Cruise control",
//   radio_cd: "Radio/CD",
//   parking_sensors: "Parking Sensors",
//   on_board_computer: "Onboard computer",
//   parking_camera: "Parking Camera",
//   start_stop: "Start/Stop",
//   electric_mirrors: "Electric Mirrors",
//   abs: "ABS",
//   tow_hook: "Tow Hook",
//   dead_angle_detection: "Dead Angle Detection",
// };
const Step5 = ({ data, setData }: { data: Data5; setData: any }) => {
  const text = useContext(LangContext);
  const op = (s: string) => text("options." + s);
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex w-full flex-row justify-start pl-8">
        Cocher les critères de votre voiture :
      </span>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {Object.keys(data).map((k, i) => {
          return (
            <div
              key={i}
              className="form-control w-[30%] rounded-lg border p-2 text-[]"
            >
              <label className="label flex  w-full cursor-pointer flex-row items-center justify-start  gap-2 break-words">
                <input
                  type="checkbox"
                  checked={data[k as keyof Data5]}
                  onChange={(e) => {
                    const obj = { ...data };
                    obj[k as keyof Data5] = e.target.checked;
                    setData(obj);
                  }}
                  className="checkbox-primary checkbox checkbox-sm"
                />
                <span className="label-text">{op(k)}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step5;
