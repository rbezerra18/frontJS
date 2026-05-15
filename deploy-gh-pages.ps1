<#
  deploy-gh-pages.ps1
  Script PowerShell para desplegar el contenido del directorio actual
  a la rama `gh-pages` del remote `origin`.

  Uso:
    Ejecutar desde la carpeta del proyecto:
      .\deploy-gh-pages.ps1

  Nota: Este script inicializa un repositorio temporal, copia los archivos
  (excluyendo la carpeta .git y scripts), crea la rama gh-pages y hace push
  forzado al remote. Asegúrate de tener configurado el acceso SSH/HTTPS.
#>

Set-StrictMode -Version Latest
try {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
} catch {
    $scriptDir = Get-Location
}

Push-Location $scriptDir

# Obtener URL del remote origin
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Error "No se encontró un remote 'origin'. Configura el remote y vuelve a intentarlo."
    Pop-Location
    exit 1
}

$tmp = Join-Path $env:TEMP "gh-pages-deploy"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path $tmp | Out-Null

# Archivos/dirs a excluir de la copia
$exclude = @('.git', '.github', 'deploy-gh-pages.ps1', 'deploy-gh-pages.sh')

Get-ChildItem -Path $scriptDir -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tmp -Recurse -Force
}

Push-Location $tmp

git init
git checkout -b gh-pages
git add .
try {
    git commit -m "Deploy site to gh-pages" | Out-Null
} catch {
    Write-Host "Advertencia: no hay cambios para commitear (posible deploy idéntico)." 
}

git remote add origin $remoteUrl
git push --force origin gh-pages

# Añadir .nojekyll para evitar procesamiento por Jekyll en GitHub Pages
if (-not (Test-Path ".nojekyll")) {
    New-Item -ItemType File -Name ".nojekyll" | Out-Null
    git add .nojekyll
    try { git commit -m "Add .nojekyll" | Out-Null } catch {}
    git push --force origin gh-pages
}

Pop-Location
Pop-Location

Write-Host "Despliegue finalizado: se subió a 'gh-pages' en $remoteUrl"
