/**
 * JavaScript Cards Trick
 * By Diego P. M. Baltar http://dpmbaltar.com.ar/
 * MIT Licensed.
 */
if (typeof Object.keys == "undefined") {
  Object.prototype.keys = function(object) {
    var properties = new Array();

    for (var property in object) {
      if (object.propertyIsEnumerable(property)) {
        properties.push(property);
      }
    }

    return properties;
  };
}

/*
if (typeof Object.toArray == "undefined") {
  Object.prototype.toArray = function() {
    var array = new Array();

    for (var property in this) {
      if (this.propertyIsEnumerable(property)) {
        array[property] = this[property];
      }
    }

    return array;
  };
}*/

/**
 * Card types.
 */
var CardType = {
  CLUB:    "club",
  DIAMOND: "diamond",
  HEART:   "heart",
  SPADE:   "spade"
};

/**
 * Card values.
 */
var CardValue = {
  ACE:   "ace",
  TWO:   "two",
  THREE: "three",
  FOUR:  "four",
  FIVE:  "five",
  SIX:   "six",
  SEVEN: "seven",
  EIGHT: "eight",
  NINE:  "nine",
  TEN:   "ten",
  JACK:  "jack",
  QUEEN: "queen",
  KING:  "king"
};

/**
 * Card.
 */
var Card = Class.extend({

  /**
   * The card type.
   * @access private
   * @type {String}
   */
  _type: null,

  /**
   * The card value.
   * @access private
   * @type {String}
   */
  _value: null,

  /**
   * Returns the card type.
   * @return {String}
   */
  getType: function() {
    return this._type;
  },

  /**
   * Returns the card value.
   * @return {String}
   */
  getValue: function() {
    return this._value;
  },

  /**
   * Returns the DOM element representation of the card.
   * @access private
   * @return {DOMElement}
   */
  toDOMElement: function() {
    var self = this, domElement;

    domElement = document.createElement("div");
    domElement.setAttribute("class", "card "+this._type+" "+this._value);
    domElement.addEventListener("click", function() {
      //alert(self.toString());
    });

    return domElement;
  },

  /**
   * Returns the string representation of this card.
   * @return {String}
   */
  toString: function() {
    return "[Card "+this._type+" "+this._value+"]";
  },

  /**
   * The Card constructor.
   * @param {String} type The card type.
   * @param {Number} value The card value.
   * @return {Card}
   */
  construct: function(type, value) {
    type = new String(type);
    value = new String(value);

    if (!CardType.hasOwnProperty(type.toUpperCase())) {
      throw new Error("Invalid card type");
    } else if (!CardValue.hasOwnProperty(value.toUpperCase())) {
      throw new Error("Invalid card value");
    }

    this._type = type.toLowerCase();
    this._value = value.toLowerCase();
  }
});

/**
 * Cards deck.
 */
