/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combinations ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// class Selector {
//   constructor() {
//     this.element = '';
//     this.id = '';
//     this.class = [];
//     this.attr = [];
//     this.pseudoClass = [];
//     this.pseudoElement = '';
//   }

//   return() {
//   return [this.element, this.id, this.class, this.attr, this.pC, this.pE].flat().join('');
//   }

//   clear() {
//     this.element = '';
//     this.id = '';
//     this.class = [];
//     this.attr = [];
//     this.pseudoClass = [];
//     this.pseudoElement = '';
//   }
// }

// const cssSelectorBuilder = {
//   separators: [' ', '+', '~', '>'],
//   selector: new Selector(),
//   value: '',

//   element(value) {
//     this.selector.element = `${value}`;
//     return this;
//   },

//   id(value) {
//     this.selector.id = `#${value}`;
//     return this;
//   },

//   class(value) {
//     this.selector.class.push(`.${value}`);
//     return this;
//   },

//   attr(value) {
//     this.selector.attr.push(`[${value}]`);
//     return this;
//   },

//   pseudoClass(value) {
//     this.selector.pseudoClass.push(`:${value}`);
//     return this;
//   },

//   pseudoElement(value) {
//     this.selector.pseudoElement = `::${value}`;
//     return this;
//   },

//   stringify() {
//     const result = (this.value) ? this.value : this.selector.return();
//     this.selector.clear();
//     return result;
//   },

//   combine(builder1, separator, builder2) {
//     const newBuilder = cssSelectorBuilder;
//     newBuilder.value = `${builder1.stringify()} ${separator} ${builder2.stringify()}`;
//     return newBuilder;
//   },

// };

const cssSelectorBuilder = {
  order: ['element', 'id', 'class', 'attribute', 'pseudo-class', 'pseudo-element', 'combine'],
  unique: ['element', 'id', 'pseudo-element'],
  result: [],

  multiple() {
    return this.result
      .map((el) => el.type)
      .filter((el, i, arr) => arr.indexOf(el) !== i)
      .every((el) => this.unique.indexOf(el) === -1);
  },

  ordered() {
    if (this.result.length === 1) return true;
    return this.result
      .map((el) => el.type)
      .filter((el, i, arr) => arr.indexOf(el) === i)
      .every((el, i, arr) => this.order.indexOf(el) > this.order.indexOf(arr[i - 1]));
  },

  add(type, ...value) {
    const newBuilder = { ...this };
    newBuilder.result = this.result.concat({ type, value: value.join('') });

    if (!newBuilder.multiple()) newBuilder.checkUnique();
    if (!newBuilder.ordered()) newBuilder.checkOrder();

    return newBuilder;
  },

  element(value) {
    return this.add('element', value);
  },

  id(value) {
    return this.add('id', `#${value}`);
  },

  class(value) {
    return this.add('class', `.${value}`);
  },

  attr(value) {
    return this.add('attribute', `[${value}]`);
  },

  pseudoClass(value) {
    return this.add('pseudo-class', `:${value}`);
  },

  pseudoElement(value) {
    return this.add('pseudo-element', `::${value}`);
  },

  combine(selector1, separator, selector2) {
    return this.add('combine', selector1.stringify(), ` ${separator} `, selector2.stringify());
  },

  return() {
    return this.result.splice(0, this.result.length).map((el) => el.value).join('');
  },

  stringify() {
    return this.return();
  },

  checkOrder() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

  checkUnique() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
