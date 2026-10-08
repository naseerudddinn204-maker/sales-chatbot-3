import React, { useRef, useState } from 'react';
import { FileText, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadKnowledgeFile } from '../lib/supabaseAdmin';

type Props = {
  slug: string;
  onUploaded: (knowledgeText: string) => void;
};

export function KnowledgeUploader({ slug, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const result = await uploadKnowledgeFile(slug, file);
      onUploaded(result.knowledge_text);
      setMessage(result.message || `Knowledge loaded from ${result.file_name}. Click Save to publish it to the chatbot.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not process this file.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 shadow-sm"><FileText size={20}/></div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm">Upload client information</h4>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Client apni business information wali file upload kare. Chatbot file ka content read karke visitors ke business questions ka jawab dega.
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Supported: PDF, TXT, MD, CSV, JSON, HTML, XML • PDF up to 50MB; smaller files are recommended.</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.md,.csv,.json,.html,.htm,.xml,text/plain,text/markdown,text/csv,application/json,application/pdf,text/html,text/xml"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}
            {busy ? 'Reading file…' : 'Choose information file'}
          </button>
          {message && <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700"><CheckCircle2 size={16} className="mt-0.5 shrink-0"/><span>{message}</span></div>}
          {error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</div>}
        </div>
      </div>
    </div>
  );
}
