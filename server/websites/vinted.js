import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v5 as uuidv5 } from 'uuid';

const COOKIE = process.env.VINTED_COOKIE || 'v_udt=L2VPUUwxMDRIU3dIc3dvYyswdjRZWkpzN3hkNi0tV3JFbHNMVzBIU3RucXpqVy0tUnFJeW5pL3BWMUp0cHdZakJhZHRiZz09; anon_id=03a5bc5f-a6fb-47f5-a203-7f3aff4e4698; anonymous-locale=fr; cf_clearance=0QHNMtMI61Ek6MAtMEoM64C.7xqZ1qU2Yau2FQ_N164-1775883849-1.2.1.1-S34COZxwlAS_i2xgvhYt4I_iI4g65msqq2WqUiZzZZJULuUGdEc5zubozaXXGpIUguSDSjvNY0cr0m4zYd8lhAJFjpukuxo87Mq.s1q6Hwq.n12q8A2T67nlT1_B0cn.fp4RrtlK1bs3gnMsYHUa1ZNXZrUoRfcljVkTMn4hK.fysoazGV2e_dnD.uGGAhbWFQyEeF3CYIoNbXiw5iP1qd8KQ42EfRCNDx.SIPUchLPO.K80koasdAmbhYvx4dw5NFxMI7wFp7bEzWKJEpyrm3rLqrwZNqM38LdnFr0vrzHLOxexLp8Tw96jykcVchxEmQd1FbRINA_8dMXe1uop_g; v_sid=ec8c58b1-1775489081; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+11+2026+07%3A04%3A11+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202602.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=03a5bc5f-a6fb-47f5-a203-7f3aff4e4698&isAnonUser=1&hosts=&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1%2CV2STACK42%3A1%2CC0035%3A1%2CC0038%3A1&genVendors=V2%3A1%2CV1%3A1%2C&intType=1&crTime=1773088182057&geolocation=FR%3BIDF&AwaitingReconsent=false&prevHadToken=0; datadome=XQSZzmTkPr0L2wUSuxNWkwBJKrlzybD_Q65ro~MMqEWRvL23WoDdQOyp8tIMf~kZiiVWCPBngZDIeY6I1OB02DvSk12RUw04dImn~OsHv12Hu9mJlVKRCOzkB7NJ9ppU; OptanonAlertBoxClosed=2026-03-09T20:29:41.904Z; eupubconsent-v2=CQgy_pgQgy_pgAcABBFRCVFsAP_gAEPgAAwILNtR_G__bWlr-Tb3abpkeYxP99hr7sQxBgbJk24FzLPW7JwCx2E5NAzatqIKmRIAu3TBIQNlHIDURUCgKIgFryDMaEyUoTNKJ6BkiBMRA2JYCFxvm4pjWQCY4vr_9lc1mB-N7dr82dzyy4hHn3a5fmS1UJCcIYetDfn8ZBKT-9IEd-x8v4v4_EbpEm-eS1n_pGtp4jd6YlM_dBmxt-TyffzPn_frk_e7X_vc_n3zv84XH77v_4LMgAmGhUQRlkQABAoCAECABQVhABQIAgAASBogIATBgQ5AwAXWEyAEAKAAYIAQAAgwABAAAJAAhEAEABAIAQIBAoAAwAIAgIAGBgADABYiAQAAgOgYpgQQCBYAJEZVBpgSgAJBAS2VCCQBAgrhCEWOAQQIiYKAAAEAAoAAAB8LAQklBKxIIAuIJoAACAAAKIECBFIWYAgoDNFoKwJOAyNMAwfMEySnQZAEwQkZBkQm_CYeKYogAAAA.f_wACHwAAAAA.ILNtR_G__bXlv-Tb36bpkeYxf99hr7sQxBgbJs24FzLvW7JwC32E7NEzatqYKmRIAu3TBIQNtHIjURUChKIgVrzDsaEyUoTtKJ-BkiDMRY2JYCFxvm4pjWQCZ4vr_91d9mT-N7dr-2dzyy5hnv3a9fuS1UJicKYetHfn8ZBKT-_IU9_x-_4v4_MbpEm-eS1v_tGtt43d64tP_dpuxt-Tyffz___f72_e7X__c__33_-_Xf_7__4A; OTAdditionalConsentString=1~43.55.61.70.83.89.93.108.117.122.124.135.143.144.147.149.159.192.196.211.228.230.239.259.266.286.291.311.320.322.323.327.367.371.385.407.415.424.430.436.445.486.491.494.495.522.523.540.550.560.568.574.576.584.587.591.737.803.820.839.864.899.904.922.938.959.979.981.985.1003.1027.1031.1046.1051.1053.1067.1092.1095.1097.1099.1107.1109.1135.1143.1149.1152.1162.1166.1186.1188.1205.1215.1226.1227.1230.1252.1268.1270.1276.1284.1290.1301.1307.1312.1329.1345.1356.1403.1415.1416.1421.1423.1440.1449.1455.1495.1512.1516.1525.1540.1548.1555.1558.1570.1577.1579.1583.1584.1603.1616.1638.1651.1653.1659.1667.1677.1678.1682.1697.1699.1703.1712.1716.1721.1725.1732.1745.1750.1765.1782.1786.1800.1810.1825.1827.1832.1838.1840.1843.1845.1859.1870.1878.1880.1889.1917.1929.1942.1944.1962.1963.1964.1967.1968.1969.1978.1985.1987.2003.2027.2035.2039.2047.2052.2056.2064.2068.2072.2074.2088.2090.2103.2107.2109.2115.2124.2130.2133.2135.2137.2140.2147.2156.2166.2177.2186.2205.2213.2216.2219.2220.2222.2225.2234.2253.2275.2279.2282.2309.2312.2316.2322.2325.2328.2331.2335.2336.2343.2354.2358.2359.2370.2376.2377.2387.2400.2403.2405.2407.2411.2414.2416.2418.2425.2440.2447.2461.2465.2468.2472.2477.2484.2486.2488.2498.2510.2517.2526.2527.2532.2535.2542.2552.2563.2564.2567.2568.2569.2571.2572.2575.2577.2583.2584.2596.2604.2605.2608.2609.2610.2612.2614.2621.2627.2628.2629.2633.2636.2642.2643.2645.2646.2650.2651.2652.2656.2657.2658.2660.2661.2669.2670.2677.2681.2684.2687.2690.2695.2698.2713.2714.2729.2739.2767.2768.2770.2772.2784.2787.2791.2792.2798.2801.2805.2812.2813.2816.2817.2821.2822.2827.2830.2831.2833.2834.2838.2839.2844.2846.2849.2850.2852.2854.2860.2862.2863.2865.2867.2869.2874.2875.2878.2880.2881.2882.2884.2886.2887.2888.2889.2891.2893.2894.2895.2897.2898.2900.2901.2908.2909.2916.2917.2918.2920.2922.2923.2927.2929.2930.2931.2940.2941.2947.2949.2950.2956.2958.2961.2963.2964.2965.2966.2968.2973.2975.2979.2980.2981.2983.2985.2986.2987.2994.2995.2997.2999.3000.3002.3003.3005.3008.3009.3010.3012.3016.3017.3018.3019.3028.3034.3038.3043.3052.3053.3055.3058.3059.3063.3066.3068.3070.3073.3074.3075.3076.3077.3089.3090.3093.3094.3095.3097.3099.3100.3106.3109.3112.3117.3119.3126.3127.3128.3130.3135.3136.3145.3150.3151.3154.3155.3163.3167.3172.3173.3182.3183.3184.3185.3187.3188.3189.3190.3194.3196.3209.3210.3211.3214.3215.3217.3222.3223.3225.3226.3227.3228.3230.3231.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3270.3272.3281.3288.3290.3292.3293.3296.3299.3300.3306.3307.3309.3314.3315.3316.3318.3324.3328.3330.3331.3531.3731.3831.4131.4531.4631.4731.4831.5231.6931.7235.7831.7931.8931.9731.10231.10631.10831.11031.11531.13632.14034.14133.14237.14332.15731.16831.16931.21233.23031.25131.25931.26031.26631.26831.27731.27831.28031.28731.28831.29631.32531.33931.34231.34631.36831.39131.39531.40632.41131.41531.43631.43731.43831.45931.47232.47531.48131.49231.49332.49431.50831.52831; is_shipping_fees_applied_info_banner_dismissed=false; domain_selected=true; _lm_id=H524B5IBAS99G81M; _gcl_au=1.1.180410540.1774356633; _ga_ZJHK1N3D75=GS2.1.s1774360458$o2$g1$t1774360461$j57$l0$h0; _ga=GA1.1.422967238.1774356633; __ps_r=_; __ps_lu=https://www.vinted.fr/session-refresh?ref_url=%2F; __ps_did=pscrb_0f6cf483-425a-40c1-c606-ac75c74d1a36; __ps_fva=1774356633254; _ga_8H12QY46R8=GS2.1.s1774360461$o2$g0$t1774360461$j60$l0$h0; cto_bundle=b6Cg5V9BbXNaN1hEdUtHYzljJTJCN2xSUm5zY1Q0enVrWXNUbVklMkJteUJMTFNpb2klMkZRbTFVMEglMkJIUzRFJTJCV0VVYUp6dW1jc2N2aE0zckNSUHklMkIxSDY4JTJGSTB1WXI2UHVxUmgyczclMkJsS1pSaHk1cjBQcnVCeTVUdk10ZTlBRFglMkZXdkhPTHMzbVBJdHhJVDRDd2k1VFl1UWQlMkJSYTJaek05bTN4ZE5tZmU4UHpTdlpZTzVpYyUzRA; cto_bidid=BlSwFV91TmRIOWttbyUyQlhmRVVSNUJ0UW80WjhyWkRCdjZ1STZIMXAlMkJFZk5lY1JkTU9WU3d6Q3RqaTc5bGQyMGJzSUgwZmp5ajRHdVl3VVp6cGxDYjhXRTlWNHlzN3V3VkZSMkZSeWpCYUE4MWVNRmcyWTFpbkttMGEzV3lKdWRRWFNDNFVzejBpNWNyd2lhVVFpU0x5VGIyTjFnJTNEJTNE; _fbp=fb.1.1774356635476.244219798838323576; _pubcid=bcebb5fc-120e-414d-a2f8-4a800bc67e62; _cc_id=825f4ad526d0ba7c45844b98b9ffae5f; cto_dna_bundle=vp3Q3F96ZklNRSUyQiUyQnJnUnV1WkFsYW02JTJGZEdvNEhDQ3FHSWNKU3ZIVzh2b2VSYTF3TVNNRzBZTVQ1b2VsJTJCa1lYRHdhQTdXJTJGdlRUeENGd2hUOU5CUk0xWCUyQlN5dyUzRCUzRA; anonymous-iso-locale=fr-FR; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzc2NDg4NjQ5LCJpYXQiOjE3NzU4ODM4NDksImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJyZWZyZXNoIiwic2NvcGUiOiJwdWJsaWMiLCJzaWQiOiJlYzhjNThiMS0xNzc1NDg5MDgxIn0.c0nc4xwFOkM6zoDznvErPQTlAI-0GJfZezctfmXP0UqmGr5Gvze4m9bvTDmlm0QlPz6YP9YIoIvhIZ9g-HMQ6iwvNWr7L0O7osv_oXYirlkdI0dcSsKwpKWqNtdQxSju43NMJdW8UthTPdBdELa8cxkhnzsTEktl8jLQFj7rjMapXwSo-qYf7zMjjCfP1y7PPeCthQfP_OpM26nybhlJwuM5oODVFcV5k1CXkyJMgguFhV7ONxSN35RvT_cdVxJE-ArKVhp9JmUAiWxxx5iNpctJDfPzNn1iabsrJpQA6OZ2crhqCJ2UQcez4_zmomIvpTj-ycUShgws25VubA95Dg; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzc1ODkxMDQ5LCJpYXQiOjE3NzU4ODM4NDksImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJhY2Nlc3MiLCJzY29wZSI6InB1YmxpYyIsInNpZCI6ImVjOGM1OGIxLTE3NzU0ODkwODEifQ.Co8FZfkBXCfcL3AMTnGuoyw6_i3ytqMTnlwuD7YH7rFtNpkLyX8hsdGiUoBWY0HaEwblv9VaobhYRZuIhBgAjPse_AvN0hk1eJm_W69W8_El_LHytRlevmum-nKgr4ToLOdXDXFYptUQl5l3bqc_cQ_bxH6NjwWUBgZk5cAMNCcBHe3aU-7wv7511yu81PioQwH38_WpNL7NLIG0tsigjDRdq1t1O4mtIG0AQxzyNWyVtRLcyheMruaV0U5YWMm4n-ifbnGaldO-8DQohdmn5a0Mf9oa3TWUkLCf8F0ZyFFjVW2jIsECQEGSnZlaDR3PhvRMAkFvLA16zHx8vR9A1g; v_sid=0a25e20d0e26fe70b0cb0efe019cde38; _vinted_fr_session=Q2lKeGM0WnhSbW83b3pKVi9vZUNYNFlhWmtyaEdKWTNYUVNTUkVVSXVJb1BJMU5ldVBlVWErTlRvcFVHOFZ1VDNLMUhXU09PUll6R0xoQnVwaHl1U084YlpHRUxwaTVOLzFidE1LYWxIaEhJT1NFTXZQYU1PVEEva3czUHNLRnZHRC9pRUpRajJYbUIyRnkyREdEaFVzN084cWxoZHppTmpOQlAycVNqOUg1RnhHL2M5QUhXV0k1cDBtc2s2UkplWnI1ZW16dEx2OUpJL3BxLzVOWWVVY1E4T2N3KzhKa3JmWGxTaTgrM0JORT0tLWlTR3FFRWZaQndxbzZPNE1xTTIwc0E9PQ%3D%3D--2b99723350aa0df70a3eca191061f0b0cb0db811; consent_version=eu; __cf_bm=q4IoMxt8Au5sIMU4ONRa7MIjZTTSxY6N7.cET3o4pjk-1775883849.729185-1.0.1.1-.8PU9gjnYzpZuLAXiP2.RpQpQQeFa2PHYv53fi4fq1BhCDYTHqkxIPQu1a_adRFCX_mUmvC3f9XQ0XTGLfbpZPY5F6kvm42SRGm.2k0yCsKrfD00ORtFPju11h_uosauMl4nnTZj.Br1KDtL9Mwu2g; non_dot_com_www_domain_cookie_buster=1; banners_ui_state=SUCCESS; viewport_size=1799';
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

      if (Array.isArray(result) && result.length > 0) {
        console.log(`Updated ${id} with ${result.length} sales`);
        output[id] = result;
      } else if (!hadPreviousValue) {
        console.log(`No previous cache for ${id}, creating empty list`);
        output[id] = [];
      } else {
        console.log(`Keeping previous cache for ${id} (${(output[id] || []).length} sales) unchanged`);
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