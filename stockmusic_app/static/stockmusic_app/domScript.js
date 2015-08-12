"use strict"

// var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
// var scaleCounter = 0;

function startD3(data, speed, positiveThreshold, negativeThreshold) {
    var instrument;

    if (data["instrument"] == "castlevania") {
        instrument = window.synths.castlevania
    } else if (data["instrument"] == "wobbly") {
        instrument = window.synths.wobbly
    };
    console.log(data["quote"])
    var minness = d3.min(data["quote"],function(d){return d["Adj_Close"];});
    var maxness = d3.max(data["quote"],function(d){return d["Adj_Close"];});
    console.log(minness, maxness);
    var longness = data["quote"].length;

    var worker = new Worker('/static/stockmusic_app/task.js');

    $("#stop_worker").on("click", function() {
        myStuff.stop();
        chartSynth.pause();
        worker.terminate();
        dataGrapher(data["frequency_sequence"], minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, data["quote"], chartSynth);
        $("#price_display").html("");
    });

    var currentMood = "normal";
    var chartColor = "white";
    var priceDisplay = 0;

    var chartSynth = myStuff.create(instrument);
    // chartSynth.play();
    var positiveSynth = myStuff.create(window.synths.positiveThreshold);
    // positiveSynth.pause();
    var negativeSynth = myStuff.create(window.synths.negativeThreshold);
    // negativeSynth.pause();

    var positiveThresholdMet = false;
    var positiveThresholdPrice;
    var positiveThresholdIndex;

    var negativeThresholdMet = false;
    var negativeThresholdPrice;
    var negativeThresholdIndex;

    // myStuff.start();
    worker.addEventListener('message', function(e) {
        chartSynth.play();

        // myStuff.start();

        var chordData = data['frequency_sequence'][e.data[0]]

        if (chordData.mood != currentMood) {
            if (chordData.mood == "happy") {
                chartColor = "rgba(0,255,0,0.3)"
            } else if (chordData.mood == "sad") {
                chartColor = "rgba(255,0,0,0.3)"
            } else {
                chartColor = "white"
            }
            currentMood = chordData.mood
        };

        // console.log("datuhh", typeof e.data);
        // console.log("chordData", typeof chordData.price, chordData.price);
        // console.log("data['quote']", typeof data["quote"][0], data["quote"][0]);
        // console.log("perceeeent", (chordData.price - data["quote"][0]) / data["quote"][0] * 100);


        if (!positiveThresholdMet && (chordData.price - data["quote"][0]["Adj_Close"]) / data["quote"][0]["Adj_Close"]*100 >= positiveThreshold) {
            positiveThresholdMet = true;
            positiveThresholdPrice = chordData.price;
            positiveThresholdIndex = e.data[0];
            // console.log("exceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeded");
            positiveSynth.play();
            setTimeout(function() {
                positiveSynth.pause();
                }, 2000);
            };

        if (!negativeThresholdMet && (chordData.price - data["quote"][0]["Adj_Close"]) / data["quote"][0]["Adj_Close"]*100 <= negativeThreshold) {
            negativeThresholdMet = true;
            negativeThresholdPrice = chordData.price;
            negativeThresholdIndex = e.data[0];
            // console.log("exceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeded");
            negativeSynth.play();
            setTimeout(function() {
                negativeSynth.pause();
                }, 2000);
            };

        // priceDisplay = chordData.price;

        $("#price_display > h1").html(chordData.price);
        $("#date_display > h1").html(data["quote"][e.data[0]]["Date"]);
        $("#volume_display > h1").html(data["quote"][e.data[0]]["Volume"]);
        // $("#volume_display").html(dataQuote[chordIdx]["Volume"]);
        // console.log(chordData)
        chartSynth.set({
            "left.freq": chordData.pitch,
            "right.freq": chordData.harmony
        });
        dataGrapher(data["frequency_sequence"].slice(0, e.data[0]+1), minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, data["quote"]);
        // dataGrapher(data["quote"].slice(0, e.data[0]+2), minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice);

        if(e.data[0]+1 == longness) {
            setTimeout(function() {
                chartSynth.pause();
            }, 1000);
        };

    }, false);

    // dataGrapher(data["quote"].slice(0, 1), minness, maxness, longness, chartColor);
    worker.postMessage([longness, speed]);
    // worker.postMessage([data["frequency_sequence"], speed]);

};

