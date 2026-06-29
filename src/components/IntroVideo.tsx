import React, { useEffect } from 'react';
import { Video } from 'lucide-react';

export default function IntroVideo() {
  useEffect(() => {
    // 1. Inject fast.wistia.com/player.js if not already present
    if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
      const script1 = document.createElement('script');
      script1.src = 'https://fast.wistia.com/player.js';
      script1.async = true;
      document.head.appendChild(script1);
    }

    // 2. Inject fast.wistia.com/embed/168y3or2hh.js if not already present
    if (!document.querySelector('script[src="https://fast.wistia.com/embed/168y3or2hh.js"]')) {
      const script2 = document.createElement('script');
      script2.src = 'https://fast.wistia.com/embed/168y3or2hh.js';
      script2.async = true;
      script2.type = 'module';
      document.head.appendChild(script2);
    }
  }, []);

  return (
    <section className="py-16 bg-white border-b border-slate-100" id="intro-video-section">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Simple, Clean Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3" id="video-header">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2" id="video-heading">
            <Video className="w-5 h-5 text-indigo-600" /> Demo Video
          </h2>
        </div>

        {/* Video Player Frame */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl relative" id="video-player-container">
          <style dangerouslySetInnerHTML={{ __html: `
            wistia-player[media-id='168y3or2hh']:not(:defined) { 
              background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/168y3or2hh/swatch'); 
              display: block; 
              filter: blur(5px); 
              padding-top: 56.25%; 
            }
          `}} />
          <div dangerouslySetInnerHTML={{ __html: '<wistia-player media-id="168y3or2hh" aspect="1.7777777777777777"></wistia-player>' }} />
        </div>
      </div>
    </section>
  );
}
