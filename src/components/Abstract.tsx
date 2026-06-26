import React from 'react';
import { ShieldCheck, Layers, Eye, Cpu, Award } from 'lucide-react';

export default function Abstract() {
  const highlights = [
    {
      icon: <Cpu className="w-6 h-6 text-indigo-600" id="icon-cpu" />,
      title: "Feed-Forward & Camera-Free",
      description: "Operates directly on uncalibrated images. No traditional SfM, known camera poses, or costly per-scene optimization required.",
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-600" id="icon-layers" />,
      title: "Structured Representation",
      description: "Decouples modeling into native spaces: Geometry, Semantics, and Texture.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" id="icon-shield" />,
      title: "Leakage-Free Alignment",
      description: "Enforces source and target separation during training using a novel parallel-stream camera pose registration.",
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" id="icon-award" />,
      title: "State-of-the-Art Results",
      description: "Achieves +5.67 dB PSNR over AnySplat on DL3DV, +1.94 dB on ACID, and +1.72 dB on RealEstate10K.",
    },
  ];

  return (
    <section className="py-16 border-b border-slate-100" id="abstract-section">
      <div className="max-w-5xl mx-auto px-6">
        {/* Teaser Image Pane */}
        <div className="mb-12" id="teaser-container">
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm p-2 sm:p-4 hover:shadow-md transition-shadow duration-300 flex items-center justify-center" id="teaser-image-box">
            <img 
              src="assets/teaser.svg" 
              alt="StructSplat Teaser" 
              className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity"
              id="teaser-image-element"
            />
          </div>
          <p className="mt-4 text-center text-sm sm:text-base text-slate-600 font-medium" id="teaser-tldr">
            <strong>TL;DR:</strong> We present StructSplat, a feed-forward and generalizable NVS framework that predicts 3D gaussians from uncalibrated images without requiring camera parameters.
          </p>
        </div>

        <div className="flex flex-col gap-10" id="abstract-grid">
          {/* Abstract Text */}
          <div className="space-y-6" id="abstract-text-container">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2" id="abstract-heading">
              <Eye className="w-5 h-5 text-indigo-600" /> Abstract
            </h2>
            <p className="text-slate-600 leading-relaxed text-justify text-sm sm:text-base" id="abstract-paragraph-1">
              We present <strong>StructSplat</strong>, a feed-forward, generalizable 3D Gaussian reconstruction
              framework that operates directly on uncalibrated images without camera poses. Unlike prior methods
              that require known poses or entangle geometry and appearance, we adopt a <strong>structured representation</strong> that
              decouples geometry, semantics, and texture. Specifically, we introduce pixel-aligned feature injection for
              accurate texture modeling, semantic-aware priors for global consistency, and a leakage-free camera alignment strategy.
            </p>
            <p className="text-slate-600 leading-relaxed text-justify text-sm sm:text-base" id="abstract-paragraph-2">
              Our method achieves state-of-the-art results across major benchmarks, outperforming AnySplat by
              <strong> +5.67 dB</strong> PSNR on DL3DV, <strong>+1.94 dB</strong> on ACID, and <strong>+1.72 dB</strong> on RealEstate10K.
            </p>
          </div>

          {/* Core Highlights */}
          <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100/80 space-y-6" id="abstract-highlights-container">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider" id="highlights-heading">
              Key Contributions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="highlights-list">
              {highlights.map((item, index) => (
                <div key={index} className="flex gap-4 items-start" id={`highlight-item-${index}`}>
                  <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0" id={`highlight-icon-box-${index}`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1" id={`highlight-text-box-${index}`}>
                    <h4 className="text-sm font-semibold text-slate-900" id={`highlight-title-${index}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-normal" id={`highlight-desc-${index}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
