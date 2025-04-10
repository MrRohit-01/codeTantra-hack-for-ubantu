from pynput import keyboard
import subprocess

is_typing = False
node_process = None

def on_activate():
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

# Changed hotkey to backtick (`) key
hotkey = keyboard.GlobalHotKeys({
    '`': on_activate
})

print("✅ Global listener running. Press ` (backtick) to start/stop typing.")
hotkey.start()
hotkey.join()
