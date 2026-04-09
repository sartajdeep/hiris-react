@echo off
REM Batch file to start all HIRIS applications
REM Run this from the root hiris-react directory

echo Starting HIRIS Backend API...
start "HIRIS API" cmd /k "cd hiris-api && npm start"

echo Starting Hiring Assistant App...
start "Hiring Assistant" cmd /k "cd hiris-react && npm run dev"

echo Starting Professor App...
start "Professor App" cmd /k "cd hiris-professor && npm run dev"

echo Starting CHRO App...
start "CHRO App" cmd /k "cd hiris-chro-app && npm run dev"

echo All applications are starting in separate command windows.
echo Close this window and check the other windows for any errors.