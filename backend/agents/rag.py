from langgraph.config import RunnableConfig
from schemmas import LeadInboxState

def rag_node(state: LeadInboxState, config: RunnableConfig | None) -> dict:
    """Generates local semantic embeddings and queries Supabase pgvector database."""
    supabase = config["configurable"].get("supabase")
    embeddings_model = config["configurable"].get("embeddings_model")
    
    email_text = f"Subject: {state.get('subject', '')}\nContent: {state.get('raw_content', '')}"
    contexts = []
    
    if supabase:
        try:
            embedding_vector = embeddings_model.embed_query(email_text)
            if len(embedding_vector) != 384:
                raise ValueError(f"Embedding size mismatch! Expected 384, got {len(embedding_vector)}")
             
            response = supabase.rpc(
                "match_internal_docs", 
                {
                    "query_embedding": embedding_vector, 
                    "match_threshold": 0.45,
                    "match_count": 3
                }
            ).execute()
             
            if response.data:
                contexts = [item['content'] for item in response.data if 'content' in item]
            else:
                contexts = ["No matching vector database documentation discovered for this query."]
                 
        except Exception as e:
            contexts = [f"Database/Embedding connection error: {str(e)}"]
    else:
        contexts = ["Supabase client unavailable. Vector search bypassed."]
         
    return {"rag_context": contexts}