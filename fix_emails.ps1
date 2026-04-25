$root = 'C:\Users\MartinMortensen\Desktop\SmartPack_v1'
$files = @('cases.html','faq.html','funktioner.html','index.html','integrationer.html','kontakt.html','om-os.html','priser.html')
foreach ($f in $files) {
    $path = Join-Path $root $f
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $updated = $content -replace 'kontakt@smartpack\.dk', 'bundlinjeboost@smartpack.dk'
    if ($content -ne $updated) {
        [System.IO.File]::WriteAllText($path, $updated, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated: $f"
    } else {
        Write-Host "No changes: $f"
    }
}
