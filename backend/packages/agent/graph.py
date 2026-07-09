from langgraph.graph import StateGraph, START, END
from state import AbiState
from nodes import (
    conversation_node,
    report_mode_node,
    access_map_data_node,
    run_sql_queries_node,
    summarize_findings_node,
    create_layout_json_node
)

# ==========================================
# 1. THE CLASSIFIER ROUTER
# ==========================================
# This acts as the circular "Classifier" block in your diagram.
# It reads the clipboard state and returns the route string.
def classifier_routing_logic(state: AbiState) -> str:
    message = state["user_message"].lower()
    
    # Simple rule for testing: if they ask for a report or data, route down
    if "report" in message or "analytics" in message or "data" in message:
        return "go_to_report_path"
    else:
        return "go_to_conversation_path"


# ==========================================
# 2. BUILDING THE LANGGRAPH WORKFLOW
# ==========================================
# Initialize the state graph framework using our clipboard structure
workflow = StateGraph(AbiState)

# Register our station blocks (Nodes) into the LangGraph framework
workflow.add_node("conversation", conversation_node)
workflow.add_node("report_mode", report_mode_node)
workflow.add_node("access_map_data", access_map_data_node)
workflow.add_node("run_sql_queries", run_sql_queries_node)
workflow.add_node("summarize_findings", summarize_findings_node)
workflow.add_node("create_layout_json", create_layout_json_node)


# ==========================================
# 3. DRAWING THE ARROWS (Edges)
# ==========================================

# START goes straight into the Classifier check, which routes to either path
workflow.add_conditional_edges(
    START,
    classifier_routing_logic,
    {
        "go_to_conversation_path": "conversation",
        "go_to_report_path": "report_mode"
    }
)

# Top Path Link: Conversation goes straight to END
workflow.add_edge("conversation", END)

# Bottom Path Links: Linear pipeline sequence exactly matching your diagram
workflow.add_edge("report_mode", "access_map_data")
workflow.add_edge("access_map_data", "run_sql_queries")
workflow.add_edge("run_sql_queries", "summarize_findings")
workflow.add_edge("summarize_findings", "create_layout_json")

# The last step of the report pipeline links directly to END
workflow.add_edge("create_layout_json", END)


# ==========================================
# 4. COMPILE THE PIPELINE
# ==========================================
# This converts the blueprint into an active application engine
abi_agent = workflow.compile()