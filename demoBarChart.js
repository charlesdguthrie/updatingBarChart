//viewsByArticle.js
var NYTD = NYTD || {};
NYTD.xStream = NYTD.xStream || {};

NYTD.xStream.demo = (function () {

	var data = [
		{key:"Article 1", value:99},
		{key:"Article 2", value:78},
		{key:"Article 3", value:77},
		{key:"Article 4", value:64},
		{key:"Article 5", value:35},
		{key:"Article 6", value:33},
		{key:"Article 7", value:29},
		{key:"Article 8", value:28},
		{key:"Article 9", value:25},
		{key:"Article 10", value:21},
		{key:"Article 11", value:19},
		{key:"Article 12", value:18},
		{key:"Article 13", value:15},
		{key:"Article 14", value:14},
		{key:"Article 15", value:11}
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
