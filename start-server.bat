@echo off
echo ========================================
echo    PDF Toolkit Development Server
echo ========================================
echo.

cd /d "%~dp0pdf-toolkit"

echo Starting PDF Toolkit development server...
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

echo.
echo Server stopped.
pause
