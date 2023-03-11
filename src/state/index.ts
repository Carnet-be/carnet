import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";
interface BidderState {
  wishList: number;
  setWishs: (by: number) => void;
  decrease: () => void;
  increase: () => void;
}
export const useBidderStore = create<BidderState>()(
  devtools(
    persist(
      (set) => ({
        wishList: 0,
        setWishs: (by: number) => set((state) => ({ wishList: by })),
        decrease: () => set((state) => ({ wishList: state.wishList - 1 })),
        increase: () => set((state) => ({ wishList: state.wishList + 1 })),
      }),
      {
        name: "bidder-storage",
      }
    )
  )
);

interface TAdminNum {
  published: number;
  pending: number;
  pause: number;
  confirmation: number;
  completed: number;
}
interface TAdminDashboard extends TAdminNum {
  reload: () => void;
  setNums: (a: TAdminNum) => void;
  setReload: (refetch: () => void) => void;
}
export const useAdminDashboardStore = create<TAdminDashboard>()(
  devtools(
    persist(
      (set) => ({
        published: 0,
        pending: 0,
        pause: 0,
        confirmation: 0,
        completed: 0,
        reload: () => {
          console.log("reload");
        },
        setNums: (a: TAdminNum) => set((state) => ({...state, ...a })),
        setReload: (refetch: () => void) =>
          set((state) => ({ ...state, reload: refetch })),
      }),
      {
        name: "admin-dashboard-storage",
      }
    )
  )
);


interface TNotificationSeen {
  notifs:string[],
  add: (by: string) => void;
}
export const useNotifStore = create<TNotificationSeen>()(
  devtools(
    persist(
      (set) => ({
        notifs: [],
       add: (by: string) => set((state) => ({ notifs: [...state.notifs, by]})),
      }),
      {
        name: "notification-storage",
      }
    )
  )
);
