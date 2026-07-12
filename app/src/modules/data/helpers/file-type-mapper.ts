import { AcceptedFileExtensionsDto } from "../dtos/accepted-file-extensions";

export function mapFileExtensionToLabel(extension: AcceptedFileExtensionsDto): string {
    let label = "";

    switch (extension) {
        case "csv":
            label = "Comma Separated Values file (csv)";
            break;
        case "pdf":
            label = "PDF file (pdf)";
            break;
        case "xls":
            label = "Microsoft Excel file (xls)";
            break;
        case "xlsx":
            label = "Microsoft Excel file (xlsx)";
            break;
        case "txt":
            label = "Plain text file (txt)";
            break;
        default:
            label = "Unknown file type";
            break;
    }

    return label;
}