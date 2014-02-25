//viewsByArticle.js
var NYTD = NYTD || {};
NYTD.xStream = NYTD.xStream || {};

NYTD.xStream.demo = (function () {

	var data = [
		{key:"Item 1", value:99},
		{key:"Item 2", value:78},
		{key:"Item 3", value:77},
		{key:"Item 4", value:64},
		{key:"Item 5", value:35},
		{key:"Item 6", value:33},
		{key:"Item 7", value:29},
		{key:"Item 8", value:28},
		{key:"Item 9", value:25},
		{key:"Item 10", value:21},
		{key:"Item 11", value:19},
		{key:"Item 12", value:18},
		{key:"Item 13", value:15},
		{key:"Item 14", value:14},
		{key:"Item 15", value:11}
	]

	var updateData = function(data){
		var newData = data;
		data.forEach(function(d,i){
			var newValue = d.value + Math.floor((Math.random()*10) - 5)
			newData[i].value = newValue <= 0 ? 10 : newValue
		})

		newData = sortAndSlice(newData);
		return(newData)
	}

	var sortAndSlice = function(data){
	    newData = data.sort(function (a, b) {
	        return b.value - a.value;
	      })
		  .slice(0, 10);
		return newData
	}

	var setup = function(targetID){
		var settings = NYTD.xStream.barChart.setup(targetID);
		draw(settings);
		update(settings);
		return settings;
	}

	var draw = function(settings){
		var newData = sortAndSlice(data)
		NYTD.xStream.barChart.draw(settings,newData)
	}

	var update = function(settings) {
		var newData = updateData(data)
		NYTD.xStream.barChart.update(settings,newData)
	}

	return {
		setup:setup,
		draw:draw,
		update:update
	}

})();
