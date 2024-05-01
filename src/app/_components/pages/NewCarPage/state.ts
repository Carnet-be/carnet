/* eslint-disable @typescript-eslint/consistent-type-imports */
import { create } from "zustand";
import { RouterInputs } from "~/trpc/shared";
type CarFormState = {
  form?: RouterInputs["car"]["addCar"];
  carId?: number;
  setForm: (data: RouterInputs["car"]["addCar"]) => void;

  setCarId: (id: number) => void;
  clear: () => void;
};

const useFormCarStore = create<CarFormState>((set) => ({
  form: undefined,


  setForm: (form: RouterInputs["car"]["addCar"]) => {
    console.log("Form", form);
    set({ form });
  },

  clear: () => set({ form: undefined,  carId: undefined }),
  setCarId: (carId: number) => set({ carId }),
}));

export default useFormCarStore;
