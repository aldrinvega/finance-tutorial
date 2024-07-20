"use client";


import { NeAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null;
    
    return (
        <>
            <NeAccountSheet/>
        </>
    );
};