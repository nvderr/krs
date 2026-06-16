@echo off
setlocal

set "EXT=%USERPROFILE%\.vscode\extensions\krs.krs-language-0.1.0"
set "SRC=%~dp0"

if exist "%EXT%" rmdir /s /q "%EXT%"

xcopy /E /I /Y "%SRC%*" "%EXT%\" >nul

echo Krs extension installed to %EXT%
echo Reload VS Code: Ctrl+Shift+P -^> Developer: Reload Window

endlocal
