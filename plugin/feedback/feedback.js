(function() {
	var socket = io.connect(window.location.origin);

	// Fires when slide is changed
	Reveal.addEventListener( 'slidechanged', function( event ) {
		var slideElement = event.currentSlide;
		var feedback = slideElement.querySelector('aside.feedback');
		console.log(feedback);
		var slideData = {
			feedback : feedback ? feedback.innerHTML : '',
		};

        if (feedback || feedback.length > 0) {
            console.log(feedback);
		    socket.emit('slidechanged', slideData);
		    console.log('sliedechange fired');
		}
	} );
}());
