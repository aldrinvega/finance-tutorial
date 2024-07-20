import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

import { useNewAccount } from "../hooks/use-new-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { useCreateAcount } from "../api/use-create-account";

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>

export const NeAccountSheet = () => {

    const { isOpen, onCLose} = useNewAccount();
    const mutation = useCreateAcount();
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onCLose();
            }
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onCLose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm 
                    onSubmit={onSubmit} 
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: ""
                    }}
                    />
            </SheetContent>
        </Sheet>
    );
};