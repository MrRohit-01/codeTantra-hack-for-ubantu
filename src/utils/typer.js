import { keyboard, Key } from "@nut-tree-fork/nut-js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const ultraFastDelay = () => 0;

const shiftedSymbols = {
  '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',
  ':': ';', '"': '\'', '<': ',', '>': '.', '?': '/',
  '~': '`',
};

// List of characters that require Shift key
function isShiftedChar(char) {
  return Object.keys(shiftedSymbols).includes(char);
}

async function typeChar(char) {
  if (isShiftedChar(char)) {
    await keyboard.pressKey(Key.LeftShift);
    await keyboard.type(shiftedSymbols[char]);
    await keyboard.releaseKey(Key.LeftShift);
  } else if (char >= 'A' && char <= 'Z') {
    await keyboard.pressKey(Key.LeftShift);
    await keyboard.type(char.toLowerCase());
    await keyboard.releaseKey(Key.LeftShift);
  } else {
    await keyboard.type(char);
  }
}

export async function typeLikeHuman(text) {
  const lines = text.split('\n');

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const rawLine = lines[lineIndex];
    const line = rawLine.replace(/^\s+/, ''); // remove leading whitespace

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '}') {
        // Use Down arrow instead of Enter to navigate to existing next line
        await keyboard.pressKey(Key.Down);
        await keyboard.releaseKey(Key.Down);

        // Move cursor to the beginning of line
        await keyboard.pressKey(Key.Home);
        await keyboard.releaseKey(Key.Home);

        continue; // skip typing }
      }

      await typeChar(char);
      await delay(ultraFastDelay());
    }

    // Newline if not the last line
    if (lineIndex < lines.length - 1) {
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
    }
  }
}
