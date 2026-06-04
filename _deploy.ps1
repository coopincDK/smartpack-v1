# SmartPack Deploy Script
# Brug: ./_deploy.ps1 "Din commit-besked"
# Bumper automatisk footer.js + header.js version med timestamp

param(
  [string]$msg = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 
)

$root = $PSScriptRoot
$ts   = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

Write-Host "Bumper JS-versioner til v$ts..." -ForegroundColor Cyan

$count = 0
Get-ChildItem $root -Recurse -Filter '*.html' | ForEach-Object {
  $txt = [IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8)
  $ny  = $txt -replace 'footer\.js\?v=\d+', "footer.js?v=$ts"
  $ny  = $ny  -replace 'header\.js\?v=\d+', "header.js?v=$ts"
  $ny  = $ny  -replace 'main\.js\?v=\d+',   "main.js?v=$ts"
  if ($ny -ne $txt) {
    [IO.File]::WriteAllText($_.FullName, $ny, [Text.Encoding]::UTF8)
    $count++
  }
}

Write-Host "$count filer opdateret." -ForegroundColor Green

Set-Location $root
git add -A
git commit -m $msg
git push origin main

Write-Host "
Done! Live om ca. 2 min." -ForegroundColor Green
