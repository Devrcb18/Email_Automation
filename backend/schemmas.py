from typing import List, Optional, Any
from typing_extensions import TypedDict
from pydantic import BaseModel, Field

class TriageAnalysis(BaseModel):
    intent: str = Field(description="Categories: 'Sales Opportunity', 'Tech Support', 'HR/Spam'")
    sentiment: str = Field(description="Positive, Neutral, or Negative")
    urgency_score: int = Field(description="1-10", ge=1, le=10)
    reasoning: str

class CompanyDossier(BaseModel):
    company_name: str
    estimated_size: str
    recent_news: List[str]
    tech_stack: List[str]

class LeadInboxState(TypedDict):
    sender_email: str
    subject: str
    raw_content: str
    triage: Optional[TriageAnalysis]
    dossier: Optional[CompanyDossier]
    rag_context: List[str]
    draft_response: str
    # Internal tools passed through state
    llm: Any
    search_tool: Any
    supabase: Any
    embeddings: Any