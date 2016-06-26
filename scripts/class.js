/**
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
var Class = (function(){
	
	var initializing = false,
		fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	
	// The base Class implementation (does nothing)
	this.Class = function(){};
	
	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		
		var _super = this.prototype;
        
		// Instantiate a base class
		// (Only create the instance, don't run the constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
        
		// Copy the properties over onto the new prototype
		for (var name in prop) {
            // Check if we're overwriting an existing function
            if (typeof prop[name] == "function"
                    && typeof _super[name] == "function"
                    && fnTest.test(prop[name])) {
                prototype[name] = (function(name, fn){
                    return function(){
                        
                        var tmp = this._super;
                        
                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];
                        
                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);		
                        this._super = tmp;
                        
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                prototype[name] = prop[name];
            }
		}
        
		// The dummy class constructor
		function Class() {
            // All construction is actually done in the construct method
            if (!initializing && this.construct) {
                this.construct.apply(this, arguments);
            }
		}
		
		// Populate our constructed prototype object
		Class.prototype = prototype;
		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;
		// And make this class extendable
		Class.extend = arguments.callee;
		
		return Class;
	};
	
	return this.Class;
})();
