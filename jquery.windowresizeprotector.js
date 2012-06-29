/*!
 * jQuery Window Resize Protector
 * Version 1.0
 * 
 * Copyright(c) 2012 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 * 
 * https://github.com/gregjacobs/jquery-windowresizeprotector
 */

/*
 * This is a simple override of the jQuery.fn.off() method, which protects you from accidentally 
 * unbinding *all* window resize events at once by accident. This can happen if say, you forget 
 * to call .off() or .unbind() with a handler at all, or in a more subtle way which is accidentally 
 * passing the `undefined` value in for the second parameter. 
 * 
 * Say you've stored a reference to a window resize handler you set up in a class. It may look like 
 * this:
 * 
 *     this.windowResizeHandler = jQuery.proxy( this.onWindowResize, this );
 *     jQuery( window ).on( 'resize', this.windowResizeHandler );
 * 
 * Then you go to unbind with this:
 * 
 *     jQuery( window ).off( 'resize', this.windowResizeHandler );
 * 
 * If for some reason, the windowResizeHandler wasn't created or set up by the time you call .off() 
 * (maybe it only gets set up in a certain situation), then you end up unbinding *all* window resize
 * event handlers that many other pieces of code may have set up, because you are essentially calling
 * .off()  without a handler function. You are instead passing undefined (the property doesn't exist),
 * which is equivalent.
 * 
 * This override helps by throwing an error if you accidentally call the .off() method (or .unbind()) 
 * for a 'resize' event on the `window` object without the second parameter (a handler), or if the 
 * second parameter is passed as undefined. Thus, it prevents you from ever accidentally making this 
 * very subtle mistake ;)
 * 
 * Requires jQuery 1.7 or higher.
 */
/*global window, jQuery */
(function( jQuery ) {   // param so that the variable name is collapsed into a single letter when minified. Could use $, but felt that jQuery was more clear.
	
	var originalOffMethod = jQuery.fn.off;
	
	// Override the off() method. This method is called by unbind() as well.
	// Note: `types` may be a string event name, or hashmap of events. In the hashmap case, this method is 
	// called recursively with the string names, so this override still handles it.
	jQuery.fn.off = function( types, selector, fn ) {
		if( types === 'resize' && !selector && !fn ) {
			// Check if any of the elements in this jQuery set are the `window` object. If so, throw an error.
			for( var i = 0, len = this.length; i < len; i++ ) {
				if( this[ i ] === window ) {
					throw new Error( "Error: *all* window 'resize' events being unbound! Check the handler function you are providing." );
				}
			}
		}
		
		return originalOffMethod.apply( this, arguments );
	};
	
})( jQuery );