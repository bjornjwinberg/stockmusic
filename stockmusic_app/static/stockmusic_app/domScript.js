"use strict"

var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
var scaleCounter = 0;
var mySynth = myStuff.create();
var mySynth2 = myStuff.create();
var upDays = [];
var downDays = [];


function dataGrapher(data, minness, maxness, longness, chartColor) {
    // console.log(chartColor);
    $("#lineBackground").empty();

    var svg = d3.select("#lineBackground")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 310)
      .attr("id", "visualization");

    var x = d3.scale.linear().domain([0, longness]).range([0, 1000]);
    var y = d3.scale.linear().domain([maxness, minness]).range([10, 300]);
    var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d,i) {return x(i);})
      .y(function(d) {return y(d);});

    var path = svg.append("path")
      .attr("d", line(data))
      .attr("stroke", "steelblue")
      .attr("stroke-width", "5")
      .attr("fill", chartColor);

    var totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(0)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
};

$(document).ready(function() {

    $("body").on("finished", function(event, killInterval) {
        window.clearInterval(killInterval);
        myStuff.stop()
    });

    $("#stock_form").on("submit", function() {
        event.preventDefault();
        var speed = Number($(this).children('input[name="tempo"]').val());
        var formData = $(this).serialize();

        $.get($(this).attr("action"), formData, function(data) {

            var prices = data["quote"];
            var notes = data["frequency_sequence"];

            var datuh = {
                labels: notes,
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "green",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: prices
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            new Chart(ctx).Line(datuh, {
                scaleShowGridLines : false,
                scaleGridLineColor : "steelblue",
                scaleGridLineWidth : 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                bezierCurve : true,
                bezierCurveTension : .4,
                pointDot : false,
                pointDotRadius : 5,
                pointDotStrokeWidth : 1,
                pointHitDetectionRadius : 20,
                datasetStrokeWidth : 2,
                offsetGridLines : false,
            });

            var minness = Math.min.apply(null, data["quote"]);
            var maxness = Math.max.apply(null, data["quote"]);
            var longness = data["quote"].length;

            var worker = new Worker('/static/stockmusic_app/task.js');
            var currentMood = "normal";
            var chartColor = "white";

            worker.addEventListener('message', function(e) {
                myStuff.play();
                console.log("mooooood", currentMood);
                if (e.data[0][0] != currentMood) {
                    if (e.data[0][0] == "happy") {
                        chartColor = "green"
                    } else if (e.data[0][0] == "sad") {
                        chartColor = "red"
                    } else {
                        chartColor = "white"
                    }
                    currentMood = e.data[0][0]
                };

                console.log("datuhh", e.data);

                mySynth.set("carrier.freq", e.data[0][1]);
                mySynth2.set("mod.freq", e.data[0][1]*2);
                // mySynth.set("mod.freq", e.data[0][1]*(3/2));
                dataGrapher(data["quote"].slice(0, e.data[1]+2), minness, maxness, longness, chartColor);
                if(e.data[1]+2 == longness) {
                    setTimeout(function() {
                        myStuff.stop();
                    }, 1000);
                };
            }, false);
            dataGrapher(data["quote"].slice(0, 1), minness, maxness, longness, chartColor);
            worker.postMessage([data["frequency_sequence"], speed]);
        });
        $(this).children("input[name]").val("");
    });
    $("#start").on("click", function() {
        myStuff.play();
    });
    $("#pitch_up").on("click", function() {
        if (scaleCounter == 6) {
            scaleCounter = -1
        };
        scaleCounter += 1;
        scaleCounter = Math.abs(scaleCounter);
        mySynth.set("carrier.freq", major[scaleCounter % major.length]);
    });
    $("#pitch_down").on("click", function() {
        if (scaleCounter == 0) {
            scaleCounter = 7
        };
        scaleCounter -= 1;
        scaleCounter = Math.abs(scaleCounter);
        mySynth.set("carrier.freq", major[scaleCounter % major.length]);
    });
    $("#shut_up").on("click", function() {
        myStuff.stop()
    });
});

// http://bl.ocks.org/duopixel/4063326 (chart you modified)
