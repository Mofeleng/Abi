from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import ToolNode, tools_condition # Import these utilities

from .state import AbiState
from .nodes import conversation_node
from .tools import query_spreadsheet

checkpointer = InMemorySaver()
workflow = StateGraph(AbiState)

workflow.add_node("conversation", conversation_node)

workflow.add_node("tools", ToolNode([query_spreadsheet]))

workflow.add_edge(START, "conversation")

workflow.add_conditional_edges(
    "conversation",
    tools_condition,
    {
        "tools": "tools",  
        END: END         
    }
)

workflow.add_edge("tools", "conversation")

abi_agent = workflow.compile(checkpointer=checkpointer)