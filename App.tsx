import React, { useRef, useState } from 'react';
import { CpuStressTest } from './components/CpuStressTest';
import { ChaosMonkey } from './components/ChaosMonkey';
import { RenderLagSimulator } from './components/RenderLagSimulator';
import { MissionClock, ClockStyleConfig } from './lib';
import { NaiveClock, NaiveClockHandle } from './components/NaiveClock';

const STYLE_PRESETS: Record<string, { label: string, config: Partial<ClockStyleConfig> }> = {
  default: {
    label: 'Standard',
    config: {
      backgroundColor: 'transparent',
      textColor: '#22c55e',
      fontFamily: "'Courier New', monospace",
      glowEffect: true,
      showDot: true
    }
  },
  cyberpunk: {
    label: 'Cyberpunk',
    config: {
      backgroundColor: 'rgba(20, 0, 40, 0.9)',
      textColor: '#00fff2',
      fontFamily: "Impact, sans-serif",
      glowEffect: true,
      showDot: true
    }
  },
  minimal: {
    label: 'Minimal',
    config: {
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      fontFamily: "Arial, sans-serif",
      glowEffect: false,
      showDot: false
    }
  },
  retro: {
    label: 'Retro',
    config: {
      backgroundColor: '#1a1000',
      textColor: '#fbbf24',
      fontFamily: "'Courier New', monospace",
      glowEffect: true,
      showDot: true
    }
  },
  roboto: {
    label: 'Roboto Fixed',
    config: {
      backgroundColor: '#334155',
      textColor: '#ffffff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '40px', // Scaling up slightly for the demo container since 20px is quite small for a 320px high box
      fontWeight: '700',
      glowEffect: false,
      showDot: true
    }
  }
};

