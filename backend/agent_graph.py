from langgraph.graph import StateGraph, START, END
from schemmas import LeadInboxState
from agents.triage import triage_node, route_urgency_and_intent as route_triage
from agents.research import research_node
from agents.rag import rag_node
from agents.writer import writer_node

def create_graph(llm=None, embeddings_model=None, supabase=None, search_tool=None, **kwargs):
    workflow = StateGraph(LeadInboxState)

    # Nodes
    workflow.add_node("triage", triage_node)
    workflow.add_node("research", research_node)
    workflow.add_node("rag", rag_node)
    workflow.add_node("writer", writer_node)

    # Edge Configurations
    workflow.add_edge(START, "triage")
    
    # Conditional Forking
    workflow.add_conditional_edges(
        "triage",
        route_triage
    )
    
    # Fan-in configuration: Both nodes merge back into writer
    workflow.add_edge("research", "writer")
    workflow.add_edge("rag", "writer")
    workflow.add_edge("writer", END)

    return workflow.compile()