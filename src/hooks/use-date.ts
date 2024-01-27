"use client";

import dayjs, { type Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type TDate = string | number | Dayjs | Date | null | undefined;
const useDate = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    format: (date: TDate) => dayjs(date).format,
    dayjs,
  };
};

export default useDate;
