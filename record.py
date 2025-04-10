# record_clicks.py
from pynput import mouse, keyboard
import json

positions = []
count = 1

def on_click(x, y, button, pressed):
    pass  # We're only tracking hotkeys, not actual clicks

def on_press(key):
    global count
    if key == keyboard.Key.esc:
        with open("positions.json", "w") as f:
            json.dump(positions, f)
        print("✅ Saved positions:", positions)
        return False
    if hasattr(key, 'char') and key.char in "123456789":
        from pynput.mouse import Controller
        mouse_controller = Controller()
        pos = mouse_controller.position
        positions.append(pos)
        print(f"📍 Saved Position {count}: {pos}")
        count += 1

print("🎯 Hover and press 1, 2, 3... then Esc to finish.")
with keyboard.Listener(on_press=on_press) as k_listener:
    k_listener.join()
