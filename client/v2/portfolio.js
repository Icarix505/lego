'use strict';

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const filtersSelect = document.querySelector('#filters-select');
const sortSelect = document.querySelector('#sort-select');

const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
};

const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(`http://localhost:8092/deals?page=${page}&size=${size}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return { result: currentDeals, meta: currentPagination };
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return { result: currentDeals, meta: currentPagination };
  }
};

const fetchSales = async (id) => {
  try {
    const response = await fetch(`http://localhost:8092/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }

    return body.data.result || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const RenderNumberOfSales = (sales) => {
  document.querySelector('#nbSales').textContent = sales.length;
};

const Renderp5PercentilePrice = (sales) => {
  const prices = sales
    .map((sale) => Number(sale.price?.amount ?? 0))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  document.querySelector('#p5').textContent = getPercentileValue(prices, 5);
};

const Renderp25PercentilePrice = (sales) => {
  const prices = sales
    .map((sale) => Number(sale.price?.amount ?? 0))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  document.querySelector('#p25').textContent = getPercentileValue(prices, 25);
};

const Renderp50PercentilePrice = (sales) => {
  const prices = sales
    .map((sale) => Number(sale.price?.amount ?? 0))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  document.querySelector('#p50').textContent = getPercentileValue(prices, 50);
};

const RenderNbofDeals = (deals) => {
  document.querySelector('#nbDeals').textContent = deals.length;
};

const resetSalesIndicators = () => {
  RenderNumberOfSales([]);
  document.querySelector('#p5').textContent = 0;
  document.querySelector('#p25').textContent = 0;
  document.querySelector('#p50').textContent = 0;
};

const renderDeals = (deals) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const template = `
    <div class="section-head">
      <h2>Deals</h2>
      <div class="section-count">${deals.length} displayed</div>
    </div>

    <div class="deals-grid">
      ${deals
        .map((deal) => {
          const imageHtml = deal.photo
            ? `<img class="deal-image" src="${deal.photo}" alt="${deal.title}" onerror="this.outerHTML='&lt;div class=&quot;deal-image deal-image-placeholder&quot;&gt;No image&lt;/div&gt;'" />`
            : `<div class="deal-image deal-image-placeholder">No image</div>`;

          return `
            <article class="deal-card" id="${deal.uuid}">
              ${imageHtml}

              <div class="card-top">
                <span class="deal-id">${deal.id}</span>
                <div class="price-box">${deal.price ?? 0}€</div>
              </div>

              <div class="card-body">
                <div class="deal-title">
                  <a href="${deal.link}" target="_blank" rel="noreferrer">${deal.title}</a>
                </div>

                <div class="badges-row">
                  <span class="badge badge-discount">-${deal.discount ?? 0}%</span>
                  <span class="badge badge-temp">${deal.temperature ?? 0}°</span>
                  <span class="badge badge-comments">${deal.comments ?? 0} comments</span>
                </div>

                <div class="meta-row">
                  <span class="meta-chip">
                    ${deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>

                <div class="card-footer">
                  <span class="secondary-text">Dealabs</span>
                  <a class="primary-link" href="${deal.link}" target="_blank" rel="noreferrer">Open deal</a>
                </div>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;

  RenderNbofDeals(deals);
  resetSalesIndicators();

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '';
  sectionDeals.appendChild(fragment);
};

const renderSales = (sales, legoSetId) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const template = `
    <div class="section-head">
      <h2>Sales</h2>
      <div class="section-count">${sales.length} found</div>
    </div>

    ${
      sales.length > 0
        ? `
      <div class="sales-grid">
        ${sales
          .map((sale) => {
            return `
              <article class="sale-card" id="${sale.uuid}">
                <div class="card-top">
                  <span class="deal-id">${legoSetId}</span>
                  <div class="price-box">${sale.price?.amount ?? 0}€</div>
                </div>

                <div class="card-body">
                  <div class="sale-title">
                    <a href="${sale.link}" target="_blank" rel="noreferrer">${sale.title}</a>
                  </div>

                  <div class="meta-row">
                    <span class="meta-chip">
                      ${sale.published ? new Date(Number(sale.published) * 1000).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>

                  <div class="card-footer">
                    <span class="secondary-text">Vinted</span>
                    <a class="primary-link" href="${sale.link}" target="_blank" rel="noreferrer">Open sale</a>
                  </div>
                </div>
              </article>
            `;
          })
          .join('')}
      </div>
    `
        : `
      <div class="empty-box">
        <strong>No sales found</strong>
        No Vinted results are currently available for LEGO set ${legoSetId}.
      </div>
    `
    }
  `;

  RenderNumberOfSales(sales);
  Renderp5PercentilePrice(sales);
  Renderp25PercentilePrice(sales);
  Renderp50PercentilePrice(sales);

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '';
  sectionDeals.appendChild(fragment);
};

const renderPagination = (pagination) => {
  const { currentPage, pageCount } = pagination;

  const options = Array.from(
    { length: pageCount },
    (_, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderLegoSetIds = (deals) => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map((id) => `<option value="${id}">${id}</option>`).join('');
  selectLegoSetIds.innerHTML = options;
};

const renderIndicators = (pagination) => {
  const { count } = pagination;
  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals);
};

const applySort = (dealsWrapper, sortValue) => {
  const cloned = {
    result: [...dealsWrapper.result],
    meta: dealsWrapper.meta
  };

  if (sortValue === 'discount-asc') return sortDealsByDiscount(cloned);
  if (sortValue === 'discount-desc') return sortDealsByDiscount(cloned).reverse();
  if (sortValue === 'comments-asc') return sortDealsByComments(cloned);
  if (sortValue === 'comments-desc') return sortDealsByComments(cloned).reverse();
  if (sortValue === 'hot-asc') return sortDealsByTemperature(cloned);
  if (sortValue === 'hot-desc') return sortDealsByTemperature(cloned).reverse();
  if (sortValue === 'price-asc') return sortDealsByPriceAsc(cloned);
  if (sortValue === 'price-desc') return sortDealsByPriceDesc(cloned);
  if (sortValue === 'date-asc') return sortDealsByDateAsc(cloned);
  if (sortValue === 'date-desc') return sortDealsByDateDesc(cloned);

  return cloned.result;
};

const applyFilter = (dealsWrapper, filterValue) => {
  const base = [...dealsWrapper.result];

  if (filterValue === 'discount') return base.filter((deal) => Number(deal.discount) > 15);
  if (filterValue === 'comments') return base.filter((deal) => Number(deal.comments) > 7);
  if (filterValue === 'hot') return base.filter((deal) => Number(deal.temperature) > 100);

  return base;
};

const refreshDealsView = async () => {
  const dealsWrapper = await fetchDeals(currentPagination.currentPage || 1, currentPagination.pageSize || 6);

  let filteredDeals = applyFilter(dealsWrapper, filtersSelect.value);

  const sortedDeals = applySort(
    { result: filteredDeals, meta: dealsWrapper.meta },
    sortSelect.value
  );

  setCurrentDeals({
    result: sortedDeals,
    meta: dealsWrapper.meta
  });

  render(currentDeals, currentPagination);
};

selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage || 1, parseInt(event.target.value, 10));
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value, 10), currentPagination.pageSize || 6);
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

sortSelect.addEventListener('change', async () => {
  await refreshDealsView();
});

filtersSelect.addEventListener('change', async () => {
  await refreshDealsView();
});

selectLegoSetIds.addEventListener('change', async (event) => {
  const legoSetId = String(event.target.value || '').trim();
  const sales = await fetchSales(legoSetId);
  renderSales(sales, legoSetId);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});