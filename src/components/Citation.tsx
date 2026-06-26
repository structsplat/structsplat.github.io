import React, { useState } from 'react';
import { Copy, Check, Quote } from 'lucide-react';

export default function Citation() {
  const [copied, setCopied] = useState(false);

  const bibtex = `@inproceedings{zhao2026structsplat,
  title={StructSplat: Generalizable 3D Gaussian Splatting from Uncalibrated Sparse Views},
  author={Zhao, Jia-Chen and Chen, Beiqi and Chen, Xinyang and Wang, Guangcong and Nie, Liqiang},
  booktitle={Proceedings of the European Conference on Computer Vision (ECCV)},
  year={2026}
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="py-16 bg-slate-50/50 border-b border-slate-100" id="citation-section">
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-6" id="citation-container">
          <div className="flex items-center justify-between" id="citation-header-row">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2" id="citation-heading">
              <Quote className="w-5 h-5 text-indigo-600 rotate-180" /> BibTeX Citation
            </h2>
            
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                copied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 active:scale-95'
              }`}
              id="btn-copy-citation"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy BibTeX
                </>
              )}
            </button>
          </div>

          <div className="relative" id="citation-code-frame">
            <pre className="bg-slate-900 text-slate-300 font-mono text-xs sm:text-sm p-6 rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed shadow-sm">
              <code>{bibtex}</code>
            </pre>
          </div>


        </div>
      </div>
    </section>
  );
}
