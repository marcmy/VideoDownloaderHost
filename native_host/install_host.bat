@echo off
setlocal enabledelayedexpansion

REM === CONFIG ===
set HOST_NAME=com.marc.video_downloader
set EXTENSION_ID=lfknfhiejeoecofpkhimecphodbjjgli

REM === INSTALL PATH ===
set HOST_DIR=%USERPROFILE%\VideoDownloaderHost
set NATIVE_EXE=%HOST_DIR%\native_host.exe
set MANIFEST_FILE=%HOST_DIR%\%HOST_NAME%.json
set DOWNLOADER=%HOST_DIR%\downloader.py

REM === CREATE INSTALL DIR ===
if not exist "%HOST_DIR%" (
    mkdir "%HOST_DIR%"
)

REM === COPY FILES ===
copy /Y "native_host.exe" "%NATIVE_EXE%" >nul
copy /Y "downloader.py" "%DOWNLOADER%" >nul

REM === WRITE MANIFEST ===
(
echo {
echo   "name": "%HOST_NAME%",
echo   "description": "Video downloader native messaging host",
echo   "path": "%NATIVE_EXE:\=\\%",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://%EXTENSION_ID%/"
echo   ]
echo }
) > "%MANIFEST_FILE%"

REM === REGISTER HOST ===
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST_NAME%" /ve /t REG_SZ /d "%MANIFEST_FILE%" /f >nul

echo.
echo Native host installed successfully.
echo Files copied to: %HOST_DIR%
echo.
pause
