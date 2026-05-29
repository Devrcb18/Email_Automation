from langgraph.config import RunnableConfig
from schemmas import LeadInboxState

def writer_node(state: LeadInboxState, config: RunnableConfig | None) -> dict:
    """Compiles enriched signals to draft a hyper-personalized response."""
    llm = config["configurable"].get("llm")
    contexts = state.get("rag_context", [])
    context_str = "\n".join(contexts) if contexts else "No local context found."
    dossier = state.get("dossier")
     
    tech_stack = dossier.tech_stack if (dossier and hasattr(dossier, 'tech_stack')) else 'Unknown'
    recent_news = dossier.recent_news if (dossier and hasattr(dossier, 'recent_news')) else 'None'
     
    prompt = f"""
    Draft a formal email response based on:
    Sender: {state['sender_email']}
    Dossier Bio: Tech Stack: {tech_stack}. News: {recent_news}.
    Internal Knowledge Context: {context_str}
    Original Email Content: {state['raw_content']}
 
    Maintain a polished professional tone and sign off cleanly. Keep it precise and only descriptive if needed.
    Write al email with the Salutation 
    "Regards,
    [Devansh Shukla]
    Manager of B2B Sales"
    """
    draft = llm.invoke(prompt).content
    return {"draft_response": draft}