/* eslint-disable @typescript-eslint/consistent-type-imports */
import { create, createStore } from "zustand"
import { persist, devtools, createJSONStorage } from "zustand/middleware"
import { TCar } from "."


type CarFormState = {
    form?: TCar,
    carId?: number,
    step: number,
    setForm: (data: TCar) => void,
    setStep: (step: number) => void,
    setCarId: (id: number) => void,
    clear: () => void,
}


const useFormCarStore = create<CarFormState>((set) => ({
    form: undefined,
    step: 1,

    setForm: (form: TCar) => {
        console.log("Form", form)
        set({ form })
    },
    setStep: (step: number) => set({ step }),
    clear: () => set({ form: undefined, step: 1, carId: undefined }),
    setCarId: (carId: number) => set({ carId }),
}))

export default useFormCarStore