import { useState } from 'react';

const Layout = ({ gallery, feed }) => {
  const [isFeedOpen, setIsFeedOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#f8fafc] flex overflow-hidden font-sans text-slate-900">
      {/* Sidebar Navigation - More compact for immersion */}
      <div className="w-20 lg:w-64 bg-white/80 backdrop-blur-2xl border-r border-slate-200 flex flex-col flex-shrink-0 z-40 transition-all duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-center lg:justify-start">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-3 text-slate-900">
            <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20 flex-shrink-0">A</span>
            <span className="hidden lg:block">Antigravity</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <button
            onClick={() => setIsFeedOpen(false)}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${!isFeedOpen
              ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/30 scale-105'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="hidden lg:block">Gallery</span>
          </button>

          <button
            onClick={() => setIsFeedOpen(true)}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${isFeedOpen
              ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/30 scale-105'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <span className="hidden lg:block">Activity</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
            <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest hidden lg:block">InstantDB ⚡</p>
            <div className="w-2 h-2 rounded-full bg-green-500 mx-auto lg:hidden shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        </div>
      </div>

      {/* Main Immersive Area */}
      <main className="flex-1 flex overflow-hidden bg-white/40 shadow-inner relative">
        {/* Gallery Content - Expands/Shrinks */}
        <div
          className="flex-1 overflow-y-auto relative scrollbar-hide py-8 px-6 lg:px-12 transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)]"
          onClick={() => isFeedOpen && setIsFeedOpen(false)} // Close feed if clicking gallery
        >
          {gallery}
        </div>

        {/* Collapsible Activity Panel - Right Side */}
        <aside
          className={`fixed lg:relative right-0 top-0 h-full bg-white/70 backdrop-blur-3xl border-l border-slate-200/60 shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.05)] flex flex-col flex-shrink-0 z-30 transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isFeedOpen ? 'w-[420px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-32 border-transparent overflow-hidden'}`}
        >
          <div className="p-8 h-full overflow-y-auto scrollbar-hide min-w-[420px]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col gap-1">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Pulse Feed</h3>
                <div className="h-1.5 w-12 bg-slate-900 rounded-full"></div>
              </div>
              <button
                onClick={() => setIsFeedOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {feed}
          </div>
        </aside>
      </main>
    </div>
  );
};
export default Layout;
