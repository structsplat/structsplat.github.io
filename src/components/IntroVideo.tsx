import React from 'react';
import { Video } from 'lucide-react';

export default function IntroVideo() {
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
          <div className="relative aspect-video w-full bg-black" id="video-display-screen">
            <iframe 
              src="https://drive.google.com/file/d/1LAnGCD9yETuskTguorX7J14QAfuefiXd/preview" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="StructSplat Demo Video"
              id="google-drive-video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
