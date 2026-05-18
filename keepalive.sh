#!/bin/bash
cd /home/z/my-project
while true; do
  node .next/standalone/server.js &
  PID=$!
  echo "Started server PID: $PID at $(date)"
  # Wait for process to die
  wait $PID 2>/dev/null
  echo "Server died at $(date), restarting in 2s..."
  sleep 2
done
