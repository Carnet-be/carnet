export const isConfirmation = (date: Date | undefined | null): boolean => {
  if (date) {
    if (date.getTime() < new Date().getTime()) {
      return true;
    }
  }
  return false;
};
