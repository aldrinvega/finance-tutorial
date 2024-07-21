import { create } from "zustand";

type NewCategoryState = {
    isOpen: boolean;
    onOpen: () => void;
    onCLose: () => void;
};

export const useNewCategory = create<NewCategoryState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onCLose: () => set({isOpen: false})
}));