from state import AbiState

# ==========================================
# 1. THE CONVERSATION PATH (Top branch)
# ==========================================

def conversation_node(state: AbiState):
    print("\n Conversation Mode: Handling a normal chat message...")
    # This is where your conversational LLM call will eventually go
    return {"response": "Hi! I am Abi. I am ready to help you analyze data or just chat."}


# ==========================================
# 2. THE REPORT PIPELINE PATH (Bottom branch sequential steps)
# ==========================================

def report_mode_node(state: AbiState):
    print("\n(->) Report Mode: Initializing the reporting pipeline...")
    return {"classification": "report"}

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