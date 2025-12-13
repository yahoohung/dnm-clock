import React, { useState, useEffect } from 'react';
import { MissionClock } from '../../lib';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const DocsLayout = () => {
    const [activeSection, setActiveSection] = useState('intro');

    // Simple sub-route handler
    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            const section = hash.replace('#/docs/', '');
            if (section && section !== '#/docs') {
                setActiveSection(section);
            } else {
                setActiveSection('intro');
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    const navigate = (section: string) => {
        window.location.hash = `#/docs/${section}`;
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans flex flex-col md:flex-row">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 sticky top-0 h-auto md:h-screen overflow-y-auto">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => window.location.hash = '#/'}>
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="font-bold text-white text-xs">API</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-sm">dnm-clock</h1>
                        <p className="text-[10px] text-slate-500">Back to Demo</p>
                    </div>
                </div>

                <nav className="p-4 space-y-8">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Getting Started</h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => navigate('intro')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'intro' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    Introduction
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('installation')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'installation' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    Installation
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Core Concepts</h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => navigate('api')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'api' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    API Reference
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('styling')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'styling' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    Styling Guide
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('controls')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'controls' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    Functional Controls
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Examples</h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => navigate('showcase')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'showcase' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    Showcases
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
                {activeSection === 'intro' && <IntroSection />}
                {activeSection === 'installation' && <InstallationSection />}
                {activeSection === 'api' && <ApiSection />}
                {activeSection === 'styling' && <StylingSection />}
                {activeSection === 'controls' && <ControlsSection />}
                {activeSection === 'showcase' && <ShowcaseSection />}
            </main>
        </div>
    );
};

// --- SECTIONS ---

const IntroSection = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h1 className="text-4xl font-bold text-white mb-4">Introduction</h1>
        <p className="text-lg leading-relaxed text-slate-400">
            <strong className="text-white">dnm-clock</strong> is a high-precision, drift-free clock engine designed specifically for modern React applications.
            It solves the fundamental problem of using <code>setInterval</code> or <code>requestAnimationFrame</code> on the main thread:
            <span className="text-red-400 font-bold"> Jitter and Drift.</span>
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
                <h3 className="text-white font-bold mb-2">🚫 The Problem</h3>
                <p className="text-sm text-slate-400">
                    React's render cycle, garbage collection, and heavy DOM updates block the main thread.
                    A simple <code>setInterval(1000)</code> will inevitably drift, losing seconds over time.
                </p>
            </div>
            <div className="p-6 bg-blue-900/10 rounded-xl border border-blue-500/20">
                <h3 className="text-blue-400 font-bold mb-2">✅ The Solution</h3>
                <p className="text-sm text-slate-400">
                    <strong className="text-white">dnm-clock</strong> moves the entire timing logic to a <strong>Web Worker</strong>.
                    It renders the clock visuals using an <strong>OffscreenCanvas</strong>, completely bypassing the React Render Cycle.
                </p>
            </div>
        </div>
    </div>
);

const InstallationSection = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h1 className="text-4xl font-bold text-white mb-4">Installation</h1>
        <p className="text-lg text-slate-400 mb-6">
            Install the package via your favorite package manager.
        </p>

        <div className="space-y-4">
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700 shadow-xl overflow-x-auto">
                <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                    {`npm install dnm-clock`}
                </SyntaxHighlighter>
            </div>
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700 shadow-xl overflow-x-auto">
                <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                    {`yarn add dnm-clock`}
                </SyntaxHighlighter>
            </div>
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700 shadow-xl overflow-x-auto">
                <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                    {`pnpm add dnm-clock`}
                </SyntaxHighlighter>
            </div>
        </div>
    </div>
);

