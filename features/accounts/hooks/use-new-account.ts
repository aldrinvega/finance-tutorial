import { create } from "zustand";

type NewAccountState = {
    isOpen: boolean;
    onOpen: () => void;
    onCLose: () => void;
};

export const useNewAccount = create<NewAccountState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onCLose: () => set({isOpen: false})
}));