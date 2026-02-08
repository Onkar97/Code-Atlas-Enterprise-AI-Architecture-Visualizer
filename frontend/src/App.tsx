import { useState } from 'react';
import client from './api/client';
import { DiagramResponse } from './types';
import DiagramViewer from './components/DiagramViewer';
import { Layout, Send, Code2, AlertCircle, Database, FolderGit2 } from 'lucide-react';

export default function App() {
  const [path, setPath] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<DiagramResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!path || !query) return;
    
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await client.post<DiagramResponse>('/generate', {
        repo_path: path,
        query: query
      });
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResponse(res.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to connect to backend. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
          <FolderGit2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">CodeAtlas</h1>
          <p className="text-slate-500 font-medium">Enterprise Architecture Visualizer</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 grid gap-6 md:grid-cols-[2fr_2fr_auto]">
        
        {/* Repo Path Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Local Repository Path</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Database className="w-5 h-5 text-slate-400" />
            <input 
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="C:/Users/Name/Projects/MyBackend"
              className="bg-transparent flex-1 outline-none text-slate-700 placeholder:text-slate-400 text-sm"
            />
          </div>
        </div>

        {/* Query Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Query</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Code2 className="w-5 h-5 text-slate-400" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Visualize the Authentication flow"
              className="bg-transparent flex-1 outline-none text-slate-700 placeholder:text-slate-400 text-sm"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-end">
          <button 
            onClick={handleGenerate}
            disabled={loading || !path || !query}
            className="h-[48px] px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? "Analyzing..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Visualization Area */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700">Architecture Diagram</h2>
          {response && (
            <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
              {response.nodes_analyzed} Nodes Parsed
            </span>
          )}
        </div>
        
        <div className="flex-1 bg-white relative">
          {!response && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
              <Layout className="w-24 h-24 mb-4 text-slate-300" />
              <p className="text-slate-400 font-medium text-lg">Ready to visualize your codebase</p>
            </div>
          )}
          
          <DiagramViewer 
            code={response?.mermaid_code || ''} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}