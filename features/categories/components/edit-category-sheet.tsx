import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

import { useOpenCategory } from "../hooks/use-open-category";
import { CategoryForm } from "./category-form";
import { PostCategories } from "@/db/schema";
import { useGetCatgory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";


export const EditCategorySheet = () => {

    const { isOpen, onCLose, id} = useOpenCategory();
    
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to delete this category?",
        "You are about to delete this category.",
    )

    const categoryQuery = useGetCatgory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);
    
    const isPending = 
    editMutation.isPending || 
    deleteMutation.isPending;

    const isLoading = categoryQuery.isLoading;
    const onSubmit = (values: PostCategories) => {
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

    const defaultValues = categoryQuery.data ? {
        name : categoryQuery.data.name
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
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category details.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground"/>
                        </div>
                    ): <CategoryForm 
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