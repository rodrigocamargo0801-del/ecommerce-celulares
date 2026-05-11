@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║         🚀 E-COMMERCE DE CELULARES - INICIALIZAR 🚀          ║
echo ║                                                                ║
echo ║              Abrindo 2 Terminais Automaticamente              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝

timeout /t 2 /nobreak

REM Obter diretório atual
setlocal enabledelayedexpansion
set "PROJECT_DIR=%cd%"

echo.
echo ✅ Iniciando Backend (Terminal 1)...
echo.

REM Abrir Terminal 1 com Backend
start cmd /k "cd /d "%PROJECT_DIR%\backend" && npm install && npm run dev"

timeout /t 5 /nobreak

echo.
echo ✅ Iniciando Frontend (Terminal 2)...
echo.

REM Abrir Terminal 2 com Frontend
start cmd /k "cd /d "%PROJECT_DIR%\frontend" && python -m http.server 5500"

timeout /t 3 /nobreak

cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   ✅ SISTEMA INICIADO COM SUCESSO!           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📊 BACKEND RODANDO EM:
echo    http://localhost:3000
echo.
echo 🌐 FRONTEND RODANDO EM:
echo    http://localhost:5500
echo    http://192.168.15.195:5500 (celular/tablet)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🎯 PRÓXIMAS ETAPAS:
echo.
echo   1. Abrir no PC:
echo      → http://localhost:5500
echo.
echo   2. Abrir no Celular/Tablet:
echo      → http://192.168.15.195:5500
echo.
echo   3. Fazer Login:
echo      Email: joao@email.com
echo      Senha: senha123456
echo.
echo   4. Fazer uma Compra Completa!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🔑 ADMIN (Opcional):
echo    Email: rodrigocamargo0801@gmail.com
echo    Senha: senha123456
echo    URL: http://localhost:5500/admin.html
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo ❌ Para Parar:
echo    Feche os 2 Terminais que abriram
echo.
echo 📖 Para Mais Informações:
echo    Leia: ACESSAR_TODOS_DISPOSITIVOS.md
echo       ou INICIAR.md
echo.
echo ═══════════════════════════════════════════════════════════════════

pause
