$env:PATH="$PWD\.node\node-v22.14.0-win-x64;"+$env:PATH
Write-Host "----------------------------------------" -ForegroundColor Green
Write-Host "✅ Portable Node.js Environment Activated!" -ForegroundColor Green
Write-Host "Node: $(node -v)"
Write-Host "NPM: $(npm -v)"
Write-Host "----------------------------------------" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run any npm command (like 'npm run dev' or 'npm run launch')." -ForegroundColor Cyan
