"use strict"
function playSynth(synth) {
    var checked = $("select[name = 'alarm_mode']").val();
    if (checked == "synthOn") {
        synth.play()
    };
};
function startD3(data, speed, positiveThreshold, negativeThreshold) {
    var instrument;
    if (data["instrument"] == "nintendo") {
        instrument = window.synths.nintendo
    } else if (data["instrument"] == "wobbly") {
        instrument = window.synths.wobbly
    } else if (data["instrument"] == "rotator") {
        instrument = window.synths.rotator
    } else if (data["instrument"] == "sine") {
        instrument = window.synths.sine
    };
    var minness = d3.min(data["quote"],function(d){return d["Adj_Close"];});
    var maxness = d3.max(data["quote"],function(d){return d["Adj_Close"];});
    var longness = data["quote"].length;
    var worker = new Worker('/static/stockmusic_app/task.js');
    $("#stop_worker").on("click", function() {
        myStuff.stop();
        chartSynth.pause();
        worker.terminate();
        dataGrapher(data["frequency_sequence"], minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, data["quote"], chartSynth);
        $("#stop_worker").hide(300);
        $("#funButtons").show(300);
    });
    $("#start_worker").on("click", function() {
        $("#shut_up").trigger("click");
        dataGrapher(data["frequency_sequence"], minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, data["quote"]);
        $("#funButtons").hide(300);
    });
    var currentMood = "normal";
    var chartColor = "rgba(0,0,255,0)";
    var priceDisplay = 0;
    var chartSynth = myStuff.create(instrument);
    $("#mute").on("click", function() {
        $("select[name = 'alarm_mode']").val("synthOff");
    });
    $("#resume").on("click", function() {
        $("select[name = 'alarm_mode']").val("synthOn");
    });
    var positiveSynth = myStuff.create(window.synths.positiveThreshold);
    var negativeSynth = myStuff.create(window.synths.negativeThreshold);
    var positiveThresholdMet = false;
    var positiveThresholdPrice;
    var positiveThresholdIndex;
    var negativeThresholdMet = false;
    var negativeThresholdPrice;
    var negativeThresholdIndex;
    worker.addEventListener('message', function(e) {
        playSynth(chartSynth);
        var chordData = data['frequency_sequence'][e.data[0]];
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
        if (!positiveThresholdMet && (chordData.price - data["quote"][0]["Adj_Close"]) / data["quote"][0]["Adj_Close"]*100 >= positiveThreshold) {
            positiveThresholdMet = true;
            positiveThresholdPrice = chordData.price;
            positiveThresholdIndex = e.data[0];
            positiveSynth.play();
            setTimeout(function() {
                positiveSynth.pause();
                }, 2000);
            };
        if (!negativeThresholdMet && (chordData.price - data["quote"][0]["Adj_Close"]) / data["quote"][0]["Adj_Close"]*100 <= negativeThreshold) {
            negativeThresholdMet = true;
            negativeThresholdPrice = chordData.price;
            negativeThresholdIndex = e.data[0];
            negativeSynth.play();
            setTimeout(function() {
                negativeSynth.pause();
                }, 2000);
            };
        $("#price_display > h1").html(chordData.price);
        $("#date_display > h1").html(data["quote"][e.data[0]]["Date"]);
        $("#volume_display > h1").html(data["quote"][e.data[0]]["Volume"]);
        chartSynth.set({
            "left.freq": chordData.pitch,
            "right.freq": chordData.harmony
        });
        dataGrapher(data["frequency_sequence"].slice(0, e.data[0]+1), minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, data["quote"]);
        if(e.data[0]+1 == longness) {
            setTimeout(function() {
                chartSynth.pause();
            }, 1000);
        };
    }, false);
    worker.postMessage([longness, speed]);
};
function dataGrapher(data, minness, maxness, longness, chartColor, positiveThresholdMet, positiveThresholdIndex, positiveThresholdPrice, negativeThresholdMet, negativeThresholdIndex, negativeThresholdPrice, dataQuote, chartSynth) {
    $("#lineBackground").empty();
    var svg = d3.select("#lineBackground")
      .append("svg")
      .attr("width", 1140)
      .attr("height", 310)
      .attr("id", "visualization");
    var x = d3.scale.linear().domain([0, longness-1]).range([10, 1130]);
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
    if (chartSynth) {
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
        };
        var bisect = d3.bisector(function(datum) {
          return datum.x;
        }).right;
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
                $("#price_display > h1").html(data[chordIdx].price);
                $("#date_display > h1").html(dataQuote[chordIdx]["Date"]);
                $("#volume_display > h1").html(dataQuote[chordIdx]["Volume"]);
                chartSynth.set({
                    "left.freq": data[chordIdx].pitch,
                    "right.freq": data[chordIdx].harmony
                });
                playSynth(chartSynth);
            }
        });
    };
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
};
$(document).ready(function() {
    var newChart;
    var template = $("#welcome2").html();
    var rendered = Mustache.render(template);
    $("#welcome").html(rendered);
    $("#welcome").fadeOut(5000);
    var userSynth = myStuff.create (
        window.synths.user
    );
    userSynth.pause();
    $("#stock_form").on("submit", function() {
        event.preventDefault();
        if (newChart) {
            newChart.destroy()
        };
        $("#fuckup").empty();
        var ticker = $('select[name="company"]').val().toUpperCase();
        console.log(ticker, typeof ticker);
        var speed = Number($('select[name="tempo"]').val());
        var duration = Number($('select[name="duration"]').val());
        var lookback = Number($('input[name="lookback"]').val());
        var positiveThreshold = Number($('input[name="positive-threshold"]').val());
        var negativeThreshold = Number($('input[name="negative-threshold"]').val());
        var formData = $(this).serialize();
        $.get($(this).attr("action"), formData, function(data) {
            if (data.error) {
                $("#fuckup").fadeIn(300);
                var template = $("#fuckup2").html();
                var rendered = Mustache.render(template, data);
                $("#fuckup").html(rendered);
                $("#fuckup").fadeOut(3000);
                return
            };
            $("#hiddenThingy").show(1000);
            $("#stop_worker").show(300);
            $("#ticker").html(ticker);
            var prices = data["quote"].map(function(price) {
                return price.Adj_Close;
            });;
            var d = data["frequency_sequence"].map(function(obj) {
                return obj.pitch.toFixed(3);
            });
            var datuh = {
                labels: prices,
                datasets: [
                    {
                        label: "Dataset",
                        fillColor: "rgba(0, 0, 255, .3)",
                        strokeColor: "green",
                        data: d
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            Chart.defaults.global.onAnimationComplete = function() {
                startD3(data, speed, positiveThreshold, negativeThreshold);
            };
            var options = {
                scaleShowGridLines : true,
                scaleBeginAtZero : true,
                scaleGridLineColor : "steelblue",
                scaleGridLineWidth : 0.8,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: false,
                bezierCurve : false,
                pointDot : false,
                pointHitDetectionRadius : 0,
                pointDotRadius : 0,
                pointDotStrokeWidth : 0,
                pointHitDetectionRadius : 0,
                datasetStrokeWidth : 0,
                offsetGridLines : false,
            };

            if (duration < 92) {
                newChart = new Chart(ctx).Bar(datuh, options);
            } else {
                newChart = new Chart(ctx).Line(datuh, options);
            };
        });
        $(this).children("input[name]").val("");
    });
    $("#start").on("click", function() {
        userSynth.play();
    });
    $("#shut_up").on("click", function() {
        userSynth.pause()
    });
});
