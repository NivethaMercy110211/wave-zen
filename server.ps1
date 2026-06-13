# Simple PowerShell static file server
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "Server started on http://localhost:$port/"
} catch {
    Write-Error "Failed to start listener: $_"
    exit
}

$currentDir = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $urlPath = $request.Url.LocalPath
        
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Prevent path traversal
        $normalizedPath = $urlPath.Replace("/", "\").TrimStart('\')
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($currentDir, $normalizedPath))
        
        if (-not $filePath.StartsWith($currentDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            
            # Simple mime type resolver
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".htm" { $response.ContentType = "text/html" }
                ".css" { $response.ContentType = "text/css" }
                ".js" { $response.ContentType = "application/javascript" }
                ".png" { $response.ContentType = "image/png" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".gif" { $response.ContentType = "image/gif" }
                ".svg" { $response.ContentType = "image/svg+xml" }
                ".mp4" { $response.ContentType = "video/mp4" }
                ".webm" { $response.ContentType = "video/webm" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $utf8 = New-Object System.Text.UTF8Encoding
            $msgBytes = $utf8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msgBytes.Length
            $response.OutputStream.Write($msgBytes, 0, $msgBytes.Length)
        }
    } catch {
        Write-Warning "Error handling request: $_"
    } finally {
        if ($response) {
            $response.Close()
        }
    }
}
