from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

from .state import AbiState
from .nodes import (
    conversation_node,
    classifier_node,
    report_mode_node,
    access_map_data_node,
    run_sql_queries_node,
    summarize_findings_node,
    create_layout_json_node,
)

checkpointer = InMemorySaver()
workflow = StateGraph(AbiState)

# Register our station blocks (Nodes) into the LangGraph framework
workflow.add_node("conversation", conversation_node)
workflow.add_node("report_mode", report_mode_node)
workflow.add_node("access_map_data", access_map_data_node)
workflow.add_node("run_sql_queries", run_sql_queries_node)
workflow.add_node("summarize_findings", summarize_findings_node)
workflow.add_node("create_layout_json", create_layout_json_node)

workflow.add_conditional_edges(
    START,
    classifier_node,
    {
        "chat": "conversation",
        "report": "report_mode"
    }
)


workflow.add_edge("conversation", END)


workflow.add_edge("report_mode", "access_map_data")
workflow.add_edge("access_map_data", "run_sql_queries")
workflow.add_edge("run_sql_queries", "summarize_findings")
workflow.add_edge("summarize_findings", "create_layout_json")

workflow.add_edge("create_layout_json", END)

abi_agent = workflow.compile(checkpointer=checkpointer)