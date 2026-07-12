from .state import AbiState

def conversation_node(state: AbiState):
    return {"messages": ["Conversation processed"]}
    print("\n(->) Conversation Mode: Handling a normal chat message...")
    # This is where your conversational LLM call will eventually go
    return {"response": "Hi! I am Abi. I am ready to help you analyze data or just chat."}

def classifier_node(state: AbiState) -> str:
    message = state.get("user_message", "").lower()
    return "report" if any(w in message for w in ["report", "data", "analytics"]) else "chat"

def report_mode_node(state: AbiState):
    return {"status": "starting_report"}

def access_map_data_node(state: AbiState):
    return {"status": "accessing_map"}

def run_sql_queries_node(state: AbiState):
    return {"status": "queries_run"}

def summarize_findings_node(state: AbiState):
    # Add your summarization logic here
    findings = state.get("sql_results", "No results found")
    summary = f"Summary of findings: {str(findings)[:100]}"
    return {"summary": summary, "status": "summarized"}

def create_layout_json_node(state: AbiState):
    return {"status": "layout_created"}