#!/usr/bin/env bash
# PatientTriage.ai One-Command Full-Stack Launcher for macOS/Linux

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "============================================================"
echo "  PatientTriage.ai - Full Stack Emergency Command Center"
echo "  Triage is a snapshot. Risk isn't."
echo "============================================================"

# Check for virtual environment
if [ -d ".venv" ]; then
    PYTHON_CMD="./.venv/bin/python"
elif command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "[1/2] Starting FastAPI Backend on http://localhost:8000 ..."
$PYTHON_CMD -m uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

sleep 2

echo "[2/2] Starting React Frontend on http://localhost:5173 ..."
cd frontend
npm run dev

