import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

import { useNewCategory } from "../hooks/use-new-category";
import { CategoryForm } from "./category-form";
import { PostCategories } from "@/db/schema";
import { useCreateCategory } from "../api/use-create-category";


export const NewCategorySheet = () => {

    const { isOpen, onCLose} = useNewCategory();
    const mutation = useCreateCategory();
    const onSubmit = (values: PostCategories) => {
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
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm 
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