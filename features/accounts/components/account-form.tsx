import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostAccount, postAccountSchema } from "@/db/schema";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem,
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";

type Props = {
    id?: string;
    defaultValues?: PostAccount;
    onSubmit: (values: PostAccount) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {

    const form = useForm<PostAccount>({
        resolver: zodResolver(postAccountSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (values: PostAccount) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form
             onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-4 pt-4">
                <FormField 
                name="name"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="e.g. Cash, Bank, Credit Card"
                                    {...field}    
                                >
                                </Input>
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save changes" : "Create account"}
                </Button>
                { !!id && 
                    (
                        <Button 
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className="w-full"
                        variant="outline"
                        >
                        <Trash className="size-4 mr-2"/>
                        Delete account
                        </Button>
                    )}
            </form>
        </Form>
    )
}