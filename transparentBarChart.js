var NYTD = NYTD || {};
NYTD.xStream = NYTD.xStream || {};

NYTD.xStream.barChart = (function(targetID) {
  /************
  *SETUP CHART*
  *************/
  //Width and height
  function setup(targetID){
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = $(targetID).width() - margin.left - margin.right,
        height = $(targetID).height() - margin.top - margin.bottom,
        textwidth = 4*20 + 5,
        defaultBarWidth = 2000;

    //Create SVG element
    d3.select(targetID).selectAll("svg").remove()
    var svg = d3.select(targetID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Set up scales
    var x = d3.scale.linear()
      .domain([0,defaultBarWidth])
      .range([0,width]);
    var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], 0.1, 0);
    
    var settings = {
      margin:margin, width:width, height:height, textwidth:textwidth,
      svg:svg, x:x, y:y
    }

    return settings
  }

  //Function to create rows, including rectangles and labels
  function draw(settings,dataset) {
    //import settings
    var margin=settings.margin, width=settings.width, height=settings.height, textwidth=settings.textwidth, 
    svg=settings.svg, x=settings.x, y=settings.y;

    //Set domains
    y.domain(dataset.map(function(d) { return d.key; }));
    var barmax = d3.max(dataset, function(e) {
      return e.value;
    });
    x.domain([0,barmax]);

    //create chart row and move to the correct height
    var chartRow = svg.selectAll("g")
       .data(dataset, function(d){return d.key})
       .enter()
       .append("g")
       .attr("class", "chartRow")
       .attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });

    //Add rectangles
    chartRow.append("rect")
      .attr("class","bar")
      .attr("x", 0)
      .attr("height", y.rangeBand())
      .attr("width", 0) //initialize width to zero 
    
    var format = d3.format("0,000")

    //Add value labels
    chartRow.append("text")
      .attr("class","label")
      .attr("y", y.rangeBand()/2)
      .attr("x",0)
      .attr("dy",".35em")
      .attr("dx","0.5em")
      .text(0); //initialize labels at 0
    
    //Add Headlines
    chartRow.append("text")
      .attr("class","category")
      .attr("text-overflow","ellipsis")
      .attr("y", y.rangeBand()/2)
      .attr("x",textwidth)
      .attr("dy",".35em")
      .attr("dx","0.5em")
      .text(function(d){return d.key});
  }


  /***********
  *UPDATES****
  ***********/
  
  var update = function(settings, newdata) {

    //import settings
    var margin=settings.margin, width=settings.width, height=settings.height, textwidth=settings.textwidth, 
    svg=settings.svg, x=settings.x, y=settings.y;

    //Reset domains
    y.domain(newdata.sort(function(a,b){
      return b.value - a.value;
    })
      .map(function(d) { return d.key; }));
    var barmax = d3.max(newdata, function(e) {
      return e.value;
    });
    x.domain([0,barmax]);

    /*************
    *ADD NEW ITEMS
    *************/
    //Bind new data to chart rows and move to below the bottom of the chart
    var format = d3.format("0,000")

    var chartRow = svg.selectAll("g.chartRow")
      .data(newdata, function(d){ return d.key});

    var newRow = chartRow.enter()
      .append("g")
        .attr("class", "chartRow")
        .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")");

    //Add bars
    newRow.insert("rect")
      .attr("class","bar")
      .attr("x", 0)
      .attr("opacity",1)
      .attr("height", y.rangeBand())
      .attr("width", 20); //initiallize bar widths to zero

    //Add value labels
    newRow.append("text")
      .attr("class","label")
      .attr("y", y.rangeBand()/2)
      .attr("x",0)
      .attr("opacity",1)
      .attr("dy",".35em")
      .attr("dx","0.5em")
      .text(0); //initialize labels at 0
    
    //Add Headlines
    newRow.append("text")
      .attr("class","category")
      .attr("text-overflow","ellipsis")
      .attr("y", y.rangeBand()/2)
      .attr("x",textwidth)
      .attr("opacity",1)
      .attr("dy",".35em")
      .attr("dx","0.5em")
      .text(function(d){return d.key});


    /*******
    *UPDATE*
    ********/
    
    //Update bar widths
    chartRow.select(".bar").transition()
      .duration(300)
      .attr("width", function(d) { return x(d.value);})
      .attr("opacity",1);

    //Update data labels
    chartRow.select(".label").transition()
      .duration(300)
      .attr("opacity",1)
      .tween("text", function(d) { 
        var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.value);
        return function(t) {
          this.textContent = format(Math.round(i(t)));
        };
      });

    //Fade in categories
    chartRow.select(".category").transition()
      .duration(300)
      .attr("opacity",1);

    //Remove exit elements
    chartRow.exit().transition()
      .style("opacity","0")
      .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
      .remove();

    /*************
    *REORDER ROWS*
    *************/

    var delay = function(d, i) { return 200 + i * 30; };

    chartRow.transition()
        .delay(delay)
        .duration(600)
        .attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });
  };

  return {
    setup:setup,
    draw:draw,
    update:update
  }
})();