// src/autosolver.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performClicksBeforeTyping, performClicksAfterTyping } from './utils/clicker.js';
import { typeLikeHuman } from './utils/typer.js';
import { fetchCodeFromLLM } from './llm.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CODE_DIR = path.join(__dirname, '..', 'data', 'code');
const QUESTION_DIR = path.join(__dirname, '..', 'data', 'questions');

async function solveQuestion(codeId) {
  const codeFile = path.join(CODE_DIR, `${codeId}.c`);            // changed to .c
  const questionFile = path.join(QUESTION_DIR, `${codeId}.txt`);
  let codeToType;

  if (fs.existsSync(codeFile)) {
    console.log(`✅ Found code for ${codeId}. Using local file.`);
    codeToType = fs.readFileSync(codeFile, 'utf-8');
  } else if (fs.existsSync(questionFile)) {
    console.log(`🤖 No code found for ${codeId}. Calling LLM...`);
    const prompt = fs.readFileSync(questionFile, 'utf-8');
    codeToType = await fetchCodeFromLLM(prompt, codeId); // <-- still passing codeId
    if (!codeToType) {
      console.error('❌ LLM failed to return valid code.');
      return;
    }
    fs.writeFileSync(codeFile, codeToType);             // save with .c
    console.log(`💾 Code saved to ${codeFile}`);
  } else {
    console.error(`❌ No code or question found for ${codeId}`);
    return;
  }

  await performClicksBeforeTyping();
  await typeLikeHuman(codeToType);
  await performClicksAfterTyping();
}

// Example usage
const codeId = process.argv[2] || ''; // Default if none provided
solveQuestion(codeId);
