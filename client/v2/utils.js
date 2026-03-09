// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';


/**
 * 
 * @param {Array} deals - list of deals
 * @returns {Array} list of lego set ids
 */
const getIdsFromDeals = deals => {
    return deals.map(deal => deal.id)
}

const sortDealsByDiscount = deals => {
    return deals.result.sort((a, b) => {
        return b.discount - a.discount
    })
}
const sortDealsByComments = deals => {
    return deals.result.sort((a, b) => {
        return b.comments - a.comments
    })
}
const sortDealsByTemperature = deals => {
    return deals.result.sort((a, b) => {
        return b.temperature - a.temperature
    })
}
const sortDealsByPriceAsc = deals => {
    return deals.result.sort((a, b) => {
        return a.price - b.price
    })
}
const sortDealsByPriceDesc = deals => {
    return deals.result.sort((a, b) => {
        return b.price - a.price
    })
}
const sortDealsByDateAsc = deals => {
    return deals.result.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt)
    })
}
const sortDealsByDateDesc = deals => {
    return deals.result.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    })
}

