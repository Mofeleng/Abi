-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('DOCX', 'PPTX', 'PDF');

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "layoutJson" JSONB NOT NULL,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "ReportFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportFile" ADD CONSTRAINT "ReportFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
