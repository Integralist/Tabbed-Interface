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
        if (st.utils.getType(component) === 'Array') {
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
		
		tabs = st.utils.getEl(container);
		lis = st.utils.getTag({ tag:'li', context:tabs });
             
/*******************************************************
 * TABS SET-UP
 *******************************************************/
             
		// Loop through the tabArray grabbing each element and assigning to object
		while (len--) {
		    // Store elements
		    tabObject[tabArray[len]] = st.utils.getEl(tabArray[len]);
		}
		
		// All tabs execept the first are automatically hidden by manual addition of class 'hideElement'
		st.css.addClass(tabObject[tabArray[0]], 'hideElement');
		
		// Create a Dictionary of the tabObject
		tabDictionary = new st.utils.Dictionary(tabObject);
		
		// Show the tab links
		st.css.addClass(tabs, 'showElement');
		
		// Show the first tab element
		st.css.addClass(tabObject[tabArray[0]], 'showElement');
        
/*******************************************************
 * EVENT LISTENERS
 *******************************************************/
        
	    // Set-up event delegation for the tab links (i.e. only one event listener and we filter out for the links we're interested in)    
	    // Note: the event listener had lost 'scope' of the tabDictionary object.
	    // So to work around this we've had to immediately-invoke the function expression (IIFE) - also known as a 'self-executing function'.
	    // Basically we execute the callback function immediately and then pass through the object whose scope is lost as an argument.
	    st.events.add(tabs, 'click', (function(td) {
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
	                st.css.removeClass(elem, 'showElement');
	            });
	            
	            // Then show the selected tab
	            st.css.addClass(selectedTab, 'showElement');
	            
	            // Loop through the tabs removing the highlight class
	            while (lisLength--) {
	                st.css.removeClass(lis[lisLength], 'selected');
	            }
	            
	            // Highlight the selected tab
	            st.css.addClass(targ.parentNode, 'selected');
	            
	            e.preventDefault();
	        };
	    }(tabDictionary)));        
        
	}
    
};