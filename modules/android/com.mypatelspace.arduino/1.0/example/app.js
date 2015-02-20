// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

var arduino_android = require('com.mypatelspace.arduino');
Ti.API.info("module is => " + arduino_android);


// Create a Button.
var aButton = Ti.UI.createButton({
	title : 'toggle on-board led',
});

// Listen for click events.
aButton.addEventListener('click', function() {
	
});

// Add to the parent view.
win.add(aButton);

win.open();

arduino_android.init();
arduino_android.connect();
arduino_android.digitalWrite(13, boolean);