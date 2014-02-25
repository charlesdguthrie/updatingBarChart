//driver.js

var NYTD = NYTD || {};
NYTD.xStream = NYTD.xStream || {};

	//setup (includes first draw)
	var demoSettings = NYTD.xStream.demo.setup('#chart')

	setInterval(function(){
    	NYTD.xStream.demo.update(demoSettings)
}, 3000);
