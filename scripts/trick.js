/**
 * JavaScript Cards Trick
 * By Diego P. M. Baltar <dpmbaltar@gmail.com>
 * MIT Licensed.
 */

/**
 * Card type.
 */
var CardType = {
  CLUB:    "club",
  DIAMOND: "diamond",
  HEART:   "heart",
  SPADE:   "spade"
};

/**
 * Card value.
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
   * The Card constructor.
   * @access public
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
  },

  /**
   * Returns the card type.
   * @access public
   * @return {String}
   */
  getType: function() {
    return this._type;
  },

  /**
   * Returns the card value.
   * @access public
   * @return {String}
   */
  getValue: function() {
    return this._value;
  },

  /**
   * Returns the DOM element representation of the card.
   * @access public
   * @return {DOMElement}
   */
  toDOMElement: function() {
    var cssClass, domElement;

    cssClass = "card "+this._type+" "+this._value;
    domElement = document.createElement("div");
    domElement.setAttribute("class", cssClass);

    return domElement;
  },

  /**
   * Returns the string representation of the card.
   * @return {String}
   */
  toString: function() {
    return "[Card "+this._type+" "+this._value+"]";
  }
});

/**
 * Card deck.
 */
var CardDeck = Class.extend({

  /**
   * The card deck.
   * @access private
   * @type {Array}
   */
  _deck: null,

  /**
   * The CardDeck constructor.
   * @access public
   * @param {Array} cards The initial cards for the deck.
   * @return {CardDeck}
   */
  construct: function(cards) {
    this._deck = new Array();

    if (typeof cards != "undefined") {
      try {
        this.pushAll(cards);
      } catch (error) {
        console.log(error.message);
      };
    }
  },

  /**
   * Indicates whether the specified card exists in the deck or not.
   * @access public
   * @return {Boolean}
   */
  contains: function(card) {
    return (this._deck.indexOf(card) != -1);
  },

  /**
   * Indicates whether the specified index maps to a card in the deck.
   * @access public
   * @return {Boolean}
   * @throws {TypeError} If index is not a number.
   */
  containsAt: function(index) {
    index = new Number(index);

    if (Number.isNaN(index)) {
      throw new TypeError("Invalid index type");
    }

    return (typeof this._deck[index] != "undefined");
  },

  /**
   * Returns the number of cards in the deck.
   * @access public
   * @return {Boolean}
   */
  count: function() {
    return this._deck.length;
  },

  /**
   * Returns the card at the specified index.
   * @access public
   * @param {Number} index The card index.
   * @return {Boolean}
   * @throws {TypeError} If index is not a number.
   * @throws {RangeError} If index is out of range.
   */
  getAt: function(index) {
    index = new Number(index);

    if (Number.isNaN(index)) {
      throw new TypeError("Invalid index type");
    } else if (index < 0 || index >= this._deck.length) {
      throw new RangeError("Index is out of range");
    }

    return this._deck[index];
  },

  /**
   * Removes and returns a subdeck from the deck between the specified
   * fromIndex, inclusive, and toIndex, exclusive.
   * @access public
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
    var subdeck;

    if (Number.isNaN(fromIndex) || Number.isNaN(toIndex)) {
      throw new TypeError("Invalid endpoint indices type");
    } else if (fromIndex > toIndex) {
      throw new Error("Endpoint indices are out of order");
    } else if (fromIndex < 0 || toIndex > this._deck.length) {
      throw new RangeError(
        "One/both of the endpoint indices value is out of range"
      );
    } else if (fromIndex == toIndex) {
      subdeck = new CardDeck();
    } else {
      subdeck = new CardDeck(this._deck.splice(fromIndex, toIndex - fromIndex));
    }

    return subdeck;
  },

  /**
   * Indicates whether the card deck is empty or not.
   * @access public
   * @return {Boolean}
   */
  isEmpty: function() {
    return (this._deck.length == 0);
  },

  /**
   * Removes and returns the last card from the deck.
   * @access public
   * @return {Card}
   */
  pop: function() {
    return this._deck.pop();
  },

  /**
   * Adds the specified card at the end of the deck.
   * @access public
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
   * @access public
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
   * @access public
   * @return {Card}
   */
  shift: function() {
    return this._deck.shift();
  },

  /**
   * Shuffles the card deck.
   * @access public
   * @return {Void}
   */
  shuffle: function() {
    this._deck.sort(function() {
      return 0.5 - Math.random();
    });
  },

  /**
   * Adds the specified card at the beginning of the deck.
   * @access public
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
   * @access public
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
   * @access public
   * @return {Array}
   */
  toArray: function() {
    return this._deck;
  },

  /**
   * Returns the DOM element representation of the card deck.
   * @access public
   * @return {DOMElement}
   */
  toDOMElement: function() {
    var domElement, index;

    domElement = document.createElement("div");
    domElement.setAttribute("class", "column col-xs-6 col-sm-4");

    for (index in this._deck) {
      domElement.appendChild(this._deck[index].toDOMElement());
    }

    return domElement;
  },

  /**
   * Returns the string representation of the card deck.
   * @access public
   * @return {String}
   */
  toString: function() {
    var deckString = "";

    for (var index in this._deck) {
      if (this._deck[index] instanceof Card) {
        deckString+= this._deck[index]+",";
      }
    }

    return deckString.slice(0, -1);
  }
});

