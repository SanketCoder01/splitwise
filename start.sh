#!/bin/bash

echo "Starting ResuChain Application..."
echo

echo "[1/4] Starting MySQL Database..."
echo "Make sure MySQL is running on port 3306"
echo "Database: resuchain_db"
echo

echo "[2/4] Starting AI Service..."
cd ai-service
source venv/bin/activate 2>/dev/null || echo "Virtual environment not found, using system Python"
python main.py &
AI_PID=$!
cd ..
sleep 5

echo "[3/4] Starting Backend Service..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..
sleep 10

echo "[4/4] Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "ResuChain Application Started!"
echo "========================================"
echo "Frontend: http://localhost:3000"
echo "Backend:   http://localhost:8080"
echo "AI Service: http://localhost:8001"
echo "========================================"
echo
echo "Press Ctrl+C to stop all services..."

# Function to cleanup processes
cleanup() {
    echo "Stopping all services..."
    kill $AI_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user input
wait
