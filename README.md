# Autonomous CRM Lead Enricher

An AI-powered multi-agent CRM automation system that enriches inbound leads, researches companies in real time, retrieves relevant internal documentation using RAG, and drafts technically accurate sales responses automatically.

Built using **LangGraph**, **FastAPI**, **Groq LLMs**, **Supabase Vector Search**, and **Next.js**.

---

# Features

* AI-powered email triage and lead qualification
* Real-time company enrichment using Tavily Search
*  Retrieval-Augmented Generation (RAG) using Supabase pgvector
*  Parallel agent execution for low-latency workflows
*  Automated personalized sales-response drafting
*  Modular multi-agent architecture with LangGraph
*  Modern dashboard frontend using Next.js
* Typed state management using Pydantic + TypedDict

---

# AI System Architecture

The pipeline is orchestrated using a Directed Acyclic Graph (DAG) powered by LangGraph.

```text
                ┌──────────────┐
                │ Incoming Mail│
                └──────┬───────┘
                       │
                ┌──────▼───────┐
                │ Triage Agent │
                └──────┬───────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
   Low Value / Spam            High Value Lead
         │                           │
         ▼                           ▼
 Human Intervention         Parallel Enrichment
                                   │
                   ┌───────────────┴───────────────┐
                   │                               │
          ┌────────▼────────┐           ┌──────────▼─────────┐
          │ Research Agent │           │     RAG Agent      │
          └────────┬────────┘           └──────────┬─────────┘
                   │                               │
                   └───────────────┬───────────────┘
                                   ▼
                         ┌──────────────────┐
                         │   Writer Agent   │
                         └──────────────────┘
```

---

# Agent Breakdown

## 1. Triage Agent

**Role:** Intent Classification & Urgency Scoring

### Responsibilities

* Detects whether the email is:

  * Sales Opportunity
  * Support Request
  * Spam
* Assigns urgency and sentiment scores

### Tech

* Groq + Llama 3
* Structured outputs with Pydantic

### Output

```python
{
  "intent": "sales",
  "urgency_score": 8,
  "sentiment": "positive"
}
```

---

## 2. Research Agent

**Role:** External Company Intelligence

### Responsibilities

* Extracts sender company/domain
* Performs live web research
* Finds:

  * Company size
  * Funding data
  * Tech stack
  * Recent news

### Tech

* Tavily Search API

---

## 3. RAG Agent

**Role:** Internal Knowledge Retrieval

### Responsibilities

* Performs semantic similarity search
* Retrieves relevant:

  * Product docs
  * FAQs
  * Technical PDFs
  * Internal documentation

### Tech

* Supabase pgvector
* HuggingFace Embeddings
* all-MiniLM-L6-v2

---

## 4. Writer Agent

**Role:** AI Sales Engineer

### Responsibilities

* Synthesizes:

  * Email context
  * Company intelligence
  * Retrieved documentation
* Generates polished markdown responses

### Output

* Personalized AI-generated sales reply

---

# ⚙️ Tech Stack

| Layer            | Technology           |
| ---------------- | -------------------- |
| Orchestration    | LangGraph            |
| LLM              | Groq / Llama 3       |
| Backend          | FastAPI              |
| Vector Database  | Supabase + pgvector  |
| Search           | Tavily AI            |
| Embeddings       | HuggingFace          |
| Frontend         | Next.js              |
| State Management | TypedDict + Pydantic |
| Deployment       | Docker               |

---

# 📂 Project Structure

```text
.
├── backend/
│   ├── agents/
│   │   ├── triage.py
│   │   ├── research.py
│   │   ├── rag.py
│   │   └── writer.py
│   │
│   ├── agent_graph.py
│   ├── main.py
│   ├── schemmas.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# 🔄 State Management

The workflow shares a central evolving state object:

```python
class LeadInboxState(TypedDict):
    sender_email: str
    subject: str
    raw_content: str

    triage: TriageAnalysis
    dossier: CompanyDossier

    rag_context: List[str]
    draft_response: str
```

Each node updates the state progressively as the graph executes.

---

# ⚡Key Innovations

## Parallel Execution
Research + RAG execute simultaneously, reducing latency significantly and API costing for A big AI system like this.

## Cost Optimization 
Clean short and definte Prompt Engineering 
## Urgency Score 
Importnace of email is backtracked by llm through its summary and sentiment analysis Saving the timining of reader in making priorty ranking


# Installation & Setup

## Clone the Repository

```bash
git clone https://github.com/Devrcb18/Email_Automation.git
cd Email_Automation
```

---

# 📦 Backend Setup

## Create Virtual Environment

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
---

## Run Backend Server
```bash
uvicorn main:app --reload
```
Backend will run on:
```text
http://127.0.0.1:8000
```
Swagger API docs:
```text
http://127.0.0.1:8000/docs
```
---

#  Frontend Setup
Open a new terminal.
##  Install Frontend Dependencies
```bash
cd frontend
npm install
```
---

## Run Frontend

```bash
npm run dev
```
Frontend will run on:
```text
http://localhost:3000
```

---

# Docker Setup 
Run the full stack using Docker:

```bash
docker-compose up --build
```