const ApiSection = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
            <p className="text-lg text-slate-400">
                The core component of the library is <code>MissionClock</code>. It accepts the following props:
            </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs">
                    <tr>
                        <th className="p-4 font-bold">Prop</th>
                        <th className="p-4 font-bold">Type</th>
                        <th className="p-4 font-bold">Default</th>
                        <th className="p-4 font-bold">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                        <td className="p-4 font-mono text-blue-400">initialSeconds</td>
                        <td className="p-4 font-mono text-purple-400">number</td>
                        <td className="p-4 font-mono text-slate-500">0</td>
                        <td className="p-4">Starting time in seconds. Can be negative.</td>
                    </tr>
                    <tr>
                        <td className="p-4 font-mono text-blue-400">config</td>
                        <td className="p-4 font-mono text-purple-400">ClockStyleConfig</td>
                        <td className="p-4 font-mono text-slate-500">DEFAULT_CONFIG</td>
                        <td className="p-4">Style configuration object (see below).</td>
                    </tr>
                    <tr>
                        <td className="p-4 font-mono text-blue-400">controllerRef</td>
                        <td className="p-4 font-mono text-purple-400">RefObject</td>
                        <td className="p-4 font-mono text-slate-500">undefined</td>
                        <td className="p-4">Ref to access imperative controls (start, pause, etc).</td>
                    </tr>
                    <tr>
                        <td className="p-4 font-mono text-blue-400">className</td>
                        <td className="p-4 font-mono text-purple-400">string</td>
                        <td className="p-4 font-mono text-slate-500">undefined</td>
                        <td className="p-4">CSS classes for the outer container.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-white mb-4">ClockStyleConfig</h2>
            <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700 shadow-xl overflow-x-auto">
                <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                    {`interface ClockStyleConfig {
  backgroundColor: string; // Hex or RGBA
  textColor: string;       // Hex or RGBA
  fontFamily: string;      // Valid CSS font-family
  fontSize?: string;       // e.g. "40px" (optional override)
  fontWeight?: string;     // e.g. "700" (optional override)
  glowEffect: boolean;     // Enable text-shadow glow
  showDot: boolean;        // Show the pulsing "worker active" dot
  timeFormat?: string;     // "hh:mm:ss", "mm:ss", "hh:mm"
}`}
                </SyntaxHighlighter>
            </div>
        </div>
    </div>
);