/**
 * Creates a random card deck.
 * @static
 * @access public
 * @return {CardDeck}
 */
CardDeck.createRandom = function() {
  var deck = new CardDeck();

  for (var index in CardValue) {
    deck.push(new Card(CardType.CLUB, CardValue[index]));
    deck.push(new Card(CardType.DIAMOND, CardValue[index]));
    deck.push(new Card(CardType.HEART, CardValue[index]));
    deck.push(new Card(CardType.SPADE, CardValue[index]));
  }

  deck.shuffle();

  return deck;
};

/**
 * The one who does the "magic"...
 */
var Tricker = Class.extend({

  /**
   * Array of 3 subdecks of the main deck, with 7 cards each.
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

  /**
   * The trick part.
   * @access private
   * @type {Number}
   */
  _part: 0,

  /**
   * The selected subdeck index (0, 1 or 2).
   * @access private
   * @type {Number}
   */
  _selected: -1,

  /**
   * The "stage" (DOM element) where the trick is performed.
   * @access private
   * @type {DOMElement}
   */
  _stage: null,

  /**
   * The Tricker constructor.
   * @access public
   * @return {Tricker}
   */
  construct: function() {
    this._deck = CardDeck.createRandom().getSubDeck(0, 21);
    this._subdecks = new Array();
    this._subdecks[0] = new CardDeck();
    this._subdecks[1] = new CardDeck();
    this._subdecks[2] = new CardDeck();
  },

  /**
   * Concludes the trick.
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
    var card;
    var subdeck;
    var cardIndex = 0;
    var subdeckIndex = 0;
    var dealDirection = 1;

    while (!this._deck.isEmpty()) {
      if (subdeckIndex > 2) {
        subdeckIndex = 2;
        dealDirection = -1;
      } else if (subdeckIndex < 0) {
        subdeckIndex = 0;
        dealDirection = 1;
      }

      card = this._deck.pop();
      subdeck = this._subdecks[subdeckIndex];
      subdeck.push(card);

      subdeckIndex+= dealDirection;
      cardIndex++;
    }
  },

  /**
   * Gather cards from the 3 separated subdecks into the main deck.
   * @access public
   * @return {Void}
   */
  gather: function() {
    var indices = [0, 1, 2];
    indices.splice(indices.indexOf(this._selected), 1);

    this._deck.pushAll(this._subdecks[this._selected]);
    this._deck.pushAll(this._subdecks[indices[1]]);
    this._deck.unshiftAll(this._subdecks[indices[0]]);
  },

  /**
   * Performs the trick.
   * @access public
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
      default:
        // Do chit chattery...
    }
  },

  /**
   * Sets the selected subdeck.
   * @access public
   * @param {Number} selected The selected subdeck index (0, 1 or 2).
   * @return {Void}
   */
  setSelected: function(selected) {
    this._selected = parseInt(selected);
  },

  /**
   * Sets the stage.
   * @access public
   * @param {DOMElement} stage The "stage" (DOM element) to be set.
   * @return {Void}
   */
  setStage: function(stage) {
    this._stage = stage;
  },

  /**
   * Shows the current trick state (updates the HTML view).
   * @access public
   * @return {Void}
   */
  show: function() {
    this._stage.removeChild(this._stage.childNodes[0]);
    this._stage.appendChild(this.toDOMElement());
  },

  /**
   * Returns the DOM element representation of the tricker.
   * @access public
   * @return {DOMElement}
   */
  toDOMElement: function() {
    var $this = this;
    var table, row, columns;

    // Column click event listener
    function columnSelect(event) {
      $this.setSelected(event.currentTarget.id);
      $this.perform();
      $this.show();
    }

    table = document.createElement("div");
    table.setAttribute("class", "table");

    row = document.createElement("div");
    row.setAttribute("class", "row");

    columns = new Array();

    for (var index in this._subdecks) {
      columns.push(this._subdecks[index].toDOMElement());
      columns[index].setAttribute("id", index);
      columns[index].addEventListener("click", columnSelect);
      row.appendChild(columns[index]);
    }

    table.appendChild(row);

    return table;
  }
});
