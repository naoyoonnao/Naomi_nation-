const fs = require("fs/promises");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "locales");
const FILES = { en: path.join(LOCALES_DIR, "en.json"), ua: path.join(LOCALES_DIR, "ua.json") };

async function readLocale(lang) {
  const file = FILES[lang];
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeLocale(lang, obj) {
  const file = FILES[lang];
  await fs.mkdir(LOCALES_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(obj, null, 2), "utf8");
}

// ───── Legacy fallback translations ─────────────────────────────
const LEGACY = {
  en: {
    welcomeMessage: "Siamese and Oriental Shorthair cattery",
    languageSwitch: "Switch Language",
    OurKittens: "Our kittens",
  },
  ua: {
    welcomeMessage: "Розплідник сіамських та орієнтальних короткошерстих кішок",
    languageSwitch: "Змінити мову",
    OurKittens: "Наші кошенята",
  },
};

function mergeLegacy(en, ua) {
  let changed = false;
  for (const [k, v] of Object.entries(LEGACY.en)) {
    if (!(k in en)) {
      en[k] = v;
      changed = true;
    }
  }
  for (const [k, v] of Object.entries(LEGACY.ua)) {
    if (!(k in ua)) {
      ua[k] = v;
      changed = true;
    }
  }
  return changed;
}

// GET /api/i18n
exports.getAll = async (req, res) => {
  try {
    let [en, ua] = await Promise.all([readLocale("en"), readLocale("ua")]);

    // merge legacy and persist if needed
    if (mergeLegacy(en, ua)) {
      await Promise.all([writeLocale("en", en), writeLocale("ua", ua)]);
    }

    const keys = Array.from(new Set([...Object.keys(en), ...Object.keys(ua)]));
    const list = keys.map((k) => ({ key: k, en: en[k] || "", ua: ua[k] || "" }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST {key,en,ua}
exports.create = async (req, res) => {
  const { key, en: enVal = "", ua: uaVal = "" } = req.body;
  if (!key) return res.status(400).json({ message: "Key required" });
  try {
    const [en, ua] = await Promise.all([readLocale("en"), readLocale("ua")]);
    if (en[key] || ua[key]) return res.status(409).json({ message: "Key exists" });
    en[key] = enVal;
    ua[key] = uaVal;
    await Promise.all([writeLocale("en", en), writeLocale("ua", ua)]);
    res.status(201).json({ key, en: enVal, ua: uaVal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /:key {en,ua}
exports.update = async (req, res) => {
  const { key } = req.params;
  const { en: enVal, ua: uaVal } = req.body;
  try {
    const [en, ua] = await Promise.all([readLocale("en"), readLocale("ua")]);
    if (!(key in en) && !(key in ua)) return res.status(404).json({ message: "Key not found" });
    if (enVal !== undefined) en[key] = enVal;
    if (uaVal !== undefined) ua[key] = uaVal;
    await Promise.all([writeLocale("en", en), writeLocale("ua", ua)]);
    res.json({ key, en: en[key] || "", ua: ua[key] || "" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /:key
exports.remove = async (req, res) => {
  const { key } = req.params;
  try {
    const [en, ua] = await Promise.all([readLocale("en"), readLocale("ua")]);
    delete en[key];
    delete ua[key];
    await Promise.all([writeLocale("en", en), writeLocale("ua", ua)]);
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/i18n/file/:lng  → raw JSON file for i18next backend
exports.sendFile = async (req, res) => {
  const { lng } = req.params;
  const file = FILES[lng] || FILES.en;
  res.sendFile(file);
};