function dataGrapher(data, minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, dataQuote, chartSynth) {
    $("#lineBackground").empty();

    var svg = d3.select("#lineBackground")
      .append("svg")
      .attr("width", 1100)
      .attr("height", 310)
      .attr("id", "visualization");

    var x = d3.scale.linear().domain([0, longness]).range([10, 1050]);
    var y = d3.scale.linear().domain([maxness, minness]).range([10, 300]);
    var line = d3.svg.line()
      .interpolate("monotone")
      .x(function(d,i) {return x(i);})
      .y(function(d) {
        return y(d.price);});

    var path = svg.append('path')
      .attr('class', 'line')
      .attr('d', line(data))
      .style('fill', chartColor)
      .style('stroke', 'steelblue')
      .style('pointer-events', 'none')
      .style('stroke-width', '5');

    if (chartSynth){
        var marker = svg.append('circle')
          .attr('r', 5)
          .style('display', 'none')
          .style('fill', '#FFFFFF')
          .style('pointer-events', 'none')
          .style('stroke', '#FB5050')
          .style('stroke-width', '3px');

        var node = path.node(),
          points = [];
        for (var i = 0; i < node.getTotalLength(); i++) {
          points.push(node.getPointAtLength(i));
        }

        var bisect = d3.bisector(function(datum) {
          return datum.x;
        }).right;
        console.log("svg", svg);
        svg.on('mouseover', function() {
          marker.style('display', 'inherit');
        }).on('mouseout', function() {
            chartSynth.pause();
          marker.style('display', 'none');
        }).on('mousemove', function() {
            var mouse = d3.mouse(this),
            index = bisect(points, mouse[0]);
            if (index < points.length) {
                var point = points[index];
                marker.attr('cx', point.x);
                marker.attr('cy', point.y);
                var chordIdx = parseInt(x.invert(point.x)+0.1);
                console.log(x.invert(point.x));
                console.log(chordIdx);
                $("#price_display").html(data[chordIdx].price);
                $("#date_display").html(dataQuote[chordIdx]["Date"]);
                $("#volume_display").html(dataQuote[chordIdx]["Volume"]);
                chartSynth.set({
                    "left.freq": data[chordIdx].pitch,
                    "right.freq": data[chordIdx].harmony
                });

                // if (data[chordIdx].price < positiveThresholdPrice) {
                //     chartColor = "white"
                // } else if (data[chordIdx].price > positiveThresholdPrice)

                // chartColor = "rgba(0,255,0,0.3)"
                // } else if (chordData.mood == "sad") {
                // chartColor = "rgba(255,0,0,0.3)"
                // white

                chartSynth.play()
            }
        });
    }

    if (positiveThresholdMet) {
        d3.select("svg").append("circle")
            .attr("r", 10)
            .attr("cx", x(positiveThresholdIndex))
            .attr("cy", y(positiveThresholdPrice))
            .style("fill", "green")
            .style("stroke", "blue")
            .style("stroke-width", "2px");
    };

    if (negativeThresholdMet) {
        d3.select("svg").append("circle")
            .attr("r", 10)
            .attr("cx", x(negativeThresholdIndex))
            .attr("cy", y(negativeThresholdPrice))
            .style("fill", "red")
            .style("stroke", "black")
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

    var template = $("#welcome2").html();
    var rendered = Mustache.render(template, "hi");
    $("#welcome").html(rendered);
    $("#welcome").fadeOut(4000);

    var userSynth = myStuff.create (
        window.synths.user
    );

    userSynth.pause();

    $("#stock_form").on("submit", function() {
        event.preventDefault();
        $("#fuckup").empty();

        var speed = Number($('select[name="tempo"]').val());
        var lookback = Number($('input[name="lookback"]').val());
        var positiveThreshold = Number($('input[name="positive-threshold"]').val());
        var negativeThreshold = Number($('input[name="negative-threshold"]').val());
        var formData = $(this).serialize();

        $.get($(this).attr("action"), formData, function(data) {
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

            var prices = data["quote"].map(function(price) {
                return price.Adj_Close;
            });;
            var d = data["frequency_sequence"].map(function(obj) {
                return obj.pitch;
            });

            // var averagePrice = average(prices);
            // var averageNote = average(d);

            // if (averagePrice > averageNote) {
            //     var multiplier = averagePrice/averageNote;
            //     for (var i = 0; i < d.length; i++) {
            //         d[i] *= multiplier;
            //     };
            // } else {
            //     var multiplier = averageNote/averagePrice;
            //     for (var i = 0; i < prices.length; i++) {
            //         prices[i] *= multiplier;
            //     };
            // };

            // console.log("data:", data);
            // console.log("prices:", prices);
            // console.log("d:", d);

            var datuh = {
                labels: d, prices,
                datasets: [
                    {
                        label: "My first dataset",
                        fillColor: "rgba(255, 255, 0, .3)",
                        strokeColor: "rgba(220,220,220,1)",
                        // pointColor: "rgba(220,220,220,1)",
                        // pointStrokeColor: "#fff",
                        // pointHighlightFill: "#fff",
                        // pointHighlightStroke: "rgba(220,220,220,1)",
                        data: prices
                    },
                    {
                        label: "My other dataset",
                        fillColor: "rgba(102, 255, 255, .3)",
                        strokeColor: "rgba(220,220,220,1)",
                        // pointColor: "rgba(220,220,220,1)",
                        // pointStrokeColor: "#fff",
                        // pointHighlightFill: "#fff",
                        // pointHighlightStroke: "rgba(220,220,220,1)",
                        data: d
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            Chart.defaults.global.onAnimationComplete = function() {

                startD3(data, speed, positiveThreshold, negativeThreshold);

            };
            // console.log(Chart.defaults.global)
            new Chart(ctx).Line(datuh, {
                scaleShowGridLines : true,
                // scaleBeginAtZero : false,
                scaleGridLineColor : "steelblue",
                scaleGridLineWidth : 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                bezierCurve : false,
                // bezierCurveTension : .4,
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
