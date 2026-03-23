import { writeFile } from 'fs/promises';

const url = 'https://www.dealabs.com/groupe/lego';
const outputFile = 'dealabs-lego-raw.html';

async function saveRawHtml() {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0',
      'accept-language': 'fr-FR,fr;q=0.9'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  await writeFile(outputFile, html, 'utf8');

  console.log(`HTML brut sauvegardé dans : ${outputFile}`);
}

saveRawHtml().catch(error => {
  console.error('Erreur :', error.message);
});