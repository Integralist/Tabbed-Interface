/**
 * Following function stores a reference to the core Object's toString() method.
 * This allows us to access JavaScript's internal [[Class]] property which helps us determine the type of certain primitives.
 * This version was updated to use @cowboy's version: https://gist.github.com/1131946
 * 
 * Example Usage:
 * 	getType([1, 2, 3]); 					// Array
 * 	getType({ a: 1, b: 2, c: 3 });          // Object
 * 	getType(123); 							// Number
 * 	getType(new Date); 						// Date
 * 	getType("String"); 						// String
 * 	getType(window); 						// Global
 * 
 * Running {}.toString.call() doesn't work with null or undefined, because executing call() with null or undefined passes window as this.
 * So for Null we check explicit value/type match, and after that if Null doesn't match then we check value is null so we know the obj is Undefined.
 * 
 * @return { String } a trimmed version of the internal [[Class]] value for the specified object (i.e. the object's true data type)
 */

var getType = (function(){
	
	var types = {};
	
	return function(obj) {
		var key;
		
		// If the object is null, return "Null" (IE <= 8)
		return obj === null ? "Null"
			// If the object is undefined, return "Undefined" (IE <= 8)
			: obj == null ? "Undefined"
			// If the object is the global object, return "Global"
			: obj === window ? "Global"
			// Otherwise return the XXXXX part of the full [object XXXXX] value, from cache if possible.
			: types[key = types.toString.call(obj)] || (types[key] = key.slice(8, -1));
	};
	
}());

/**
 * Following method is short hand for document.getElementById
 * This can help improve performance by not having to keep looking up scope chain for either 'document' or 'getElementById'
 * 
 * @param id { String } the identifier for the element we want to access.
 * @return { Element | Undefined } either the element we require or undefined if it's not found
 */
var getEl = function (id) {
	return document.getElementById(id);
};

/**
 * Following method is short hand for document.getElementsByTagName
 * This can help improve performance by not having to keep looking up scope chain for either 'document' or 'getElementsByTagName'
 * Also allows us to return the first found element if we so choose.
 * 
 * @param options { Object } object literal of options
 * @param tag { String } the HTML tag to search for (e.g. 'div')
 * @param context { Element/Node } an element to anchor the search by (defaults to window.document)
 * @param first { Boolean } determines if we return the first element or the entire HTMLCollection
 * @return { Element | HTMLCollection/Array | Undefined } either the element(s) we require or undefined if it's not found
 */
var getTag = function (options) {
	var tag = options.tag || '*', 
        context = options.context || this.doc, 
        returnFirstFound = options.first || false;
	
	return (returnFirstFound) 
                                ? context.getElementsByTagName(tag)[0] 
                                : context.getElementsByTagName(tag);
};

var utilities = {
			
	/**
	 * The toCamelCase method takes a hyphenated value and converts it into a camel case equivalent.
	 * e.g. margin-left becomes marginLeft. 
	 * Hyphens are removed, and each word after the first begins with a capital letter.
	 * 
	 * @param hyphenatedValue { String } hyphenated string to be converted
	 * @return result { String } the camel case version of the string argument
	 */
 	toCamelCase: function(hyphenatedValue) { 
		
		var result = hyphenatedValue.replace(/-\D/g, function(character) { 
			return character.charAt(1).toUpperCase(); 
		}); 
		
		return result;
		 
	}, 
	
	/**
	 * The toHyphens method performs the opposite conversion, taking a camel case string and converting it into a hyphenated one.
	 * e.g. marginLeft becomes margin-left
	 * 
	 * @param camelCaseValue { String } camel cased string to be converted
	 * @return result { String } the hyphenated version of the string argument
	 */
 	toHyphens: function(camelCaseValue) { 
		
		var result = camelCaseValue.replace(/[A-Z]/g, function(character) { 
			return ('-' + character.charAt(0).toLowerCase()); 
		});
	
		return result; 

	}
};

