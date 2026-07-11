from .state import AbiState
from langchain.messages import SystemMessage
from .llm import llm

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
   messages = [
       SystemMessage("Your name is Abi. You are a helpful data analyst, answer the user's questions"),
       *state["messages"]
   ]

   result = llm.invoke(messages)

   return { "messages": [result.content] }

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

def access_map_data_node(state: AbiState):
    # This is where you map user questions to database schemas
    
    return {"data_source_mapped": True}

def run_sql_queries_node(state: AbiState):
    print("(->) Run SQL Queries: Querying database via SQLAlchemy...")
    # This is where future SQL connection code will live!
    return {"sql_query_results": "Raw Rows: [Month='July', Revenue=45000, Growth='12%']"}

def summarize_findings_node(state: AbiState):
    print("(->) Summarize Findings: Formatting and processing data insights...")
    # This is where an LLM reads the database results and writes a human summary
    return {"summary_findings": "Analysis shows July revenue hit $45,000 with a 12% growth spike."}

def create_layout_json_node(state: AbiState):
    print("(->) Create Layout JSON: Packing findings into final presentation format...")
    # Creating the final layout JSON structure for your frontend UI
    final_layout = {
        "component": "DashboardReport",
        "title": "Revenue Performance Report",
        "data": {"metrics": state.get("sql_query_results"), "summary": state.get("summary_findings")}
    }
    return {
        "presentation_json": final_layout,
        "response": "Your custom report layout has been successfully built!"
    }