function App() {
  const clockControllerRef = useRef<any>(null);
  const naiveClockRef = useRef<NaiveClockHandle>(null);
  const mobileNaiveClockRef = useRef<NaiveClockHandle>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [timeFormat, setTimeFormat] = useState('hh:mm:ss');
  const [activeStyle, setActiveStyle] = useState('default');
  const [countDirection, setCountDirection] = useState<'UP' | 'DOWN'>('UP');

  const actions = {
    start: () => {
      clockControllerRef.current?.start();
      naiveClockRef.current?.start();
      mobileNaiveClockRef.current?.start();
      setIsRunning(true);
    },
    pause: () => {
      clockControllerRef.current?.pause();
      naiveClockRef.current?.pause();
      mobileNaiveClockRef.current?.pause();
      setIsRunning(false);
    },
    setTime: (s: number) => {
      clockControllerRef.current?.setTime(s);
      naiveClockRef.current?.setTime(s);
      mobileNaiveClockRef.current?.setTime(s);
    },
    adjustTime: (delta: number) => {
      clockControllerRef.current?.adjustTime(delta);
      naiveClockRef.current?.adjustTime(delta);
      mobileNaiveClockRef.current?.adjustTime(delta);
    },
    setDirection: (direction: 'UP' | 'DOWN') => {
      clockControllerRef.current?.setDirection(direction);
    }
  };

  const presets = [
    { label: 'HT (45:00)', value: 45 * 60 },
    { label: 'FT (90:00)', value: 90 * 60 },
    { label: 'ET (120:00)', value: 120 * 60 },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">

      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-100 leading-tight">
                DNM Broadcast Engine
              </h1>
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                PoC: OffscreenCanvas Worker
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#/docs"
              className="px-3 py-1.5 rounded-full text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              API DOCS
            </a>
            <a
              href="https://www.npmjs.com/package/dnm-clock"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-slate-800"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 7.334v8h6.666v-5.333h5.333v5.333h12v-8H0zM20 13.334h-2.667v-2.667h-2.666v2.667H12v-2.667h-2.667v2.667H2.667V10h17.333v3.334z" />
              </svg>
              <span>NPM</span>
            </a>
            <a
              href="http://github.com/yahoohung/dnm-clock"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav >

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* === TOP ROW: DASHBOARD === */}
        <div className="lg:col-span-8 space-y-6">

          {/* MASTER CLOCK DISPLAY */}
          <div className="bg-transparent rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />

            <div className="relative p-6 md:p-8 flex flex-col items-center justify-center min-h-[240px]">

              <div className="w-full flex justify-between items-start absolute top-4 left-0 px-6 z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Master Reference</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                    <span className="text-xs font-bold text-green-500 tracking-wider">WORKER THREAD :: ACTIVE</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-slate-400">
                    OFFSCREENCANVAS
                  </div>
                </div>
              </div>

              {/* THE CLOCK COMPONENT */}
              <div className="w-full h-full flex items-center justify-center">
                <MissionClock
                  data-testid="mission-clock"
                  controllerRef={clockControllerRef}
                  initialSeconds={0}
                  className="w-full h-40" // Height is arbitrary, canvas scales
                  config={{
                    ...STYLE_PRESETS[activeStyle].config,
                    // Override color for pause state ONLY if in default mode (to match original behavior)
                    // or just let the preset dictate. Let's keep it simple and just use the preset + format.
                    timeFormat
                  }}
                />

                {/* VIDEO PLAYER STYLE OVERLAY */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isRunning ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                >
                  <button
                    onClick={isRunning ? actions.pause : actions.start}
                    className={`group relative flex items-center justify-center w-14 h-14 rounded-full border-2 backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${activeStyle === 'minimal'
                      ? 'bg-black/10 border-black/50 hover:bg-black/20 hover:border-black text-black'
                      : 'bg-white/10 border-white/50 hover:bg-white/20 hover:border-white text-white'
                      }`}
                  >
                    {isRunning ? (
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}

                    {/* Ripple/Glow ring */}
                    {!isRunning && (
                      <div className={`absolute inset-0 rounded-full border animate-ping ${activeStyle === 'minimal' ? 'border-black/30' : 'border-white/30'
                        }`} />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* === MOBILE ONLY: COMPARISON & STRESS LAB === */}
          <div className="lg:hidden space-y-6">
            {/* COMPARISON MONITOR */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Thread Monitor</span>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="p-6 flex flex-col items-center justify-center">
                <NaiveClock
                  ref={mobileNaiveClockRef}
                  timeFormat={timeFormat}
                  data-testid="naive-clock-mobile"
                  className={`text-5xl font-mono font-bold tracking-tighter ${isRunning ? 'text-red-500' : 'text-slate-700'}`}
                />
                <p className="mt-2 text-[10px] text-red-900 uppercase font-bold tracking-widest">Susceptible to Lag</p>
              </div>
            </div>

            {/* STRESS CONTROLS */}
            <div className="bg-slate-900/20 rounded-xl border border-slate-800 p-1">
              <div className="bg-slate-900/80 p-4 rounded-lg space-y-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Stress Testing Lab
                  </h2>
                </div>

                <CpuStressTest />
                <div className="h-px bg-slate-800" />
                <RenderLagSimulator />
                <div className="h-px bg-slate-800" />
                <ChaosMonkey actions={actions} />
              </div>
            </div>
          </div>

          {/* CONTROL DECK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Controls */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex gap-3">
              <button
                onClick={isRunning ? actions.pause : actions.start}
                className={`flex-1 rounded-lg font-bold text-lg tracking-wide shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-900/20'
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                  }`}
              >
                {isRunning ? 'PAUSE' : 'START'}
              </button>
              <button
                onClick={() => actions.setTime(0)}
                className="px-6 rounded-lg font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
              >
                RESET
              </button>
            </div>

            {/* Preset Controls */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex gap-2 overflow-x-auto">
              {presets.map(p => (
                <button
                  key={p.value}
                  onClick={() => actions.setTime(p.value)}
                  className="flex-1 min-w-[80px] py-3 text-xs font-mono font-bold text-slate-400 bg-slate-950 border border-slate-800 rounded hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}

              {/* Direction Toggle */}
              <button
                onClick={() => {
                  const newDir = countDirection === 'UP' ? 'DOWN' : 'UP';
                  setCountDirection(newDir);
                  actions.setDirection(newDir);
                }}
                className={`flex-1 min-w-[80px] py-3 text-xs font-mono font-bold border rounded transition-colors ${countDirection === 'DOWN'
                  ? 'bg-orange-900/30 text-orange-400 border-orange-900/50 hover:bg-orange-900/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {countDirection === 'UP' ? 'Count UP' : 'Count DOWN'}
              </button>
            </div>
          </div>

          {/* STYLE PRESETS */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Visual Style</span>
            <div className="flex-1 flex gap-2 w-full overflow-x-auto no-scrollbar">
              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setActiveStyle(key)}
                  className={`px-4 py-2 text-xs font-bold rounded transition-all whitespace-nowrap border ${activeStyle === key
                    ? 'bg-slate-100 text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* FORMAT CONFIGURATION */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Time Format</span>
            <div className="flex-1 flex gap-2 w-full">
              <input
                type="text"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-1 text-sm font-mono text-white w-full md:w-32 focus:border-blue-500 outline-none transition-colors"
              />
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {['hh:mm:ss', 'mm:ss', 'hh:mm', 'mm', 'ss'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setTimeFormat(fmt)}
                    className={`px-3 py-1 text-[10px] font-mono border rounded transition-colors whitespace-nowrap ${timeFormat === fmt ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ATOMIC ADJUSTMENTS */}
          <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precision Adjustments</h3>
              <span className="text-[10px] text-slate-600 font-mono">DELTA UPDATES</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {/* Seconds */}
              <button onClick={() => actions.adjustTime(-1)} className="p-2 bg-slate-950 text-blue-400 border border-slate-800 rounded hover:border-blue-500/50 text-xs font-mono font-bold">-1s</button>
              <button onClick={() => actions.adjustTime(1)} className="p-2 bg-slate-950 text-blue-400 border border-slate-800 rounded hover:border-blue-500/50 text-xs font-mono font-bold">+1s</button>
              {/* Minutes */}
              <button onClick={() => actions.adjustTime(-60)} className="p-2 bg-slate-950 text-indigo-400 border border-slate-800 rounded hover:border-indigo-500/50 text-xs font-mono font-bold">-1m</button>
              <button onClick={() => actions.adjustTime(60)} className="p-2 bg-slate-950 text-indigo-400 border border-slate-800 rounded hover:border-indigo-500/50 text-xs font-mono font-bold">+1m</button>
              {/* Hours */}
              <button onClick={() => actions.adjustTime(-3600)} className="p-2 bg-slate-950 text-purple-400 border border-slate-800 rounded hover:border-purple-500/50 text-xs font-mono font-bold">-1h</button>
              <button onClick={() => actions.adjustTime(3600)} className="p-2 bg-slate-950 text-purple-400 border border-slate-800 rounded hover:border-purple-500/50 text-xs font-mono font-bold">+1h</button>
            </div>
          </div>

          {/* ARCHITECTURAL EXPLANATION */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="text-red-400">⚠️</span> Why `setInterval` Fails
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <div className="w-1 h-full min-h-[1.2em] bg-red-900 rounded-full"></div>
                  <p><strong className="text-slate-300">Main Thread Blocking:</strong> React rendering, heavy JSON parsing, or garbage collection freezes the UI thread. The timer simply stops.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-full min-h-[1.2em] bg-red-900 rounded-full"></div>
                  <p><strong className="text-slate-300">Drift Accumulation:</strong> `setInterval(1000)` is essentially "wait <i>at least</i> 1000ms". A 5ms delay per second adds up to 18 seconds of error per hour.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-full min-h-[1.2em] bg-red-900 rounded-full"></div>
                  <p><strong className="text-slate-300">Visual Jitter:</strong> React state updates are scheduled. If the browser is busy painting layout, the clock digits update unevenly.</p>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="text-green-400">⚡</span> The Worker Solution
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <div className="w-1 h-full min-h-[1.2em] bg-green-900 rounded-full"></div>
                  <p><strong className="text-slate-300">Parallel Execution:</strong> The clock logic runs in a separate thread. Even if React crashes or hangs, the worker keeps running.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-full min-h-[1.2em] bg-green-900 rounded-full"></div>
                  <p><strong className="text-slate-300">OffscreenCanvas:</strong> Pixels are painted directly to the GPU from the worker. We bypass the React Render Cycle entirely.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-full min-h-[1.2em] bg-green-900 rounded-full"></div>
                  <p><strong className="text-slate-300">Drift-Free Math:</strong> We don't count ticks. We calculate <code>(Now - Start)</code> on every frame. It is mathematically impossible to drift.</p>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN: STRESS LAB === */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">

          {/* COMPARISON MONITOR */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Thread Monitor</span>
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <NaiveClock
                ref={naiveClockRef}
                timeFormat={timeFormat}
                data-testid="naive-clock"
                className={`text-5xl font-mono font-bold tracking-tighter ${isRunning ? 'text-red-500' : 'text-slate-700'
                  }`}
              />
              <p className="mt-2 text-[10px] text-red-900 uppercase font-bold tracking-widest">Susceptible to Lag</p>
            </div>
          </div>

          {/* STRESS CONTROLS */}
          <div className="bg-slate-900/20 rounded-xl border border-slate-800 p-1">
            <div className="bg-slate-900/80 p-4 rounded-lg space-y-6 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Stress Testing Lab
                </h2>
              </div>

              <CpuStressTest />
              <div className="h-px bg-slate-800" />
              <RenderLagSimulator />
              <div className="h-px bg-slate-800" />
              <ChaosMonkey actions={actions} />
            </div>
          </div>

        </div>

      </main >
    </div >
  );
}

export default App;