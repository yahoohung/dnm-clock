import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface NaiveClockHandle {
    start: () => void;
    pause: () => void;
    setTime: (s: number) => void;
    adjustTime: (delta: number) => void;
}

// Pure Helper
// Pure Helper
const formatTime = (totalSeconds: number, format: string = 'hh:mm:ss'): string => {
    const absSeconds = Math.abs(totalSeconds);
    const hasHours = format.includes('hh');
    const hasMinutes = format.includes('mm');
    const hasSeconds = format.includes('ss');

    let remaining = absSeconds;
    let h = 0, m = 0, s = 0;

    if (hasHours) {
        h = Math.floor(remaining / 3600);
        remaining %= 3600;
    }

    if (hasMinutes) {
        m = Math.floor(remaining / 60);
        remaining %= 60;
    }

    if (hasSeconds) {
        s = remaining;
    }

    const hStr = h < 60 ? h.toString().padStart(2, '0') : h.toString(); // Naive doesn't have DIGITS cache
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');

    let timeText = format
        .replace('hh', hStr)
        .replace('mm', mStr)
        .replace('ss', sStr);

    return totalSeconds < 0 ? '-' + timeText : timeText;
};

export const NaiveClock = forwardRef<NaiveClockHandle, React.HTMLAttributes<HTMLDivElement> & { className?: string, timeFormat?: string }>(({ className, timeFormat = 'hh:mm:ss', ...props }, ref) => {
    const [displayTime, setDisplayTime] = useState(formatTime(0, timeFormat)); // Initial state
    const [isRunning, setIsRunning] = useState(false);

    // Internal mutable state for time calculation
    const state = useRef({
        startTime: 0,
        baseTime: 0, // ms
    });

    useImperativeHandle(ref, () => ({
        start: () => {
            if (isRunning) return;
            state.current.startTime = Date.now();
            setIsRunning(true);
        },
        pause: () => {
            if (!isRunning) return; // Already paused
            const now = Date.now();
            state.current.baseTime += (now - state.current.startTime);
            setIsRunning(false);
        },
        setTime: (seconds: number) => {
            state.current.baseTime = seconds * 1000;
            // If currently running, we must reset the start anchor to "now"
            // to prevent the old elapsed time from being added to the new base.
            if (isRunning) {
                state.current.startTime = Date.now();
            }
            setDisplayTime(formatTime(seconds, timeFormat));
        },
        adjustTime: (delta: number) => {
            state.current.baseTime += delta * 1000;
            // Force immediate update
            const now = Date.now();
            const diff = isRunning ? (now - state.current.startTime) : 0;
            const totalMs = state.current.baseTime + diff;
            const totalSec = Math.floor(totalMs / 1000);
            setDisplayTime(formatTime(totalSec, timeFormat));
        }
    }));

    useEffect(() => {
        if (!isRunning) return;

        // The "Naive" implementation:
        // 1. Runs on Main Thread
        // 2. Uses setInterval
        // 3. Triggers React Re-renders via setState
        // This will freeze completely if the Main Thread is blocked.
        const intervalId = setInterval(() => {
            const now = Date.now();
            const diff = now - state.current.startTime;
            const totalMs = state.current.baseTime + diff;
            const totalSec = Math.floor(totalMs / 1000);
            setDisplayTime(formatTime(totalSec, timeFormat));
        }, 50); // 20fps update

        return () => clearInterval(intervalId);
    }, [isRunning, timeFormat]);

    // Update display when format changes while paused
    useEffect(() => {
        if (!isRunning) {
            const totalSec = Math.floor(state.current.baseTime / 1000);
            setDisplayTime(formatTime(totalSec, timeFormat));
        }
    }, [timeFormat, isRunning]);

    return (
        <div className={`font-mono tabular-nums ${className}`} {...props}>
            {displayTime}
        </div>
    );
});

NaiveClock.displayName = 'NaiveClock';