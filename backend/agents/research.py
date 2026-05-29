import json
import re
from langgraph.config import RunnableConfig
from schemmas import LeadInboxState, CompanyDossier

def _normalize_to_string_list(value):
    if isinstance(value, list):
        return [str(item) for item in value if item is not None]
    if value is None:
        return []
    if isinstance(value, str):
        text = value.strip()
        if text == "":
            return []
        if text.startswith("[") or text.startswith("{"):
            try:
                parsed = json.loads(text)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed if item is not None]
                return [str(parsed)]
            except json.JSONDecodeError:
                pass
        parts = re.split(r"[,;]\s*", text)
        return [part.strip().strip('"\'') for part in parts if part.strip()]
    return [str(value)]

def research_node(state: LeadInboxState, config: RunnableConfig | None) -> dict:
    """Queries live web data to construct target dossier."""
    llm = config["configurable"].get("llm")
    search_tool = config["configurable"].get("search_tool")
    
    try:
        domain = state["sender_email"].split("@")[-1]
    except Exception:
        domain = "unknown_domain"
        
    search_results = search_tool.invoke({"query": f"{domain} company size funding status core tech stack recent news"})
    
    snippets = [r.get("content", r.get("snippet", "")) for r in search_results if r]
     
    structured_llm = llm.with_structured_output(CompanyDossier)
    system_msg = """Extract structured company profile data from the raw search snippets.
Return JSON with exact fields:
- company_name (str)
- estimated_size (str)
- recent_news (array of strings)
- tech_stack (array of strings)

Use JSON arrays exactly like [\"item 1\", \"item 2\"].
If there is no recent news, return an empty array: []
If there is no tech stack, return an empty array: []
Do not return strings that look like arrays. Return real arrays."""
    raw_dossier = structured_llm.invoke([("system", system_msg), ("user", str(snippets))])

    dossier_data = raw_dossier.dict() if hasattr(raw_dossier, "dict") else dict(raw_dossier)
    dossier_data["recent_news"] = _normalize_to_string_list(dossier_data.get("recent_news"))
    dossier_data["tech_stack"] = _normalize_to_string_list(dossier_data.get("tech_stack"))
    dossier_data["company_name"] = dossier_data.get("company_name") or domain
    dossier_data["estimated_size"] = dossier_data.get("estimated_size") or "Unknown"

    return {"dossier": CompanyDossier(**dossier_data).dict()}