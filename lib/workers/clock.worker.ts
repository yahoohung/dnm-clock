/**
 * ============================================================================
 * MODULE: High-Precision Mission Clock Kernel (Dedicated Worker)
 * * SECURITY LEVEL: STRICT (CSP Compliant - worker-src 'self')
 * * PERFORMANCE: Zero-Allocation Loop
 * ============================================================================
 */

// Note: We export as string to ensure portability without bundler reliance for worker loading
// Note: We export as string to ensure portability without bundler reliance for worker loading
export const CLOCK_WORKER_SCRIPT = `
// -- Global Scope --
let canvas = null;
let ctx = null;
let animationFrameId = null;

// [OPTIMISATION] Pre-allocate strings (00-59).
// Eliminates string allocation during the render loop.
const DIGITS = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const state = {
  baseTimeMs: 0,
  startTimeMs: 0,
  isRunning: false,
  lastRenderedSecond: -1,
  width: 0,
  height: 0,
  dpr: 1,
  countDirection: 1, // 1 for UP, -1 for DOWN
  stopAtZero: false,
  config: {
    backgroundColor: '#0f172a',
    textColor: '#22c55e',
    fontFamily: "'Courier New', monospace",
    glowEffect: true,
    showDot: true
  }
};

function paint(displaySeconds) {
  // Safety check
  if (!ctx || state.width === 0 || state.height === 0) return;
  
  const { width, height, dpr, config } = state;

  // 1. Clear Buffer
  ctx.clearRect(0, 0, width, height);

  // 2. Background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 50: Typography
  // Adaptive font size based on container, unless explicit override provided.
  let fontSize;
  if (config.fontSize) {
    fontSize = typeof config.fontSize === 'number' ? \`\${config.fontSize}px\` : config.fontSize;
  } else {
    // [FIX] Adjusted divisor from 5 to 6.5 to prevent horizontal clipping of the glow effect
    // and ensuring the 8-character string (00:00:00) fits comfortably with margins.
    fontSize = \`\${Math.min(width / 6.5, height / 1.5)}px\`;
  }

  const fontWeight = config.fontWeight || 'bold';
  ctx.font = \`\${fontWeight} \${fontSize} \${config.fontFamily}\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 4. Time String Composition (Zero GC)
  const absSeconds = Math.abs(displaySeconds);
  const format = config.timeFormat || 'hh:mm:ss';
  
  // Parse format requirements - Check for ANY presence of time units
  const hasHours = format.includes('h');
  const hasMinutes = format.includes('m');
  const hasSeconds = format.includes('s');

  let remaining = absSeconds;
  
  // Calculate values
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

  // Format strings
  // Double digits (padded)
  const hhStr = h < 60 ? DIGITS[h] : h.toString().padStart(2, '0');
  const mmStr = m < 60 ? DIGITS[m] : m.toString().padStart(2, '0');
  const ssStr = s < 60 ? DIGITS[s] : s.toString().padStart(2, '0');
  
  // Single digits (unpadded)
  const hStr = h.toString();
  const mStr = m.toString();
  const sStr = s.toString();

  // Replace tokens - CRITICAL: Replace double digits FIRST to avoid partial matches
  let timeText = format
    .replace('hh', hhStr)
    .replace('mm', mmStr)
    .replace('ss', ssStr)
    .replace('h', hStr)
    .replace('m', mStr)
    .replace('s', sStr);
  
  // Simple prefix for negative
  if (displaySeconds < 0) {
    timeText = '-' + timeText;
  }

  // 5. Draw Text
  ctx.fillStyle = config.textColor;
  if (config.glowEffect) {
    ctx.shadowColor = config.textColor;
    ctx.shadowBlur = 20 * dpr;
  } else {
    ctx.shadowBlur = 0;
  }
  ctx.fillText(timeText, width / 2, height / 2);
  
  // 6. Alive Indicator (Red Dot)
  if (config.showDot && absSeconds % 2 === 0) {
    ctx.beginPath();
    const dotRadius = fontSize / 12;
    // Position dot relative to width, but ensure it doesn't overlap text area too much
    const dotX = width - (dotRadius * 4);
    const dotY = dotRadius * 4;
    
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = config.glowEffect ? 10 * dpr : 0;
    ctx.fill();
  }
}

function loop() {
  if (!state.isRunning) return;

  const now = performance.now();
  const elapsedMs = now - state.startTimeMs;
  
  // Apply direction to the elapsed time
  // If UP (1): total = base + elapsed
  // If DOWN (-1): total = base - elapsed
  let totalMs = state.baseTimeMs + (elapsedMs * state.countDirection);

  // Stop at zero check
  if (state.stopAtZero && state.countDirection === -1 && totalMs <= 0) {
      totalMs = 0;
      state.isRunning = false;
      state.baseTimeMs = 0;
      state.lastRenderedSecond = 0;
      paint(0);
      return; 
  }
  
  const currentSecond = Math.floor(totalMs / 1000);

  // [OPTIMISATION] Dirty Check: Only paint if the second has changed
  if (currentSecond !== state.lastRenderedSecond) {
    state.lastRenderedSecond = currentSecond;
    paint(currentSecond);
  }

  animationFrameId = requestAnimationFrame(loop);
}

self.onmessage = function(e) {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT':
      canvas = payload.canvas;
      // desynchronized: true hints to UA to skip composition for lower latency
      ctx = canvas.getContext('2d', { 
        alpha: false, 
        desynchronized: true 
      });
      
      state.config = payload.config;
      state.baseTimeMs = payload.initialSeconds * 1000;
      state.baseTimeMs = payload.initialSeconds * 1000;
      state.lastRenderedSecond = payload.initialSeconds;
      state.countDirection = payload.countDirection === 'DOWN' ? -1 : 1;
      state.stopAtZero = payload.stopAtZero;
      
      // [FIX] Initialize dimensions from canvas to ensure first paint works
      if (canvas) {
        state.width = canvas.width;
        state.height = canvas.height;
      }
      
      paint(payload.initialSeconds);
      break;

    case 'RESIZE':
      // [FIX] Critical: Resize the backing bitmap store.
      // Ensures 1:1 pixel mapping for sharp text on high DPI.
      if (canvas) {
          canvas.width = payload.width;
          canvas.height = payload.height;
      }
      state.width = payload.width;
      state.height = payload.height;
      state.dpr = payload.dpr;
      
      // Force repaint immediately
      if (state.lastRenderedSecond >= 0) {
          paint(state.lastRenderedSecond);
      }
      break;

    case 'UPDATE_CONFIG':
      state.config = payload;
      if (state.lastRenderedSecond >= 0) paint(state.lastRenderedSecond);
      break;

    case 'START':
      if (state.isRunning) return;
      state.isRunning = true;
      state.startTimeMs = performance.now();
      animationFrameId = requestAnimationFrame(loop);
      break;

    case 'PAUSE':
      if (!state.isRunning) return;
      state.isRunning = false;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      
      // Accumulate elapsed time correctly based on direction
      const elapsed = performance.now() - state.startTimeMs;
      state.baseTimeMs += (elapsed * state.countDirection);
      break;

    case 'SET_TIME':
      state.baseTimeMs = payload.seconds * 1000;
      if (state.isRunning) {
        state.startTimeMs = performance.now();
      }
      state.lastRenderedSecond = payload.seconds;
      paint(payload.seconds);
      break;

    case 'SET_DIRECTION':     
      const newDirection = payload.direction === 'UP' ? 1 : -1;
      if (state.countDirection === newDirection) return;

      // Consolidate current time before switching
      if (state.isRunning) {
        const now = performance.now();
        const elapsed = now - state.startTimeMs;
        state.baseTimeMs += (elapsed * state.countDirection);
        state.startTimeMs = now; // Reset anchor
      }

      state.countDirection = newDirection;
      
      // Force repaint to reflect any immediate calculation diffs?
      // Actually baseTimeMs is exact now, so valid.
      // But if we are paused, no visual change until start or setTime.
      break;

    case 'ADJUST_TIME':
      // payload.deltaSeconds can be positive or negative
      state.baseTimeMs += payload.deltaSeconds * 1000;
      
      // Calculate current total immediately for UI feedback
      let currentTotalMs = state.baseTimeMs;
      if (state.isRunning) {
        const elapsed = performance.now() - state.startTimeMs;
        currentTotalMs += (elapsed * state.countDirection);
      }
      
      const newSecond = Math.floor(currentTotalMs / 1000);
      state.lastRenderedSecond = newSecond;
      paint(newSecond);
      break;
  }
};
`;