var css = {
			
    /**
     * The getAppliedStyle method returns the current value of a specific CSS style property on a particular element
     * 
     * @param element { Element/Node } the element we wish to find the style value for
     * @param styleName { String } the specific style property we're interested in
     * @return style { String } the value of the style property found
     */
    getAppliedStyle: function(element, styleName) {
    	 
    	var style = "";
    	
    	if (window.getComputedStyle) { 
    		//  W3C specific method. Expects a style property with hyphens 
    		style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(utilities.toHyphens(styleName)); 
    	} 
    	
    	else if (element.currentStyle) { 
    		// Internet Explorer-specific method. Expects style property names in camel case 
    		style = element.currentStyle[utilities.toCamelCase(styleName)]; 
    	}
    	  
    	return style;
    	
    },
    
    /**
     * The getArrayOfClassNames method is a utility method which returns an array of all the CSS class names assigned to a particular element.
     * Multiple class names are separated by a space character
     * 
     * @param element { Element/Node } the element we wish to retrieve class names for
     * @return classNames { String } a list of class names separated with a space in-between
     */
    	getArrayOfClassNames: function(element) {
    	
    	var classNames = []; 
    	
    	if (element.className) { 
    		// If the element has a CSS class specified, create an array 
    		classNames = element.className.split(' '); 
    	} 
    	
    	return classNames;
    	
    },
    
    /**
     * The addClass method adds a new CSS class of a given name to a particular element
     * 
     * @param element { Element/Node } the element we want to add a class name to
     * @param className { String } the class name we want to add
     * @return undefined {  } no explicitly returned value
     */
    addClass: function(element, className) {
    	
        // Get a list of the current CSS class names applied to the element 
    	var classNames = this.getArrayOfClassNames(element); 
    	
    	// Make sure the class doesn't already exist on the element
        if (this.hasClass(element, className)) {
            return;
        }
       
    	// Add the new class name to the list 
    	classNames.push(className);
    	
    	// Convert the list in space-separated string and assign to the element 
    	element.className = classNames.join(' '); 
    	
    },
    
    /**
     * The removeClass method removes a given CSS class name from a given element
     * 
     * @param element { Element/Node } the element we want to remove a class name from
     * @param className { String } the class name we want to remove
     * @return undefined {  } no explicitly returned value
     */
    removeClass: function(element, className) { 
    	
    	var classNames = this.getArrayOfClassNames(element),
            resultingClassNames = []; // Create a new array for storing all the final CSS class names in 
        
    	for (var index = 0, len = classNames.length; index < len; index++) { 
    	
    		// Loop through every class name in the list 
    		if (className != classNames[index]) { 
    		
    			// Add the class name to the new list if it isn't the one specified 
    			resultingClassNames.push(classNames[index]); 
    			
    		}
    		
    	}
    	  
    	// Convert the new list into a  space- separated string and assign it 
    	element.className = resultingClassNames.join(" "); 
    	
    },
    
    /**
     * The hasClass method returns true if a given class name exists on a specific element, false otherwise
     * 
     * @param element { Element/Node } the element we want to check whether a class name exists on
     * @param className { String } the class name we want to check for
     * @return isClassNamePresent { Boolean } if class name was found or not
     */
    hasClass: function(element, className) { 
    	
    	// Assume by default that the class name is not applied to the element 
    	var isClassNamePresent = false,
    		 classNames = this.getArrayOfClassNames(element); 
        
    	for (var index = 0, len = classNames.length; index < len; index++) { 
    	
    		// Loop through each CSS class name applied to this element 
    		if (className == classNames[index]) { 
    		
    			// If the specific class name is found, set the return value to true 
    			isClassNamePresent = true; 
    			
    		} 
    		
    	} 
        
    	// Return true or false, depending on if the specified class name was found 
    	return isClassNamePresent; 
    	
    }
    
};

/**
 * The following method is a Constructor with additional methods attached to the prototype
 * which aid every time you need to check whether a property is present in an object.
 * We approach an object as just a set of properties.
 * And because we can use it to look things up by name, we will call it a 'Dictionary'.
 * Lastly, as it's a constructor we'll use the correct naming convention of using a capitalised first letter.
 */
var Dictionary = function (startValues) {
	this.values =  startValues || {};
}

Dictionary.prototype = {
	
	/**
	 * The following method stores a new property and associated value
	 * 
	 * @param name { String } the property name to create
	 * @param value { Value } the value to store under the specified property name
	 * @return undefined {  } no explicitly returned value
	 */
	store: function(name, value) {
		this.values[name] = value;
	},
	
	/**
	 * The following method checks the object for a named property.
	 * 
	 * @param name { String } the property name to lookup 
	 * @return { Value } returns the value associated with the specified object property name
	 */
	lookup: function(name) {
		return this.values[name];
	},
	
	/**
	 * The following method checks the object for a named property.
	 * 
	 * @param name { String } the property name to check for
	 * @return { Boolean } returns whether the object contains a specified property name
	 */
	contains: function(name) {
		return Object.prototype.hasOwnProperty.call(this.values, name) && Object.prototype.propertyIsEnumerable.call(this.values, name);
	},
	
	/**
	 * The following method executes a function for every property in this object.
	 * 
	 * @param action { Function } a user specified callback function to execute for each property in this object
	 * @return undefined {  } no explicitly returned value
	 */
	each: function(action) {
		var object = this.values;
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				action(property, object[property]);
			}
		}
	},
	
	/**
	 * The following method returns an Array of all property names within an object.
	 * 
	 * @return names { Array } a list of all property names in this object
	 */
	names: function() {
		var names = [];
		
		this.each(function(name, value) {
			names.push(name);
		});
		
		return names;
	}
	
};