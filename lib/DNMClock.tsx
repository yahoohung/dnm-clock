import React, { useEffect, useRef, useMemo } from 'react';
import { CLOCK_WORKER_SCRIPT } from './workers/clock.worker';

/**
 * Configuration options for the clock's visual appearance.
 */
export interface ClockStyleConfig {
  /** Background color of the canvas (CSS color string) */
  backgroundColor: string;
  /** Color of the digits (CSS color string) */
  textColor: string;
  /** Font family for the digits (monospace recommended) */
  fontFamily: string;
  /** Whether to show a glow/shadow effect behind digits */
  glowEffect: boolean;
  /** Whether to show the pulsing activity dot indicating worker status */
  showDot: boolean;
  /** Time format string e.g. "hh:mm:ss", "mm:ss", "m:ss", "s" (default: "hh:mm:ss") */
  timeFormat?: string;
  /** Optional fixed font size (e.g. "20px" or 20). If omitted, scales responsively. */
  fontSize?: string | number;
  /** Optional font weight (e.g. "700", "bold"). Default: "bold" */
  fontWeight?: string | number;
}

const DEFAULT_CONFIG: ClockStyleConfig = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontFamily: "Arial, sans-serif",
  glowEffect: false,
  showDot: true,
  timeFormat: 'hh:mm:ss',
};

/**
 * Props for the DNMClock component.
 */
// [FIX] Extend HTMLAttributes to allow data-testid etc.
export interface DNMClockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial time in seconds to display (default: 0) */
  initialSeconds?: number;
  /** Optional style configuration overrides */
  config?: Partial<ClockStyleConfig>;
  /** CSS class names for the container div */
  className?: string;
  /** 
   * Mutable ref to access imperative controls (start/pause/setTime).
   * Useful when controlling the clock from a parent component or external store.
   */
  controllerRef?: React.MutableRefObject<any>;
  /** Automatically start the clock when the component mounts */
  autoStart?: boolean;
  /** Initial counting direction (default: 'UP') */
  countDirection?: 'UP' | 'DOWN';
  /** Whether to stop automatically when reaching zero (default: false) */
  stopAtZero?: boolean;
}

export const DNMClock = ({
  initialSeconds = 0,
  config = {},
  className = "",
  controllerRef,
  autoStart = false,
  countDirection = 'UP',
  stopAtZero = false,
  ...props
}: DNMClockProps) => {

  // [FIX] Ref points to container DIV, not Canvas directly
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const activeConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  useEffect(() => {
    if (!containerRef.current) return;

    // ------------------------------------------------------------------------
    // [FIX] React 18 Strategy: Imperative Creation
    // We manually create Canvas to avoid React Render cycle interference.
    // This ensures that every time the Effect runs (Worker init), we have a
    // fresh, non-transferred Canvas element. Solves "InvalidStateError".
    // ------------------------------------------------------------------------
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    containerRef.current.appendChild(canvas);

    // Worker Instantiation (Blob URL for portability)
    const blob = new Blob([CLOCK_WORKER_SCRIPT], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    workerRef.current = worker;

    // Transfer Control
    // Since canvas is freshly created, it will not throw InvalidStateError
    const offscreen = canvas.transferControlToOffscreen();

    worker.postMessage(
      {
        type: 'INIT',
        payload: {
          canvas: offscreen,
          config: activeConfig,
          initialSeconds,
          countDirection,
          stopAtZero
        }
      },
      [offscreen]
    );

    if (autoStart) {
      worker.postMessage({ type: 'START' });
    }

    // ResizeObserver: Watch container size
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;

        worker.postMessage({
          type: 'RESIZE',
          payload: {
            // Send physical pixel dimensions
            width: Math.round(width * dpr),
            height: Math.round(height * dpr),
            dpr: dpr
          }
        });
      }
    });
    observer.observe(containerRef.current);

    // Controller Binding for Parent Access
    if (controllerRef) {
      controllerRef.current = {
        start: () => worker.postMessage({ type: 'START' }),
        pause: () => worker.postMessage({ type: 'PAUSE' }),
        setTime: (s: number) => worker.postMessage({ type: 'SET_TIME', payload: { seconds: s } }),
        adjustTime: (delta: number) => worker.postMessage({
          type: 'ADJUST_TIME',
          payload: { deltaSeconds: delta }
        }),
        setDirection: (direction: 'UP' | 'DOWN') => worker.postMessage({
          type: 'SET_DIRECTION',
          payload: { direction } // 'UP' or 'DOWN'
        })
      };
    }

    // Cleanup
    return () => {
      observer.disconnect();
      worker.terminate();
      workerRef.current = null;
      URL.revokeObjectURL(workerUrl);

      // [FIX] Important: Manually remove canvas to keep DOM clean
      if (containerRef.current && containerRef.current.contains(canvas)) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, []); // Empty dependency ensures logic runs once per mount cycle

  // Dynamic Config Update
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'UPDATE_CONFIG',
        payload: activeConfig
      });
    }
  }, [activeConfig]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      {...props}
      // Ensure min-height before canvas loads
      style={{ minHeight: '1px' }}
    />
  );
};