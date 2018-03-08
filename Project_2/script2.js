
//plots

var marginTot = {t: 10, r: 5, b: 10, l: 5}; //this is an object
var totalWidth = d3.select('#mobile2').node().clientWidth - margin1.r - margin1.l,
    totalHeight = (d3.select('#mobile2').node().clientHeight ) - margin1.t - margin1.b;

var margin5 = {t: 10, r: 0, b: 10, l: 5}; //this is an object
var width5 = (d3.select('.sun-column').node().clientWidth),
    height5 = (d3.select('.sun-column').node().clientHeight);

var plot5 = d3.select('.sun-column') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width5 )
    .attr('height', height5);

console.log(width5);
console.log(height5);


var margin6 = {t: 15, r: 0, b: 20, l: 0}; //this is an object
var width6 = (d3.select('#MoonColumn').node().clientWidth),
    height6 = (d3.select('#MoonColumn').node().clientHeight) ;

var plot6 = d3.select('#MoonColumn') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width6)
    .attr('height',height6);


var margin7 = {t: 15, r: 0, b: 20, l: 0}; //this is an object
var width7 = (d3.select('#MidColumn').node().clientWidth),
    height7 = (d3.select('#MidColumn').node().clientHeight) ;

var plot7 = d3.select('#MidColumn') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width7)
    .attr('height',height7);


// var url = 'https://darksky.net/forecast/42.3638,-71.1034/us12/en'
//https://darksky.net/forecast/42.3638,-71.1034/us12/en..data/boston_weather.json


d3.json("data/boston_weather.json", draw2);


//GET DATA REAL TIME
//$.ajax({
//  url: 'https://api.darksky.net/forecast/c6b293fcd2092b65cfb7313424b2f7ff/42.361145,-71.057083',
//  dataType: 'JSONP',
//  type: 'GET',
//  crossDomain: true,
//  complete: function (data) {
//    if (data.readyState == '4' && data.status == '200') {
//      draw2(data.responseJSON)
//    } else {
//      console.log("DATA FETCH FAILED")
//    }
//  }
//})





