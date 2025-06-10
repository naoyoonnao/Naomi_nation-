const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2/translate';

const translateText = async (text, targetLang) => {
  try {
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('target_lang', targetLang);  
    formData.append('source_lang', 'EN');  

    const response = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

module.exports = { translateText };
