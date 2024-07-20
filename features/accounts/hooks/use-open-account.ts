import { create } from "zustand";

type OpenAccountState = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onCLose: () => void;
};

export const useOpenAccount = create<OpenAccountState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({isOpen: true, id}),
    onCLose: () => set({isOpen: false, id: undefined})
}));