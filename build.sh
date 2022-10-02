#!/bin/bash
echo "Building Windows executable..."
deno compile --allow-read --allow-write --output ./build/TripAdvisorCleaner --target x86_64-pc-windows-msvc index.ts 
echo "Building Linux executable..."
deno compile --allow-read --allow-write --output ./build/TripAdvisorCleaner --target x86_64-unknown-linux-gnu index.ts