Get-ChildItem -Path "d:\wave and zen\wave&zen\*.html" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    
    # Match the tagline block in the original file
    $pattern = '(?s)<p class="footer-tagline">Ride the wave\. Find your zen\. Experience the coast in its most authentic form\.</p>'
    
    $replacement = @"
<p class="footer-tagline">
        <span class="tagline-main">Ride the wave. Find your zen. Experience the coast in its most authentic form.</span>
        <span class="tagline-sub">Our premium surf coaching and beach yoga retreats are designed to refresh your body, calm your mind, and reconnect your soul with the ocean.</span>
        <span class="tagline-extra">Chase the horizon. Embrace the breeze. Discover coastal beauty at its purest.</span>
      </p>
"@

    if ($content -match $pattern) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)
        [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Successfully updated tagline content in: $filePath"
    } else {
        Write-Warning "Pattern not found in: $filePath"
    }
}
