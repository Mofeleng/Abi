import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewDatabaseSource } from "../actions/create-new-data-source";
import { ConfigureNewDatabaseDto } from "../dtos/configure-new-db-dto";

export default function UseCreateDatabaseSource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: ConfigureNewDatabaseDto) => createNewDatabaseSource(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-datasources"]});
        }
    })
}