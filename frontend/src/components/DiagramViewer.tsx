import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2, AlertTriangle } from 'lucide-react';

interface Props {
  code: string;
  loading?: boolean;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
});

export default function DiagramViewer({ code, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // --- NEW: Helper function to clean the AI's messy output ---
  const cleanMermaidCode = (rawCode: string) => {
    if (!rawCode) return "";
    
    // 1. Remove Markdown code block wrappers (```mermaid ... ```)
    let cleaned = rawCode.replace(/```mermaid/g, '').replace(/```/g, '');

    // 2. Find the start of the valid diagram syntax
    // (Sometimes AI adds text like "Here is your diagram:" before the code)
    const keywords = ['sequenceDiagram', 'classDiagram', 'graph', 'flowchart', 'stateDiagram'];
    let startIndex = -1;

    for (const keyword of keywords) {
      const idx = cleaned.indexOf(keyword);
      if (idx !== -1) {
        // Find the earliest occurrence of a keyword
        if (startIndex === -1 || idx < startIndex) {
          startIndex = idx;
        }
      }
    }

    // 3. Slice from the valid start and trim whitespace
    if (startIndex !== -1) {
      cleaned = cleaned.substring(startIndex);
    }

    return cleaned.trim();
  };

  useEffect(() => {
    const renderDiagram = async () => {
      if (code && containerRef.current) {
        setRenderError(null);
        
        // CLEAN THE CODE BEFORE RENDERING
        const safeCode = cleanMermaidCode(code);

        try {
          containerRef.current.innerHTML = '';
          const id = `mermaid-${Date.now()}`;
          
          // Render the CLEANED code
          const { svg } = await mermaid.render(id, safeCode);
          containerRef.current.innerHTML = svg;
          
        } catch (err: any) {
          console.error("Mermaid Render Error:", err);
          setRenderError("Syntax Error: The AI generated invalid Mermaid code.");
        }
      }
    };

    const timeoutId = setTimeout(() => {
        if (code) renderDiagram();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [code]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p className="font-medium">Analyzing codebase structure...</p>
        <p className="text-sm mt-2 opacity-75">Parsing AST & generating visualization</p>
      </div>
    );
  }

  if (!code) return null;

  return (
    <div className="w-full h-full overflow-auto flex flex-col items-center p-8 bg-white rounded-lg">
      {renderError ? (
        <div className="flex flex-col items-center text-red-500 mt-10 max-w-2xl">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <p className="font-bold mb-2">{renderError}</p>
          <div className="text-sm text-slate-600 mb-4">
            Raw output received:
          </div>
          <pre className="p-4 bg-slate-100 rounded text-xs text-left w-full overflow-auto border border-slate-300">
            {code}
          </pre>
        </div>
      ) : (
        <div ref={containerRef} className="w-full flex justify-center" />
      )}
    </div>
  );
}