var CardDeck = Class.extend({

  /**
   * The card deck.
   * @access private
   * @type {Array}
   */
  _deck: null,

  /**
   * Indicates whether the specified card exists in this deck or not.
   * @return {Boolean}
   */
  contains: function(card) {
    return this._deck.indexOf(card) != -1;
  },

  /**
   * Indicates whether a card exists at the specified index.
   * @return {Boolean}
   * @throws {TypeError} If index is not a number.
   */
  containsAt: function(index) {
    index = new Number(index);

    if (isNaN(index)) {
      throw new TypeError("Invalid index type");
    }

    return typeof this._deck[index] != "undefined";
  },

  /**
   * Indicates whether this card deck is empty or not.
   * @return {Boolean}
   */
  count: function() {
    return this._deck.length;
  },

  /**
   * Returns the card at the specified index.
   * @param {Number} index The card index.
   * @return {Boolean}
   * @throws {TypeError} If index is not a number.
   * @throws {RangeError} If index is out of range.
   */
  getAt: function(index) {
    index = new Number(index);

    if (isNaN(index)) {
      throw new TypeError("Invalid index type");
    } else if (index < 0 || index >= this._deck.length) {
      throw new RangeError("Index is out of range");
    }

    return this._deck[index];
  },

  /**
   * Removes and returns a sub deck from this deck between the specified
   * fromIndex, inclusive, and toIndex, exclusive.
   * @param {Number} fromIndex Start index (inclusive).
   * @param {Number} toIndex End index (exclusive).
   * @return {CardDeck}
   * @throws {TypeError} If endpoint indices are not numbers.
   * @throws {Error} If endpoint indices are out of order.
   * @throws {RangeError} If one/both of the endpoint indices is out of range.
   */
  getSubDeck: function(fromIndex, toIndex) {
    fromIndex = new Number(fromIndex);
    toIndex = new Number(toIndex);

    if (isNaN(fromIndex) || isNaN(toIndex)) {
      throw new TypeError("Invalid endpoint indices type");
    } else if (fromIndex == toIndex) {
      return new CardDeck();
    } else if (fromIndex > toIndex) {
      throw new Error("Endpoint indices are out of order");
    } else if (fromIndex < 0 || toIndex > this._deck.length) {
      throw new RangeError(
        "One/both of the endpoint indices value is out of range"
      );
    } else {
      return new CardDeck(this._deck.splice(fromIndex, toIndex - fromIndex));
    }
  },

  /**
   * Indicates whether this card deck is empty or not.
   * @return {Boolean}
   */
  isEmpty: function() {
    return this._deck.length == 0;
  },

  /**
   * Removes and returns the last card from the deck.
   * @return {Card}
   */
  pop: function() {
    return this._deck.pop();
  },

  /**
   * Adds the specified card at the end of the deck.
   * @param {Card} card The card to be added.
   * @return {Void}
   * @throws {TypeError} If card is not an instance of Card.
   */
  push: function(card) {
    if (!card instanceof Card) {
      throw new TypeError("Invalid card type");
    }

    this._deck.push(card);
  },

  /**
   * Merges the specified card deck at the end of the deck.
   * Merged cards are removed from the given deck.
   * @param {CardDeck|Array} cards The cards to be added.
   * @return {Void}
   * @throws {TypeError} If cards is not an instance of CardDeck or Array.
   */
  pushAll: function(cards) {
    if (cards instanceof CardDeck) {
      while (!cards.isEmpty()) {
        this.push(cards.shift());
      }
    } else if (cards instanceof Array) {
      while (cards.length != 0) {
        this.push(cards.shift());
      }
    } else {
      throw new TypeError("Invalid cards type");
    }
  },

  /**
   * Removes and returns the first card from the deck.
   * @return {Card}
   */
  shift: function() {
    return this._deck.shift();
  },

  /**
   * Adds the specified card at the beginning of the deck.
   * @param {Card} card The card to be added.
   * @return {Void}
   * @throws {TypeError} If card is not an instance of Card.
   */
  unshift: function(card) {
    if (!card instanceof Card) {
      throw new TypeError("Invalid card type");
    }

    this._deck.unshift(card);
  },

  /**
   * Merges the specified card deck at the beginning of the deck.
   * Merged cards are removed from the given deck.
   * @param {CardDeck|Array} cards The cards to be added.
   * @return {Void}
   * @throws {TypeError} If cards is not an instance of CardDeck or Array.
   */
  unshiftAll: function(cards) {
    if (cards instanceof CardDeck) {
      while (!cards.isEmpty()) {
        this.unshift(cards.pop());
      }
    } else if (cards instanceof Array) {
      while (cards.length != 0) {
        this.unshift(cards.pop());
      }
    } else {
      throw new TypeError("Invalid cards type");
    }
  },

  /**
   * Returns the array representation of the card deck.
   * @return {Array}
   */
  toArray: function() {
    return this._deck;
  },

  toDOMElement: function() {
    var column, index = 0;
    column = document.createElement("div");
    column.setAttribute("class", "column col-xs-6 col-sm-4");

    while (index < this._deck.length) {
      column.appendChild(this._deck[index].toDOMElement());
      index++;
    }

    return column;
  },

  /**
   * Returns the string representation of this card deck.
   * @return {String}
   */
  toString: function() {
    var deckString = "";
    var cardIndex;

    for (cardIndex in this._deck) {
      if (this._deck[cardIndex] instanceof Card) {
        deckString+= this._deck[cardIndex]+",";
      }
    }

    return deckString.slice(0, -1);
  },

  /**
   * The CardDeck constructor.
   * @param {Array} cards The initial cards of this deck.
   * @return {CardDeck}
   */
  construct: function(cards) {
    this._deck = new Array();

    if (typeof cards != "undefined") {
      try {
        this.pushAll(cards);
      } catch (error){};
    }
  }
});

/**
 * Create random card deck.
 * @static
 * @access public
 * @return {CardDeck}
 */
CardDeck.createRandom = function() {
  this.shuffle = function(inputArray) {
    var oldArray = inputArray;
    var newArray = new Array();
    var key;

    for (key in oldArray) {
      if (oldArray.hasOwnProperty(key)) {
        newArray.push(oldArray[key]);
      }
    }

    newArray.sort(function(){
      return 0.5 - Math.random();
    });

    return newArray;
  };

  var deck = new CardDeck();
  var cards = new Array();
  var index;

  for (index in CardValue) {
    cards.push(new Card(CardType.CLUB, CardValue[index]));
    cards.push(new Card(CardType.DIAMOND, CardValue[index]));
    cards.push(new Card(CardType.HEART, CardValue[index]));
    cards.push(new Card(CardType.SPADE, CardValue[index]));
  }

  deck.pushAll(this.shuffle(cards));

  return deck;
};

