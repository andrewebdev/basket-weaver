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
import {mul, sum, min, max} from './prices.js';


/**
 * The following is our compatability patches so that babel can transpile
 * correctly to ES5, since es5 does not let you extend an Array.
 */
class ArrayLike {
  constructor(...items) {
    this._items = new Array(...items);
  }
}

Object.defineProperties(
  ArrayLike.prototype,
  ['map', 'some', 'reduce', 'filter', 'find', 'push', 'pop'].reduce((obj, method) => {
    obj[method] = {
      value: function(...args) { return this._items[method](...args); },
      enumerable: false,
      configurable: true,
      writeable: true,
    };
    return obj;
  }, {})
);
/** End ES5 compatability patches **/


/**
 * A single item or variant
 */
export class Item {

  getPricePerItem(...args) { return this.price; }

  getPrice(...args) { return this.getPricePerItem(...args); }

}


/**
 * A single line of an order in a basket
 */
export class ItemLine {

  getPricePerItem(...args) { return this.price; }

  getQuantity() { return 1; }

  getTotal(...args) {
    return mul(this.getPricePerItem(...args), this.getQuantity());
  }

}


/**
 * A group of products like a product with multiple variants
 */
export class ItemRange extends ArrayLike {

  getPricePerItem(item, ...args) { return item.getPrice(...args); }

  getPriceRange(...args) {
    let prices = this.map(item => this.getPricePerItem(item));
    if (!prices) throw "Cannot call getPriceRange() on an empty ItemRange";
    return [min(...prices), max(...prices)];
  }

}


/**
 * A set of products like an order or basket
 */
export class ItemSet extends ArrayLike {

  getTotal(...args) {
    let subTotals = this.map(item => { return item.getTotal(...args); });
    if (!subTotals) throw "Cannot call getTotal() on an empty ItemSet";
    return sum(...subTotals);
  }

}
