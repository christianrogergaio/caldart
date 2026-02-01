@echo off
echo ===================================================
echo   Iniciando Aplicativo Android (AgroMonitor)
echo ===================================================
echo.
cd mobile_app

echo Verificando dependencias...
if exist "C:\Program Files\nodejs\npm.cmd" (
    call "C:\Program Files\nodejs\npm.cmd" install
) else (
    call npm install
)

echo Limpando cache antigo para evitar erros...
if exist ".expo" rd /s /q .expo

echo.
echo Iniciando Expo...
echo [!] Escaneie o QR Code abaixo com o app Expo Go no seu Android.
echo.
if exist "C:\Program Files\nodejs\npx.cmd" (
    call "C:\Program Files\nodejs\npx.cmd" expo start --clear
) else (
    call npx expo start --clear
)
pause
