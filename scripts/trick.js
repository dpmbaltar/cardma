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
	 * The card DOM element.
	 * @access private
	 * @type {DOMElement}
	 */
	_domElement: null,
	
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
	 * Returns the card DOM element.
	 * @return {Object}
	 */
	getDOMElement: function() {
		return this._domElement;
	},
	
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
		
		this._type = type;
		this._value = value;
		this._domElement = document.createElement("div");
		this._domElement.setAttribute("class", "card "+type+" "+value);
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
	 * Adds the specified card into this deck.
	 * @param {Card} card The card to be added.
	 * @return {Void}
	 * @throws {TypeError} If card is not an instance of Card.
	 */
	add: function(card) {
		if (!card instanceof Card) {
			throw new TypeError("Invalid card type");
		}
		
		this._deck.push(card);
	},
	
	/**
	 * Adds the specified cards into this deck.
	 * @param {CardDeck|Array} cards The card to be added.
	 * @return {Void}
	 * @throws {TypeError} If cards is not an instance of CardDeck or Array.
	 */
	addAll: function(cards) {
		if (cards instanceof CardDeck) {
			var index = 0;
			
			while (index < cards.count()) {
				this.add(cards.getAt(0));
				index++;
			}
		} else if (cards instanceof Array) {
			for (var index in cards) {
				this.add(cards[index]);
			}
		} else {
			throw new TypeError("Invalid cards type");
		}
	},
	
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
	 * Returns a sub deck from this deck between the specified fromIndex,
	 * inclusive, and toIndex, exclusive.
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
			return new CardDeck(this._deck.slice(fromIndex, toIndex));
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
				this.addAll(cards);
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
	
	deck.addAll(this.shuffle(cards).slice(0, 21));
	
	return deck;
};

/**
 * The one who does the magic...
 */
var Tricker = Class.extend({
	
	/**
	 * Array of 3 columns (DOM elements) to deal cards.
	 * @access private
	 * @type {Array}
	 */
	_columns: null,
	
	/**
	 * The card deck to be used.
	 * @access private
	 * @type {CardDeck}
	 */
	_cardDeck: null,
	
	/**
	 * Row (DOM element) for cards.
	 * @access private
	 * @type {DOMElement}
	 */
	_row: null,
	
	/**
	 * The "table" (DOM container element) where the trick is done.
	 * @access private
	 * @type {DOMElement}
	 */
	_table: null,
	
	/**
     * Conclude trick.
     * @access public
     * @return {Void}
     */
	conclude: function() {
		
	},
	
    /**
     * Deal cards.
     * @access public
     * @return {Void}
     */
    deal: function() {
		var cardIndex = 0;
		var columnIndex = 0;
		var card;
		var column;
		var dir = 1;
		
		while (cardIndex < this._cardDeck.count()) {
			if (columnIndex > 2) {
				columnIndex = 2;
				dir = -1;
			} else if (columnIndex < 0) {
				columnIndex = 0;
				dir = 1;
			}
			
			column = this._columns[columnIndex];
			card = this._cardDeck.getAt(cardIndex);
			
			column.appendChild(card.getDOMElement());
			
			columnIndex = dir > 0 ? columnIndex + 1 : columnIndex - 1;
			cardIndex++;
		}
	},
	
	/**
     * Gather cards.
     * @access public
     * @return {Void}
     */
    gather: function() {
		
	},
	
	getTableDOMElement: function() {
		return this._table;
	},
	
	/**
     * Perform trick.
     * @access public
     * @param {Number} part The part of the trick; either 0, 1, 2 or 3.
     * @return {Void}
     */
    perform: function(part) {
		part = new Number(part);
		
		switch (part) {
			case 0:
				this.deal();
				break;
			case 1:
			case 2:
				this.gather();
				this.deal();
				break;
			case 3:
				this.gather();
				this.conclude();
				break;
		}
	},
    
    /**
     * Create a new Tricker instance.
     * @param {CardDeck} cardDeck The card deck to be used.
     * @return {Tricker}
     */
    construct: function(cardDeck) {
        this._cardDeck = cardDeck;
        this._columns = new Array();
        
        this._table = document.createElement("div");
		this._table.setAttribute("class", "table");
		
		this._row = document.createElement("div");
		this._row.setAttribute("class", "row");
		
		this._columns[0] = document.createElement("div");
		this._columns[0].setAttribute("class", "column"+" col-xs-6 col-sm-4");
		this._columns[1] = this._columns[0].cloneNode();
		this._columns[2] = this._columns[0].cloneNode();
		
		var self = this;
		
		function columnClick() {
			alert(":O");
			//self.perform(++self._part);
		}
		
		this._columns[0].addEventListener("click", columnClick);
		this._columns[1].addEventListener("click", columnClick);
		this._columns[2].addEventListener("click", columnClick);
		
		this._row.appendChild(this._columns[0]);
		this._row.appendChild(this._columns[1]);
		this._row.appendChild(this._columns[2]);
		
		this._table.appendChild(this._row);
    }
});

window.onload = function() {
	var tricker, trick;
	
	tricker = new Tricker(CardDeck.createRandom());
	tricker.deal();
	
	trick = document.getElementById("trick");
	trick.appendChild(tricker.getTableDOMElement());
};
