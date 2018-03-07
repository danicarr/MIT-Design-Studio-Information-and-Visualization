//plots

var margin1 = {t: 10, r: 40, b: 20, l: 30}; //this is an object
var width1 = d3.select('#mobile1').node().clientWidth - margin1.r - margin1.l,
    height1 = (d3.select('#mobile1').node().clientHeight / 3) - margin1.t - margin1.b;

var plot1 = d3.select('#TempVRealFeelGraph') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width1 + margin1.r + margin1.l)
    .attr('height', height1 + margin1.t + margin1.b);

var margin2 = {t: 0, r: 40, b: 20, l: 40}; //this is an object
var width2 = d3.select('#highLowGraph').node().clientWidth - margin2.r - margin2.l,
    height2 = (d3.select('#mobile1').node().clientHeight / 4) - margin2.t - margin2.b;

var plot2 = d3.select('#highLowGraph') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width2 + margin2.r + margin2.l)
    .attr('height', height2 + margin2.t + margin2.b);


var margin3 = {t: 0, r: 40, b: 20, l: 40};
var width3 = d3.select('#WindSpChanceRain').node().clientWidth - margin1.r - margin1.l,
    height3 = (d3.select('#WindSpChanceRain').node().clientHeight / 3) - margin1.t - margin1.b;

var plot3 = d3.select('#WindSpChanceRain') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width3 + margin3.r + margin3.l)
    .attr('height', height3 + margin3.t + margin3.b);

var margin4 = {t: 0, r: 40, b: 20, l: 40};
var width4 = d3.select('#HumVsCCGraph').node().clientWidth - margin1.r - margin1.l,
    height4 = (d3.select('#HumVsCCGraph').node().clientHeight / 3) - margin1.t - margin1.b;

var plot4 = d3.select('#HumVsCCGraph') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width3 + margin3.r + margin3.l)
    .attr('height', height3 + margin3.t + margin3.b);

// var url = 'https://darksky.net/forecast/42.3638,-71.1034/us12/en'
//https://darksky.net/forecast/42.3638,-71.1034/us12/en..data/boston_weather.json


d3.json("data/boston_weather.json", draw);

function draw(error,data){
    //Plot one todays weather hourly (next 6 hours) and percieved temperature
    var todayWeather = data.hourly.data,
        //data from data.currently
        nowData = data.currently,
        dataOfTheDay = data.daily.data;
    
    var currentTemperature = data.currently.temperature;
    console.log(currentTemperature);
    
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
    
    var dataNow = todayWeather.filter(function(d){
        return d.time==todayNow
    });
    
    var temperatureNow = dataNow.temperature;
    
    
    
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
    
    plot1.append('g')
        .attr('transform', 'translate(' + margin1.l+ ',' + margin1.t + ')')
        .attr('class', 'axis axis-y');
    plot1.append('g')
        .attr('transform', 'translate(' + margin1.l + ',' + (margin1.t + height1) + ')')
        .attr('class', 'axis axis-x');
    plot1.append('g')
        .attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')')
        .attr('class', 'todayWeather');
    
    //create the axis
    var formatHours = d3.timeFormat("%H:00");
    var formatDate = d3.timeFormat("%A");

    var axisHourX = d3.axisBottom().scale(scaleX1).ticks().tickFormat(formatHours),
        axisHourY = d3.axisLeft().scale(scaleY1).tickSizeInner(-width1).tickPadding([10]).ticks(5);

    plot1.select(".axis-x").call(axisHourX);
    plot1.select(".axis-y").call(axisHourY);
    
    //create the lines
    var lineWeatherActual = d3.line()
        .x(function(d) { return scaleX1(new Date (d.time*1000)); })
        .y(function(d) { return scaleY1(d.temperature); });
    
    var lineWeatherPercieved = d3.line()
        .x(function(d) { return scaleX1(new Date (d.time*1000)); })
        .y(function(d) { return scaleY1(d.apparentTemperature); });
    
    plot1.select('.todayWeather')
        .datum(data24h)
        .append("path")
        .attr("class", "weather")
        .attr("d", lineWeatherActual);
    
    plot1.select('.todayWeather')
        .datum(data24h)
        .append("path")
        .attr("class", "weatherP")
        .attr("d", lineWeatherPercieved);
    
    plot1.select('.todayWeather')
        .append("line")
        .attr("class","meanWeather")
        .attr("x1",scaleX1(extentdata24h[0]))
        .attr("x2",scaleX1(extentdata24h[1]))
        .attr("y1",scaleY1(meanTodayWeather))
        .attr("y2",scaleY1(meanTodayWeather));
    
    plot1.select('.todayWeather')
        .append("line")
        .attr("class","meanWeatherP")
        .attr("x1",scaleX1(extentdata24h[0]))
        .attr("x2",scaleX1(extentdata24h[1]))
        .attr("y1",scaleY1(meanPercievedToday))
        .attr("y2",scaleY1(meanPercievedToday));
    
    
     var plotDots = plot1.select('.todayWeather')
        .append("g")
        .attr("class","dots");


    plotDots
        .selectAll(".weatherDots")
        .data(data24h) //select the data
        .enter()
        .append("circle")
        .attr("class", "weatherDots") // this is the same class that we have selected before
        .attr("cx",function(d) { return scaleX1(new Date (d.time*1000)); })
        .attr("cy",function(d) { return scaleY1(d.temperature); })
        .attr("r",3);
    
    
    //TEMP TIME LOCATION TOP LEFT
    var formatTime = d3.timeFormat("%I:%M %p");
    d3.select("#tempLarge").html(" " + Math.floor(currentTemperature) + "°");
    d3.select("#currTime").datum(nowData).html(formatTime(
        new Date (nowData.time*1000)));
    
    //HIGH LOW GRAPH
    var tempRanges = [];
    var count = 0;
    for (var i= Math.round(extentTodayPercWeather[0]); i<= Math.round(extentTodayWeather[1]); i++){
        var tempDict = {
            index:count,
            temperature:i
        };
        
        count++;
        tempRanges.push(tempDict);
    }
    
