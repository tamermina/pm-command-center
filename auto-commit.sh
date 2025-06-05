#!/bin/bash
while true; do
  if [[ `git status --porcelain` ]]; then
    git add .
    git commit -m "Auto-update: $(date)"
    git push
    echo "Changes pushed at $(date)"
  fi
  sleep 30  # Check every 30 seconds
done