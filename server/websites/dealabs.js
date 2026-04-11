import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

const BASE_URL = 'https://www.dealabs.com/groupe/lego';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function computeDiscount(price, retail, percentage) {
  if (percentage && Number(percentage) > 0) {
    return Number(percentage);
  }

  if (!price || !retail) {
    return 0;
  }

  return Math.round(((Number(retail) - Number(price)) / Number(retail)) * 100);
}

function extractLegoSetId(...texts) {
  const joined = texts
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const match5 = joined.match(/\b\d{5}\b/);
  if (match5) return match5[0];

  const match4 = joined.match(/\b\d{4}\b/);
  if (match4) return match4[0];

  return '';
}

function normalizeUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') return null;

  const clean = url.trim();

  if (clean.startsWith('//')) return `https:${clean}`;
  if (clean.startsWith('/')) return `${BASE_URL}${clean}`;
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;

  return clean;
}

function extractFromSrcset(srcset) {
  if (typeof srcset !== 'string' || srcset.trim() === '') return null;

  const first = srcset
    .split(',')
    .map((part) => part.trim().split(' ')[0])
    .find(Boolean);

  return normalizeUrl(first);
}

function extractPhotoUrl(thread = {}, article = null) {
  // NOUVEAU : construire l'URL depuis mainImage
  if (thread?.mainImage?.path && thread?.mainImage?.name) {
    const { path, name, ext } = thread.mainImage;
    const extension = ext && ext !== 'raw' ? ext : 'jpg';
    return `https://static-pepper.dealabs.com/${path}/${name}/re/202x202/qt/70/${name}.${extension}`;
  }
}

  // ... tout le reste du code existant inchangé

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

    const dealUuid = uuidv5(`dealabs:${thread.threadId}`, uuidv5.URL);
    const article = $(`#thread_${thread.threadId}`);

    const anchor =
      article.find('a.js-thread-title').first().length > 0
        ? article.find('a.js-thread-title').first()
        : article.find('a').first();

    const href = anchor.attr('href') || thread?.url || '';
    const link = normalizeUrl(href) || `${BASE_URL}`;

    const snippet = article
      .find('.userHtml-content')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    const legoSetId = extractLegoSetId(thread.title || '', snippet);

    const price = thread.price ?? 0;
    const retail = thread.nextBestPrice ?? 0;
    const discount = computeDiscount(price, retail, thread.percentage);
    const photo = extractPhotoUrl(thread, article);

    deals.push({
      _id: dealUuid,
      link,
      retail,
      price,
      discount,
      temperature: thread.temperature ?? 0,
      comments: thread.commentCount ?? 0,
      published: thread.publishedAt
        ? new Date(thread.publishedAt * 1000).toISOString()
        : null,
      title: thread.title || '',
      id: legoSetId || String(thread.threadId),
      dealabsId: String(thread.threadId),
      community: 'dealabs',
      uuid: dealUuid,
      photo
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

async function saveDealsJson(
  url = 'https://www.dealabs.com/groupe/lego',
  outputFile = path.join(__dirname, '..', 'data', 'dealabs.json')
) {
  const deals = await scrape(url);

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(deals, null, 2), 'utf-8');

  return deals;
}

export { scrape, saveDealsJson };