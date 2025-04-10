import os
from PIL import Image
import pytesseract
import re
import unicodedata

# -------- Settings --------
input_folder = "../codeTantra/code-image"
output_folder = "../codeTantra/questions"
os.makedirs(output_folder, exist_ok=True)

# -------- Cleaning Utility --------
def clean_ocr_text(text):
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    return text.strip()

# -------- Process Each Image --------
processed, skipped = 0, 0

for filename in os.listdir(input_folder):
    if not filename.lower().endswith((".png", ".jpg", ".jpeg")):
        continue

    image_path = os.path.join(input_folder, filename)
    img = Image.open(image_path)

    # ---------- Crop ----------
    question_code_crop = img.crop((0, 10, 500, 150))  # Top-left area
    question_body_crop = img.crop((0, 50, img.width // 2, img.height))  # Left-side main body

    # ---------- OCR ----------
    raw_code = pytesseract.image_to_string(question_code_crop, config="--psm 6")
    raw_body = pytesseract.image_to_string(question_body_crop, config="--psm 6")

    question_code_text = clean_ocr_text(raw_code)
    question_body_text = clean_ocr_text(raw_body)

    # ---------- Regex ----------
    match = re.search(r'(\d{1,2}\.\d{1,2}(?:\.\d{1,2})?)', question_code_text)
    if not match:
        print(f"❌ Skipping {filename} - Question code not found")
        continue

    question_code = match.group()
    output_path = os.path.join(output_folder, f"{question_code}.txt")

    if os.path.exists(output_path):
        print(f"⏭️  Skipped (already exists): {question_code}.txt")
        skipped += 1
        continue

    # ---------- Save ----------
    with open(output_path, "w") as f:
        f.write(f"Question Code: {question_code}\n\n")
        f.write(question_body_text)

    print(f"✅ Saved: {question_code}.txt")
    processed += 1

# -------- Summary --------
print("\n--- DONE ---")
print(f"✅ Total saved: {processed}")
print(f"⏭️  Skipped (already existed): {skipped}")
    