@echo off
if exist "%APPDATA%\npm\krs.ps1" (
  del /f /q "%APPDATA%\npm\krs.ps1"
  echo Removed krs.ps1 — reload your terminal.
) else (
  echo krs.ps1 not found. Should work via krs.cmd
)
