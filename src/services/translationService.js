const cache = {};
const queue = {};
const timers = {};

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATION_API_KEY;
const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
const DEBOUNCE_MS = 80;
const MAX_SEGMENTS = 128; // Google Translate API v2 limit per request

if (!API_KEY) {
  console.warn("[Translation] VITE_GOOGLE_TRANSLATION_API_KEY is not set. Translation will be disabled.");
}

/**
 * Static override map for translations that the Google API gets wrong.
 * Key: exact PT source string (must match the <T> child exactly).
 * Value: correct EN translation.
 * Add new entries here whenever a UI label is mistranslated.
 */
const TRANSLATION_OVERRIDES = {
  en: {
    "Início": "Home",
    "Sobre": "About",
    "Sair": "Logout",
    "ÁREA DIDÁTICA": "TEACHING AREA",
    "Área didática": "Teaching Area",
    "Voltar para o site": "Back to website",
    "Sobre o Telapsi": "About Telapsi",
    "Saiba mais": "Learn more",
    "Guias Didáticos": "Teaching Guides",
    "Planos de Aula": "Lesson Plans",
    "Perguntas Frequentes": "Frequently Asked Questions",
    "Vários Filmes": "Multiple Films",
  },
};

/**
 * Send a single batch of texts (max MAX_SEGMENTS) to the Google API.
 * Resolves each pending item with the translated text, or falls back to
 * the original on failure.
 */
async function sendBatch(pendingChunk, targetLang) {
  const texts = pendingChunk.map((item) => item.text);

  try {
    const response = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texts,
        source: "pt",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`[Translation] Google API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const translations = data.data.translations;

    if (!cache[targetLang]) cache[targetLang] = {};

    translations.forEach((result, i) => {
      const original = texts[i];
      const translated = result.translatedText;
      cache[targetLang][original] = translated;
      pendingChunk[i].resolve(translated);
    });
  } catch (error) {
    console.error("[Translation] Batch failed:", error.message);
    // On failure, gracefully return the original text
    pendingChunk.forEach((item) => item.resolve(item.text));
  }
}

/**
 * Flush the queued translation requests for a given language.
 * Splits the queue into chunks of MAX_SEGMENTS to stay within Google API limits.
 */
async function flushQueue(targetLang) {
  const pending = queue[targetLang] || [];
  if (pending.length === 0) return;

  // Clear the queue immediately so new requests go into the next batch
  queue[targetLang] = [];

  // Deduplicate: if the same text appears multiple times, only translate once
  const uniqueTexts = new Map(); // text → [list of pending items]
  for (const item of pending) {
    // Check cache first — resolve immediately for cache hits
    if (cache[targetLang]?.[item.text] !== undefined) {
      item.resolve(cache[targetLang][item.text]);
      continue;
    }
    if (!uniqueTexts.has(item.text)) {
      uniqueTexts.set(item.text, []);
    }
    uniqueTexts.get(item.text).push(item);
  }

  // Build a flat list of unique items (one representative per unique text)
  const uniqueItems = [];
  for (const [text, items] of uniqueTexts) {
    uniqueItems.push({ text, items });
  }

  if (uniqueItems.length === 0) return;

  // Chunk into groups of MAX_SEGMENTS
  for (let i = 0; i < uniqueItems.length; i += MAX_SEGMENTS) {
    const chunk = uniqueItems.slice(i, i + MAX_SEGMENTS);

    // Build a pendingChunk where each entry's resolve fans out to all duplicates
    const pendingChunk = chunk.map(({ text, items }) => ({
      text,
      resolve: (translated) => {
        items.forEach((item) => item.resolve(translated));
      },
    }));

    await sendBatch(pendingChunk, targetLang);
  }
}

/**
 * Translate a single text string from PT to targetLang.
 * Returns the original text if targetLang is "pt" or if it's empty/null.
 */
export function translateText(text, targetLang) {
  if (!text || typeof text !== "string" || text.trim() === "") {
    return Promise.resolve(text);
  }

  if (!targetLang || targetLang === "pt") {
    return Promise.resolve(text);
  }

  if (!API_KEY) {
    return Promise.resolve(text);
  }

  // Static override — checked before cache and before API
  if (TRANSLATION_OVERRIDES[targetLang]?.[text] !== undefined) {
    return Promise.resolve(TRANSLATION_OVERRIDES[targetLang][text]);
  }

  // Check cache first
  if (cache[targetLang]?.[text] !== undefined) {
    return Promise.resolve(cache[targetLang][text]);
  }

  // Add to batched queue
  return new Promise((resolve, reject) => {
    if (!queue[targetLang]) queue[targetLang] = [];
    queue[targetLang].push({ text, resolve, reject });

    // Debounce: flush after DEBOUNCE_MS of inactivity
    clearTimeout(timers[targetLang]);
    timers[targetLang] = setTimeout(() => flushQueue(targetLang), DEBOUNCE_MS);
  });
}
