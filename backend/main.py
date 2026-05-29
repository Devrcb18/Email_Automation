import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.tools.tavily_search import TavilySearchResults
from supabase import create_client
import warnings
# Load variables & silence log clutter
load_dotenv()
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
warnings.filterwarnings('ignore', category=DeprecationWarning)

from agent_graph import create_graph

# Initialize Shared Shared Infrastructure
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1)
embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

search_tool = TavilySearchResults(max_results=5)

# Compile the core graph topology
workflow = create_graph(
    llm=llm,
    embeddings_model=embeddings_model,
    supabase=supabase,
    search_tool=search_tool
)

app = FastAPI(title="B2B AI CRM Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Isolated Backend running smoothly"}

@app.post("/process")
async def process_email(data: dict):
    initial_state = {
        "sender_email": data.get("sender_email", ""),
        "subject": data.get("subject", ""),
        "raw_content": data.get("content", ""),
        "rag_context": [],
        "triage": None,
        "dossier": None,
        "draft_response": ""
    }

    try:

        config = {
            "configurable": {
                "llm": llm,
                "embeddings_model": embeddings_model,
                "supabase": supabase,
                "search_tool": search_tool
            }
        }
        final_state = workflow.invoke(initial_state, config=config)
        return {"success": True, "data": final_state}

    except Exception as e:
        return {"success": False, "error": str(e)}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)