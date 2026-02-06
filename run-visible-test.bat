@echo off
REM Quick Start - Visible Torrent Power Automation Test
REM This will open browser and show real form filling automation

echo.
echo ========================================================
echo    VISIBLE TORRENT POWER AUTOMATION TEST
echo ========================================================
echo.
echo Starting automation - browser will open in ~5 seconds...
echo Watch as the form fields get filled automatically!
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Activate Python environment if needed
REM call venv\Scripts\activate

REM Run the test
python test_visible_automation.py

echo.
echo ========================================================
echo    AUTOMATION COMPLETE!
echo ========================================================
echo.
pause
