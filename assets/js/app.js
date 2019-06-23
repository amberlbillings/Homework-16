// Today's Date
var n =  new Date();
var y = n.getFullYear();
var m = n.getMonth();
var d = n.getDate();
var day = n.getDay();
var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var dayOfWeek = weekday[day];
var month = months[m];

document.getElementById("date").innerHTML = dayOfWeek + ", " + month + " " + d + ", " + y;

// Today's Weather
function weatherBalloon(cityID) {
    var key = '0145d520e5f7b799949a35c6cb55ab1b';
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&appid=' + key)  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        console.log(data);

        var fahrenheit = Math.round(((parseFloat(data.main.temp)-273.15)*1.8)+32);
        var description = data.weather[0].description;
        var tempMin = Math.round(((parseFloat(data.main.temp_min)-273.15)*1.8)+32);
        var tempMax = Math.round(((parseFloat(data.main.temp_max)-273.15)*1.8)+32);
        console.log(fahrenheit);
        console.log(description);
        console.log(tempMin);
        console.log(tempMax);

        if (description == "clear sky") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/clearsky.png" alt="clear sky" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "few clouds") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/fewclouds.png" alt="few clouds" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "scattered clouds") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/scatteredclouds.png" alt="scattered clouds" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "overcast clouds") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/brokenclouds.png" alt="scattered clouds" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "broken clouds") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/brokenclouds.png" alt="broken clouds" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "shower rain") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/rain.png" alt="shower rain" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "rain") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/rain.png" alt="rain" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "thunderstorm") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/thunderstorm.png" alt="thunderstorm" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "snow") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/snow.png" alt="snow" style="width: 50px; margin-bottom: -10px;" />';
        }
        else if (description == "mist") {
          document.getElementById("description").innerHTML = '<img src="assets/weather-icons/mist.png" alt="mist" style="width: 50px; margin-bottom: -10px;" />';
        }
        else {
          document.getElementById("description").innerHTML = description;
        };
    
        document.getElementById("temp").innerHTML = fahrenheit + '&deg;';
        document.getElementById("temp-max").innerHTML = tempMax+ '&deg;';
        document.getElementById("temp-min").innerHTML = tempMin+ '&deg;';
  })
}

weatherBalloon(5037649);

// Draw Scatter Plot
var svgWidth = 712;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 20,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(censusData, chosenXAxis) {

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(censusData, d => d[chosenYAxis])])
  .range([height, 0]);

  return yLinearScale;
}

