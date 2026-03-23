import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

function parse(html) {
  const $ = cheerio.load(html);
  const deals = [];

  $('.js-vue3[data-vue3*="ThreadMainListItemNormalizer"]').each((_, element) => {
    const raw = $(element).attr('data-vue3');
    if (!raw) return;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    const thread = parsed?.props?.thread;
    if (!thread) return;

    deals.push({
      id: String(thread.threadId),
      title: thread.title || '',
      comments: thread.commentCount ?? 0,
      temperature: thread.temperature ?? null,
      price: thread.price ?? null,
      published: thread.publishedAt
        ? new Date(thread.publishedAt * 1000).toISOString()
        : null,
      uuid: uuidv5(`dealabs:${thread.threadId}`, uuidv5.URL)
    });
  });

  return deals;
}

async function scrape(url = 'https://www.dealabs.com/groupe/lego') {
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
  return parse(html);
}

export { scrape };