/* eslint-disable no-console, no-process-exit */
import fs from 'node:fs/promises';
import path from 'node:path';

import * as avenuedelabrique from './websites/avenuedelabrique.js';
import * as dealabs from './websites/dealabs.js';
import * as vinted from './websites/vinted.js';

async function writeJsonFile(relativeFilePath, data) {
  const target = new URL(relativeFilePath, import.meta.url);
  const filePath = target.pathname;

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

  return filePath;
}

async function scrapeADLB(website = 'https://www.avenuedelabrique.com/promotions-et-bons-plans-lego') {
  console.log(`🕵️‍♀️  browsing ${website} website`);

  const deals = await avenuedelabrique.scrape(website);

  console.log(deals);
  console.log('done');
}

async function scrapeDealabs(website = 'https://www.dealabs.com/groupe/lego') {
  console.log(`scraping ${website}`);

  const rawDeals = await dealabs.scrape(website);

  if (!rawDeals) {
    throw new Error('Impossible de récupérer les deals Dealabs');
  }

  const deals = rawDeals.map((deal) => ({
    id: deal.id,
    title: deal.title,
    comments: deal.comments,
    temperature: deal.temperature,
    price: deal.price,
    published: deal.published,
    uuid: deal.uuid
  }));

  const output = await writeJsonFile('./data/dealabs.json', deals);

  console.log(`${deals.length} deals sauvegardés dans ${output}`);
  console.log(deals);
  console.log('done');
}

async function scrapeVinted(lego) {
  console.log(`scraping lego ${lego} from vinted.fr`);

  const sales = await vinted.scrape(lego);

  console.log(sales);
  console.log('done');
}

const [, , param] = process.argv;

(async () => {
  try {
    if (!param || param.includes('avenuedelabrique.com')) {
      await scrapeADLB(param);
    } else if (param.includes('dealabs.com')) {
      await scrapeDealabs(param);
    } else {
      await scrapeVinted(param);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();