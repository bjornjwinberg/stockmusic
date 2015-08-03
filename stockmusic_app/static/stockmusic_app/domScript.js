"use strict"

var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
var scaleCounter = 0;
var mySynth = myStuff.create();
var upDays = [];
var downDays = [];


function dataGrapher(data, minness, maxness, longness, chartColor) {
    console.log(chartColor);
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

    $("body").on("finished", function(event, killInterval){
        window.clearInterval(killInterval);
        myStuff.stop()
    });

    $("#stock_form").on("submit", function() {
        event.preventDefault();
        var speed = Number($(this).children('input[name="tempo"]').val());
        var formData = $(this).serialize();

        $.get($(this).attr("action"), formData, function(data) {
            var minness = Math.min.apply(null, data["quote"]);
            var maxness = Math.max.apply(null, data["quote"]);
            var longness = data["quote"].length

            var worker = new Worker('/static/stockmusic_app/task.js');
            var currentMood = "normal"
            var chartColor = "white"

            worker.addEventListener('message', function(e) {
                myStuff.play();
                console.log("mooooood",currentMood)
                if (e.data[0][0] != currentMood) {
                    if (e.data[0][0] == "happy") {
                        chartColor = "green"
                        console.log("should be green", chartColor)
                    } else if (e.data[0][0] == "sad") {
                        chartColor = "red"
                        console.log("should be red", chartColor)
                    } else {
                        chartColor = "white"
                    }
                    currentMood = e.data[0][0]
                };
                mySynth.set("carrier.freq", e.data[0][1]);
                dataGrapher(data["quote"].slice(0, e.data[1]+2), minness, maxness, longness, chartColor);
                // chartColor = "white"
                if(e.data[1]+2 == longness) {
                    setTimeout(function() {
                        myStuff.stop();
                    }, 1000);
                };
            }, false);
            dataGrapher(data["quote"].slice(0, 1), minness, maxness, longness);
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






// everything below is older code that worked
// "use strict"

// var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
// var scaleCounter = 0;
// var mySynth = myStuff.create();
// var upDays = [];
// var downDays = [];

// function dataPlayer(data, tempo) {
//     var dataCounter = 0;
//     var octave = 1
//     var id = setInterval(function() {
//         myStuff.play();

//         var currentValue = [];
//         var nextValue = [];
//         currentValue.push(data[dataCounter]);
//         nextValue.push(data[dataCounter+1]);

//         if (isNaN(nextValue[0])) {
//             $("body").trigger("finished", [id]);
//             console.log("id is:", id)

//         } else {

//             if (currentValue[0] < nextValue[0]) {
//                 var positiveChange = (nextValue[0] - currentValue[0]) / currentValue[0] * 100;
//                 upDays.push(positiveChange);
//                  console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent increase:", positiveChange);

//                 if (scaleCounter == 6) {
//                     scaleCounter = -1;
//                     if (octave == 0.5) {
//                         octave = 1
//                     } else {
//                         octave += 1
//                     }
//                 };

//                 scaleCounter += 1;
//                 dataCounter += 1;
//                 scaleCounter = Math.abs(scaleCounter);
//                 mySynth.set("carrier.freq", octave * major[scaleCounter % major.length]);
//                 var freq = mySynth.get("carrier.freq");
//                 console.log("freq after up button:", freq, "scaleCounter after up button:", scaleCounter, "dataCounter after up:", dataCounter)

//             } else {

//                 var negativeChange = (currentValue[0] - nextValue[0]) / currentValue[0] * 100;
//                 downDays.push(negativeChange);
//                 console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent decrease:", negativeChange);

//                 if (scaleCounter == 0) {
//                     scaleCounter = 7;
//                     if (octave > 1){
//                         octave -= 1;
//                     }else{
//                         octave = 0.5;
//                     }
//                 };

//                 scaleCounter -= 1;
//                 dataCounter += 1;
//                 scaleCounter = Math.abs(scaleCounter);
//                 mySynth.set("carrier.freq", octave * major[scaleCounter % major.length]);
//                 var freq = mySynth.get("carrier.freq");
//                 console.log("freq after down button________", freq, "scaleCounter after down button________", scaleCounter);
//             };
//         }
//     }, tempo);
// };

// function dataGrapher(data) {

//     var svg = d3.select("#lineBackground")
//       .append("svg")
//       .attr("width", 1200)
//       .attr("height", 1200)
//       .attr("id", "visualization");

    // var max = Math.max.apply(null, data);
//     var height = max + 10;
//     var width = data.length;
//     var x = d3.scale.linear().domain([0, width]).range([0, 1100]);
//     var y = d3.scale.linear().domain([height, 0]).range([0, 1100]);
//     var line = d3.svg.line()
//       .interpolate("linear")
//       .x(function(d,i) {return x(i);})
//       .y(function(d) {return y(d);});

//     var path = svg.append("path")
//       .attr("d", line(data))
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", "5")
//       .attr("fill", "white");

//     var totalLength = path.node().getTotalLength();

//     path
//       .attr("stroke-dasharray", totalLength + " " + totalLength)
//       .attr("stroke-dashoffset", totalLength)
//       .transition()
//         .duration(5000)
//         .ease("linear")
//         .attr("stroke-dashoffset", 0);

//     svg.on("click", function() {
//       path
//         .transition()
//         .duration(2000)
//         .ease("linear")
//         .attr("stroke-dashoffset", totalLength);
//     })
// };

// $(document).ready(function() {

//     $("body").on("finished", function(event, killInterval){
//         window.clearInterval(killInterval);
//         myStuff.stop()
//         console.log("interval killed, yo:", killInterval)
//     });

//     $("#stock_form").on("submit", function() {
//         event.preventDefault();

//         var speed = $(this).children('input[name="tempo"]').val();
//         console.log("speed:", speed)

//         var formData = $(this).serialize();
//         console.log("form data:", formData);

//         $.get($(this).attr("action"), formData, function(data) {

//             var worker = new Worker('/static/stockmusic_app/task.js');

//             worker.addEventListener('message', function(e) {
//                 console.log('received from worker: ' + e.data);
//             }, false);

//             worker.postMessage([data["frequency_sequence"], speed]);

//             // dataPlayer(data["quote"], speed);
//             // dataGrapher(data["quote"]);
//         });
//         $(this).children("input[name]").val("");
//     });
//     $("#start").on("click", function() {
//         myStuff.play();
//     });
//     $("#pitch_up").on("click", function() {
//         if (scaleCounter == 6) {
//             scaleCounter = -1
//         };
//         scaleCounter += 1;
//         scaleCounter = Math.abs(scaleCounter);
//         mySynth.set("carrier.freq", major[scaleCounter % major.length]);
//         var freq = mySynth.get("carrier.freq");
//         console.log("freq after up button________", freq, "scaleCounter after up button________", scaleCounter)
//     });
//     $("#pitch_down").on("click", function() {
//         if (scaleCounter == 0) {
//             scaleCounter = 7
//         };
//         scaleCounter -= 1;
//         scaleCounter = Math.abs(scaleCounter);
//         mySynth.set("carrier.freq", major[scaleCounter % major.length]);
//         var freq = mySynth.get("carrier.freq");
//         console.log("freq after down button________", freq, "scaleCounter after down button________", scaleCounter)
//     });
//     $("#shut_up").on("click", function() {
//         myStuff.stop()
//     });
// });

// http://bl.ocks.org/duopixel/4063326 (chart you modified)
