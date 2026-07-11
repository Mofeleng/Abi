import enum

class ReportTypeEnum(str, enum.Enum):
    DOCX = "docx"
    PDF = "pdf"
    XLSX = "xlsx"
    PPTX = "pptx"

class MessageParticipantEnum(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"