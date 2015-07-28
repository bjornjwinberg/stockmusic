
var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
var scaleCounter = 0;
var mySynth = myStuff.create();

var increases = [];
var decreases = [];

function foo(dummyData, tempo) {
    var dataCounter = 0;
    var octave = 1
    var id = setInterval(function() {
        myStuff.play();

        var currentValue = [];
        var nextValue = [];
        currentValue.push(dummyData[dataCounter]);
        nextValue.push(dummyData[dataCounter+1]);

        if (isNaN(nextValue[0])) {
            $("body").trigger("dun",[id]);
            console.log("idddd", id)
        } else {

            if (currentValue[0] < nextValue[0]) {
                var positiveChange = (nextValue[0] - currentValue[0]) / currentValue[0] * 100;
                increases.push(positiveChange);
                console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent increase:", positiveChange);

                if (scaleCounter == 6) {
                    scaleCounter = -1;
                    if (octave == 0.5){
                        octave = 1
                    } else {
                        octave += 1
                    }
                };

                scaleCounter += 1;
                dataCounter += 1;
                scaleCounter = Math.abs(scaleCounter);
                mySynth.set("carrier.freq", octave * major[scaleCounter % major.length]);
                var freq = mySynth.get("carrier.freq");
                console.log("freq after up button:", freq, "scaleCounter after up button:", scaleCounter, "dataCounter after up:", dataCounter)

            } else {
                var negativeChange = (currentValue[0] - nextValue[0]) / currentValue[0] * 100;
                decreases.push(negativeChange);
                console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent decrease:", negativeChange);

                if (scaleCounter == 0) {
                    scaleCounter = 7;
                    if (octave > 1){
                        octave -= 1;
                    }else{
                        octave = 0.5;
                    }
                };

                scaleCounter -= 1;
                dataCounter += 1;
                scaleCounter = Math.abs(scaleCounter);
                mySynth.set("carrier.freq", octave * major[scaleCounter % major.length]);
                var freq = mySynth.get("carrier.freq");
                console.log("freq after down button________", freq, "scaleCounter after down button________", scaleCounter);
            };
        }
    }, tempo);
};

$(document).ready(function() {
    var dummyData = [100, 95, 90, 80, 200, 50, 75, 150, 75, 7.5, 15, 30, 60, 120, 150, 160, 150, 140, 80, 70, 60, 50, 49, 48, 44, 43, 41, 35, 33, 31, 14];

    $("body").on("dun", function(event, killInter){
        window.clearInterval(killInter);
        myStuff.stop()
        console.log("killed yo")
        console.log(killInter)
    });

    $("#stock_form").on("submit", function() {
        event.preventDefault();
        var datuh = $(this).serialize();
        console.log("datah:", datuh)
        $.get($(this).attr("action"), datuh, function(data) {
            console.log(data)
            foo(data["quote"], 100);
        })
    });

    $("#start").on("click", function() {
        foo(dummyData, 100);
    });
    $("#pitch_up").on("click", function() {
        if (scaleCounter == 6) {
            scaleCounter = -1
        };
        scaleCounter += 1;
        scaleCounter = Math.abs(scaleCounter);
        mySynth.set("carrier.freq", major[scaleCounter % major.length]);
        var freq = mySynth.get("carrier.freq");
        console.log("freq after up button________", freq, "scaleCounter after up button________", scaleCounter)
    });
    $("#pitch_down").on("click", function() { // make these functions that take scalecounter as an arg. every time set interval runs, de/increment stuff
        if (scaleCounter == 0) {
            scaleCounter = 7
        };
        scaleCounter -= 1;
        scaleCounter = Math.abs(scaleCounter);
        mySynth.set("carrier.freq", major[scaleCounter % major.length]);
        var freq = mySynth.get("carrier.freq");
        console.log("freq after down button________", freq, "scaleCounter after down button________", scaleCounter)
    });
    $("#shut_up").on("click", function() {
        myStuff.stop()
    });
});


