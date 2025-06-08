# Create a basic SVG logo for SwarmSight

# Create branding directory if it doesn't exist
if (-not (Test-Path -Path "branding")) {
    New-Item -ItemType Directory -Path "branding"
}

# SVG content for a simple logo
$svgLogo = @"
<svg width="500" height="150" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 48px 'Montserrat', sans-serif; fill: #0066FF; }
    .tagline { font: 20px 'Open Sans', sans-serif; fill: #555555; }
    .hex { fill: #0066FF; }
    .hex-light { fill: #0099FF; }
    .hex-highlight { fill: #FFD700; }
  </style>
  
  <!-- Hexagon pattern representing a swarm -->
  <g transform="translate(60, 75)">
    <polygon class="hex" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(30, 0)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-30, 0)" />
    <polygon class="hex-highlight" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(15, 26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-15, 26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(15, -26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-15, -26)" />
  </g>
  
  <!-- Text elements -->
  <text x="160" y="85" class="title">SwarmSight</text>
  <text x="160" y="115" class="tagline">Advanced security analysis for blockchain ecosystems</text>
</svg>
"@

# Write the SVG to a file
$svgLogo | Out-File -FilePath "branding/swarmsight_logo.svg" -Encoding utf8

# Create a white version for dark backgrounds
$svgLogoWhite = $svgLogo -replace 'fill: #0066FF;', 'fill: #FFFFFF;' `
                         -replace 'fill: #0099FF;', 'fill: #CCCCCC;' `
                         -replace 'fill: #555555;', 'fill: #DDDDDD;'

$svgLogoWhite | Out-File -FilePath "branding/swarmsight_logo_white.svg" -Encoding utf8

# Create a smaller icon-only version
$svgIcon = @"
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <style>
    .hex { fill: #0066FF; }
    .hex-light { fill: #0099FF; }
    .hex-highlight { fill: #FFD700; }
  </style>
  
  <!-- Hexagon pattern representing a swarm -->
  <g transform="translate(50, 50)">
    <polygon class="hex" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(30, 0)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-30, 0)" />
    <polygon class="hex-highlight" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(15, 26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-15, 26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(15, -26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-15, -26)" />
  </g>
</svg>
"@

$svgIcon | Out-File -FilePath "branding/swarmsight_icon.svg" -Encoding utf8

# Create a horizontal layout version
$svgHorizontal = @"
<svg width="600" height="100" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 40px 'Montserrat', sans-serif; fill: #0066FF; }
    .tagline { font: 16px 'Open Sans', sans-serif; fill: #555555; }
    .hex { fill: #0066FF; }
    .hex-light { fill: #0099FF; }
    .hex-highlight { fill: #FFD700; }
  </style>
  
  <!-- Hexagon pattern representing a swarm -->
  <g transform="translate(50, 50) scale(0.8)">
    <polygon class="hex" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(30, 0)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-30, 0)" />
    <polygon class="hex-highlight" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(15, 26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-15, 26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(15, -26)" />
    <polygon class="hex-light" points="0,20 17.3,10 17.3,-10 0,-20 -17.3,-10 -17.3,10" transform="translate(-15, -26)" />
  </g>
  
  <!-- Text elements -->
  <text x="120" y="50" class="title">SwarmSight</text>
  <text x="120" y="75" class="tagline">Advanced security analysis for blockchain ecosystems</text>
</svg>
"@

$svgHorizontal | Out-File -FilePath "branding/swarmsight_logo_horizontal.svg" -Encoding utf8

Write-Host "Logo files created in the branding directory."
