// src/llm.js
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// 🔧 Strips Markdown code fences (e.g., ```c)
function stripMarkdownCodeBlock(text) {
  return text
    .replace(/^```(?:c|C)?\n/, '') // Remove opening line like ``` or ```c
    .replace(/\n```$/, '')         // Remove closing ```
    .trim();
}

export async function fetchCodeFromLLM(prompt, codeId) {
  try {
    const body = {
      contents: [
        {
          parts: [
            {
              text:
                `You are a C programming expert. Only reply with **pure executable C code**.\n` +
                `Do NOT include comments, docstrings, explanations, markdown formatting, or any extra text.\n` +
                `Return ONLY the clean raw code.\n\n${prompt}`,
            },
          ],
        },
      ],
    };

    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`${res.status} ${res.statusText}: ${errText}`);
    }

    const data = await res.json();

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!rawText) {
      console.warn('⚠️ Gemini returned no usable content.');
      return null;
    }

    // 💾 Save full raw response
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const rawPath = path.join(RAW_DIR, `${codeId}_gemini_raw.json`);
    fs.writeFileSync(rawPath, JSON.stringify(data, null, 2));
    console.log(`📄 Full Gemini response saved to ${rawPath}`);

    // 🧠 Optional anchor match (if LLM adds it)
    const match = rawText.match(/#\s*Write your code here[\s\S]*/i);
    if (match) {
      return match[0].trim();
    }

    // 🧼 Fallback: strip markdown formatting
    console.warn('⚠️ No "# Write your code here" found. Returning stripped response.');
    return stripMarkdownCodeBlock(rawText);

  } catch (err) {
    console.error('❌ Error while calling Gemini:', err.message);
    return null;
  }
}
