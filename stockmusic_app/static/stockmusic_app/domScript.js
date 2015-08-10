"use strict"

var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
var scaleCounter = 0;

function startD3(data, speed, instrument) {

    var instrument;

    if (data["instrument"] == "castlevania") {
        instrument = window.castlevania
    } else if (data["instrument"] == "r2d2") {
        instrument = window.r2d2
    };

    var minness = Math.min.apply(null, data["quote"]);
    var maxness = Math.max.apply(null, data["quote"]);
    var longness = data["quote"].length;

    var worker = new Worker('/static/stockmusic_app/task.js');
    var currentMood = "normal";
    var chartColor = "white";

    var chartSynth = myStuff.create(instrument);

    worker.addEventListener('message', function(e) {

        myStuff.play();
        console.log("mooooood", currentMood);
        if (e.data[0].mood != currentMood) {
            if (e.data[0].mood == "happy") {
                chartColor = "rgba(0,255,0,0.3)"
            } else if (e.data[0].mood == "sad") {
                chartColor = "rgba(255,0,0,0.3)"
            } else {
                chartColor = "white"
            }
            currentMood = e.data[0].mood
        };

        console.log("datuhh", e.data);

        chartSynth.set({
            "left.freq": e.data[0].pitch,
            "right.freq": e.data[0].harmony
        });
        dataGrapher(data["quote"].slice(0, e.data[1]+2), minness, maxness, longness, chartColor);
        if(e.data[1]+2 == longness) {
            setTimeout(function() {
                chartSynth.pause();
            }, 1000);
        };
    }, false);
    dataGrapher(data["quote"].slice(0, 1), minness, maxness, longness, chartColor);
    worker.postMessage([data["frequency_sequence"], speed]);
};

function dataGrapher(data, minness, maxness, longness, chartColor) {
    $("#lineBackground").empty();

    var svg = d3.select("#lineBackground")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 310)
      .attr("id", "visualization");

    var x = d3.scale.linear().domain([0, longness]).range([0, 1000]);
    var y = d3.scale.linear().domain([maxness, minness]).range([10, 300]);
    var line = d3.svg.line()
      .interpolate("monotone")
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
    var userSynth = myStuff.create (
        window.user
    );

    userSynth.pause();

    $("body").on("finished", function(event, killInterval) {
        window.clearInterval(killInterval);
        myStuff.stop()
    });

    $("#stock_form").on("submit", function() {
        event.preventDefault();
        $("#fuckup").empty();
        var speed = Number($('select[name="tempo"]').val());
        var formData = $(this).serialize();
        console.log("formdata:", formData);

        $.get($(this).attr("action"), formData, function(data) {
            if (data.error) {
                var template = $("#fuckup2").html();
                var rendered = Mustache.render(template, data);
                $("#fuckup").html(rendered);
                $("#fuckup").fadeOut(5000);
                return
            };

            function average(array) {
                var sum = array.reduce(function(a, b) { return a + b; });
                var avg = sum / array.length;
                return avg;
            };

            var prices = data["quote"];
            var notes = data["frequency_sequence"].map(function(obj) {
                return obj.pitch;
            });

            var averagePrice = average(prices);
            console.log("avgprice:", averagePrice);

            var averageNote = average(notes);
            console.log("avgnote:", averageNote);

            if (averagePrice > averageNote) {
                var multiplier = averagePrice/averageNote;
                for (var i = 0; i < notes.length; i++) {
                    notes[i] *= multiplier;
                };
            } else {
                var multiplier = averageNote/averagePrice;
                for (var i = 0; i < prices.length; i++) {
                    prices[i] *= multiplier;
                };
            };

            console.log("data:", data);
            console.log("prices:", prices);
            console.log("notes:", notes);

            var datuh = {
                labels: notes,
                datasets: [
                    {
                        label: "My first dataset",
                        fillColor: "rgba(255, 255, 0, .3)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: prices
                    },
                    {
                        label: "My other dataset",
                        fillColor: "rgba(102, 255, 255, .3)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: notes
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            Chart.defaults.global.onAnimationComplete = function() {
                startD3(data, speed);
            };
            // console.log(Chart.defaults.global)
            new Chart(ctx).Line(datuh, {
                scaleShowGridLines : false,
                // scaleBeginAtZero : false,
                scaleGridLineColor : "steelblue",
                scaleGridLineWidth : 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                bezierCurve : true,
                bezierCurveTension : .4,
                pointDot : true,
                pointDotRadius : 5,
                pointDotStrokeWidth : 1,
                pointHitDetectionRadius : 20,
                datasetStrokeWidth : 2,
                offsetGridLines : false,
            });
        });
        $(this).children("input[name]").val("");
    });
    $("#start").on("click", function() {
        userSynth.play();
    });
    $("#pitch_up").on("click", function() {
        if (scaleCounter == 6) {
            scaleCounter = -1
        };
        scaleCounter += 1;
        scaleCounter = Math.abs(scaleCounter);
        userSynth.set("user.freq", major[scaleCounter % major.length]/4);
    });
    $("#pitch_down").on("click", function() {
        if (scaleCounter == 0) {
            scaleCounter = 7
        };
        scaleCounter -= 1;
        scaleCounter = Math.abs(scaleCounter);
        userSynth.set("user.freq", major[scaleCounter % major.length]/4);
    });
    $("#shut_up").on("click", function() {
        userSynth.pause()
    });
});