function draw2(data){
    console.log(data);
//    console.log(error);
    //Plot one todays weather hourly (next 6 hours) and percieved temperature
    var todayWeather = data.hourly.data,
        //data from data.currently
        nowData = data.currently,
        dataOfTheDay = data.daily.data;
    
    var currentTemperature = data.currently.temperature;
    
    
    //Get the high and low times - when does this data start and end
    //gets us the start and end times of all the data
    var extentTImeWeather = d3.extent(todayWeather, function(d) {
        return new Date(d.time *1000)
    });
    
    //get the data just for the next 24 and 6 hours
    var todayNow = new Date ().getTime()/1000;
    var tomorrow = new Date ().getTime()/1000 + 24*3600;
    var nxt6Hr = new Date ().getTime()/1000 + 6*3600;
    
    
    var dailyDataTodayOnly = dataOfTheDay.filter(function(d){
        return d.time>=todayNow && d.time<=tomorrow
    })
    
    console.log(dailyDataTodayOnly);
    
    var data24h = todayWeather.filter(function(d){
        return d.time >= todayNow && d.time<=tomorrow
    });
    var data6h = todayWeather.filter(function(d){
        return d.time >=todayNow && d.time<=nxt6Hr
    });
    
    //going to give us the start and end of the period
    var extentdata24h = d3.extent(data24h, function(d){
        return new Date(d.time*1000)
    });
    
    //get the high and lows of the temp in the next 24 hours
    //use this to scale the height of the graph 
    var extentTodayWeather = d3.extent(data24h, function(d){
        return d.temperature
    });
    //gets the high and low of the apparent temperasture for the next 6 hours
    var extentTodayPercWeather = d3.extent(data24h, function(d){
        return d.apparentTemperature
    });
    
    //DAILY VS PERCIEVED GRAPH
    
    var meanTodayWeather = d3.mean(data24h, function(d){
        return d.temperature
    });
    var meanPercievedToday = d3.mean(data24h, function(d){
        return d.apparentTemperature
    });
    
    var scaleX1 = d3.scaleTime().domain(extentdata24h).range([0, width1]);
    var scaleY1 = d3.scaleLinear().domain([extentTodayPercWeather[0]-5, extentTodayWeather[1]+5]).range([height1,0]);
    
   
    
    //create the axis
    var formatHours = d3.timeFormat("%H:00");
    var formatDate = d3.timeFormat("%A");
    
    var centerX = width5/2;
    var centerY = width5/2;
    
    var radius1 = width5/2.1;
    plot5.append("g")
        .attr('transform', 'translate(' + (centerX)+ ',' + (centerY+totalHeight - radius1*1.8) + ')')
        .attr('class', 'Sun');
    
     var SunArc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius1)
                    .startAngle(0) //convert from degs to radians
                    .endAngle(360);
    
    plot5.select(".Sun").append("path").attr("class", "SunCircle").attr("d",SunArc);
    
    
     plot6.append("g")
        .attr('transform', 'translate(' + (centerX-10)+ ',' + (centerY+margin6.t) + ')')
        .attr('class', 'Moon');
    
     var MoonArc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(width6/2)
                    .startAngle(0) //convert from degs to radians
                    .endAngle(360);
    
    plot6.select(".Moon").append("path").attr("class", "MoonCircle").attr("d",MoonArc);
    
    //new moon - fully covered 0 
    //full moon - fully showing 1
    var radius = width6/2.1;
    var amtMoonCover = (radius*dataOfTheDay[0].moonPhase);
    
    plot6.append("g")
        .attr('transform', 'translate(' + (centerX-amtMoonCover)+ ',' + (centerY+margin6.t) + ')')
        .attr('class', 'MoonCover');
    
     var MoonArcCover = d3.arc()
                    .innerRadius(0)
                    .outerRadius(width6/2)
                    .startAngle(0) //convert from degs to radians
                    .endAngle(360);
    
    plot6.select(".MoonCover").append("path").attr("class", "MoonCircleCover").attr("d",MoonArcCover);
    
    plot7.append("g")
        .attr('transform', 'translate(' + margin7.l+ ',' + (margin7.t) + ')')
        .attr('class', 'Week');
    
    
   var xpos = 65;
    var ypos= 20;
   plot7.select(".Week").append("line").attr("class","weekLine").attr("x1",xpos).attr("y1",ypos).attr("x2", xpos).attr("y2",totalHeight-40);
    
    
    console.log("data of day");
    console.log(dataOfTheDay);
    
    //going to give me the lowest and highest (high) temps that week
     var extentWeeklyWeatherActual = d3.extent(dataOfTheDay, function(d) {
        return d.temperatureHigh;
    });
    console.log(extentWeeklyWeatherActual);
    
    //going to give me the highest and the lowest (low) temps that week
    var extentWeeklyWeatherApparent = d3.extent(dataOfTheDay, function(d) {
        return d.apparentTemperatureLow;
    });
    console.log(extentWeeklyWeatherApparent);
    
    
    var scaleRadHighs = d3.scaleLinear().domain([extentWeeklyWeatherApparent[0], extentWeeklyWeatherActual[1]]).range([10,35]);

    
    console.log(totalHeight-40);
    console.log(dailyDataTodayOnly[0].temperatureHigh);
    //20 to 664
    //128.8 in between each 
    var interval = 107.33;
    for(var i=0; i<5;i++){
        plot7.select(".Week").append("circle").attr("class", "HighsOfDay").attr("cx",xpos).attr("cy",ypos+interval).attr("r",scaleRadHighs(dataOfTheDay[i].temperatureHigh));
        ypos+=interval;
    }
    
    var scaleRadLows = d3.scaleLinear().domain([extentWeeklyWeatherApparent[0], extentWeeklyWeatherApparent[1]]).range([3,15]);
    
    var interval = 107.33;
    ypos =20;
    for(var i=0; i<5;i++){
        plot7.select(".Week").append("circle").attr("class", "LowsOfDay").attr("cx",xpos).attr("cy",ypos+interval).attr("r",scaleRadHighs(dataOfTheDay[i].apparentTemperatureLow));
        ypos+=interval;
    }
    
    
    

}
