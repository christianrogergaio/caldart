@echo off
echo ===================================================
echo   Iniciando AgroMonitor (Modo Web/Simulador)
echo ===================================================
echo.
cd mobile_app

echo Iniciando no Navegador...
if exist "C:\Program Files\nodejs\npx.cmd" (
    call "C:\Program Files\nodejs\npx.cmd" expo start --web
) else (
    call npx expo start --web
)
pause
