import { keyboard, Key } from "@nut-tree-fork/nut-js";

const avgWPM = 110;
const autoClosedChars = new Set([')', '}', ']', '"', "'"]);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function getDelay(char) {
  const base = 60000 / (avgWPM * 5);
  const variance = Math.random() * base * 0.2;
  if (char === "\n") return base * 1.8 + variance;
  if (char === " ") return base * 0.4 + variance;
  return base + variance;
}

export async function typeLikeHuman(text) {
  const lines = text.split("\n");

  for (let rawLine of lines) {
    let line = rawLine.trimStart();

    let i = 0;
    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      // Skip if character is auto-closed by the IDE
      if (autoClosedChars.has(char)) {
        i++;
        continue;
      }

      // Occasionally simulate typo
      if (Math.random() < 0.01 && /[a-zA-Z]/.test(char)) {
        await keyboard.type("z");
        await keyboard.pressKey(Key.Backspace);
        await keyboard.releaseKey(Key.Backspace);
      }

      await keyboard.type(char);

      // If next character is an auto-closed one, move the cursor right
      if (autoClosedChars.has(nextChar)) {
        await keyboard.pressKey(Key.Right);
        await keyboard.releaseKey(Key.Right);
      }

      await delay(getDelay(char));
      i++;
    }

    // Press enter at the end of each line
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);
    await delay(getDelay("\n"));
  }
}
