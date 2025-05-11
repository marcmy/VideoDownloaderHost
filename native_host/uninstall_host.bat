@echo off
setlocal

set HOST_NAME=com.marc.video_downloader
set HOST_DIR=%USERPROFILE%\VideoDownloaderHost

REM Remove registry key
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST_NAME%" /f

REM Delete folder and contents
if exist "%HOST_DIR%" (
    rmdir /s /q "%HOST_DIR%"
)

echo.
echo Native messaging host uninstalled.
pause
