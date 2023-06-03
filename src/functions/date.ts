import moment from "moment";

export const isConfirmation = (date: Date | undefined | null): boolean => {
  if (date) {
    if (moment(date).isBefore(moment())) {
      return true;
    }
  }
  return false;
};
