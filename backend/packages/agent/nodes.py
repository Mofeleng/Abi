from .state import AbiState
from langchain.messages import SystemMessage, ToolMessage
from .llm import llm
from .tools import query_spreadsheet

def classifier_node(state: AbiState) -> str:
    messages = [
       SystemMessage(
            content=(
                "You are an expert intent classifier for a business intelligence system. "
                "Analyze the user's prompt and reply with EXACTLY one word. "
                "Return 'chat' if the user wants a simple, direct conversational answer. "
                "Return 'report' if the user requires a comprehensive analysis or data document. "
                "Do not include any punctuation, formatting, or extra text."
            )
        ),
       *state["messages"]
   ]
    
    result = llm.invoke(messages)
    
    if "chat" in result.content:
        return "chat"
    else:
        return "report"

def conversation_node(state: AbiState):
    llm_with_tools = llm.bind_tools([query_spreadsheet])

    system_prompt = SystemMessage(
        content=(
            "Your name is Abi. You are a business intelligence assistant. "
            "You have access to a spreadsheet tool called 'query_spreadsheet' containing supermarket sales data. "
            "The dataframe is pre-loaded as 'df'. Columns include: 'Invoice ID', 'Branch', 'City', "
            "'Customer type', 'Gender', 'Product line', 'Unit price', 'Quantity', 'Tax 5%', 'Total', 'Date', 'Time', 'Payment', 'cogs', 'gross margin percentage', 'gross income', 'Rating'. "
            "If the user asks a data question, write Python code to calculate the answer and use the tool. "
            "Once you receive the tool output, interpret the results and provide a friendly, well-formatted response to the user."
        )
    )
    messages = [system_prompt] + state["messages"]
    
    response = llm_with_tools.invoke(messages)
    
    return { "messages": [response] }

def report_mode_node(state: AbiState):
    print("\n(->) Report Mode: Initializing the reporting pipeline...")
    messages = [
       SystemMessage(
            content=(
                "You are an expert document requirements classifier for a business intelligence system. "
                "Analyze the user's prompt and reply with EXACTLY one word. "
                "Return 'docx', 'pptx', 'pdf' based on what the best report to generate would be "
                "pptx is great for presentations, docx are great for research and formal findings, and pdf is similar to docx provided the user does not intend to make changes later "
                "Do not include any punctuation, formatting, or extra text."
            )
        ),
       *state["messages"]
   ]
    
    res = llm.invoke(messages)
    result = res.content.strip().lower()

    return { "report_type": result }