function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderLabels(statesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  statesGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis])+4);

  return statesGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Median Age:";
  }
  else {
    var xlabel = "Median Household Income:";
  }

  if (chosenYAxis === "healthcare") {
    var ylabel = "Lacks Healthcare (%):";
  }
  else if (chosenYAxis === "smokes") {
    var ylabel = "Smokes (%):";
  }
  else {
    var ylabel = "Obese (%):";
  }

  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([0, 0])
  .html(function(d) {
    return (`<strong>${d.state}</strong><br />${xlabel} ${d[chosenXAxis]}<br />${ylabel} ${d[chosenYAxis]}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
  toolTip.show(data, this);
})
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

return circlesGroup;
}

// Import Data
var csvFile = "/assets/data/data.csv";
d3.csv(csvFile) 
  .then(function(censusData) {
    
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obestity = +data.obesity;
    });

    var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);
  


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "steelblue")
    .attr("opacity", ".8");

  var statesGroup = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .text(d => (d.abbr))
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+4)
    .classed("chartText", true);

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g");


    var povertyBox = labelsGroup.append("rect")
      .classed("bar", true)
      .attr("width", 92)
      .attr("height", 28)
      .classed("on", true)
      .attr("x", 0)
      .attr("y", 411);

    var ageBox = labelsGroup.append("rect")
      .classed("bar", true)
      .attr("width", 88)
      .attr("height", 28)
      .classed("off", true)
      .attr("x", 120)
      .attr("y", 411);

    var incomeBox = labelsGroup.append("rect")
      .classed("bar", true)
      .attr("width", 164)
      .attr("height", 28)
      .classed("off", true)
      .attr("x", 232)
      .attr("y", 411);

    var povertyLabel = labelsGroup.append("text")
      .attr("y", 429)
      .attr("x", 47)
      .attr("value", "poverty")
      .attr("class", "axisText")
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
      .attr("y", 429)
      .attr("x", 163)
      .attr("value", "age")
      .attr("class", "axisText")
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("y", 429)
      .attr("x", 315)
      .attr("value", "income")
      .attr("class", "axisText")
      .text("Household Income (Median)");

  var ylabelsGroup = chartGroup.append("g");

     var healthcareBox = ylabelsGroup.append("rect")
      .classed("bar", true)
      .attr("width", 28)
      .attr("height", 130)
      .classed("on", true)
      .attr("x", -63)
      .attr("y", 251);

      var smokesBox = ylabelsGroup.append("rect")
      .classed("bar", true)
      .attr("width", 28)
      .attr("height", 82)
      .classed("off", true)
      .attr("x", -63)
      .attr("y", 150);

      var obeseBox = ylabelsGroup.append("rect")
      .classed("bar", true)
      .attr("width", 28)
      .attr("height", 74)
      .classed("off", true)
      .attr("x", -63)
      .attr("y", 58);

    // Create axes labels
    var healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 22)
      .attr("x", 0 - 315)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .attr("class", "axisText")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 22)
      .attr("x", 0 - 190)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .attr("class", "axisText")
      .text("Smokes (%)");

    var obesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 22)
      .attr("x", 0 - 95)
      .attr("dy", "1em")
      .attr("value", "obesity")
      .attr("class", "axisText")
      .text("Obese (%)");

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // x axis labels event listener
      labelsGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {
    
            // replaces chosenXAxis with value
            chosenXAxis = value;
    
            // console.log(chosenXAxis)
    
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);
    
            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);
    
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            statesGroup = renderLabels(statesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
              povertyBox
                .classed("on", true)
                .classed("off", false);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              ageBox
                .classed("on",false)
                .classed("off", true)
              incomeLabel
                .classed("active", false)
                .classed("inactive", true)
              incomeBox
                .classed("on",false)
                .classed("off", true)
            }
            else if (chosenXAxis === "age") {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyBox
                .classed("on", false)
                .classed("off", true);
              ageLabel
                .classed("active", true)
                .classed("inactive", false);
              ageBox
                .classed("on",true)
                .classed("off", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeBox
                .classed("on",false)
                .classed("off", true);
            }
            else {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyBox
                .classed("on", false)
                .classed("off", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              ageBox
                .classed("on",false)
                .classed("off", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
              incomeBox
                .classed("on", true)
                .classed("off", false);
            }
          }

        });
    
      ylabelsGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          if (value !== chosenYAxis) {
    
            // replaces chosenXAxis with value
            chosenYAxis = value;
    
            // console.log(chosenXAxis)
    
            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);
    
            // updates x axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);
    
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            statesGroup = renderLabels(statesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
              healthcareBox
                .classed("on", true)
                .classed("off", false);
              obesityLabel
                .classed("active", false)
                .classed("inactive", true);
              obeseBox
                .classed("on", false)
                .classed("off", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesBox
                .classed("on", false)
                .classed("off", true);
            }
            else if (chosenYAxis === "obesity") {
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareBox
                .classed("on", false)
                .classed("off", true);
              obesityLabel
                .classed("active", true)
                .classed("inactive", false);
              obeseBox
                .classed("on", true)
                .classed("off", false);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesBox
                .classed("on", false)
                .classed("off", true);
            }
            else {
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareBox
                .classed("on", false)
                .classed("off", true);
              obesityLabel
                .classed("active", false)
                .classed("inactive", true);
              obeseBox
                .classed("on", false)
                .classed("off", true);
              smokesLabel
                .classed("active", true)
                .classed("inactive", false);
              smokesBox
                .classed("on", true)
                .classed("off", false);
            }
          }


        });
    });