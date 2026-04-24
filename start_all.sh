#!/usr/bin/env bash
# ============================================================
#  HIRIS — Start All Services
#  Run from the project root: bash start_all.sh
#  Requires: Node.js, npm, PostgreSQL running
# ============================================================

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         HIRIS — Starting All Services        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

echo "  Clearing ports 3001, 5173, 5174, 5175, 5176..."
lsof -ti :3001 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
lsof -ti :5174 | xargs kill -9 2>/dev/null || true
lsof -ti :5175 | xargs kill -9 2>/dev/null || true
lsof -ti :5176 | xargs kill -9 2>/dev/null || true
sleep 1
echo "  Ports cleared."
echo ""

check_deps() {
  local dir="$1"
  local name="$2"
  if [ ! -d "$dir/node_modules" ]; then
    echo "  node_modules missing in $name — running npm install..."
    (cd "$dir" && npm install)
  fi
}

check_deps "$ROOT/backend"                   "backend"
check_deps "$ROOT/frontend/landing"          "frontend/landing"
check_deps "$ROOT/frontend/hiring-assistant" "frontend/hiring-assistant"
check_deps "$ROOT/frontend/professor"        "frontend/professor"
check_deps "$ROOT/frontend/chro"             "frontend/chro"

echo ""
echo "  [1/5] Starting Backend API          → http://localhost:3001"
(cd "$ROOT/backend" && npm run dev) &
API_PID=$!

sleep 1

echo "  [2/5] Starting Landing Website      → http://localhost:5176"
(cd "$ROOT/frontend/landing" && npm run dev -- --strictPort) &
LAND_PID=$!

echo "  [3/5] Starting Hiring Manager     → http://localhost:5173"
(cd "$ROOT/frontend/hiring-assistant" && npm run dev -- --strictPort) &
HA_PID=$!

echo "  [4/5] Starting Professor Portal     → http://localhost:5174"
(cd "$ROOT/frontend/professor" && npm run dev -- --strictPort) &
PROF_PID=$!

echo "  [5/5] Starting CHRO Portal          → http://localhost:5175"
(cd "$ROOT/frontend/chro" && npm run dev -- --strictPort) &
CHRO_PID=$!

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   All services running. Press Ctrl+C to stop ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Landing Website      : http://localhost:5176"
echo "  Hiring Manager     : http://localhost:5173"
echo "  Professor Portal     : http://localhost:5174"
echo "  CHRO Portal          : http://localhost:5175"
echo "  Backend API          : http://localhost:3001"
echo ""
echo "  Sign up your organisation at http://localhost:5176/signup"
echo "  Login at http://localhost:5176/login"
echo ""

trap 'echo ""; echo "Shutting down all services..."; lsof -ti :3001 | xargs kill -9 2>/dev/null || true; lsof -ti :5173 | xargs kill -9 2>/dev/null || true; lsof -ti :5174 | xargs kill -9 2>/dev/null || true; lsof -ti :5175 | xargs kill -9 2>/dev/null || true; lsof -ti :5176 | xargs kill -9 2>/dev/null || true; kill $API_PID $LAND_PID $HA_PID $PROF_PID $CHRO_PID 2>/dev/null; exit 0' SIGINT SIGTERM
wait
