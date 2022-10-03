#!/bin/bash
echo "Building Windows executable..."
deno compile --allow-read --allow-write --output ./build/windows/TripAdvisorCleaner --target x86_64-pc-windows-msvc index.ts 
cd ./build/windows
zip -r windows.zip .
cd ../../
echo "Building Linux executable..."
deno compile --allow-read --allow-write --output ./build/linux/TripAdvisorCleaner --target x86_64-unknown-linux-gnu index.ts
cd ./build/linux
zip -r linux.zip .