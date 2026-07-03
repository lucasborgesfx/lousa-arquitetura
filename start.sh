#!/usr/bin/env bash
# Lousa de Arquitetura — start script
# P1: Lousa HTML (8890) + LikeC4 spike (5173)
# P2: Lesson App React (5174) — inclui LikeC4 embutido, não precisa do spike separado

set -e

SPIKE_DIR="/home/lusga/workspace/spikes/001-likec4-mind-bootstrap"
LOUSA_DIR="/home/lusga/projects/lousa-arquitetura"
LESSON_DIR="/home/lusga/projects/lousa-arquitetura/lesson-app"

mode="${1:-all}"

if [ "$mode" = "lesson" ] || [ "$mode" = "all" ]; then
  echo "→ Iniciando Lesson App (Story 2) em http://localhost:5174 …"
  cd "$LESSON_DIR"
  npm run dev -- --port 5174 &
  LESSON_PID=$!
fi

if [ "$mode" = "p1" ] || [ "$mode" = "all" ]; then
  echo "→ Iniciando LikeC4 spike em localhost:5173…"
  cd "$SPIKE_DIR"
  npx likec4 start --port 5173 &
  C4_PID=$!

  echo "→ Servindo Lousa P1 (legado) em http://localhost:8890/p1-html/…"
  cd "$LOUSA_DIR"
  npx --yes serve -p 8890 legacy &
  LOUSA_PID=$!
fi

sleep 2
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  Lousa de Arquitetura                                ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Lesson App (Story 2): http://localhost:5174         ║"
echo "║  Lousa P1 HTML (legado):http://localhost:8890/p1-html/║"
echo "║  LikeC4 standalone:    http://localhost:5173         ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Uso: ./start.sh [lesson|p1|all]"
echo "Ctrl+C para parar."

cleanup() {
  echo "Encerrando…"
  kill ${LESSON_PID:-} ${C4_PID:-} ${LOUSA_PID:-} 2>/dev/null || true
}
trap cleanup INT TERM
wait
