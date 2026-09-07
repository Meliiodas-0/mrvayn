param(
  [Parameter(Mandatory = $true)][string]$SourceVideo,
  [string]$Ffmpeg = 'ffmpeg'
)

$ErrorActionPreference = 'Stop'
$source = (Resolve-Path -LiteralPath $SourceVideo).Path
$destination = Join-Path (Split-Path -Parent $PSScriptRoot) 'public\projects'
if (!(Test-Path -LiteralPath $destination -PathType Container)) {
  throw 'Run from the portfolio repository with public/projects present.'
}

# Preserve one complete live/replay pair from the native 60 fps master.
# LIVE 04 begins at frame 5401, LIVE 05 at 6658: 1257 frames, 20.95 seconds.
& $Ffmpeg -hide_banner -loglevel error -nostdin -y -ss 90.0166667 -i $source `
  -map 0:v:0 -frames:v 1257 -vf 'scale=1280:720:flags=lanczos,setsar=1' `
  -c:v libx264 -preset slow -crf 23 -threads 6 -maxrate 4000k -bufsize 8000k `
  -pix_fmt yuv420p -movflags +faststart -an -map_metadata -1 -map_chapters -1 `
  (Join-Path $destination 'cricket-broadcast-preview.mp4')
if ($LASTEXITCODE -ne 0) { throw 'Cricket preview encoding failed.' }

# Full-frame poster: contact view with batsman, ball and broadcast graphics intact.
& $Ffmpeg -hide_banner -loglevel error -nostdin -y -ss 100 -i $source `
  -frames:v 1 -vf 'scale=1280:720:flags=lanczos' -q:v 2 -update 1 `
  (Join-Path $destination 'cricket-broadcast.jpg')
if ($LASTEXITCODE -ne 0) { throw 'Cricket poster export failed.' }

Get-Item -LiteralPath (Join-Path $destination 'cricket-broadcast-preview.mp4'), (Join-Path $destination 'cricket-broadcast.jpg') |
  Select-Object Name, Length
