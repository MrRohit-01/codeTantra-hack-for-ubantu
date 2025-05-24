// src/utils/clicker.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { mouse, Point, Button } from '@nut-tree-fork/nut-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const positionsPath = path.join(__dirname, '..', '..', 'data', 'positions.json');

// Wrap everything in an async function to allow top-level `await` loading
let positions;
try {
  const rawData = await fs.readFile(positionsPath, 'utf-8');
  positions = JSON.parse(rawData);
} catch (err) {
  console.error('Failed to read positions.json:', err);
  positions = { before: [], after: [] }; // fallback
}

// ✅ Exported functions
export async function performClicksBeforeTyping() {
  for (const [x, y] of positions.before) {
    await mouse.setPosition(new Point(x, y));
    await mouse.click(Button.LEFT);
  }
}

export async function performClicksAfterTyping() {
  for (let i = 0; i < positions.after.length; i++) {
    const [x, y] = positions.after[i];
    await mouse.setPosition(new Point(x, y));
    await mouse.click(Button.LEFT);

    // Wait 2s before the last 2 clicks
    if (i === positions.after.length - 2 || i === positions.after.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  }
}
