import React, { useState, useRef, useEffect } from 'react';
import { Layers, Sliders, ChevronLeft, ChevronRight, BarChart3, Grid, FileText, CheckCircle2, Image, FileImage } from 'lucide-react';
import { ComparisonScene, MetricRow } from '../types';

export default function Comparison() {
  const [activeTab, setActiveTab] = useState<'visual' | 'quantitative'>('visual');
  const [activeTableTab, setActiveTableTab] = useState<'dl3dv' | 'multiview' | 'acid' | 're10k'>('dl3dv');

  // New visual comparison figure assets (Fig. 6 and Fig. 7)
  // CRITICAL: Replace these URLs/Paths with your own digital image assets
  // e.g., Fig 6: "/my_assets/fig6_dl3dv.png", Fig 7: "/my_assets/fig7_acid_re10k.png"
  const fig6_DL3DVUrl = "assets/dl3dv.png"; // Placeholder for Fig 6 (DL3DV comparison)
  const fig7_ACID_RE10KUrl = "assets/acid_re10k.png"; // Placeholder for Fig 7 (ACID and RE10K comparison)

  const [selectedFigure, setSelectedFigure] = useState<'fig6' | 'fig7'>('fig6');

  // Visual Comparison States
  const [selectedScene, setSelectedScene] = useState<'subway' | 'books' | 'flamingo'>('subway');
  const [selectedBaseline, setSelectedBaseline] = useState<string>('anysplat');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [showErrorMap, setShowErrorMap] = useState<boolean>(false);
  const [zoomActive, setZoomActive] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quantitative Metrics Data
  const dl3dvMetrics: MetricRow[] = [
    { method: 'PF3plat', cameraCondition: 'Weak', psnr: 22.579, ssim: 0.731, lpips: 0.186 },
    { method: 'SelfSplat', cameraCondition: 'Weak', psnr: 18.017, ssim: 0.511, lpips: 0.366 },
    { method: 'NoPoSplat', cameraCondition: 'Weak', psnr: 25.592, ssim: 0.838, lpips: 0.104 },
    { method: 'FLARE', cameraCondition: 'Weak', psnr: 23.441, ssim: 0.757, lpips: 0.126 },
    { method: 'Splatt3R', cameraCondition: 'No', psnr: 15.936, ssim: 0.391, lpips: 0.408 },
    { method: 'RayZer', cameraCondition: 'No', psnr: 19.802, ssim: 0.527, lpips: 0.286 },
    { method: 'AnySplat', cameraCondition: 'No', psnr: 22.377, ssim: 0.716, lpips: 0.150 },
    { method: 'Depth Anything 3', cameraCondition: 'No', psnr: 20.715, ssim: 0.615, lpips: 0.226 },
    { method: 'StructSplat', cameraCondition: 'No', psnr: 28.045, ssim: 0.888, lpips: 0.091, isOurs: true, isBold: true },
  ];

  const acidMetrics: MetricRow[] = [
    { method: 'Splatt3R', cameraCondition: 'No', psnr: 11.000, ssim: 0.307, lpips: 0.582 },
    { method: 'AnySplat', cameraCondition: 'No', psnr: 22.433, ssim: 0.651, lpips: 0.237 },
    { method: 'Depth Anything 3', cameraCondition: 'No', psnr: 20.482, ssim: 0.588, lpips: 0.346 },
    { method: 'StructSplat', cameraCondition: 'No', psnr: 24.372, ssim: 0.712, lpips: 0.219, isOurs: true, isBold: true },
  ];

  const re10kMetrics: MetricRow[] = [
    { method: 'Splatt3R', cameraCondition: 'No', psnr: 12.092, ssim: 0.364, lpips: 0.540 },
    { method: 'AnySplat', cameraCondition: 'No', psnr: 20.521, ssim: 0.686, lpips: 0.212 },
    { method: 'Depth Anything 3', cameraCondition: 'No', psnr: 18.769, ssim: 0.613, lpips: 0.312 },
    { method: 'StructSplat', cameraCondition: 'No', psnr: 22.240, ssim: 0.729, lpips: 0.201, isOurs: true, isBold: true },
  ];

  // Baseline properties for visual comparison simulator
  const baselines: { [key: string]: { label: string; blur: number; artifacts: boolean; shift: boolean; detail: string; errorLevel: number } } = {
    gt: { label: 'Ground Truth Reference', blur: 0, artifacts: false, shift: false, detail: 'Perfect', errorLevel: 0 },
    anysplat: { label: 'AnySplat [19]', blur: 5.5, artifacts: true, shift: true, detail: 'Blurry, severe artifacts', errorLevel: 8.5 },
    da3: { label: 'Depth Anything 3 [27]', blur: 2.5, artifacts: false, shift: false, detail: 'Smudged textures', errorLevel: 5.0 },
    splatt3r: { label: 'Splatt3R [40]', blur: 8.0, artifacts: true, shift: true, detail: 'Heavy geometric distortions', errorLevel: 12.0 },
  };

  // Drawing high fidelity representations on canvases
  useEffect(() => {
    const drawScene = (canvas: HTMLCanvasElement, isLeftOurs: boolean, isErrorView: boolean, baselineId: string) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Configure quality adjustments
      const currentBaseline = baselines[baselineId];
      const blurFactor = isLeftOurs ? 0 : currentBaseline.blur;
      const hasArtifacts = isLeftOurs ? false : currentBaseline.artifacts;
      const hasColorShift = isLeftOurs ? false : currentBaseline.shift;

      if (isErrorView) {
        // Render Error Map (Black background, error contours in purple/red)
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Draw structural outlines that reflect error levels
        const errorMultiplier = isLeftOurs ? 0.08 : currentBaseline.errorLevel * 0.5;
        ctx.lineWidth = 1.5;

        if (selectedScene === 'subway') {
          // Exit Sign error contour
          ctx.strokeStyle = `rgba(236, 72, 153, ${0.1 + errorMultiplier * 0.35})`;
          ctx.strokeRect(width / 2 - 90, 40, 180, 50);
          ctx.strokeRect(width / 2 - 80, 50, 160, 30);

          // Pillars error contour
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.05 + errorMultiplier * 0.25})`;
          ctx.strokeRect(50, 100, 40, height - 100);
          ctx.strokeRect(width - 90, 100, 40, height - 100);

          // Floor gridlines error contour
          ctx.beginPath();
          ctx.moveTo(50, height); ctx.lineTo(width / 2, 100);
          ctx.moveTo(width - 50, height); ctx.lineTo(width / 2, 100);
          ctx.stroke();
        } else if (selectedScene === 'books') {
          // Book spines error contour
          for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = `rgba(236, 72, 153, ${0.05 + (errorMultiplier * (i % 3 === 0 ? 0.5 : 0.2))})`;
            ctx.strokeRect(30 + i * 40, 60, 35, height - 120);
          }
        } else {
          // Flamingo statue contour
          ctx.strokeStyle = `rgba(236, 72, 153, ${0.1 + errorMultiplier * 0.4})`;
          ctx.beginPath();
          ctx.arc(width / 2 - 10, height / 2 - 20, 35, 0, Math.PI * 2); // body
          ctx.stroke();
        }
      } else {
        // Standard RGB Render simulation
        if (hasColorShift) {
          ctx.fillStyle = '#0f172a'; // color shifted background
        } else {
          ctx.fillStyle = '#1e293b';
        }
        ctx.fillRect(0, 0, width, height);

        // Apply blur filter on canvas level if requested
        if (blurFactor > 0) {
          ctx.filter = `blur(${blurFactor}px)`;
        }

        // Draw Subway Station Scene
        if (selectedScene === 'subway') {
          // Ceiling tiles
          ctx.fillStyle = '#334155';
          ctx.fillRect(0, 0, width, 100);

          // Pillars
          ctx.fillStyle = hasColorShift ? '#52525b' : '#475569';
          ctx.fillRect(50, 100, 40, height - 100);
          ctx.fillRect(width - 90, 100, 40, height - 100);

          // Exit Sign board
          ctx.fillStyle = '#020617';
          ctx.fillRect(width / 2 - 90, 40, 180, 50);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.strokeRect(width / 2 - 90, 40, 180, 50);

          // Sharp or Blurry text in Signboard
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 16px font-sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('EXIT 202 ↗', width / 2, 70);

          // Subway tracks/ground
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(90, 180, width - 180, height - 180);
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(90, 178, width - 180, 2); // Yellow platform safety line
        }

        // Draw Bookshelf Scene
        else if (selectedScene === 'books') {
          ctx.fillStyle = '#27272a';
          ctx.fillRect(0, 0, width, height);

          // Draw bookshelves
          ctx.fillStyle = '#71717a';
          ctx.fillRect(20, 50, width - 40, 10);
          ctx.fillRect(20, height - 60, width - 40, 10);

          // Spines of books
          const bookColors = ['#dc2626', '#d97706', '#059669', '#2563eb', '#7c3aed', '#db2777', '#4b5563', '#16a34a'];
          for (let i = 0; i < 8; i++) {
            ctx.fillStyle = bookColors[i % bookColors.length];
            const h = 100 + (i % 3) * 20;
            ctx.fillRect(30 + i * 40, height - 60 - h, 35, h);

            // Title labels on spines (extremely sharp in StructSplat, unreadable in AnySplat)
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px font-mono, monospace';
            ctx.save();
            ctx.translate(30 + i * 40 + 17, height - 60 - h / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillText(isLeftOurs ? `ECCV 2026` : `BLURRED`, 0, 0);
            ctx.restore();
          }
        }

        // Draw Garden Flamingo Scene
        else if (selectedScene === 'flamingo') {
          // Lush grass and sky background
          ctx.fillStyle = '#14532d'; // Dark green grass
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = '#38bdf8'; // Blue sky top corner
          ctx.fillRect(0, 0, width, 80);

          // Draw garden bushes
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.arc(50, 120, 60, 0, Math.PI * 2);
          ctx.arc(width - 50, 130, 70, 0, Math.PI * 2);
          ctx.fill();

          // Flamingo base / stand
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(width / 2 - 10, height / 2 + 10);
          ctx.lineTo(width / 2 - 10, height - 50);
          ctx.stroke();

          // Flamingo pink body (Fuzzy in baselines)
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(width / 2 - 10, height / 2 - 20, 35, 0, Math.PI * 2);
          ctx.fill();

          // Neck
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.moveTo(width / 2 - 30, height / 2 - 30);
          ctx.bezierCurveTo(width / 2 - 60, height / 2 - 80, width / 2 - 20, height / 2 - 90, width / 2 - 20, height / 2 - 70);
          ctx.stroke();

          // Head / Beak
          ctx.fillStyle = '#020617';
          ctx.beginPath();
          ctx.arc(width / 2 - 20, height / 2 - 70, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Reset filter
        ctx.filter = 'none';

        // Draw floating cloud-splat artifacts on uncalibrated baselines (to represent real 3DGS out-of-bounds splats)
        if (hasArtifacts) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          for (let k = 0; k < 6; k++) {
            ctx.beginPath();
            // generate static pseudo-random spots
            const spotX = (50 + k * 77) % width;
            const spotY = (120 + k * 53) % height;
            ctx.ellipse(spotX, spotY, 15 + (k % 3) * 10, 8 + (k % 2) * 5, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    };

    // Redraw both canvases
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;

    if (leftCanvas && rightCanvas) {
      const dpr = window.devicePixelRatio || 1;
      const leftRect = leftCanvas.getBoundingClientRect();
      const rightRect = rightCanvas.getBoundingClientRect();

      leftCanvas.width = leftRect.width * dpr;
      leftCanvas.height = leftRect.height * dpr;
      leftCanvas.getContext('2d')?.scale(dpr, dpr);

      rightCanvas.width = rightRect.width * dpr;
      rightCanvas.height = rightRect.height * dpr;
      rightCanvas.getContext('2d')?.scale(dpr, dpr);

      drawScene(leftCanvas, true, showErrorMap, selectedBaseline);
      drawScene(rightCanvas, false, showErrorMap, selectedBaseline);
    }
  }, [selectedScene, selectedBaseline, showErrorMap, sliderPosition]);

  // Handle Dragging comparison slider
  const handleSliderMove = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || e.type === 'mousemove') {
      handleSliderMove(e.clientX);
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-100" id="comparison-section">
      <div className="max-w-5xl mx-auto px-6">

        {/* Toggle tabs (Visual vs Quantitative) */}
        <div className="flex justify-center mb-10" id="comparison-tabs">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200" id="tabs-box">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${activeTab === 'visual'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
              id="tab-visual-comparison"
            >
              <Sliders className="w-4 h-4" /> Visual Comparison
            </button>
            <button
              onClick={() => setActiveTab('quantitative')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${activeTab === 'quantitative'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
              id="tab-quantitative-metrics"
            >
              <BarChart3 className="w-4 h-4" /> Benchmark Metrics
            </button>
          </div>
        </div>

        {/* TAB 1: Visual Side-by-side comparison slider */}
        {activeTab === 'visual' && (
          <div className="space-y-8" id="visual-tab-content">

            {/* New Figure Selection Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6" id="figure-select-header">
              <div className="space-y-1" id="figure-meta">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight" id="figure-title">
                  Qualitative Visual Comparisons
                </h3>
                <p className="text-xs text-slate-500" id="figure-desc">
                  Select a figure below to see visual comparisons with state-of-the-art novel view synthesis methods.
                </p>
              </div>

              {/* Figure Selector Tabs */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200" id="figure-selector-tabs">
                <button
                  onClick={() => setSelectedFigure('fig6')}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${selectedFigure === 'fig6'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                  id="btn-fig6-tab"
                >
                  DL3DV Dataset
                </button>
                <button
                  onClick={() => setSelectedFigure('fig7')}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${selectedFigure === 'fig7'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                  id="btn-fig7-tab"
                >
                  ACID & RealEstate10K
                </button>
              </div>
            </div>

            {/* Display Selected Figure */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6" id="selected-figure-panel">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2" id="figure-asset-header">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block" id="figure-asset-tag">
                  {selectedFigure === 'fig6' ? 'Visual Quality on DL3DV' : 'Cross-Dataset Generalization'}
                </span>
                {/* <div className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2.5 py-1 rounded border border-slate-200" id="figure-code-label">
                  Edit path in: src/components/Comparison.tsx
                </div> */}
              </div>

              {/* Responsive Image Container */}
              <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200/60 flex items-center justify-center" id="figure-image-container">
                <img
                  src={selectedFigure === 'fig6' ? fig6_DL3DVUrl : fig7_ACID_RE10KUrl}
                  alt={selectedFigure === 'fig6' ? "Fig. 6 Visual comparison on DL3DV" : "Fig. 7 Visual comparison on ACID and RealEstate10K"}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity"
                  id="figure-image-element"
                />
              </div>

              {/* Captions */}
              {selectedFigure === 'fig6' ? (
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify italic" id="figure-fig6-caption">
                  <strong>Qualitative comparison on the DL3DV dataset.</strong> Compared to prior feed-forward sparse-view reconstruction models, our proposed StructSplat model produces significantly sharper high-frequency details (such as readable book titles, intricate architectural edges, and clear foreground structures) without requiring expensive per-scene camera calibrations or lengthy optimization cycles.
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify italic" id="figure-fig7-caption">
                  <strong>Qualitative comparison on the ACID and RealEstate10K datasets.</strong> Demonstrating cross-dataset generalization. StructSplat successfully recovers robust and leakage-free camera tracks along with pristine novel view details, whereas baseline models often suffer from structural floaters, foggy geometries, or complete camera tracking failure.
                </p>
              )}
            </div>

            {/* ------------------ LEGACY INTERACTIVE SLIDER (COMMENTED OUT / INACTIVE) ------------------ */}
            {false && (
              <div className="space-y-8" id="legacy-visual-tab-content">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6" id="visual-controls-row">
                  <div className="space-y-1" id="visual-meta">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight" id="visual-title">
                      Uncalibrated Sparse-View Novel Synthesis
                    </h3>
                    <p className="text-xs text-slate-500" id="visual-desc">
                      Drag the central slider left/right to compare <strong>StructSplat (Ours)</strong> with other models.
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3" id="visual-control-buttons">
                    {/* Scene Selector */}
                    <div className="flex items-center gap-1.5" id="scene-select-group">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" id="scene-select-label">Scene:</span>
                      <select
                        value={selectedScene}
                        onChange={(e: any) => setSelectedScene(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        id="select-comparison-scene"
                      >
                        <option value="subway">Metro exit (Fig. 1)</option>
                        <option value="books">Book shelf detail (Fig. 6)</option>
                        <option value="flamingo">Garden flamingo (Fig. 7)</option>
                      </select>
                    </div>

                    {/* Baseline selector */}
                    <div className="flex items-center gap-1.5" id="baseline-select-group">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" id="baseline-select-label">Vs:</span>
                      <select
                        value={selectedBaseline}
                        onChange={(e) => setSelectedBaseline(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        id="select-comparison-baseline"
                      >
                        <option value="gt">Ground Truth (Reference)</option>
                        <option value="anysplat">AnySplat [19]</option>
                        <option value="da3">Depth Anything 3 [27]</option>
                        <option value="splatt3r">Splatt3R [40]</option>
                      </select>
                    </div>

                    {/* Error Map Toggle */}
                    <button
                      onClick={() => setShowErrorMap(!showErrorMap)}
                      className={`text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all ${showErrorMap
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      id="btn-toggle-l1-error"
                    >
                      {showErrorMap ? 'Show Color Render' : 'Show L1 Error Map'}
                    </button>
                  </div>
                </div>

                {/* Split Screen Image Slider Container */}
                <div
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  className="relative w-full h-[320px] sm:h-[400px] bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 select-none cursor-ew-resize"
                  id="slider-container"
                >
                  {/* Left Side: Ours (StructSplat) */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                    id="left-split-frame"
                  >
                    <canvas
                      ref={leftCanvasRef}
                      className="absolute inset-y-0 left-0 w-full h-full block min-w-[500px]"
                      style={{ width: containerRef.current?.getBoundingClientRect().width }}
                      id="left-split-canvas"
                    />

                    {/* Overlay Badge for Ours */}
                    <div className="absolute top-4 left-4 bg-indigo-600 backdrop-blur-md text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase px-2.5 py-1 rounded shadow-sm" id="left-split-badge">
                      StructSplat (Ours) {showErrorMap && '• Low Error'}
                    </div>
                  </div>

                  {/* Right Side: Baseline */}
                  <div className="absolute inset-0 z-0 pointer-events-none" id="right-split-frame">
                    <canvas
                      ref={rightCanvasRef}
                      className="w-full h-full block"
                      id="right-split-canvas"
                    />

                    {/* Overlay Badge for Baseline */}
                    <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-md text-slate-200 font-bold text-[10px] sm:text-xs tracking-wider uppercase px-2.5 py-1 rounded shadow-sm" id="right-split-badge">
                      {baselines[selectedBaseline].label} {showErrorMap && '• High Error'}
                    </div>
                  </div>

                  {/* Slider Divider Bar */}
                  <div
                    className="absolute inset-y-0 z-10 w-1 bg-white hover:bg-indigo-400 cursor-ew-resize flex items-center justify-center group"
                    style={{ left: `${sliderPosition}%` }}
                    id="slider-divider-bar"
                  >
                    <div className="absolute w-8 h-8 bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center border border-slate-200 font-semibold text-xs select-none transition-transform group-hover:scale-115" id="slider-handle">
                      ↔
                    </div>
                  </div>
                </div>

                {/* Slider Stats / Information */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6" id="visual-critique-panel">
                  <div className="space-y-1.5" id="critique-col-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" id="critique-header-1">STRUCTURAL STABILITY</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify" id="critique-text-1">
                      {selectedBaseline === 'anysplat'
                        ? 'AnySplat fails to bind appearance with clean geometry, creating floating cloud-like Gaussian artifacts.'
                        : selectedBaseline === 'gt'
                          ? 'StructSplat exhibits almost zero visual degradation, matching Ground Truth colors and structure perfectly.'
                          : 'Unaligned camera baselines result in geometric distortion and blurry text outlines.'}
                    </p>
                  </div>
                  <div className="space-y-1.5" id="critique-col-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" id="critique-header-2">HIGH-FREQUENCY TEXTURE</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify" id="critique-text-2">
                      Our <strong>pixel-aligned texture injection</strong> pathway bypasses the typical spatial smoothing bias of 3DGS, resolving tiny text (e.g. "EXIT 202") and book spine details faithfully.
                    </p>
                  </div>
                  <div className="space-y-1.5" id="critique-col-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" id="critique-header-3">METRIC SUMMARY</span>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200/60 mt-1" id="metric-chip">
                      <div className="text-center flex-1 border-r border-slate-100" id="chip-ours">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">OURS PSNR</span>
                        <span className="text-sm font-bold text-indigo-600">28.05 dB</span>
                      </div>
                      <div className="text-center flex-1" id="chip-baseline">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">BASELINE</span>
                        <span className="text-sm font-bold text-slate-500">
                          {selectedBaseline === 'anysplat' ? '22.38 dB' : selectedBaseline === 'da3' ? '20.72 dB' : selectedBaseline === 'splatt3r' ? '15.94 dB' : 'Reference'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: Quantitative tables */}
        {activeTab === 'quantitative' && (
          <div className="space-y-8" id="quantitative-tab-content">

            {/* Table level tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4" id="table-tabs">
              {[
                { id: 'dl3dv', label: 'DL3DV Benchmark' },
                { id: 'acid', label: 'ACID Benchmark' },
                { id: 're10k', label: 'RealEstate10K Benchmark' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTableTab(t.id as any)}
                  className={`text-xs font-semibold py-1.5 px-3.5 rounded-full transition-colors ${activeTableTab === t.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  id={`btn-table-tab-${t.id}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Render Selected Table */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm" id="table-frame">
              {activeTableTab === 'dl3dv' && (
                <table className="w-full text-left text-sm" id="table-dl3dv-metrics">
                  <thead className="bg-slate-50/75 border-b border-slate-100" id="table-dl3dv-head">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 text-xs uppercase">Method</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">PSNR ↑ (dB)</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">SSIM ↑</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">LPIPS ↓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50" id="table-dl3dv-body">
                    {dl3dvMetrics.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${row.isOurs ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50/40'
                          }`}
                        id={`dl3dv-row-${idx}`}
                      >
                        <td className="p-4 font-medium text-slate-800" id={`dl3dv-method-${idx}`}>
                          {row.method} {row.isOurs && <span className="ml-1.5 text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">Ours</span>}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-indigo-700' : 'text-slate-700'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`dl3dv-psnr-${idx}`}>
                          {row.psnr.toFixed(3)}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-500'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`dl3dv-ssim-${idx}`}>
                          {row.ssim.toFixed(3)}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-500'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`dl3dv-lpips-${idx}`}>
                          {row.lpips.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === 'acid' && (
                <table className="w-full text-left text-sm" id="table-acid-metrics">
                  <thead className="bg-slate-50/75 border-b border-slate-100" id="table-acid-head">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 text-xs uppercase">Method</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">PSNR ↑</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">SSIM ↑</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">LPIPS ↓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50" id="table-acid-body">
                    {acidMetrics.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${row.isOurs ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50/40'
                          }`}
                        id={`acid-row-${idx}`}
                      >
                        <td className="p-4 font-medium text-slate-800" id={`acid-method-${idx}`}>
                          {row.method} {row.isOurs && <span className="ml-1.5 text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">Ours</span>}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-indigo-700' : 'text-slate-700'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`acid-psnr-${idx}`}>
                          {row.psnr.toFixed(3)}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-500'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`acid-ssim-${idx}`}>
                          {row.ssim.toFixed(3)}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-500'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`acid-lpips-${idx}`}>
                          {row.lpips.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTableTab === 're10k' && (
                <table className="w-full text-left text-sm" id="table-re10k-metrics">
                  <thead className="bg-slate-50/75 border-b border-slate-100" id="table-re10k-head">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 text-xs uppercase">Method</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">PSNR ↑</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">SSIM ↑</th>
                      <th className="p-4 font-bold text-slate-900 text-xs uppercase text-right">LPIPS ↓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50" id="table-re10k-body">
                    {re10kMetrics.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${row.isOurs ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50/40'
                          }`}
                        id={`re10k-row-${idx}`}
                      >
                        <td className="p-4 font-medium text-slate-800" id={`re10k-method-${idx}`}>
                          {row.method} {row.isOurs && <span className="ml-1.5 text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">Ours</span>}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-indigo-700' : 'text-slate-700'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`re10k-psnr-${idx}`}>
                          {row.psnr.toFixed(3)}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-500'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`re10k-ssim-${idx}`}>
                          {row.ssim.toFixed(3)}
                        </td>
                        <td className={`p-4 text-right ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-500'} ${row.isUnderline ? 'underline decoration-slate-400' : ''}`} id={`re10k-lpips-${idx}`}>
                          {row.lpips.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
