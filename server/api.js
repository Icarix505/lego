import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { saveDealsJson } from './websites/dealabs.js';
import { buildVintedJsonFromDeals } from './websites/vinted.js';

const app = express();
const PORT = 8092;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEALS_FILE = path.join(__dirname, 'data', 'dealabs.json');
const SALES_FILE = path.join(__dirname, 'sources', 'vinted.json');
const CLIENT_V2_DIR = path.join(__dirname, '..', 'client', 'v2');

async function readJson(filePath) {
  const text = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(text);
}

function paginate(items, page = 1, size = 6) {
  const count = items.length;
  const pageCount = Math.max(1, Math.ceil(count / size));
  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const start = (currentPage - 1) * size;
  const end = start + size;

  return {
    result: items.slice(start, end),
    meta: {
      count,
      pageCount,
      currentPage,
      pageSize: size
    }
  };
}

function adaptDealForV2(deal) {
  return {
    uuid: deal.uuid,
    id: deal.id,
    title: deal.title,
    link: deal.link,
    price: deal.price,
    discount: deal.discount,
    temperature: deal.temperature,
    comments: deal.comments,
    createdAt: deal.published,
    photo: deal.photo || null
  };
}

function adaptSaleForV2(sale) {
  return {
    uuid: sale.uuid,
    link: sale.link,
    title: sale.title,
    published: sale.published,
    price: sale.price
  };
}

app.use('/v2', express.static(CLIENT_V2_DIR));

app.get('/', (_req, res) => {
  res.redirect('/v2/');
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/deals', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 6;

    let deals = await readJson(DEALS_FILE);
    deals = deals.map(adaptDealForV2);

    deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const data = paginate(deals, page, size);

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Cannot read deals file',
      message: error.message
    });
  }
});

app.get('/sales', async (req, res) => {
  try {
    const id = String(req.query.id || '').trim();
    const salesBySetId = await readJson(SALES_FILE);

    const result = id ? (salesBySetId[id] || []) : [];

    result.sort((a, b) => Number(b.published || 0) - Number(a.published || 0));

    return res.json({
      success: true,
      data: {
        result: result.map(adaptSaleForV2)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Cannot read sales file',
      message: error.message
    });
  }
});

app.get('/deals/search', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const maxPrice = req.query.price ? Number(req.query.price) : null;
    const minDate = req.query.date ? new Date(req.query.date) : null;
    const filterBy = req.query.filterBy;

    let deals = await readJson(DEALS_FILE);

    if (maxPrice !== null) {
      deals = deals.filter((deal) => Number(deal.price) <= maxPrice);
    }

    if (minDate) {
      deals = deals.filter((deal) => {
        if (!deal.published) return false;
        return new Date(deal.published) >= minDate;
      });
    }

    if (filterBy === 'best-discount') {
      deals.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
    } else if (filterBy === 'most-commented') {
      deals.sort((a, b) => Number(b.comments || 0) - Number(a.comments || 0));
    } else {
      deals.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    return res.json({
      limit,
      total: deals.slice(0, limit).length,
      results: deals.slice(0, limit)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Cannot search deals',
      message: error.message
    });
  }
});

app.get('/sales/search', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const legoSetId = String(req.query.legoSetId || '').trim();
    const salesBySetId = await readJson(SALES_FILE);

    let result = legoSetId ? (salesBySetId[legoSetId] || []) : [];

    result.sort((a, b) => Number(b.published || 0) - Number(a.published || 0));

    return res.json({
      limit,
      total: result.slice(0, limit).length,
      results: result.slice(0, limit).map(adaptSaleForV2)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Cannot search sales',
      message: error.message
    });
  }
});

async function boot() {
  console.log('Step 1: scraping Dealabs...');
  await saveDealsJson('https://www.dealabs.com/groupe/lego');

  console.log('Step 2: reading dealabs.json...');
  const deals = await readJson(DEALS_FILE);

  console.log('Step 3: building vinted.json from deal ids...');
  await buildVintedJsonFromDeals(deals);

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    console.log(`Open the website on http://localhost:${PORT}/v2/`);
  });
}

boot().catch((error) => {
  console.error('Boot failed:', error);
  process.exit(1);
});