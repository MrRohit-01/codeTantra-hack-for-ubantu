from pynput import keyboard
import subprocess
import os
import time
from threading import Thread
from src.utils.id_tracker import get_current_question_id, increment_question_id

node_process = None
is_running = False
stop_requested = False
MAX_QUESTIONS = 20

def run_automation_loop():
    global node_process, is_running, stop_requested

    for _ in range(MAX_QUESTIONS):
        if stop_requested:
            print("🛑 Stop requested. Exiting automation loop.")
            break

        print("📸 Extracting question from screen...")
        result = subprocess.run(["python", "question-extract.py"])
        if result.returncode != 0:
            print("❌ Failed to extract question. Exiting loop.")
            break

        time.sleep(1)
        code_id = get_current_question_id()
        if not code_id:
            print("❌ Could not fetch question ID. Exiting loop.")
            break

        script_path = os.path.join("src", "autosolver.js")
        node_process = subprocess.Popen(["node", script_path, code_id])
        print(f"✍️ Typing started for {code_id}...")

        node_process.wait()

        if stop_requested:
            break

        new_id = increment_question_id()
        print(f"🔁 Moved to next question: {new_id}")
        time.sleep(2)

    print("✅ Automation loop completed or stopped.")
    is_running = False
    stop_requested = False

def toggle_automation():
    global is_running, stop_requested, node_process

    if not is_running:
        print("🚀 Starting automation...")
        is_running = True
        stop_requested = False
        Thread(target=run_automation_loop).start()
    else:
        print("🛑 Stopping automation...")
        stop_requested = True
        if node_process:
            try:
                node_process.terminate()
                print("⛔️ Node process terminated.")
            except Exception as e:
                print(f"⚠️ Error stopping node process: {e}")

# Bind backtick (`) to start/stop automation loop
hotkey = keyboard.GlobalHotKeys({
    '`': toggle_automation
})

print("✅ Listening... Press ` to START/STOP automation.")
hotkey.start()
hotkey.join()
