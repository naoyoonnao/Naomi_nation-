# Naomi Nation – Front-end

## Prerequisites

* Node.js ≥ 18.0 (LTS recommended)
* npm ≥ 9

## 1. Install Dependencies

```bash
# from Front-end/
npm install
# translation backend loader
npm install i18next-http-backend
```

## 2. Environment Variables
Create a `.env` (or use system vars) and define:

```
VITE_API_URL=http://localhost:8080
```

## 3. Run Development Server

```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## Backend (API)
The Express API lives in `Back-end/`.

```bash
cd ../Back-end
npm install
npm run dev   # listens on http://localhost:8080
```

### Endpoints added for translations
| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/i18n`           | List all keys  |
| `POST` | `/api/i18n`           | Add `{key,en,ua}` |
| `PUT`  | `/api/i18n/:key`      | Update values   |
| `DELETE` | `/api/i18n/:key`    | Remove key      |
| `GET`  | `/api/i18n/file/:lng` | Raw JSON for i18next loader |

Legacy keys (hard-coded in the old `src/i18n.js`) are merged on-the-fly into `Back-end/locales/en.json` & `ua.json` on the first request, so no translations are lost.

---

## Internationalisation Flow
1. `src/i18n.js` uses **i18next-http-backend** to load JSON files from `/api/i18n/file/{{lng}}`.
2. If a key is missing in the file, i18next falls back to the static object from `src/i18nLegacy.js`.
3. The **Translations** tab in the admin panel provides full CRUD for keys and persists them to the JSON files mentioned above.
4. After adding or editing keys, refresh the page (or call `i18n.reloadResources()`) to see the changes live.

---

## Adding New Text
Replace hard-coded strings in components with:

```jsx
import { useTranslation } from 'react-i18next';
...
const { t } = useTranslation();
...
<h1>{t('welcomeMessage')}</h1>
```

Add the new key via Admin → Translations.

---

## Build for Production

```bash
npm run build
```
The compiled assets will be in `dist/`.
