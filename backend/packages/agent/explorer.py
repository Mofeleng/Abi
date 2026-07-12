from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END
from .classifier import create_classifier

# 1. Define the state of your graph
class AgentState(TypedDict):
    user_prompt: str
    classification: Literal["chat", "report"]
    response: str

# 2. Define the routing node
def classify_input_node(state: AgentState):
    """Invokes the LLM classifier to decide the execution track."""
    classifier = create_classifier()
    result = classifier.invoke({"user_prompt": state["user_prompt"]})
    
    
    # Extract the raw text from the LLM's message content and clean it
    decision_text = result.content.strip().lower()
    
    # Update the graph state with the decision
    return {"classification": decision_text}

# 3. Define placeholder nodes for the two tracks
def chat_track_node(state: AgentState):
    # This is where your quick chat logic will go
    return {"response": "Processing quick chat response..."}

def report_track_node(state: AgentState):
    # This is where your deeper data exploration/BI agent track will go
    return {"response": "Processing detailed BI report generation..."}

# 4. Define the conditional routing logic
def router_condition(state: AgentState) -> Literal["chat", "report"]:
    """Reads the state to tell LangGraph which edge to follow next."""
    if state["classification"] == "report":
        return "report"
    return "chat"

# 5. Build the LangGraph Workflow
def create_explorer_graph():
    workflow = StateGraph(AgentState)
    
    # Add our components as graph nodes
    workflow.add_node("classifier", classify_input_node)
    workflow.add_node("chat_track", chat_track_node)
    workflow.add_node("report_track", report_track_node)
    
    # Set the starting point
    workflow.set_entry_point("classifier")
    
    # Direct the flow conditionally out of the classifier node
    workflow.add_conditional_edges(
        "classifier",
        router_condition,
        {
            "chat": "chat_track",
            "report": "report_track"
        }
    )
    
    # Complete both paths
    workflow.add_edge("chat_track", END)
    workflow.add_edge("report_track", END)
    
    return workflow.compile()

# Compile the final explorer agent
explorer_agent = create_explorer_graph()