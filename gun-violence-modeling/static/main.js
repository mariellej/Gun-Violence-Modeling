var width = 960;
var height = 500;
// D3 Projection
var projection = d3.geo.albersUsa()
           .translate([width/2, height/2])    // translate to center of screen
           .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
         .projection(projection);  // tell path generator to use albersUsa projection

    
// Define linear scale for output
var color = d3.scale.linear()
  .domain([0, 7])  
  .range(["yellow", "red"]); 


var legendText = ["0-49", "50-99", "100-149", "150-199", "200-249", "250-299", "300-349", "350+"];


var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
        .append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);



//d3.json("us_population_data", function(data){

 




  d3.json("us_states", function(json) {
  
  /*
     for (var i = 0; i<data.length; i++){
    console.log(data[i]["State"]);
    console.log(data[i]["2018 Population"]);

  }*/



    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1");

  });


//});



d3.json("incident_data", function(data) {
states = {};
dates = [];
count = 0;
jQuery.each(data, function(){
  count+=1;
  dates.push(this.date);
  state = this.state;
  if (!states[state]){
    states[state] = 1;
  }else{
    states[state]+=1;

  }
  
});


  console.log(count);
var dateArr = dates.map(function(v) {
  return new Date(v);
});

dateArr.sort(function(a, b) {
  return a.getTime() - b.getTime();
  // OR `return a - b`
});


console.log(dateArr[0]);
console.log(dateArr[dateArr.length-1]);

console.log(Math.max.apply(Math,Object.values(states)));
console.log(Math.min.apply(Math,Object.values(states)));

svg.selectAll("path").style("fill", function(d){
  state = d.properties.name;

  if (Object.keys(states).includes(state)){
    freq = states[state];

    return color(Math.floor(freq/50));


  }else{
    states[state] = 0;
    return color(0);
  }

  

})
.on("mouseover", function(d) {  
    state = d.properties.name;    
      div.transition()        
           .duration(200)      
           .style("opacity", .9) 
           .text(state + ": "+ states[state])    
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px")
           ;    
  })

.on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    })
  
;

svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")

  .attr("cx", function(d) {
    try{
      return projection([d.longitude, d.latitude])[0];
    }
    catch(e){
      console.log(e.message);
    }
  })
  .attr("cy", function(d) {
    try{
      return projection([d.longitude, d.latitude])[1];
    }
    catch(e){
      console.log(e.message);
    }
  })
  .attr("r", function(d) {
    return 4;
  })

    .style("fill", "rgb(217,91,67)")  
    .style("opacity", 0.85) 

  // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
  // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
  .on("mouseover", function(d) {      
      div.transition()        
           .duration(200)      
           .style("opacity", .9)      
           .text(d.city_or_county + ", " + d.date)
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");    
  })   

    // fade out tooltip on mouse out               
    .on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    });

var legend = d3.select("body").append("svg")
            .attr("class", "legend")
          .attr("width", 140)
          .attr("height", 200)
          .selectAll("g")
          .data([0,1,2,3,4,5,6,7])
          .enter()
          .append("g")
          .attr("transform", function(d, i) { 

          
            return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)

    legend.append("text")

        .data(legendText)
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) { 
            console.log(d);
            return d; });




});  

d3.select('svg')
  .append("text")
  .attr("x", width/2)             
  .attr("y", .07*height)
  .attr("text-anchor", "middle")  
  .text("US Gun Violence Incidence in March 2018 (4.5k data points)")
  .style("font-size","20px");









