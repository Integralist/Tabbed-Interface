/**
 * Following method handles setting up a tab facility for multiple components.
 * It checks which element is requiring tabs and ensures it is converted to using tabs.
 *
 * @param which { String } the element to convert to using tabs
 * @return undefined {  } no explicitly returned value
 */
Tabs = {
    
	init: function(component) {
        
        // There could be multiple components that use the 'tab' script so we check for Array as the argument passed through.
        if (getType(component) === 'Array') {
            for (prop in component) {
                if (component.hasOwnProperty(prop)) {
                    this.process(component[prop]);
                }
            }
        } 
        // Otherwise we just initiate a single 'tabbed search' instance.
        else {
            this.process(component);
        }
        
    },
    
    process: function(which) {
        
/*******************************************************
 * VARIABLE SET-UP/CACHING
 *******************************************************/
     
		var container,
			tabArray,
			len,
			tabDictionary,
			tabObject = {},
			self = this,
			tabs,
			lis;
	             
		switch (which) {
		    case 'home':
		        container = 'my-home-tabs';
		        tabArray = ['tab-a', 'tab-b'];
		        len = tabArray.length;
		        break;
		        
		    case 'about':
		        container = 'my-about-tabs';
		        tabArray = ['tab-c', 'tab-d'];
		        len = tabArray.length;
		        break;
		        
		    default:
		    	return;
		}
		
		tabs = getEl(container);
		lis = getTag({ tag:'li', context:tabs });
             
/*******************************************************
 * TABS SET-UP
 *******************************************************/
             
		// Loop through the tabArray grabbing each element and assigning to object
		while (len--) {
		    // Store elements
		    tabObject[tabArray[len]] = getEl(tabArray[len]);
		}
		
		// All tabs execept the first are automatically hidden by manual addition of class 'hideElement'
		css.addClass(tabObject[tabArray[0]], 'hideElement');
		
		// Create a Dictionary of the tabObject
		tabDictionary = new Dictionary(tabObject);
		
		// Show the tab links
		css.addClass(tabs, 'showElement');
		
		// Show the first tab element
		css.addClass(tabObject[tabArray[0]], 'showElement');
        
/*******************************************************
 * EVENT LISTENERS
 *******************************************************/
        
        var handler = (function (td) {
	        return function(e) {
	            var targ = e.target,
                    link,
                    selectedTab,
                    lisLength = lis.length;
	                
	            if (targ.href === undefined) {
	                return;
	            }
	            
	            link = targ.href.split('#');
	             
	            // Use Dictionary to find object
	            if (td.contains(link[1])) {
	                selectedTab = td.lookup(link[1]);
	            }
	            
	            // Hide all tabs
	            td.each(function(name, elem) {
	                css.removeClass(elem, 'showElement');
	            });
	            
	            // Then show the selected tab
	            css.addClass(selectedTab, 'showElement');
	            
	            // Loop through the tabs removing the highlight class
	            while (lisLength--) {
	                css.removeClass(lis[lisLength], 'selected');
	            }
	            
	            // Highlight the selected tab
	            css.addClass(targ.parentNode, 'selected');
	            
	            e.preventDefault();
	        };
	    }(tabDictionary));
        
        // Super simple event handler fork (too basic, but that's all that's required for this example)
        if (window.addEventListener) {
            tabs.addEventListener('click', handler, false);
        } else {
            tabs.attachEvent('onclick', handler);
        }       
        
	}
    
};