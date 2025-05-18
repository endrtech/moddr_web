import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

interface ServerStore {
  serverId: string | null;
  setServerId: (value: string) => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),
}));

export const useServerStore = create<ServerStore>((set) => ({
  serverId: null,
  setServerId: (id: string) => set({ serverId: id }),
}));