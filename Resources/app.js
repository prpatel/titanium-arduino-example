// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
	title : 'Tab 1',
	backgroundColor : '#fff'
});
var tab1 = Titanium.UI.createTab({
	icon : 'KS_nav_views.png',
	title : 'Tab 1',
	window : win1
});

var label1 = Titanium.UI.createLabel({
	color : '#999',
	top : 150,
	text : 'Press button to get current temperature',
	font : {
		fontSize : 25,
		fontFamily : 'Helvetica Neue'
	},
	textAlign : 'center',
	width : 'auto'
});

win1.add(label1);

var arduino_android = require('com.mypatelspace.arduino');
Ti.API.info("module is => " + arduino_android);

// Create a Button.
var aButton = Ti.UI.createButton({
	top : 100,
	title : 'Get temperature',
});

// Listen for click events.
var blinker;
aButton.addEventListener('click', function() {

	label1.text = Thermistor.f(arduino_android.analogRead(1));
});

arduino_android.init();
arduino_android.connect(); ( function() {
		var adcres, beta, kelvin, rb, ginf;

		adcres = 1023;
		// Beta parameter
		beta = 3950;
		// 0°C = 273.15 K
		kelvin = 273.15;
		// 10 kOhm
		rb = 10000;
		// Ginf = 1/Rinf
		ginf = 120.6685;

		Thermistor = {
			c : function(raw) {
				var rthermistor, tempc;

				rthermistor = rb * (adcres / raw - 1);
				tempc = beta / (Math.log(rthermistor * ginf));

				return tempc - kelvin;
			},
			f : function(raw) {
				return (this.c(raw) * 9) / 5 + 32;
			}
		};
	}());
// Add to the parent view.
win1.add(aButton);
//arduino_android.requestPermission();
//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
	title : 'Tab 2',
	backgroundColor : '#fff'
});
var tab2 = Titanium.UI.createTab({
	icon : 'KS_nav_ui.png',
	title : 'Tab 2',
	window : win2
});

var label2 = Titanium.UI.createLabel({
	color : '#999',
	top : 100,
	text : 'Touch me to blink the LEDs!',
	font : {
		fontSize : 36,
		fontFamily : 'Helvetica Neue'
	},
	textAlign : 'center',
	width : 'auto'
});
win2.add(label2);

label2.addEventListener('click', function() {
	if (blinker) {
		clearInterval(blinker);
		// turn it off it's on
		blinker = null;
		arduino_android.digitalWrite(11, false);
	} else {
		blinker = setInterval(blink, 500);
	}
});
var state = false;
function blink() {
	if (state) {
		state = false;
	} else {
		state = true;
	}
	arduino_android.digitalWrite(11, state);
}

var label3 = Titanium.UI.createLabel({
	color : '#999',
	botton : 100,
	text : 'Touch me to blink ALL LEDs!',
	font : {
		fontSize : 36,
		fontFamily : 'Helvetica Neue'
	},
	textAlign : 'center',
	width : 'auto'
});
win2.add(label3);

var blinker2;
label3.addEventListener('click', function() {
	if (blinker2) {
		clearInterval(blinker2);
		// turn it off it's on
		blinker2 = null;
		arduino_android.digitalWrite(11, false);
	} else {
		blinker2 = setInterval(blink2, 500);
	}

});

var ledNumber = 0;
function blink2() {
	if (ledNumber == 0) {
		arduino_android.digitalWrite(11, true);
		arduino_android.digitalWrite(10, false);
	} else if (ledNumber == 1) {
		arduino_android.digitalWrite(10, true);
		arduino_android.digitalWrite(11, false);
	} else if (ledNumber == 2) {
		ledNumber = -1;
	}
	ledNumber++;
}

// tab 3
var win3 = Titanium.UI.createWindow({
	title : 'Tab 3',
	backgroundColor : '#fff'
});
var tab3 = Titanium.UI.createTab({
	icon : 'KS_nav_ui.png',
	title : 'Tab 3',
	window : win3
});

var label4 = Titanium.UI.createLabel({
	color : '#999',
	botton : 100,
	text : 'start fader demo',
	font : {
		fontSize : 36,
		fontFamily : 'Helvetica Neue'
	},
	textAlign : 'center',
	width : 'auto'
});
win3.add(label4);

// Create a Slider.
var aSlider = Titanium.UI.createSlider({
	min : 0,
	max : 900,
	value : 25,
	width : 200,
	height : 'auto',
	top : 30
});
win3.add(aSlider);
aSlider.show();

var faderReader;
label4.addEventListener('click', function() {
	if (faderReader) {
		clearInterval(faderReader);
		faderReader = null;
		// turn it off if it's on
		arduino_android.digitalWrite(11, false);
	} else {
		faderReader = setInterval(readPot, 1000);
	}

});

function readPot() {
	var potReading = arduino_android.analogRead(0);
	Ti.API.info('pot reading:' + Math.ceil(potReading / 4));
	label4.text = potReading;
	arduino_android.analogWrite(11, Math.ceil(potReading / 4));
	aSlider.value = potReading;
}

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);

// open tab group
tabGroup.open();
