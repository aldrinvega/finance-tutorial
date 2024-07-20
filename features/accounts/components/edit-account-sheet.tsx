import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

import { useOpenAccount } from "../hooks/use-open-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { useCreateAcount } from "../api/use-create-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAcount } from "../api/use-edit-account";
import { useDeleteAcount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {

    const { isOpen, onCLose, id} = useOpenAccount();
    
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to delete this account?",
        "You are about to delete this account.",
    )

    const accountQuery = useGetAccount(id);
    const editMutation = useEditAcount(id);
    const deleteMutation = useDeleteAcount(id);
    
    const isPending = 
    editMutation.isPending || 
    deleteMutation.isPending;

    const isLoading = accountQuery.isLoading;
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onCLose();
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onCLose();
                }
            });
        }
        
    }

    const defaultValues = accountQuery.data ? {
        name : accountQuery.data.name
    } : {
        name: ""
    }

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onCLose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account details.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground"/>
                        </div>
                    ): <AccountForm 
                    id={id}
                    onSubmit={onSubmit} 
                    disabled={isPending}
                    defaultValues={defaultValues}
                    onDelete={onDelete}
                    />}
                    
                </SheetContent>
            </Sheet>
        </>
    );
};