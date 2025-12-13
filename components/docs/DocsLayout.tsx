import React, { useState, useEffect } from 'react';
import { DNMClock } from '../../lib';
import { CodeBlock } from './CodeBlock';

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
                                    onClick={() => navigate('quickstart')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === 'quickstart' ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800'}`}
                                >
                                    Quick Start
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
                {activeSection === 'quickstart' && <QuickStartSection />}
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
    <div className="space-y-12 animate-in fade-in duration-500">
        {/* HEADER */}
        <div>
            <h1 className="text-4xl font-bold text-white mb-4">Introduction</h1>
            <p className="text-lg leading-relaxed text-slate-400">
                <strong className="text-white">dnm-clock</strong> is a specialized timing engine created for one purpose: <br />
                To provide <span className="text-blue-400 font-bold">Broadcast-Grade Precision</span> in a browser environment.
            </p>
        </div>

        {/* THE PROBLEM */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">🚧 The Main Thread Problem</h2>
            <p className="text-slate-400 leading-relaxed">
                In modern JavaScript frameworks (React, Vue, etc.), the "Main Thread" is overcrowded. It handles:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>JavaScript Logic & State Updates</li>
                <li>DOM Reconciliation (Diffing)</li>
                <li>User Interactions (Clicks, Inputs)</li>
                <li>CSS Layout & Painting</li>
            </ul>
            <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg mt-4">
                <p className="text-red-300 text-sm">
                    <strong>The Consequence:</strong> If a standard <code>setInterval</code> fires while React is rendering a large list, the timer event is delayed.
                    This causes the displayed time to "stutter" or drift, sometimes skipping entire seconds.
                </p>
            </div>
        </div>

        {/* THE SOLUTION */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">⚡ The Worker Solution</h2>
            <p className="text-slate-400 leading-relaxed">
                <strong className="text-white">dnm-clock</strong> bypasses the Main Thread entirely using a "Dual-Architecture" approach:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-400 mb-2">1. Dedicated Worker</h3>
                    <p className="text-sm text-slate-400">
                        The timing logic lives in a <a href="https://www.w3.org/TR/workers/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline decoration-1 underline-offset-2">Web Worker</a>. This thread runs in parallel to your UI. Even if your React app freezes completely, the worker keeps running at full speed.
                    </p>
                </div>
                <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <h3 className="text-lg font-bold text-purple-400 mb-2">2. Offscreen Rendering</h3>
                    <p className="text-sm text-slate-400">
                        Instead of updating React State (which triggers re-renders), the worker paints directly to an <a href="https://www.w3.org/TR/offscreencanvas/" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline decoration-1 underline-offset-2">OffscreenCanvas</a>. The browser performs a zero-copy transfer of these pixels to the screen.
                    </p>
                </div>
            </div>
        </div>

        {/* DEEP DIVE */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">🧠 Under the Hood</h2>
            <p className="text-slate-400">
                How we achieve <strong>Drift-Free</strong> accuracy:
            </p>

            <div className="space-y-6">
                <div>
                    <h3 className="text-white font-bold text-lg mb-2">Self-Correcting Math</h3>
                    <p className="text-slate-400 text-sm mb-2">
                        We never use <code>setInterval(fn, 1000)</code>. Instead, we use a <code>requestAnimationFrame</code> loop that calculates the exact time every frame:
                    </p>
                    <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700 font-mono text-xs text-blue-300">
                        elapsed = performance.now() - startTime;<br />
                        current = baseTime + elapsed;
                    </div>
                    <p className="text-slate-500 text-xs mt-2 italic">
                        If the browser lags for 500ms, the next frame simply jumps strictly to the correct time. Errors never accumulate.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-bold text-lg mb-2">Zero-Allocation Loop</h3>
                    <p className="text-slate-400 text-sm">
                        The rendering loop is carefully written to create <strong>Zero Garbage</strong>. All strings ("01", "02"...) are pre-allocated.
                        This prevents the JavaScript Garbage Collector from pausing the clock to clean up memory.
                    </p>
                </div>
            </div>
        </div>

        {/* USE CASES */}
        <div className="space-y-4 pb-10">
            <h2 className="text-2xl font-bold text-white">🚀 Ideal Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 rounded border border-slate-800">
                    <div className="text-2xl mb-2">⚽</div>
                    <h4 className="font-bold text-white mb-1">Sports Graphics</h4>
                    <p className="text-xs text-slate-500">Live match timers that must match the TV broadcast feed exactly.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded border border-slate-800">
                    <div className="text-2xl mb-2">📉</div>
                    <h4 className="font-bold text-white mb-1">Trading Desks</h4>
                    <p className="text-xs text-slate-500">Market opening countdowns where timing is financial law.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded border border-slate-800">
                    <div className="text-2xl mb-2">🎮</div>
                    <h4 className="font-bold text-white mb-1">Live Gaming</h4>
                    <p className="text-xs text-slate-500">Speed-run timers or tournament clocks overlaying heavy game UIs.</p>
                </div>
            </div>
        </div>
        {/* BROWSER SUPPORT */}
        <div className="pb-10 border-t border-slate-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">🌏 Browser Support</h2>
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400">
                        <tr>
                            <th className="p-4">Browser</th>
                            <th className="p-4">Version</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 text-slate-300">
                        <tr>
                            <td className="p-4 font-bold text-white">Chrome / Edge</td>
                            <td className="p-4 font-mono">69+</td>
                            <td className="p-4 text-green-400">Fully Supported</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-white">Firefox</td>
                            <td className="p-4 font-mono">105+</td>
                            <td className="p-4 text-green-400">Fully Supported</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-white">Safari (macOS/iOS)</td>
                            <td className="p-4 font-mono">16.4+</td>
                            <td className="p-4 text-green-400">Fully Supported</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-xs text-slate-500">
                * Requires <code>OffscreenCanvas</code> and <code>Web Worker</code> support.
                Older browsers will throw a runtime error.
            </p>
        </div>

        {/* FRAMEWORK SUPPORT */}
        <div className="pb-10 border-t border-slate-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">🔌 Framework Support</h2>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    {/* React Logo Placeholder (Text for now) */}
                    <span className="text-6xl font-black text-blue-900">⚛️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Built for React</h3>
                <p className="text-slate-400 relative z-10 text-sm leading-relaxed max-w-lg">
                    This library currently exports a <strong>React Component</strong> (<code>&lt;DNMClock /&gt;</code>) and a set of hooks.
                    It requires <code>react</code> version 18+ as a peer dependency.
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-xs text-blue-300">
                    Peer Dependency: React 18+
                </div>

                <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-800">
                    <em><strong>Note:</strong> The underlying <code>clock.worker.ts</code> engine is framework-agnostic. Vue/Svelte bindings can be implemented by porting the `DNMClock` wrapper.</em>
                </p>
            </div>
        </div>
    </div>
);

const QuickStartSection = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h1 className="text-4xl font-bold text-white mb-4">Quick Start</h1>
        <p className="text-lg text-slate-400 mb-6">
            Get up and running with <strong>dnm-clock</strong> in seconds.
        </p>

        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-3">1. Installation</h3>
                <div className="space-y-4">
                    <div className="w-full">
                        <CodeBlock language="bash" code={`npm install dnm-clock`} />
                    </div>
                    <div className="w-full">
                        <CodeBlock language="bash" code={`yarn add dnm-clock`} />
                    </div>
                    <div className="w-full">
                        <CodeBlock language="bash" code={`pnpm add dnm-clock`} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-3">2. Import</h3>
                <div className="w-full">
                    <CodeBlock language="typescript" code={`import { DNMClock } from 'dnm-clock';`} />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-3">3. Usage</h3>
                <p className="text-slate-400 mb-3 text-sm">
                    Drop the component into your app. It works out of the box with default settings.
                </p>
                <div className="w-full">
                    <CodeBlock language="tsx" code={`export const MyTimer = () => {
  return (
    <div style={{ width: '300px', height: '100px' }}>
      <DNMClock className="w-full h-full" autoStart={true}/>
    </div>
  );
};`} />
                </div>

                <h4 className="text-sm font-bold text-slate-500 mt-4 mb-2">Option B: Standard CSS / Inline Style</h4>
                <p className="text-slate-400 mb-3 text-sm">
                    No Tailwind? No problem. Use standard CSS or inline styles.
                </p>
                <div className="w-full">
                    <CodeBlock language="tsx" code={`export const MyTimer = () => {
  return (
    <div style={{ width: '300px', height: '100px' }}>
      {/* 
        The clock will fill the parent container.
        You can also pass standard style objects directly.
      */}
      <DNMClock style={{ width: '100%', height: '100%' }} autoStart={true}/>
    </div>
  );
};`} />
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-3">4. Result</h3>
                <p className="text-slate-400 mb-3 text-sm">
                    A precise, drift-free clock rendering in a worker thread.
                </p>
                <div className="h-32 w-full max-w-md bg-slate-900 rounded border border-slate-700 relative overflow-hidden">
                    <DNMClock
                        className="w-full h-full"
                        autoStart={true}
                    />
                </div>
            </div>
        </div>
    </div>
);

const ApiSection = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
            <p className="text-lg text-slate-400">
                The core component of the library is <code>DNMClock</code>. It accepts the following props:
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
                    <tr>
                        <td className="p-4 font-mono text-blue-400">countDirection</td>
                        <td className="p-4 font-mono text-purple-400">'UP' | 'DOWN'</td>
                        <td className="p-4 font-mono text-slate-500">'UP'</td>
                        <td className="p-4">The initial counting direction.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-white mb-4">ClockStyleConfig</h2>
            <div className="w-full">
                <CodeBlock language="typescript" code={`interface ClockStyleConfig {
  backgroundColor: string; // Hex or RGBA
  textColor: string;       // Hex or RGBA
  fontFamily: string;      // Valid CSS font-family
  fontSize?: string;       // e.g. "40px" (optional override)
  fontWeight?: string;     // e.g. "700" (optional override)
  glowEffect: boolean;     // Enable text-shadow glow
  showDot: boolean;        // Show the pulsing "worker active" dot
  timeFormat?: string;     // "hh:mm:ss", "mm:ss", "m:ss", "s"
}`} />
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
                    Supports flexible formats like <code>hh:mm:ss</code>, <code>mm:ss</code>, or even single digit <code>m:s</code>.
                    Use the interactive playground below to generate your style config.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* PREVIEW */}
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</h3>
                        <div className="h-64 rounded-lg overflow-hidden border border-slate-600 bg-black relative">
                            <DNMClock
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
                    <div className="h-full flex flex-col">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Generated Code</h3>
                        <div className="flex-1">
                            <CodeBlock language="tsx" code={`<DNMClock 
  config={{
    backgroundColor: '${config.backgroundColor}',
    textColor: '${config.textColor}',
    fontFamily: "${config.fontFamily}",
    glowEffect: ${config.glowEffect},
    showDot: ${config.showDot},
    timeFormat: '${config.timeFormat}'
  }}
/>`} />
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
                        <DNMClock
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
                        <button onClick={() => handleAction('Direction DOWN', () => controller.current?.setDirection('DOWN'))} className="p-3 bg-purple-900/30 text-purple-400 border border-purple-900/50 rounded hover:bg-purple-900/50 font-mono text-sm">.setDirection</button>
                    </div>
                </div>

                {/* CODE */}
                <div className="w-full">
                    <CodeBlock language="tsx" code={`// 1. Create a ref
const controller = useRef(null);

// 2. Pass to component
<DNMClock controllerRef={controller} />

// 3. call methods anywhere
<button onClick={() => controller.current.start()}>
  Start
</button>

<button onClick={() => controller.current.setDirection('DOWN')}>
  Count Down
</button>`} />
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
                ⚽ Sports Match Clock
            </h3>
            <p className="text-sm text-slate-400">Fixed width monospace font for stable digit alignment.</p>
            <div className="h-32 bg-black rounded border border-slate-700 relative overflow-hidden">
                <DNMClock
                    config={{
                        backgroundColor: '#000',
                        textColor: '#fbbf24', // Amber
                        fontFamily: '"Courier New", monospace',
                        glowEffect: false,
                        showDot: false,
                        timeFormat: 'mm:ss'
                    }}
                    initialSeconds={5400} // 90 mins
                    className="w-full h-full"
                    autoStart={true}
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
                <DNMClock
                    config={{
                        backgroundColor: 'transparent',
                        timeFormat: 'hh:mm:ss'
                    }}
                    className="h-12 w-32"
                    initialSeconds={34200} // 09:30:00
                    autoStart={true}
                />
            </div>
        </div>


        {/* NEW YORK TIMES SQUARE */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Count down
            </h3>
            <p className="text-sm text-slate-400">Countdown to zero, stopping automatically. High impact style.</p>
            <div className="h-40 bg-black rounded border border-slate-700 relative overflow-hidden">
                <DNMClock
                    config={{
                        backgroundColor: '#000000',
                        textColor: '#ff00ff',
                        fontFamily: 'Impact, sans-serif',
                        glowEffect: true,
                        showDot: false,
                        timeFormat: 's'
                    }}
                    initialSeconds={10}
                    countDirection="DOWN"
                    stopAtZero={true}
                    autoStart={true}
                    className="w-full h-full"
                />
            </div>
        </div>
    </div >
);
