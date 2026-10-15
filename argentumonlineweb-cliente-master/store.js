import { create } from "zustand";

const useGameStore = create((set) => ({
    account: {},
    initsLoaded: false,

    setAccount: (account) => set({ account }),
    setInitLoaded: (initsLoaded) => set({ initsLoaded }),

    resetStore: () => set({ account: {}, initsLoaded: false })
}));

export default useGameStore;
