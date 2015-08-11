"use strict"

var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
var scaleCounter = 0;

function startD3(data, speed, threshold) {
    var instrument;

    if (data["instrument"] == "castlevania") {
        instrument = window.synths.castlevania
    } else if (data["instrument"] == "r2d2") {
        instrument = window.synths.r2d2
    };

    var minness = Math.min.apply(null, data["quote"]);
    var maxness = Math.max.apply(null, data["quote"]);
    var longness = data["quote"].length;

    var worker = new Worker('/static/stockmusic_app/task.js');
    var currentMood = "normal";
    var chartColor = "white";
    var priceDisplay = 0;

    var chartSynth = myStuff.create(instrument);
    var thresholdSynth = myStuff.create(window.synths.threshold);
    thresholdSynth.pause();
    var thresholdMet = false;

    var thresholdPrice;
    var thresholdIndex;

    worker.addEventListener('message', function(e) {

        myStuff.play();

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

        // console.log("datuhh", typeof e.data);
        // console.log("e.data[0]", typeof e.data[0].price, e.data[0].price);
        // console.log("data['quote']", typeof data["quote"][0], data["quote"][0]);
        // console.log("perceeeent", (e.data[0].price - data["quote"][0]) / data["quote"][0] * 100);

        if (!thresholdMet && (e.data[0].price - data["quote"][0]) / data["quote"][0] >= threshold/100) {
            thresholdMet = true;
            thresholdPrice = e.data[0].price;
            thresholdIndex = e.data[1];
            // console.log("exceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeded");
            thresholdSynth.play();
            setTimeout(function() {
                thresholdSynth.pause();
                }, 1000);
            };

        priceDisplay = e.data[0].price;
        $("#price_display").html(priceDisplay);

        chartSynth.set({
            "left.freq": e.data[0].pitch,
            "right.freq": e.data[0].harmony
        });

        dataGrapher(data["quote"].slice(0, e.data[1]+2), minness, maxness, longness, chartColor, thresholdMet, thresholdIndex, thresholdPrice);

        if(e.data[1]+2 == longness) {
            setTimeout(function() {
                chartSynth.pause();
            }, 1000);
        };

    }, false);

    dataGrapher(data["quote"].slice(0, 1), minness, maxness, longness, chartColor);
    worker.postMessage([data["frequency_sequence"], speed]);

};

function dataGrapher(data, minness, maxness, longness, chartColor, thresholdMet, thresholdIndex, thresholdPrice) {
    $("#lineBackground").empty();

    var svg = d3.select("#lineBackground")
      .append("svg")
      .attr("width", 1100)
      .attr("height", 310)
      .attr("id", "visualization");

    var x = d3.scale.linear().domain([0, longness]).range([0, 1100]);
    var y = d3.scale.linear().domain([maxness, minness]).range([10, 300]);
    var line = d3.svg.line()
      .interpolate("monotone")
      .x(function(d,i) {return x(i);})
      .y(function(d) {
        return y(d);});

    var path = svg.append("path")
      .attr("d", line(data))
      .attr("stroke", "steelblue")
      .attr("stroke-width", "5")
      .attr("fill", chartColor);

    if (thresholdMet) {
        d3.select("svg").append("circle")
            .attr("r", 10)
            .attr("cx", x(thresholdIndex))
            .attr("cy", y(thresholdPrice))
            .style("fill", "blue")
            .style("stroke", "red")
            .style("stroke-width", "2px");
    };

    // var temp = data.length - lookback;
    // var line2 = d3.svg.line()
    //   .interpolate("monotone")
    //   .x(function(d,i) {return x(i+temp);})
    //   .y(function(d) {return y(d);});

    // svg.append("path")
    //     .attr("d", line2(data.slice(-lookback)))
    //     .attr("fill", chartColor);
};

$(document).ready(function() {
    setTimeout(function(){ alert("Hover over things to read about what they do!"); }, 500);
    // $("#price_display").animate({"top": "+=200px"}, 1000);
    // $("#threshold_display").animate({"left": "+=600px"}, 1000);

    var userSynth = myStuff.create (
        window.synths.user
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
        var lookback = Number($('input[name="lookback"]').val());
        var threshold = Number($('input[name="threshold"]').val());
        var formData = $(this).serialize();
        alert(""window.location.href + formData);

        // console.log("formdata:", formData);

        $.get($(this).attr("action"), formData, function(data) {
            // console.log(data)
            if (data.error) {
                var template = $("#fuckup2").html();
                var rendered = Mustache.render(template, data);
                $("#fuckup").html(rendered);
                $("#fuckup").fadeOut(3000);
                return
            };

            // function average(array) {
            //     var sum = array.reduce(function(a, b) { return a + b; });
            //     var avg = sum / array.length;
            //     return avg;
            // };

            var prices = data["quote"];
            var notes = data["frequency_sequence"].map(function(obj) {
                return obj.pitch;
            });

            // var averagePrice = average(prices);
            // var averageNote = average(notes);

            // if (averagePrice > averageNote) {
            //     var multiplier = averagePrice/averageNote;
            //     for (var i = 0; i < notes.length; i++) {
            //         notes[i] *= multiplier;
            //     };
            // } else {
            //     var multiplier = averageNote/averagePrice;
            //     for (var i = 0; i < prices.length; i++) {
            //         prices[i] *= multiplier;
            //     };
            // };

            // console.log("data:", data);
            // console.log("prices:", prices);
            // console.log("notes:", notes);

            var datuh = {
                labels: notes, prices,
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

                startD3(data, speed, threshold);

            };
            // console.log(Chart.defaults.global)
            new Chart(ctx).Line(datuh, {
                scaleShowGridLines : false,
                // scaleBeginAtZero : false,
                scaleGridLineColor : "steelblue",
                scaleGridLineWidth : 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                bezierCurve : false,
                bezierCurveTension : .4,
                pointDot : true,
                pointDotRadius : 1,
                pointDotStrokeWidth : 1,
                pointHitDetectionRadius : 1,
                datasetStrokeWidth : 2,
                offsetGridLines : false,
            });
        });
        $(this).children("input[name]").val("");
    });
    $("#start").on("click", function() {
        userSynth.play();
    });
    // $("#pitch_up").on("click", function() {
    //     if (scaleCounter == 6) {
    //         scaleCounter = -1
    //     };
    //     scaleCounter += 1;
    //     scaleCounter = Math.abs(scaleCounter);
    //     userSynth.set("user.freq", major[scaleCounter % major.length]/4);
    // });
    // $("#pitch_down").on("click", function() {
    //     if (scaleCounter == 0) {
    //         scaleCounter = 7
    //     };
    //     scaleCounter -= 1;
    //     scaleCounter = Math.abs(scaleCounter);
    //     userSynth.set("user.freq", major[scaleCounter % major.length]/4);
    // });
    $("#shut_up").on("click", function() {
        userSynth.pause()
    });
});
