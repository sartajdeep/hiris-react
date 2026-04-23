#!/bin/bash

# Define dark mode and animation CSS block to inject
CSS_BLOCK='
/* ── Dark Mode Overrides ────────────────────────────────────────────────── */
[data-theme="dark"] {
  --bg:          #0F172A;
  --surface:     #1E293B;
  --border:      #334155;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted:  #94A3B8;
  --navy:        #FFFFFF; /* Invert navy text to white in dark mode */
  --white:       #1E293B; /* White surfaces become dark slate */
}

/* ── Theme Toggle Component ─────────────────────────────────────────────── */
.theme-toggle {
  position: fixed;
  top: 16px;
  left: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}
.theme-toggle:hover {
  transform: scale(1.05);
  border-color: var(--teal);
  color: var(--teal);
}
.theme-toggle:active {
  transform: scale(0.95);
}

/* ── Global Transitions & Animations ────────────────────────────────────── */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.btn, .btn-primary, .btn-secondary, button {
  transition: transform 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn:active, .btn-primary:active, .btn-secondary:active, button:active {
  transform: scale(0.97);
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
.slide-in-right { animation: slideInRight 0.4s ease both; }

@keyframes pulseSubtle {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}
.pulse-subtle { animation: pulseSubtle 2s infinite; }
'

# Append to landing
echo "$CSS_BLOCK" >> frontend/landing/src/index.css

# Append to CHRO
echo "$CSS_BLOCK" >> frontend/chro/src/index.css

# Append to hiring-assistant
echo "$CSS_BLOCK" >> frontend/hiring-assistant/src/index.css

# Append to professor
echo "$CSS_BLOCK" >> frontend/professor/src/index.css

echo "CSS updated successfully!"
