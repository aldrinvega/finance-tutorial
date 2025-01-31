import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAcount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({
                param: { id },
            });
            const data = await response.json();

            return data;
        },

        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.invalidateQueries({queryKey: ["account", { id }]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            //TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete account");
        }
    });

    return mutation;
};