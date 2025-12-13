import { renderHook, act } from '@testing-library/react';
import { useBroadcastMatchTimer } from '../lib/useBroadcastMatchTimer';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Worker
class MockWorker {
    onmessage: ((e: MessageEvent) => void) | null = null;
    postMessage(data: any) {
        // Echo back TICK if START was sent, to simulate worker running?
        // Actually the hook relies on TICK from worker to update state.
        if (data.type === 'START') {
            // Simulate a tick immediately or asynchronously?
            // The hook listen to 'TICK'.
        }
    }
    terminate() { }
}

global.Worker = MockWorker as any;
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

describe('useBroadcastMatchTimer Formatting', () => {

    it('formats default hh:mm:ss correctly', () => {
        const { result } = renderHook(() => useBroadcastMatchTimer(3665)); // 1h 1m 5s
        expect(result.current.displayTime).toBe('01:01:05');
    });

    it('formats mm:ss correctly (minutes overflow)', () => {
        // 3665 seconds = 61 minutes, 5 seconds
        const { result } = renderHook(() => useBroadcastMatchTimer(3665, 'mm:ss'));
        expect(result.current.displayTime).toBe('61:05');
    });

    it('formats hh:mm correctly', () => {
        // 3665 seconds = 1h, 1m, 5s.
        // hh:mm -> 01:01. Seconds are ignored/truncated from display (but math shouldn't change).
        const { result } = renderHook(() => useBroadcastMatchTimer(3665, 'hh:mm'));
        expect(result.current.displayTime).toBe('01:01');
    });

    it('formats ss correctly (total seconds)', () => {
        const { result } = renderHook(() => useBroadcastMatchTimer(3665, 'ss'));
        expect(result.current.displayTime).toBe('3665');
    });

    it('formats mm correctly (total minutes)', () => {
        // 3665 / 60 = 61.08... -> 61
        const { result } = renderHook(() => useBroadcastMatchTimer(3665, 'mm'));
        expect(result.current.displayTime).toBe('61');
    });

    it('handles negative time', () => {
        const { result } = renderHook(() => useBroadcastMatchTimer(-65, 'mm:ss'));
        // -1m 5s? Logic says abs value formatted with prefix.
        // 65s -> 01:05. Prefix -> -01:05.
        expect(result.current.displayTime).toBe('-01:05');
    });

    it('updates format when prop changes', () => {
        const { result, rerender } = renderHook(
            ({ format }) => useBroadcastMatchTimer(3665, format),
            { initialProps: { format: 'hh:mm:ss' } }
        );
        expect(result.current.displayTime).toBe('01:01:05');

        rerender({ format: 'mm:ss' });
        expect(result.current.displayTime).toBe('61:05');
    });

});
