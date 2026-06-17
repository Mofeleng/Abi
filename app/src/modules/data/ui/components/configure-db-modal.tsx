import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { configureNewDatabaseDto, ConfigureNewDatabaseDto } from "../../dtos/configure-new-db-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mapDatabaseToLabel } from "../../helpers/database-provider-mapper";
import { AcceptedDatabaseProviderDto } from "../../dtos/accepted-db-providers";
import { Button } from "@/components/ui/button";

interface ConfigureDatabaseModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    db: AcceptedDatabaseProviderDto
}



export function ConfigureDatabaseModal({ open, setOpen, db }:ConfigureDatabaseModalProps) {
    const databases = ["POSTGRES", "MONGO", "MYSQL"];

    const form = useForm<ConfigureNewDatabaseDto>({
        resolver: zodResolver(configureNewDatabaseDto),
        defaultValues: {
            name: "",
            type: db,
            databaseConnectionString: ""
        }
    });

    const onSubmit = () => {

    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Database</DialogTitle>
                    <DialogDescription>Setup your new database connection</DialogDescription>
                </DialogHeader>
                <div className="">
                    <Separator />
                </div>
                <div className="">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Name
                                    </FieldLabel>
                                    <Input
                                        { ...field }
                                        id="db-name"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Database
                                    </FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose database" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                { databases.map((db) => (
                                                    <SelectItem key={db} value={db}>
                                                        { mapDatabaseToLabel(db as AcceptedDatabaseProviderDto)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="databaseConnectionString"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="db-connection-string">
                                        Connection string
                                    </FieldLabel>
                                    <Textarea
                                        { ...field }
                                        id="db-connection-string"
                                        aria-invalid={fieldState.invalid}
                                    ></Textarea>
                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Button type="submit"
                            className="w-full"
                        >
                            Add data source
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}