//    document.write(tempRanges[0].temperature);
    
    
    var scaleX2 = d3.scaleLinear().domain([0, tempRanges.length]).range([0, width2]);
    var scaleY2 = d3.scaleLinear().domain([extentTodayPercWeather[0], extentTodayWeather[1]]).range([height2,0]);
    

    
    plot2.append('g')
        .attr('transform', 'translate(' + margin2.l+ ',' + margin2.t + ')')
        .attr('class', 'axis axisHL-y');
    plot2.append('g')
        .attr('transform', 'translate(' + margin2.l + ',' + (margin2.t + height2) + ')')
        .attr('class', 'axis axisHL-x');
    plot2.append('g')
        .attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')')
        .attr('class', 'highLow');
    
    var axisX = d3.axisBottom().scale(scaleX2),
        axisYTemp = d3.axisLeft().scale(scaleY2);

    plot2.select(".axisHL-x").call(axisX);
    plot2.select(".axisHL-y").call(axisYTemp);
    
    //create the lines
    var highLowLine = d3.line()
        .x(function(d) { return scaleX2(d.index); })
        .y(function(d) { return scaleY1(d.temperature); });
    
     plot2.select('.highLow')
        .datum(tempRanges)
        .append("path")
            .attr("class", "highLowTempLine")
            .attr("d", highLowLine);
    
    
    plot2.append('g')
        .attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')')
        .attr('class', 'lowTemp');
    
    plot2.append('g')
        .attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')')
        .attr('class', 'highTemp');
    
    
    plot2.select(".lowTemp")
        .datum(dailyDataTodayOnly)
        .append("text")
        .attr("x", 10)
        .attr("y", height2+20)
        .text(function(d){
         return " "+ Math.round(d[0].temperatureLow) + "°"
     });
    
    plot2.select(".highTemp")
        .datum(dailyDataTodayOnly)
        .append("text")
        .attr("x", width2-10)
        .attr("y", 30)
        .text(function(d){
         return " " + Math.round(d[0].temperatureHigh) + "°"
     });
    
    console.log(dailyDataTodayOnly[0].temperatureLow)
    
    //DOTS FOR THE HIGH LOW BAR LINE NOT SHOWING UP
//    plot2.append('g')
//        .attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')')
//        .attr("class","currTempDot");
    
    function getIndexForTemp(temp){
        var roundTemp = Math.round(temp);
        for(var x=0; x<tempRanges.length; x++){
            if(tempRanges[x].temperature == roundTemp){}
                console.log("WINNER " + tempRanges[x].index);
                return tempRanges[x].index;
            }
        }
    
    
//    plot2.append('g')
//        .attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')')
//        .attr('class', 'dotsHL');
    
    var plotHLDots = plot2.select(".highLow")
                            .append("g")
                            .attr("class", "HLDots");
    
    
    plotHLDots.select(".currTemp")
        .data(dataNow)
        .enter()
        .append("circle")
            .attr("class", "currTemp")
            .attr("cx",function(d) { return scaleX2(getIndexForTemp(d.temperature))
                })
            .attr("cy",function(d) { return scaleY2(d.temperature); })
            .attr("r",3);
    
    
    
//    plotDotsHL
//        .selectAll(".HLDots")
//        .data(dataNow)
//        .enter()
//        .append("circle")
//        .attr("class", "HLDots")
//        .attr("cx",function(d) { return scaleX2(getIndexForTemp(d.temperature))
//            })
//        .attr("cy",function(d) { return scaleY2(d.temperature); })
//        .attr("r",3);

         
    
    

//pie chart of humidity and cloud coverage
    
    var percHumCC = {};
    var count = 0;
    for (var i= Math.round(extentTodayPercWeather[0]); i<= Math.round(extentTodayWeather[1]); i++){
        var tempDict = {
            index:count,
            temperature:i
        };
        
        count++;
        tempRanges.push(tempDict);
    }
    
    plot4.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'pie pieChart');
    
//    plot4.select(".pieChart").value(function(d) {return d.})
    
    
    

    
//wind speed and percentage chance rain
    d3.select("#mphNum").html(" " + Math.floor(nowData.windSpeed)  + " MPH");
    d3.select("#percentage").html(" " + Math.floor(nowData.precipProbability) + "%");
    

}
