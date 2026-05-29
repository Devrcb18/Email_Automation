from langgraph.config import RunnableConfig
from langgraph.graph import END
from schemmas import LeadInboxState, TriageAnalysis

def triage_node(state: LeadInboxState, config: RunnableConfig | None) -> dict:
    """Uses structured outputs to validate intent and urgency semantic scoring."""
    llm = config["configurable"].get("llm")
    structured_llm = llm.with_structured_output(TriageAnalysis)
    prompt = f"""Analyze the inbound communication:\nFrom: {state['sender_email']}\nSubject: {state['subject']}\nContent: {state['raw_content']}
    \n\nClassify whether this is a partnership or buyer inquiry and
    whether it should be handled as an opportunity or escalated to HR/Spam. Generate an urgency score from 1-10 (integer score), and provide brief reasoning for your classifications."""
    analysis = structured_llm.invoke(prompt)
    return {"triage": analysis}

def route_urgency_and_intent(state: LeadInboxState):
    """Determines branching logic immediately after classification."""
    triage = state["triage"]
    if triage.intent == "HR/Spam":
        return END
    return ["research", "rag"]