/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { create } from "zustand"

type Store = {
    data: any,
    setData: (data: any) => void,
    clear: () => void
}



const useNewCarHistorique = create<Store>((set, get) => ({
    data: {1:1},
    setData: (data) => set({ data }),
    clear: () => set({ data: {} })

}))


export default useNewCarHistorique