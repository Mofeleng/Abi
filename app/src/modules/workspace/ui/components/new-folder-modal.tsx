import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { newFolderDto, NewFolderDto } from "../../dto/new-folder-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useCreateNewFolder } from "../../hooks/use-create-folder";
import { toast } from "sonner";

interface NewFolderModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export function NewFolderModal({ open, setOpen }:NewFolderModalProps) {
    const form = useForm<NewFolderDto>({
        resolver: zodResolver(newFolderDto),
        defaultValues: {
            name: ""
        }
    });

    const { mutateAsync, isPending } = useCreateNewFolder();

    const onSubmit = async ({ name }:NewFolderDto) => {
        await mutateAsync(name, {
            onSuccess: () => {
                toast.success("Successfully created new folder!");
                form.reset();
                setOpen(false);
            },
            onError: (err) => {
                toast.error(err.message);
            }
        });
    }
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new folder</DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="">
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <Controller
                            name="name"
                            control={form.control}
                            render={( { field, fieldState } ) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="folder-name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        { ...field }
                                        placeholder="Quaterly sales analysis"
                                        id="folder-name"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />

                        <Button
                            className="w-full flex flex-row gap-1.5"
                            type="submit"
                            disabled={isPending}
                        >
                            {
                                isPending ? (
                                    <>
                                        <LoaderIcon className="animate-spin" />
                                        Creating folder...
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon />
                                        Create
                                    </>
                                )
                            }
                             
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}