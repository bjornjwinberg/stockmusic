$(document).ready(function() {

    var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
    var counter = 0;
    var mySynth = myStuff.create();

    var dummyData = [100, 200, 50, 75, 150, 75, 7.5, 15, 30, 60, 120, 150, 160, 80];
    var increases = [];
    var decreases = [];

    $("#start").on("click", function() {
        myStuff.play()
    });

    $("#shut_up").on("click", function() {
        myStuff.stop()
    });

    for (var i = 0; i < dummyData.length; i++) {
        var currentValue = [];
        var nextValue = [];
        currentValue.push(dummyData[i]);
        nextValue.push(dummyData[i+1]);

        if (isNaN(nextValue[0])) {
            break
        }
        if (currentValue[0] < nextValue[0]) {
            var positiveChange = (nextValue[0] - currentValue[0]) / currentValue[0] * 100;
            increases.push(positiveChange);
            console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent increase:", positiveChange);

            if (counter == 6) {
                counter = -1
            };
            counter += 1;
            counter = Math.abs(counter);
            mySynth.set("carrier.freq", major[counter % major.length]);
            var freq = mySynth.get("carrier.freq");
            console.log("freq after up button________", freq, "counter after up button________", counter)

        } else {
            var negativeChange = (currentValue[0] - nextValue[0]) / currentValue[0] * 100;
            decreases.push(negativeChange);
            console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent decrease:", negativeChange);

            if (counter == 0) {
                counter = 7
            };
            counter -= 1;
            counter = Math.abs(counter);
            mySynth.set("carrier.freq", major[counter % major.length]);
            var freq = mySynth.get("carrier.freq");
            console.log("freq after down button________", freq, "counter after down button________", counter);
        };
    };
});

// $(document).ready(function() {

//     var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883];
//     var counter = 0;
//     var mySynth = myStuff.create();

//     $("#start").on("click", function() {
//         myStuff.play()
//     });
//     $("#pitch_up").on("click", function() {
//         if (counter == 6) {
//             counter = -1
//         };
//         counter += 1;
//         counter = Math.abs(counter);
//         mySynth.set("carrier.freq", major[counter % major.length]);
//         var freq = mySynth.get("carrier.freq");
//         console.log("freq after up button________", freq, "counter after up button________", counter)
//     });
//     $("#pitch_down").on("click", function() {
//         if (counter == 0) {
//             counter = 7
//         };
//         counter -= 1;
//         counter = Math.abs(counter);
//         mySynth.set("carrier.freq", major[counter % major.length]);
//         var freq = mySynth.get("carrier.freq");
//         console.log("freq after down button________", freq, "counter after down button________", counter)
//     });
//     $("#shut_up").on("click", function() {
//         myStuff.stop()
//     });
// });
