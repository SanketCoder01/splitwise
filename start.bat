@echo off
echo Starting ResuChain Application...
echo.

echo [1/4] Starting MySQL Database...
echo Make sure MySQL is running on port 3306
echo Database: resuchain_db
echo.

echo [2/4] Starting AI Service...
cd ai-service
start "AI Service" cmd /k "python main.py"
cd ..
timeout /t 5

echo [3/4] Starting Backend Service...
cd backend
start "Backend" cmd /k "mvn spring-boot:run"
cd ..
timeout /t 10

echo [4/4] Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo ResuChain Application Started!
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:   http://localhost:8080
echo AI Service: http://localhost:8001
echo ========================================
echo.
echo Press any key to exit...
pause
