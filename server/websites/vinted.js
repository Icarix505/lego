import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v5 as uuidv5 } from 'uuid';

const COOKIE = process.env.VINTED_COOKIE || 'v_udt=L2VPUUwxMDRIU3dIc3dvYyswdjRZWkpzN3hkNi0tV3JFbHNMVzBIU3RucXpqVy0tUnFJeW5pL3BWMUp0cHdZakJhZHRiZz09; anon_id=03a5bc5f-a6fb-47f5-a203-7f3aff4e4698; anonymous-locale=fr; non_dot_com_www_domain_cookie_buster=1; cf_clearance=aVTKFhVvVEMf7tukSBKCIXyeYKSLDy38oTOZCeVq2VQ-1775513477-1.2.1.1-JsvpP0Qy8qTKb.8.64BF1rAzIq7kpEgEw5sANRBKL5QtLSMR4RWK99Zb8P_rvVPWX01KTTKl1ByNweXWgGtTweoSNpGVw9OtcYiX61RmYAwL9dt2k_H5Ydt.qYawQNEgWSViAnOmwTKeZd3BhTqDVq8s9slQeuHH9Aio_GLt.cZKSihF0OTyDfNoESzacM2DqkHBHjYOIeiXkyKzCtTm7oV_ohnVGy_zdUgEtAJfUEnHAsV22Y3f8uoFOtyDkGEggVMSngL2XoXsdyUJxwLVxpW61LxZ0UHGfCp5Spqs1IM7z9wSIC0jm_WzmK9m2Vzs8vntfEhY.BJXrdxaGMgvrw; v_sid=ec8c58b1-1775489081; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Apr+07+2026+00%3A11%3A18+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202602.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=03a5bc5f-a6fb-47f5-a203-7f3aff4e4698&isAnonUser=1&hosts=&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1%2CV2STACK42%3A1%2CC0035%3A1%2CC0038%3A1&genVendors=V2%3A1%2CV1%3A1%2C&intType=1&crTime=1773088182057&geolocation=FR%3BIDF&AwaitingReconsent=false&prevHadToken=0; datadome=DzJMh5SQUiddGwcKbjc2UWJ0az5ItBxnqoJw~ZWJpwUhTW9Lhr_d8lmiovdiS78zLA4i0ORy084e8Q7NSzNT2nxGZuPZbS7xWk2XSbnKdLlTDn8seyu2IvHHXz~4TVna; OptanonAlertBoxClosed=2026-03-09T20:29:41.904Z; eupubconsent-v2=CQgy_pgQgy_pgAcABBFRCVFsAP_gAEPgAAwILNtR_G__bWlr-Tb3abpkeYxP99hr7sQxBgbJk24FzLPW7JwCx2E5NAzatqIKmRIAu3TBIQNlHIDURUCgKIgFryDMaEyUoTNKJ6BkiBMRA2JYCFxvm4pjWQCY4vr_9lc1mB-N7dr82dzyy4hHn3a5fmS1UJCcIYetDfn8ZBKT-9IEd-x8v4v4_EbpEm-eS1n_pGtp4jd6YlM_dBmxt-TyffzPn_frk_e7X_vc_n3zv84XH77v_4LMgAmGhUQRlkQABAoCAECABQVhABQIAgAASBogIATBgQ5AwAXWEyAEAKAAYIAQAAgwABAAAJAAhEAEABAIAQIBAoAAwAIAgIAGBgADABYiAQAAgOgYpgQQCBYAJEZVBpgSgAJBAS2VCCQBAgrhCEWOAQQIiYKAAAEAAoAAAB8LAQklBKxIIAuIJoAACAAAKIECBFIWYAgoDNFoKwJOAyNMAwfMEySnQZAEwQkZBkQm_CYeKYogAAAA.f_wACHwAAAAA.ILNtR_G__bXlv-Tb36bpkeYxf99hr7sQxBgbJs24FzLvW7JwC32E7NEzatqYKmRIAu3TBIQNtHIjURUChKIgVrzDsaEyUoTtKJ-BkiDMRY2JYCFxvm4pjWQCZ4vr_91d9mT-N7dr-2dzyy5hnv3a9fuS1UJicKYetHfn8ZBKT-_IU9_x-_4v4_MbpEm-eS1v_tGtt43d64tP_dpuxt-Tyffz___f72_e7X__c__33_-_Xf_7__4A; OTAdditionalConsentString=1~43.55.61.70.83.89.93.108.117.122.124.135.143.144.147.149.159.192.196.211.228.230.239.259.266.286.291.311.320.322.323.327.367.371.385.407.415.424.430.436.445.486.491.494.495.522.523.540.550.560.568.574.576.584.587.591.737.803.820.839.864.899.904.922.938.959.979.981.985.1003.1027.1031.1046.1051.1053.1067.1092.1095.1097.1099.1107.1109.1135.1143.1149.1152.1162.1166.1186.1188.1205.1215.1226.1227.1230.1252.1268.1270.1276.1284.1290.1301.1307.1312.1329.1345.1356.1403.1415.1416.1421.1423.1440.1449.1455.1495.1512.1516.1525.1540.1548.1555.1558.1570.1577.1579.1583.1584.1603.1616.1638.1651.1653.1659.1667.1677.1678.1682.1697.1699.1703.1712.1716.1721.1725.1732.1745.1750.1765.1782.1786.1800.1810.1825.1827.1832.1838.1840.1843.1845.1859.1870.1878.1880.1889.1917.1929.1942.1944.1962.1963.1964.1967.1968.1969.1978.1985.1987.2003.2027.2035.2039.2047.2052.2056.2064.2068.2072.2074.2088.2090.2103.2107.2109.2115.2124.2130.2133.2135.2137.2140.2147.2156.2166.2177.2186.2205.2213.2216.2219.2220.2222.2225.2234.2253.2275.2279.2282.2309.2312.2316.2322.2325.2328.2331.2335.2336.2343.2354.2358.2359.2370.2376.2377.2387.2400.2403.2405.2407.2411.2414.2416.2418.2425.2440.2447.2461.2465.2468.2472.2477.2484.2486.2488.2498.2510.2517.2526.2527.2532.2535.2542.2552.2563.2564.2567.2568.2569.2571.2572.2575.2577.2583.2584.2596.2604.2605.2608.2609.2610.2612.2614.2621.2627.2628.2629.2633.2636.2642.2643.2645.2646.2650.2651.2652.2656.2657.2658.2660.2661.2669.2670.2677.2681.2684.2687.2690.2695.2698.2713.2714.2729.2739.2767.2768.2770.2772.2784.2787.2791.2792.2798.2801.2805.2812.2813.2816.2817.2821.2822.2827.2830.2831.2833.2834.2838.2839.2844.2846.2849.2850.2852.2854.2860.2862.2863.2865.2867.2869.2874.2875.2878.2880.2881.2882.2884.2886.2887.2888.2889.2891.2893.2894.2895.2897.2898.2900.2901.2908.2909.2916.2917.2918.2920.2922.2923.2927.2929.2930.2931.2940.2941.2947.2949.2950.2956.2958.2961.2963.2964.2965.2966.2968.2973.2975.2979.2980.2981.2983.2985.2986.2987.2994.2995.2997.2999.3000.3002.3003.3005.3008.3009.3010.3012.3016.3017.3018.3019.3028.3034.3038.3043.3052.3053.3055.3058.3059.3063.3066.3068.3070.3073.3074.3075.3076.3077.3089.3090.3093.3094.3095.3097.3099.3100.3106.3109.3112.3117.3119.3126.3127.3128.3130.3135.3136.3145.3150.3151.3154.3155.3163.3167.3172.3173.3182.3183.3184.3185.3187.3188.3189.3190.3194.3196.3209.3210.3211.3214.3215.3217.3222.3223.3225.3226.3227.3228.3230.3231.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3270.3272.3281.3288.3290.3292.3293.3296.3299.3300.3306.3307.3309.3314.3315.3316.3318.3324.3328.3330.3331.3531.3731.3831.4131.4531.4631.4731.4831.5231.6931.7235.7831.7931.8931.9731.10231.10631.10831.11031.11531.13632.14034.14133.14237.14332.15731.16831.16931.21233.23031.25131.25931.26031.26631.26831.27731.27831.28031.28731.28831.29631.32531.33931.34231.34631.36831.39131.39531.40632.41131.41531.43631.43731.43831.45931.47232.47531.48131.49231.49332.49431.50831.52831; is_shipping_fees_applied_info_banner_dismissed=false; domain_selected=true; _lm_id=H524B5IBAS99G81M; _gcl_au=1.1.180410540.1774356633; _ga_ZJHK1N3D75=GS2.1.s1774360458$o2$g1$t1774360461$j57$l0$h0; _ga=GA1.1.422967238.1774356633; __ps_r=_; __ps_lu=https://www.vinted.fr/session-refresh?ref_url=%2F; __ps_did=pscrb_0f6cf483-425a-40c1-c606-ac75c74d1a36; __ps_fva=1774356633254; _ga_8H12QY46R8=GS2.1.s1774360461$o2$g0$t1774360461$j60$l0$h0; cto_bundle=b6Cg5V9BbXNaN1hEdUtHYzljJTJCN2xSUm5zY1Q0enVrWXNUbVklMkJteUJMTFNpb2klMkZRbTFVMEglMkJIUzRFJTJCV0VVYUp6dW1jc2N2aE0zckNSUHklMkIxSDY4JTJGSTB1WXI2UHVxUmgyczclMkJsS1pSaHk1cjBQcnVCeTVUdk10ZTlBRFglMkZXdkhPTHMzbVBJdHhJVDRDd2k1VFl1UWQlMkJSYTJaek05bTN4ZE5tZmU4UHpTdlpZTzVpYyUzRA; cto_bidid=BlSwFV91TmRIOWttbyUyQlhmRVVSNUJ0UW80WjhyWkRCdjZ1STZIMXAlMkJFZk5lY1JkTU9WU3d6Q3RqaTc5bGQyMGJzSUgwZmp5ajRHdVl3VVp6cGxDYjhXRTlWNHlzN3V3VkZSMkZSeWpCYUE4MWVNRmcyWTFpbkttMGEzV3lKdWRRWFNDNFVzejBpNWNyd2lhVVFpU0x5VGIyTjFnJTNEJTNE; _fbp=fb.1.1774356635476.244219798838323576; _pubcid=bcebb5fc-120e-414d-a2f8-4a800bc67e62; _cc_id=825f4ad526d0ba7c45844b98b9ffae5f; cto_dna_bundle=vp3Q3F96ZklNRSUyQiUyQnJnUnV1WkFsYW02JTJGZEdvNEhDQ3FHSWNKU3ZIVzh2b2VSYTF3TVNNRzBZTVQ1b2VsJTJCa1lYRHdhQTdXJTJGdlRUeENGd2hUOU5CUk0xWCUyQlN5dyUzRCUzRA; anonymous-iso-locale=fr-FR; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzc2MTE4Mjc1LCJpYXQiOjE3NzU1MTM0NzUsImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJyZWZyZXNoIiwic2NvcGUiOiJwdWJsaWMiLCJzaWQiOiJlYzhjNThiMS0xNzc1NDg5MDgxIn0.dnshUYaX6sEsstO73HkJz2PQzDN5-oFVZ9ZZJSclgtgvkbMeViS-Ftop8Bja_Bf80pY8YD86F7QdI9xOSZjPG_7wOevM51TAfk2J-XPDNh1LI6hH57w2llJE-ANoflDdukCzGJ1nSdu-u0zbPNyc35U1pj306k-fn3Zh_nz-_YtkGYFYgPaKuH_EBfXfD4pmQ2V71FNvAINB20vhKddiaJ1QRz8hEVYrlIqZRXfjJC06YJTbvL6cs4mup3DiCcUUn9brH82ok9rAEov_cx6dy47f0OnQgED-c7xN7pw_-4ePHhthRfxeL6H6dfLMri3CjJ5ugksjOkI2VoAfpKoRdA; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzc1NTIwNjc1LCJpYXQiOjE3NzU1MTM0NzUsImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJhY2Nlc3MiLCJzY29wZSI6InB1YmxpYyIsInNpZCI6ImVjOGM1OGIxLTE3NzU0ODkwODEifQ.mwV0wu9_uWubGCZN8Pu2Sg6Uea7vBjMun_cIyqNb6QD-wFL8LnDWFdG0ll8quHwF6DZ2UK0TTO-L1ZXkNFBjxuS3KcCOeylY0g3lEPhEYXMDGRobZE3h6pi-9G1eNEUy8N8prwl8ox5paHBi6YV987Do3fKUIDdjs1pfb1zIfiHamy8QkWNk7z5843_D_Zj9H7-Me26U8kkxwsbRyt5UGyOCZvWZdEHR5WpmwLiMfbhcdv1s8kc1Cz2ye2LQddywJRVJlFDoGaZgC2oUPRkH1RrA84C9Ql_RSA1kKKMHP_XXRg-s6s0H5tnqlIT8uLgbV2KNpXF2b_S7LPzpR2UQ_Q; v_sid=0a25e20d0e26fe70b0cb0efe019cde38; viewport_size=1387; _vinted_fr_session=Zy9SM212MlN3WExHdE95SXliemxDelVXRndWYlJDQ0xBSTBKMmRNYWVuRmpCUnhJS0NHZmNEZGU3THFUQWNVREt1K0N6VHptb0dVMTBaSWhZaEN2eGxNd0plcXlJRkJjK2N2Y1pFdkJ5TVphcmxTaWFLR1lGQTZqSGpVSkNYTWJ2SGxUZE1rcjFKVmlRV0k4bURSSFQ1Mm9Pcjdzd1Q3aDBvWVVuY1I0Nm1JclNJY3RGZ3VTU1lYcENwbDBWakp3djVtdWF0enpQUUp4OG5BUjd0MFl2OWdUMGlObk5FaGJ4UzBiMm4rODZQdz0tLS95Tmo3TWVqNkg1TzBBZ284RVQySlE9PQ%3D%3D--8b9def73e37b1d4f61c618141c1317094f41f592; consent_version=eu; __cf_bm=PDyWs5NEGzGWI5nAXPKMA78fNcddJuX6nVXFtUJXrZo-1775513477.786996-1.0.1.1-bbuJ7BZFR8FiBZffsLp5wJ1WjaKou4xdLS1VVN_9a4dPwrBRMmI4ScpNWIp_L2.5JhN6A07LoHLK9z4RNxGrKfdDXPrsnyK8mtYpsuLJp9msZ4G_jzh0I5y5Yfh6vfsPqYtIUqDAry8X_Ln4IzPELg';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VINTED_JSON_FILE = path.join(__dirname, '..', 'sources', 'vinted.json');

