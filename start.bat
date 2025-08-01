@echo off
echo 🚀 Activating virtual environment...

REM Activate the virtual environment (adjust path if needed)
call myenv\Scripts\activate

echo ✅ myenv activated.
echo 🚀 Starting React and Streamlit apps...

REM 1. Start React frontend (e.g., using Vite at port 5173)
start cmd /k "npm run dev -- --port 5173"

REM 2. Start first Streamlit app at port 8501 (uses active myenv)
start cmd /k "cd streamlit_app && call ..\myenv\Scripts\activate && streamlit run app.py --server.port 8501"

REM 3. Start Python backend API on port 5000 (uses active myenv)
start cmd /k "cd finaljournalb\emotion-journal-backend && call ..\..\myenv\Scripts\activate && python app.py"

REM 4. Start emotional journal frontend (React) on port 3000
start cmd /k "cd finaljournalb\emotional-journal && npm start"

REM 4. Start emotional journal frontend (React) on port 3000
start cmd /k "cd selfcarefinalb\ && npm start -- --port 3002"


echo ✅ All apps are starting in separate terminals...
