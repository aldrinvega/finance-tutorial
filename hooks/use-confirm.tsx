import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog";

export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
        const [promise, setPromise] = useState<{ resolve: (value: boolean) => void} | null>(null);
    
    const confirm = () => new Promise (resolve => {
        setPromise({ resolve });
    });
    
    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        handleClose();
        promise?.resolve(true);
    };
    const handleCancel = () => {
        handleClose();
        promise?.resolve(false);
    };
    
    const ConfirmationDialog = () => (
        <Dialog open={promise !== null} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
}