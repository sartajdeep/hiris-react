@echo off
REM Batch file to start all HIRIS applications from the project root
REM Ensure you have run 'npm install' in all directories first.

echo [SYSTEM] Starting HIRIS Ecosystem...

echo [1/4] Starting HIRIS Backend API...
start "HIRIS API" cmd /k "cd hiris-api && npm start"

echo [2/4] Starting Hiring Assistant Dashboard...
REM Run directly from this root directory
start "Hiring Assistant" cmd /k "npm run dev"

echo [3/4] Starting Professor Dashboard...
start "Professor App" cmd /k "cd hiris-professor && npm run dev"

echo [4/4] Starting CHRO Dashboard...
start "CHRO App" cmd /k "cd hiris-chro-app && npm run dev"

echo.
echo [SUCCESS] All systems are initiating in separate windows.
echo API: http://localhost:3001
echo Hiring Assistant: http://localhost:5173
echo Professor App: http://localhost:5174
echo CHRO App: http://localhost:5175
echo.
echo Close this window once terminals appear.
timeout /t 10