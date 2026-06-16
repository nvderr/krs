@echo off
setlocal

cd /d "%~dp0runtime"
if errorlevel 1 (
  echo Error: runtime folder not found.
  exit /b 1
)

echo Installing Krs runtime...
call npm install
if errorlevel 1 exit /b 1

echo Linking krs command globally...
call npm link
if errorlevel 1 exit /b 1

if exist "%APPDATA%\npm\krs.ps1" (
  del /f /q "%APPDATA%\npm\krs.ps1"
  echo Removed krs.ps1 shim ^(PowerShell fix^).
)

echo.
echo Done! Reload your terminal:
echo   krs --version
echo   krs run examples\hello.krs
echo.

endlocal
