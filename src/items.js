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
 * A single item or variant
 */
export class Item {
  getPricePerItem() {
    throw "getPricePerItem() not implemented"
  }

  getPrice() {
    throw "getPrice() not implemented"
  }
}


/**
 * A single line of an order in a basket
 */
export class ItemLine {
  getPricePerItem() { throw "getPricePerItem() not implemented" }

  getQuantity() { return 1; }

  getTotal() { return this.getPricePerItem() * this.getQuantity(); }
}


/**
 * A group of products like a product with multiple variants
 */
export class ItemRange {
  getPricePerItem(item) { return item.getTotal(); }

  getPriceRange() {
    let prices = this.map(item => this.getPricePerItem(item));
    if (!prices) throw "Cannot call getPriceRange() on an empty ItemRange";
    return [Math.min(...prices), Math.max(...prices)];
  }
}


/**
 * A set of products like an order or basket
 */
export class ItemSet extends Array {
  getSubTotal(item) { return item.getTotal(); }

  getTotal() {
    let subTotals = this.map(item => this.getSubTotal(item));
    if (!subTotals) throw "Cannot call getTotal() on an empty ItemSet";
    return subTotals.reduce((x, y) => x + y);
  }
}
