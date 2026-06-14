import { useMutation, useQueryClient } from "@tanstack/react-query";
import createNewFolder from "../actions/create-folder";

export function useCreateNewFolder() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (name: string) => createNewFolder(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-folders"]});
        }
    })
}