import React from 'react';
import { Network, Image, HelpCircle } from 'lucide-react';

export default function Pipeline() {
  // CRITICAL: Replace these URLs/Paths with your own digital image assets
  // e.g., Fig 2: "/my_assets/fig2_overview.png", Fig 5: "/my_assets/fig5_leakage.png"
  const fig2_OverviewUrl = "assets/overview.png"; // Placeholder for Fig 2 (Method Overview)

  return (
    <section className="py-16 bg-slate-50/40 border-b border-slate-100" id="pipeline-section">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Simplified Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3" id="pipeline-header">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider" id="pipeline-badge">
            Architecture
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2" id="pipeline-heading">
            <Network className="w-5 h-5 text-indigo-600" /> Pipeline & Method Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-500" id="pipeline-desc">
            StructSplat organizes geometry, semantic, and texture cues into explicit roles in the reconstruction process.
          </p>
        </div>

        {/* Two-Image Method Framework Displays */}
        <div className="space-y-16" id="pipeline-images-stack">
          
          {/* Fig. 2: Method Overview */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6" id="fig2-container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2" id="fig2-header">
              <div id="fig2-meta">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Core Framework</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Overview of StructSplat</h3>
              </div>
              {/* <div className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2.5 py-1 rounded border border-slate-200" id="fig2-code-label">
                Edit path in: src/components/Pipeline.tsx
              </div> */}
            </div>

            {/* Image Box */}
            <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200/60 flex items-center justify-center" id="fig2-image-box">
              <img
                src={fig2_OverviewUrl}
                alt="StructSplat Framework Overview (Fig. 2)"
                referrerPolicy="no-referrer"
                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                id="fig2-image-element"
              />
            </div>

            {/* Fig 2 Caption */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify italic" id="fig2-caption">
              <strong>Overview of our proposed StructSplat.</strong> Given uncalibrated source images, we perform feed-forward 3D reconstruction without camera parameters by adopting a structured representation that organizes texture, semantic, and geometric cues. Encoders extract multi-level features which drive two decoding pathways: a Gaussian decoder predicts camera-centric Gaussians, while a camera decoder estimates camera parameters followed by a camera alignment module for unified registration.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
