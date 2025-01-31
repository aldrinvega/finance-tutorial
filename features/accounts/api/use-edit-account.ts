import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAcount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({
                json,
                param: { id: id },
            });
            return await response.json();
        },

        onSuccess: () => {
            toast.success("Account updated");
            queryClient.invalidateQueries({queryKey: ["accounts", { id }]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            //TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to edit account");
        }
    });

    return mutation;
};