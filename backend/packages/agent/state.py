from typing import TypedDict, Any, Annotated
from langgraph.graph import add_messages
import enum

class ReportEnum(str, enum.Enum):
    DOCX = "docx"
    PPTX = "pptx"
    PDF = "pdf"

class AbiState(TypedDict):
    """
    The central clipboard for the Abi agent pipeline.
    Tracks data as it moves from classification through SQL analysis to presentation.
    """
    messages: Annotated[list, add_messages]     # The incoming chat message from the user
    report_type: str
    classification: str        # 'conversation' or 'report'
    data_source_mapped: bool   # Tracks if 'Access & map data source' succeeded
    sql_query_results: Any     # Holds the output from 'Run SQL queries'
    summary_findings: str      # Holds text summary from 'Summarize findings'
    presentation_json: dict    # The final layout JSON for the presentation
    response: str              # The final string answer returned to the UI