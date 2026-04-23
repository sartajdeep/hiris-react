#!/usr/bin/env bash
# ============================================================
#  HIRIS — Start All Services
#  Run from the project root: bash start_all.sh
#  Requires: Node.js, npm, PostgreSQL running
# ============================================================

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         HIRIS — Starting All Services        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Kill any processes already on our ports ────────────────────────
echo "  Clearing ports 3001 and 5173..."
lsof -ti :3001 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
sleep 1
echo "  Ports cleared."
echo ""

# ── Step 2: Check node_modules ─────────────────────────────────────────────
check_deps() {
  local dir="$1"
  local name="$2"
  if [ ! -d "$dir/node_modules" ]; then
    echo "  node_modules missing in $name — running npm install..."
    (cd "$dir" && npm install --silent)
    echo "  ✓ $name dependencies installed."
  fi
}

check_deps "$ROOT/backend"      "backend"
check_deps "$ROOT/frontend/app" "frontend/app"

# ── Step 3: Validate .env has GEMINI_API_KEY ──────────────────────────────
if grep -q "your_gemini_api_key_here" "$ROOT/backend/.env" 2>/dev/null; then
  echo ""
  echo "  ⚠️  WARNING: GEMINI_API_KEY is not set in backend/.env"
  echo "     AI features will use fallback responses."
  echo "     Add your key: GEMINI_API_KEY=AIza..."
  echo ""
fi

# ── Step 4: Start services ─────────────────────────────────────────────────
echo "  [1/2] Starting Backend API          → http://localhost:3001"
(cd "$ROOT/backend" && npm run dev) &
API_PID=$!

sleep 2

echo "  [2/2] Starting HIRIS Platform       → http://localhost:5173"
(cd "$ROOT/frontend/app" && npm run dev -- --port 5173 --strictPort) &
FRONTEND_PID=$!

sleep 2

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   All services running. Press Ctrl+C to stop ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  HIRIS Platform   : http://localhost:5173"
echo "  Backend API      : http://localhost:3001"
echo "  API Docs         : http://localhost:3001/api-docs"
echo ""
echo "  Sign up          : http://localhost:5173/signup"
echo "  Login            : http://localhost:5173/login"
echo ""

# Graceful shutdown on Ctrl+C
trap "echo ''; echo '  Shutting down all services...'; lsof -ti :3001 | xargs kill -9 2>/dev/null; lsof -ti :5173 | xargs kill -9 2>/dev/null; kill $API_PID $FRONTEND_PID 2>/dev/null; echo '  Done. Goodbye!'; exit 0" SIGINT SIGTERM
wait
