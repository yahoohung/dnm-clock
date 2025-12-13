import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useBroadcastMatchTimer } from '../useBroadcastMatchTimer';

// We need a way to trigger messages "from" the worker back to the hook.
let workerOnMessageCallback: ((e: MessageEvent) => void) | null = null;

const mockPostMessage = vi.fn();
const mockTerminate = vi.fn();

class MockHookWorker {
  constructor() {
    workerOnMessageCallback = null;
  }
  set onmessage(handler: (e: MessageEvent) => void) {
    workerOnMessageCallback = handler;
  }
  postMessage = mockPostMessage;
  terminate = mockTerminate;
}

describe('useBroadcastMatchTimer Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (window as any).Worker = MockHookWorker;
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
    workerOnMessageCallback = null;
    vi.spyOn(console, 'error').mockImplementation(() => { }); // Suppress error logs for negative test

    // Mock performance.now explicitly
    vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('updates state when Worker sends TICK message', () => {
    const { result } = renderHook(() => useBroadcastMatchTimer(0));
    act(() => { result.current.start(); });
    // vi.advanceTimersByTime(2000);
    // Update our mock time
    (performance.now as any).mockReturnValue(2000);

    act(() => {
      if (workerOnMessageCallback) {
        workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent);
      }
    });
    expect(result.current.displayTime).toBe('00:00:02');
  });

  it('pauses correctly', () => {
    const { result } = renderHook(() => useBroadcastMatchTimer(0));
    act(() => { result.current.start(); });
    // Forward 5s
    (performance.now as any).mockReturnValue(5000);

    act(() => { if (workerOnMessageCallback) workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent); });

    act(() => { result.current.pause(); });
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'STOP' });
  });

  it('handles setTime correctly', () => {
    const { result } = renderHook(() => useBroadcastMatchTimer(0));
    act(() => { result.current.setTime(120); });
    expect(result.current.displayTime).toBe('00:02:00');
  });

  it('terminates worker on unmount (Memory Leak Prevention)', () => {
    const { unmount } = renderHook(() => useBroadcastMatchTimer(0));
    unmount();
    expect(mockTerminate).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('gracefully handles Worker initialization failure', () => {
    // Force Worker to throw during construction
    (window as any).Worker = class BadWorker {
      constructor() { throw new Error('Security Error'); }
    };

    const { result } = renderHook(() => useBroadcastMatchTimer(0));

    // Should not crash, but also won't run.
    expect(result.current.displayTime).toBe('00:00:00');
    expect(console.error).toHaveBeenCalledWith('Clock Worker Init Failed:', expect.any(Error));
  });

  // --- NEW COUNTDOWN TESTS ---

  it('counts down from a start time', () => {
    // Start at 10 seconds, set direction DOWN
    const { result } = renderHook(() => useBroadcastMatchTimer(10));

    act(() => { result.current.setDirection('DOWN'); });
    expect(result.current.countDirection).toBe('DOWN');

    act(() => { result.current.start(); });

    // Advance 3 seconds
    (performance.now as any).mockReturnValue(3000);
    act(() => { if (workerOnMessageCallback) workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent); });

    // Should be 10 - 3 = 7
    expect(result.current.totalSeconds).toBe(7);
    expect(result.current.displayTime).toBe('00:00:07');
  });

  it('switches direction mid-count correctly', () => {
    const { result } = renderHook(() => useBroadcastMatchTimer(0));
    act(() => { result.current.start(); });

    // 1. Count UP for 5 seconds
    (performance.now as any).mockReturnValue(5000);
    act(() => { if (workerOnMessageCallback) workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent); });
    expect(result.current.totalSeconds).toBe(5);

    // 2. Switch to DOWN
    // Note: setDirection will re-base time. 
    // current total = 5000ms. New base = 5000ms. New start = 5000ms.
    act(() => { result.current.setDirection('DOWN'); });

    // 3. Advance another 2 seconds (total real time 7000ms)
    // Formula: base(5000) - (now(7000) - start(5000)) = 5000 - 2000 = 3000
    (performance.now as any).mockReturnValue(7000);
    act(() => { if (workerOnMessageCallback) workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent); });

    expect(result.current.totalSeconds).toBe(3);
  });

  it('pauses correctly while counting down', () => {
    const { result } = renderHook(() => useBroadcastMatchTimer(10));
    act(() => { result.current.setDirection('DOWN'); });
    act(() => { result.current.start(); });

    // Advance 4s -> should be 6s
    (performance.now as any).mockReturnValue(4000);
    act(() => { if (workerOnMessageCallback) workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent); });
    expect(result.current.totalSeconds).toBe(6);

    // Pause
    act(() => { result.current.pause(); });
    // baseDuration should be updated to ~6000ms
    expect(result.current.isRunning).toBe(false);

    // Advance real time (should not affect timer)
    (performance.now as any).mockReturnValue(10000);
    act(() => { if (workerOnMessageCallback) workerOnMessageCallback({ data: { type: 'TICK' } } as MessageEvent); });

    expect(result.current.totalSeconds).toBe(6);
  });
});