import { keyboard, Key } from "@nut-tree-fork/nut-js";
import fs from "fs/promises";

// Configuration
const filePath = "./code.txt";
const avgWPM = 40; // words per minute
let text = await fs.readFile(filePath, "utf-8");
let index = 0;

// Helper to calculate delay between characters
function getDelay(char) {
  const base = 60000 / (avgWPM * 5); // average char time
  const variance = Math.random() * base * 0.4;
  if (char === "\n") return base * 2 + variance;
  if (char === " ") return base * 0.5 + variance;
  return base + variance;
}

// Convert character to nut.js key
function charToKey(char) {
  const keyMap = {
    "\n": Key.Return,
    "\t": Key.Tab,
    " ": Key.Space,
  };

  if (keyMap[char]) return keyMap[char];

  const upper = char.toUpperCase();
  if (/[A-Z]/.test(upper)) return Key[upper];

  return null; // fallback to type
}

// Typing function
async function typeChar() {
  if (index >= text.length) {
    console.log("✅ Done typing!");
    process.exit(0);
    return;
  }

  const char = text[index];

  // Simulate typo with 2% probability
  if (Math.random() < 0.02 && /[a-zA-Z]/.test(char)) {
    const typo = String.fromCharCode(char.charCodeAt(0) + 1);
    await keyboard.type(typo);
    await keyboard.pressKey(Key.Backspace);
    await keyboard.releaseKey(Key.Backspace);
  }

  if (char === "\n") {
    await keyboard.pressKey(Key.Return);
    await keyboard.releaseKey(Key.Return);
  } else if (char === "\t") {
    await keyboard.pressKey(Key.Tab);
    await keyboard.releaseKey(Key.Tab);
  } else {
    await keyboard.type(char);
  }

  index++;
  const delay = getDelay(char);
  setTimeout(typeChar, delay);
}

console.log("✍️ Typing...");
typeChar();