function isNotDefined(value) {
  return value == null || (typeof value === 'string' && value.trim().length === 0);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJsonSafe(filePath, fallback = {}) {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function parse(data) {
  try {
    const items = Array.isArray(data?.items) ? data.items : [];

    return items.map((item) => ({
      link: item.url || '',
      price: item.total_item_price ?? item.price?.amount ?? null,
      title: item.title || '',
      published: item.photo?.high_resolution?.timestamp ?? null,
      uuid: uuidv5(item.url || String(Math.random()), uuidv5.URL)
    }));
  } catch (error) {
    console.error('Vinted parse error:', error);
    return [];
  }
}

async function fetchVinted(searchText) {
  if (isNotDefined(COOKIE)) {
    throw new Error('VINTED_COOKIE is missing');
  }

  const url =
    `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=24` +
    `&search_text=${encodeURIComponent(searchText)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'cookie': COOKIE,
      'referer': 'https://www.vinted.fr/',
      'origin': 'https://www.vinted.fr',
      'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Vinted HTTP error:', response.status, response.statusText);
    console.error(text.slice(0, 500));
    return [];
  }

  const body = await response.json();
  return parse(body);
}

function filterRelevantSales(sales, legoSetId) {
  const id = String(legoSetId).trim();
  return sales.filter((sale) => String(sale.title || '').includes(id));
}

async function scrape(legoSetId) {
  try {
    const id = String(legoSetId || '').trim();

    if (!id) {
      return [];
    }

    const queries = [`lego ${id}`, id];

    for (const query of queries) {
      const sales = await fetchVinted(query);
      const filtered = filterRelevantSales(sales, id);

      if (filtered.length > 0) {
        return filtered;
      }

      if (sales.length > 0) {
        return sales;
      }
    }

    return [];
  } catch (error) {
    console.error(`Vinted scrape error for ${legoSetId}:`, error.message || error);
    return [];
  }
}

async function buildVintedJsonFromDeals(deals) {
  const existing = await readJsonSafe(VINTED_JSON_FILE, {});
  const output = { ...existing };

  const ids = [...new Set(
    deals
      .map((deal) => String(deal.id || '').trim())
      .filter((id) => /^\d{4,6}$/.test(id))
  )];

  for (const id of ids) {
    try {
      console.log(`Refreshing Vinted cache for Lego set ${id}...`);

      const result = await scrape(id);
      const hadPreviousValue = Object.prototype.hasOwnProperty.call(output, id);

      if (result.ok && Array.isArray(result.sales) && result.sales.length > 0) {
        console.log(`Updated ${id} with ${result.sales.length} sales`);
        output[id] = result.sales;
      } else if (!hadPreviousValue) {
        console.log(`No previous cache for ${id}, creating empty list`);
        output[id] = [];
      } else {
        console.log(`Keeping previous cache for ${id} unchanged`);
      }
    } catch (error) {
      console.error(`Error while refreshing ${id}:`, error.message || error);

      const hadPreviousValue = Object.prototype.hasOwnProperty.call(output, id);

      if (!hadPreviousValue) {
        console.log(`Error and no previous cache for ${id}, creating empty list`);
        output[id] = [];
      } else {
        console.log(`Error for ${id}, keeping previous cache unchanged`);
      }
    }

    await writeJson(VINTED_JSON_FILE, output);
    await delay(1200);
  }

  return output;
}

export { scrape, buildVintedJsonFromDeals };