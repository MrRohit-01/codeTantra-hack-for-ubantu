#!/usr/bin/env python3
import time
import os
import subprocess
import platform
import datetime
import re
import unicodedata
import json
from PIL import Image
import pytesseract

# -------- Settings --------
output_folder = "../codeTantra/data/questions"
tracker_path = "./currentQuestionId.json"  # ✅ Update this file with the current ID
os.makedirs(output_folder, exist_ok=True)

SCREEN_REGION = (0, 0, 1000, 800)  # (left, top, width, height)

# -------- Cleaning Utilities --------
def clean_ocr_text(text):
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    text = re.sub(r'[ \t]+', ' ', text)  # remove extra spaces
    return text.strip()

def fix_linebreaks(text):
    lines = text.splitlines()
    fixed_lines = []
    buffer = ""

    for line in lines:
        line = line.strip()
        if not line:
            if buffer:
                fixed_lines.append(buffer.strip())
                buffer = ""
            continue
        # Assume a new sentence starts if the line ends with punctuation
        if buffer and not re.search(r'[.?!:]$', buffer):
            buffer += " " + line
        else:
            if buffer:
                fixed_lines.append(buffer.strip())
            buffer = line

    if buffer:
        fixed_lines.append(buffer.strip())

    fixed_text = "\n".join(fixed_lines)

    # Optional: Capitalize first letter of each line (sentence-level polish)
    fixed_text = "\n".join(
        line[0].upper() + line[1:] if line and line[0].islower() else line
        for line in fixed_text.split("\n")
    )
    return fixed_text

# -------- Screenshot Capture --------
timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
debug_image_path = f"../codeTantra/debug-capture-{timestamp}.png"

def is_wayland():
    return os.environ.get("XDG_SESSION_TYPE") == "wayland"

def take_screenshot():
    if is_wayland():
        print("⚠️ Wayland detected: Using grim to take screenshot")
        subprocess.run(["grim", debug_image_path])
        return Image.open(debug_image_path)
    else:
        time.sleep(2)
        import pyautogui
        screenshot = pyautogui.screenshot(region=SCREEN_REGION)
        screenshot.save(debug_image_path)
        return screenshot

screenshot = take_screenshot()

# ---------- Crop ----------
question_code_crop = screenshot.crop((0, 10, 500, 150))  # Top-left area
question_body_crop = screenshot.crop((0, 50, screenshot.width // 2, screenshot.height))  # Left-side main body

# ---------- OCR ----------
raw_code = pytesseract.image_to_string(question_code_crop, config="--psm 6")
raw_body = pytesseract.image_to_string(question_body_crop, config="--psm 6")

question_code_text = clean_ocr_text(raw_code)
question_body_text = fix_linebreaks(clean_ocr_text(raw_body))

# ---------- Regex ----------
match = re.search(r'(\d{1,2}\.\d{1,2}(?:\.\d{1,2})?)', question_code_text)
if not match:
    print(f"❌ Question code not found in screenshot")
    exit(1)

question_code = match.group()
output_path = os.path.join(output_folder, f"{question_code}.txt")

# ✅ Always update the tracker file
with open(tracker_path, "w") as f:
    json.dump({"id": question_code}, f, indent=2)
print(f"📌 Updated current ID: {question_code}")

# ---------- Save if not exists ----------
if os.path.exists(output_path):
    print(f"⏭️  Skipped (already exists): {question_code}.txt")
    exit(0)

with open(output_path, "w") as f:
    f.write(f"Question Code: {question_code}\n\n")
    f.write(question_body_text)

print(f"✅ Saved: {question_code}.txt")
