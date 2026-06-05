#!/usr/bin/env pwsh
# Starts the backend (.NET minimal API) and frontend (Vite) together.
# Press Ctrl+C to stop both.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

# Single source of truth for ports and the backend message.
# Override by setting these env vars before running the script.
if (-not $env:BACKEND_PORT)  { $env:BACKEND_PORT = '5122' }
if (-not $env:FRONTEND_PORT) { $env:FRONTEND_PORT = '5173' }
if (-not $env:MESSAGE)       { $env:MESSAGE = 'Hello world' }
$env:ASPNETCORE_ENVIRONMENT = 'Development'

Write-Host 'Starting backend and frontend...' -ForegroundColor Cyan

$backend = Start-Process -FilePath 'dotnet' `
    -ArgumentList 'run', '--project', 'backend', '--no-launch-profile' `
    -WorkingDirectory $root -PassThru -NoNewWindow

$frontend = Start-Process -FilePath 'cmd.exe' `
    -ArgumentList '/c', 'npm', 'run', 'dev' `
    -WorkingDirectory (Join-Path $root 'frontend') -PassThru -NoNewWindow

Write-Host "Backend  -> http://localhost:$($env:BACKEND_PORT)/api/hello" -ForegroundColor Green
Write-Host "Frontend -> http://localhost:$($env:FRONTEND_PORT)" -ForegroundColor Green
Write-Host 'Press Ctrl+C to stop both.' -ForegroundColor Cyan

try {
    while (-not $backend.HasExited -and -not $frontend.HasExited) {
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host "`nStopping..." -ForegroundColor Yellow
    foreach ($p in @($backend, $frontend)) {
        if ($p -and -not $p.HasExited) {
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
