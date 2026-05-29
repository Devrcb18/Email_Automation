"use client";
import React, { useState } from 'react';
import { Send, Loader2, Database, Mail, Zap, PenTool, CheckCircle, Search, BarChart3, Activity, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState({
    sender_email: "alex.rivera@tech-frontier.io",
    subject: "Inquiry regarding Enterprise AI Scaling",
    content: "Hi Team, we saw your recent documentation on pgvector scaling. We are currently using a stack involving Python and React and want to know if your system supports 10M+ vector dimensions."
  });

  const runAgents = async () => {
    setLoading(true);
    setResult(null);
    setStatus("Processing lead...");
    
    try {
        const res = await fetch('http://localhost:8000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                content: email.content, 
                sender_email: email.sender_email, 
                subject: email.subject 
            })
        });
        const responseData = await res.json();
        
        if (responseData.success) {
            setResult(responseData.data);
        } else {
            alert("Agent Error: " + responseData.error);
        }
    } catch (e) {
        alert("Connection Error: Is the FastAPI backend running on port 8000?");
    } finally {
        setLoading(false);
        setStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <nav className="h-20 bg-white border-b border-slate-200/50 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <TrendingUp size={22}/>
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">B2B Sales</div>
            <div className="text-[9px] text-slate-500 font-medium">AI-Powered Lead Intelligence</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM ONLINE
            </div>
        </div>
      </nav>

      <main className="flex-1 grid grid-cols-12 gap-6 p-8 overflow-hidden">
        {/* LEFT: INPUT SECTION */}
        <section className="col-span-5 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Incoming Lead</h2>
              <p className="text-sm text-slate-500">Enter lead details to trigger comprehensive analysis</p>
            </div>
            
            <div className="space-y-5 flex-1">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sender Email</label>
                <input 
                  className="w-full border border-slate-300 p-3.5 rounded-xl bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400" 
                  placeholder="contact@company.com"
                  value={email.sender_email} 
                  onChange={e => setEmail({...email, sender_email: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Subject Line</label>
                <input 
                  className="w-full border border-slate-300 p-3.5 rounded-xl bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400" 
                  placeholder="Sales inquiry..."
                  value={email.subject} 
                  onChange={e => setEmail({...email, subject: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Message</label>
                <textarea 
                  className="flex-1 border border-slate-300 p-3.5 rounded-xl bg-slate-50 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400 leading-relaxed" 
                  placeholder="Paste the email content here..."
                  value={email.content} 
                  onChange={e => setEmail({...email, content: e.target.value})} 
                />
              </div>

              <button 
                onClick={runAgents} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20}/> Processing...</>
                ) : (
                  <><Zap size={20}/> Analyze Lead</>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: OUTPUT SECTION */}
        <section className="col-span-7 flex flex-col overflow-hidden">
          {!result && !loading ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 flex-1 flex flex-col items-center justify-center text-center">
              <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                <Mail className="w-12 h-12 text-blue-300" />
              </div>
              <p className="font-semibold text-slate-700 text-lg">Ready to analyze</p>
              <p className="text-slate-500 text-sm mt-1">Submit a lead to see AI-powered insights</p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-full shadow-xl relative border border-blue-200">
                   <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
              </div>
              <p className="font-semibold text-slate-800 text-base">Analyzing lead intelligence...</p>
              <p className="text-blue-600 font-mono text-xs uppercase tracking-widest mt-2 opacity-70">{status}</p>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto pb-2">
              
              {/* TOP METRICS ROW */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Lead Type</p>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">{result.triage?.intent}</h3>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${(result.triage?.urgency_score || 0) > 7 ? 'bg-red-100 text-red-700' : (result.triage?.urgency_score || 0) > 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      Priority: {result.triage?.urgency_score}/10
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{result.triage?.primary_reasoning}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Company Profile</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{result.dossier?.company_name}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-4">Size: {result.dossier?.estimated_size}</p>
                  <div className="flex flex-wrap gap-2">
                    {result.dossier?.tech_stack?.slice(0, 3).map((t:any) => (
                       <span key={t} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-200">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RAG CONTEXT */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-4">
                   <Database className="w-5 h-5 text-emerald-600" />
                   <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Knowledge Base</h4>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-sm text-slate-700 leading-relaxed">
                   {result.rag_context?.[0] || "No additional context found"}
                </div>
              </div>

              {/* EMAIL DRAFT */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3 font-bold">
                    <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur">
                        <PenTool size={18}/> 
                    </div>
                    AI-Generated Response
                  </div>
                  <button className="bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95">
                    <CheckCircle size={16} className="text-emerald-500"/> Approve
                  </button>
                </div>
                <div className="p-7 font-serif text-[15px] text-slate-700 whitespace-pre-wrap leading-relaxed bg-gradient-to-b from-white to-slate-50/50 max-h-72 overflow-y-auto">
                  {result.draft_response}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}