/**
 * The one who does the magic...
 */
var Tricker = Class.extend({

  /**
   * Array of 3 cards subdeck (7 each).
   * @access private
   * @type {Array}
   */
  _subdecks: null,

  /**
   * The card deck to be used (21 different random cards).
   * @access private
   * @type {CardDeck}
   */
  _deck: null,

  _part: 0,

  _selected: null,

  /**
   * The "stage" (DOM element) where the trick is done.
   * @access private
   * @type {DOMElement}
   */
  _stage: null,

  /**
   * Conclude trick.
   * @access public
   * @return {Void}
   */
  conclude: function() {
    this._subdecks[1].pushAll(this._deck.getSubDeck(10, 11));
  },

  /**
   * Deal cards into 3 separated subdecks.
   * @access public
   * @return {Void}
   */
  deal: function() {
    var cardIndex = 0;
    var subdeckIndex = 0;
    var card;
    var subdeck;
    var dir = 1;

    while (!this._deck.isEmpty()) {
      if (subdeckIndex > 2) {
        subdeckIndex = 2;
        dir = -1;
      } else if (subdeckIndex < 0) {
        subdeckIndex = 0;
        dir = 1;
      }

      card = this._deck.pop();
      subdeck = this._subdecks[subdeckIndex];
      subdeck.push(card);

      subdeckIndex+= dir;
      cardIndex++;
    }
  },

  /**
    * Gather cards from the 3 separated subdecks into the main deck.
    * @access public
    * @param {Number} selected The selected subdeck index (0, 1 or 2).
    * @return {Void}
    */
  gather: function() {
    var indices = [0, 1, 2];
    indices.splice(indices.indexOf(this._selected), 1);

    this._deck.pushAll(this._subdecks[this._selected]);
    this._deck.unshiftAll(this._subdecks[indices[0]]);
    this._deck.pushAll(this._subdecks[indices[1]]);
  },

  /**
   * Perform trick.
   * @access public
   * @param {DOMElement} stage The "stage" for the trick (a DOM element).
   * @return {Void}
   */
  perform: function() {
    switch (this._part) {
      case 0:
        this.deal();
        this._part++;
        break;
      case 1:
      case 2:
        this.gather();
        this.deal();
        this._part++;
        break;
      case 3:
        this.gather();
        this.conclude();
        this._part++;
        break;
    }

    this.show();
  },

  setSelected: function(selected) {
    this._selected = parseInt(selected);
  },

  setStage: function(stage) {
    this._stage = stage;
  },

  show: function() {
    this._stage.removeChild(stage.childNodes[0]);
    this._stage.appendChild(this.toDOMElement());
  },

  toDOMElement: function() {
    var table, row, columns;

    table = document.createElement("div");
    table.setAttribute("class", "table");

    row = document.createElement("div");
    row.setAttribute("class", "row");

    columns = new Array();
    columns.push(this._subdecks[0].toDOMElement());
    columns.push(this._subdecks[1].toDOMElement());
    columns.push(this._subdecks[2].toDOMElement());

    //Set column identifiers
    columns[0].setAttribute("id", "0");
    columns[1].setAttribute("id", "1");
    columns[2].setAttribute("id", "2");

    var self = this;

    function columnSelect(event) {
      self.setSelected(event.currentTarget.id);
      self.perform();
    }

    //Set column click events
    columns[0].addEventListener("click", columnSelect);
    columns[1].addEventListener("click", columnSelect);
    columns[2].addEventListener("click", columnSelect);

    row.appendChild(columns[0]);
    row.appendChild(columns[1]);
    row.appendChild(columns[2]);

    table.appendChild(row);

    return table;
  },

  /**
   * Create a new Tricker instance.
   * @return {Tricker}
   */
  construct: function() {
    this._deck = CardDeck.createRandom().getSubDeck(0, 21);
    this._subdecks = new Array();
    this._subdecks[0] = new CardDeck();
    this._subdecks[1] = new CardDeck();
    this._subdecks[2] = new CardDeck();
  }
});

window.onload = function() {
  var tricker, stage;
  stage = document.getElementById("stage");
  tricker = new Tricker();
  tricker.setStage(stage);
  tricker.perform();
};