const StylingSection = () => {
    const [config, setConfig] = useState({
        backgroundColor: '#0f172a',
        textColor: '#22c55e',
        fontFamily: "'Courier New', monospace",
        glowEffect: true,
        showDot: true,
        timeFormat: 'hh:mm:ss'
    });

    const presets = {
        neon: { backgroundColor: '#111827', textColor: '#ec4899', fontFamily: "'Courier New', monospace", glowEffect: true },
        cyber: { backgroundColor: 'rgba(0,0,0,0.8)', textColor: '#00f2ff', fontFamily: 'Impact, sans-serif', glowEffect: true },
        retro: { backgroundColor: '#2b211e', textColor: '#f59e0b', fontFamily: 'monospace', glowEffect: false },
        clean: { backgroundColor: '#ffffff', textColor: '#000000', fontFamily: 'Arial, sans-serif', glowEffect: false }
    };

    const applyPreset = (name: keyof typeof presets) => {
        setConfig({ ...config, ...presets[name] });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-bold text-white mb-4">Styling Guide</h1>
                <p className="text-lg text-slate-400">
                    The clock's appearance is fully customizable via the <code>config</code> prop.
                    Use the interactive playground below to generate your style config.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* PREVIEW */}
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</h3>
                        <div className="h-64 rounded-lg overflow-hidden border border-slate-600 bg-black relative">
                            <MissionClock
                                config={config}
                                className="w-full h-full"
                                initialSeconds={3665} // Example time (01:01:05)
                            />
                            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
                                Rendered in Worker
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => applyPreset('neon')} className="px-4 py-2 bg-pink-900/30 text-pink-400 border border-pink-900/50 rounded hover:bg-pink-900/50 transition">Neon</button>
                        <button onClick={() => applyPreset('cyber')} className="px-4 py-2 bg-cyan-900/30 text-cyan-400 border border-cyan-900/50 rounded hover:bg-cyan-900/50 transition">Cyber</button>
                        <button onClick={() => applyPreset('retro')} className="px-4 py-2 bg-amber-900/30 text-amber-400 border border-amber-900/50 rounded hover:bg-amber-900/50 transition">Retro</button>
                        <button onClick={() => applyPreset('clean')} className="px-4 py-2 bg-slate-200 text-slate-900 border border-slate-400 rounded hover:bg-white transition">Clean</button>
                    </div>
                </div>

                {/* CODE */}
                <div className="space-y-4">
                    <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700 shadow-xl h-full flex flex-col">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Generated Code</h3>
                        <div className="flex-1">
                            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                                {`<MissionClock 
  config={{
    backgroundColor: '${config.backgroundColor}',
    textColor: '${config.textColor}',
    fontFamily: "${config.fontFamily}",
    glowEffect: ${config.glowEffect},
    showDot: ${config.showDot},
    timeFormat: '${config.timeFormat}'
  }}
/>`}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ControlsSection = () => {
    const controller = React.useRef<any>(null);
    const [status, setStatus] = useState('Stopped');

    const handleAction = (action: string, fn: () => void) => {
        fn();
        setStatus(action);
        setTimeout(() => setStatus(prev => prev === action ? '' : prev), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-bold text-white mb-4">Functional Controls</h1>
                <p className="text-lg text-slate-400">
                    Control the clock interactively using the <code>controllerRef</code>.
                    This allows parent components to Start, Pause, Set Time, and Adjust Time without triggering React re-renders.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* PREVIEW */}
                <div className="space-y-6">
                    <div className="h-48 rounded-lg overflow-hidden border border-slate-600 bg-slate-900 relative">
                        <MissionClock
                            controllerRef={controller}
                            config={{
                                backgroundColor: 'transparent',
                                textColor: '#3b82f6',
                                fontFamily: 'monospace',
                                glowEffect: true,
                                showDot: true
                            }}
                            className="w-full h-full"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white border border-white/10">
                            {status || 'Idle'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleAction('Started', () => controller.current?.start())} className="p-3 bg-green-900/30 text-green-400 border border-green-900/50 rounded hover:bg-green-900/50 font-mono text-sm">.start()</button>
                        <button onClick={() => handleAction('Paused', () => controller.current?.pause())} className="p-3 bg-yellow-900/30 text-yellow-400 border border-yellow-900/50 rounded hover:bg-yellow-900/50 font-mono text-sm">.pause()</button>
                        <button onClick={() => handleAction('Added 1 Min', () => controller.current?.adjustTime(60))} className="p-3 bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded hover:bg-blue-900/50 font-mono text-sm">.adjustTime(60)</button>
                        <button onClick={() => handleAction('Reset to 0', () => controller.current?.setTime(0))} className="p-3 bg-red-900/30 text-red-400 border border-red-900/50 rounded hover:bg-red-900/50 font-mono text-sm">.setTime(0)</button>
                    </div>
                </div>

                {/* CODE */}
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-slate-700 shadow-xl overflow-x-auto">
                    <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                        {`// 1. Create a ref
const controller = useRef(null);

// 2. Pass to component
<MissionClock controllerRef={controller} />

// 3. call methods anywhere
<button onClick={() => controller.current.start()}>
  Start
</button>

<button onClick={() => controller.current.adjustTime(60)}>
  Add 1 Minute
</button>`}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
};

const ShowcaseSection = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <h1 className="text-4xl font-bold text-white mb-4">Showcases</h1>
        <p className="text-lg text-slate-400">Examples of dnm-clock in real-world scenarios.</p>

        {/* SPORT */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                ⚽ Sports Broadcast
            </h3>
            <p className="text-sm text-slate-400">High contrast, large fonts, and specific "90:00" formatting.</p>
            <div className="h-32 bg-black rounded border border-slate-700 relative overflow-hidden">
                <MissionClock
                    config={{
                        backgroundColor: '#000',
                        textColor: '#fbbf24', // Amber
                        fontFamily: 'Impact',
                        glowEffect: false,
                        showDot: false,
                        timeFormat: 'mm:ss'
                    }}
                    initialSeconds={5400} // 90 mins
                    className="w-full h-full"
                />
            </div>
        </div>

        {/* FINANCE */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📈 Financial Ticker
            </h3>
            <p className="text-sm text-slate-400">Precise, clean, no-nonsense timing for market opens/closes.</p>
            <div className="h-24 bg-white rounded border border-slate-300 relative overflow-hidden">
                <MissionClock
                    config={{
                        backgroundColor: '#ffffff',
                        textColor: '#1e293b',
                        fontFamily: 'Arial',
                        glowEffect: false,
                        showDot: true
                    }}
                    initialSeconds={34200} // 09:30:00
                    className="w-full h-full"
                />
            </div>
        </div>
    </div>
);
