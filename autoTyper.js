import { keyboard, Key, mouse, screen, Point } from "@nut-tree-fork/nut-js";
import fs from "fs/promises";
import path from "path";

// Config
const baseFilename = "7.2";           // Base like 7.2.1, 7.2.2, ...
const maxFiles = 20;                  // Max number of files
const fileDirectory = "./code";       // Folder where files are
const positionsPath = "./positions.json"; // Mouse click positions
const avgWPM = 70;

const positions = JSON.parse(await fs.readFile(positionsPath, "utf-8"));
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

console.log("🚀 Starting automation...");

// WPM-based delay
function getDelay(char) {
  const base = 60000 / (avgWPM * 5);
  const variance = Math.random() * base * 0.2;
  if (char === "\n") return base * 1.8 + variance;
  if (char === " ") return base * 0.4 + variance;
  return base + variance;
}

// Human-like typing using built-in `keyboard.type()` (handles all chars)
async function typeText(text) {
  for (const char of text) {
    // Simulate an occasional typo
    if (Math.random() < 0.01 && /[a-zA-Z]/.test(char)) {
      await keyboard.type("z");
      await keyboard.pressKey(Key.Backspace);
      await keyboard.releaseKey(Key.Backspace);
    }

    await keyboard.type(char); // Handles everything including special chars
    await delay(getDelay(char));
  }
}

// Click handler
async function clickAt(index) {
  const pos = positions[index];
  if (!pos) return;
  await mouse.setPosition(new Point(pos[0], pos[1]));
  await mouse.leftClick();
  await delay(500);
}

// Main flow
for (let i = 1; i <= maxFiles; i++) {
  const filename = `${baseFilename}.${i}.py`;
  const fullPath = path.join(fileDirectory, filename);

  try {
    const code = await fs.readFile(fullPath, "utf-8");
    console.log(`✍️ Typing from file: ${filename}`);

    // Clicks before typing (e.g., set language)
    for (let j = 0; j < 3; j++) await clickAt(j);

    // Type the code
    await typeText(code);

    // Clicks after typing (e.g., submit, next)
    for (let j = 3; j < 5; j++) await clickAt(j);

    await delay(2000);
  } catch (err) {
    console.log(`❌ No more files. Stopped at: ${filename}`);
    continue;
  }
}

console.log("✅ Automation finished.");

dez