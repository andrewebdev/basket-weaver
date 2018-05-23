/**
  Copyright (c) 2018 Tehnode Ltd.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/**
 * Convert and returns the price as a Integer. Note that this will convert
 * the prices to "cents" and is preferred when doing any price arithmetic.
 */
export function priceToInt(price) {
  return parseFloat(price).toFixed(2) * 100;
};

/**
 * Convert the price back to decimal
 */
export function priceToDecimal(price) {
  return (price / 100).toFixed(2);
};

/**
 * Multiply the price by `multiplier` and returns the resulting price
 */
export function mul(price, multiplier) {
  if (price instanceof Price) {
    let priceMap = {};

    price.currencies.map((currency) => {
      priceMap[currency] = price.value(currency) * multiplier;
    });

    return Price.baseInt(priceMap);
  } else {
    throw `Invalid type for price, ${price.constructor.name}. Must be 'Price'`;
  }
}

/**
 * Sums the collection of price instances and returns a resulting price.
 */
export function sum(...prices) {
  let resultMap = {};

  prices.forEach((price, index) => {
    price.currencies.map((currency) => {
      if (index === 0) { resultMap[currency] = price.value(currency); }
      else { resultMap[currency] += price.value(currency); }
    });
  });

  return Price.baseInt(resultMap);
}

/**
 * Applies a discount rate to price and returns the result.
 */
export function discounted(price, rate) {
  let discountedMap = {};

  price.currencies.map((currency) => {
    let lessAmount = (price.value(currency) * rate);
    discountedMap[currency] = price.value(currency) - lessAmount;
  });

  return Price.baseInt(discountedMap);
}

/**
 * Find the minimum prices (for each currency) in a list of prices and
 * returns a new price instance with the minimums for each currency.
 */
export function min(...prices) {
  let minMap = {};
  let currencies = prices[0].currencies;

  currencies.forEach((currency) => {
    minMap[currency] = Math.min(...prices.map(price => price.value(currency)));
  });

  return Price.baseInt(minMap);
}

/**
 * Find the maximum prices (for each currency) in a list of prices and
 * returns a new price instance with the maximums for each currency.
 */
export function max(...prices) {
  let maxMap = {};
  let currencies = prices[0].currencies;

  currencies.forEach(currency => {
    maxMap[currency] = Math.max(...prices.map(price => price.value(currency)));
  })

  return Price.baseInt(maxMap);
}


/**
 * A price instance will make sure that we work with the price as a
 * integer, converting it. A price is always converted to int
 */
export class Price {

  /**
   * The standard constructor expects the price to be in decimal format,
   * and will convert the price to cents automatically.
   *
   * If you don't want the conversion (ie. your prices are already cents) then
   * you can set `asInt` to true.
   *
   * That said it's probably better to use the static constructors,
   * `Price.baseInt()` and `Price.baseDecimal()` to create your price
   * instances, since this is more human readible.
   */
  constructor(priceMap, asInt) {
    this.currencies = Object.keys(priceMap);
    if (this.currencies.length === 0) { throw "priceMap cannot be empty."; }

    // Auto convert every price to integer
    this._priceMap = {};
    if (asInt) {
      this._priceMap = priceMap;
    } else {
      this.currencies.map(currency => {
        this._priceMap[currency] = priceToInt(priceMap[currency]);
      });
    }
  }

  static baseInt(priceMap) { return new this(priceMap, true); }
  static baseDecimal(priceMap) { return new this(priceMap, false); }

  /**
   * Return the price in cents for currency
   */
  value(currency) { return this._priceMap[currency.toLowerCase()]; }

  /**
   * Return the price in decimal for the currency
   */
  toDecimal(currency) { return priceToDecimal(this.value(currency)); }

  net(currency) { return this.toDecimal(currency); }
}
