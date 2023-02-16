import { create } from 'zustand'

import { devtools, persist } from 'zustand/middleware'
interface BidderState {
    wishList: number
    setWishs: (by: number) => void,
    decrease: () => void,
    increase: () => void,
  }
export const useBidderStore = create<BidderState>()(
    devtools(
      persist(
        (set) => ({
          wishList: 0,
            setWishs: (by: number) => set((state) => ({ wishList: by })),
           decrease: () => set((state) => ({ wishList: state.wishList-1 })),
          increase: () => set((state) => ({ wishList: state.wishList+1 })),
        }),
        {
          name: 'bidder-storage',
        }
      )
    )
  )