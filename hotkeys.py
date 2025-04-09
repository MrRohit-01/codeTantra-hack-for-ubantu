import keyboard
import subprocess

is_typing = False
node_process = None

def toggle_typing():
    global is_typing, node_process
    if is_typing:
        if node_process:
            node_process.terminate()
        print("⏹️ Typing stopped.")
        is_typing = False
    else:
        node_process = subprocess.Popen(["node", "autoTyper.js"])
        print("⏳ Typing started...")
        is_typing = True

# Use Ctrl+Shift+T as start/stop
keyboard.add_hotkey('ctrl+shift+t', toggle_typing)

print("✅ Global listener running. Press Ctrl+Shift+T to start/stop typing.")
keyboard.wait()  # Keeps the script running
