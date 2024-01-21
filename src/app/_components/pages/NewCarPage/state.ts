/* eslint-disable @typescript-eslint/consistent-type-imports */
import { create } from "zustand";
import { RouterInputs } from "~/trpc/shared";
type CarFormState = {
  form?: RouterInputs["car"]["addCar"];
  carId?: number;
  step: number;
  setForm: (data: RouterInputs["car"]["addCar"]) => void;
  setStep: (step: number) => void;
  setCarId: (id: number) => void;
  clear: () => void;
};

const useFormCarStore = create<CarFormState>((set) => ({
  form: undefined,
  step: 1,

  setForm: (form: RouterInputs["car"]["addCar"]) => {
    console.log("Form", form);
    set({ form });
  },
  setStep: (step: number) => set({ step }),
  clear: () => set({ form: undefined, step: 1, carId: undefined }),
  setCarId: (carId: number) => set({ carId }),
}));

export default useFormCarStore;
