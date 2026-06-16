import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileUpIcon, ImageIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {useDropzone} from 'react-dropzone';
import { Controller, useForm } from "react-hook-form";
import { uploadFileDto, UploadFileDto } from "../../dtos/upload-file-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mapFileExtensionToLabel } from "../../helpers/file-type-mapper";
import { AcceptedFileExtensionsDto } from "../../dtos/accepted-file-extensions";
import { Label } from "@/components/ui/label";

interface UploadNewFileModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const acceptedFileTypes = ["xls", "xlsx", "csv", "pdf", "txt"];

export function UploadNewFileModal({ open, setOpen }:UploadNewFileModalProps) {
     const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

    const form = useForm<UploadFileDto>({
        resolver: zodResolver(uploadFileDto),
        defaultValues: {
            filename: "",
            type: "txt"
        }
    });

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));

    const onUploadFile = ({ filename, type }: UploadFileDto) => {

    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload file</DialogTitle>
                    <DialogDescription>Select a file for Abi to use as a data source </DialogDescription>
                </DialogHeader>
                <div className="">
                    <Separator />
                </div>
                <div className="">
                    <form onSubmit={form.handleSubmit(onUploadFile)} className="space-y-4">
                        <Controller
                            name="filename"
                            control={form.control}
                            render={ ({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="filename">
                                        Filename
                                    </FieldLabel>
                                    <Input
                                        id="filename"
                                        { ...field }
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
                            render={ ({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="file-type">
                                        File type
                                    </FieldLabel>
                                    <Select {...field}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="File extension" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                { acceptedFileTypes.map((ext) => (
                                                    <SelectItem key={ext} value={ext}>
                                                        { mapFileExtensionToLabel(ext as AcceptedFileExtensionsDto)}
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

                        <div className="space-y-4">
                            <Label>Upload files</Label>
                            <div className="container border border-px border-muted">
                                <div {...getRootProps({className: 'dropzone'})} className="flex flex-col p-3 gap-1.5 justify-center items-center">
                                    <input {...getInputProps()} />
                                    <FileUpIcon />
                                    <p>Choose files</p>
                                </div>
                                <Separator />
                                <aside className="px-2 py-1 space-y-1">
                                    <h4 className="text-base">Selected files</h4>
                                    <ul className="text-sm text-muted-foreground">{files}</ul>
                                </aside>
                            </div>
                        </div>
                    </form>
                    
                </div>
            </DialogContent>
        </Dialog>
    )
}