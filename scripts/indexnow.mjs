// scripts/indexnow.mjs
const API_KEY = "5d5d2b6f1d28498aaaaf50d7ae18cf4a";
const HOST = "www.stabilityprotocol.space";
const LOCALES = ["en", "fr"];
const SLUGS = ["jitter", "bufferbloat", "packet-loss"];

const urlList = [];
LOCALES.forEach(lang => {
  urlList.push(`https://${HOST}/${lang}`);
  urlList.push(`https://${HOST}/${lang}/glossary`);
  SLUGS.forEach(slug => {
    urlList.push(`https://${HOST}/${lang}/glossary/${slug}`);
  });
});

async function notifyIndexNow() {
  console.log("🚀 IndexNow: Envoi des URLs à Bing/Yandex...");
  
  try {
    const response = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: API_KEY,
        keyLocation: `https://${HOST}/${API_KEY}.txt`,
        urlList: urlList,
      }),
    });

    if (response.ok) {
      console.log(`✅ IndexNow: ${urlList.length} URLs envoyées avec succès.`);
    } else {
      console.error(`❌ IndexNow Error: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ IndexNow: Échec de la requête", error);
  }
}

notifyIndexNow();
