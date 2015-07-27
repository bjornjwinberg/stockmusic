$(document).ready(function() {

    var major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883, 523.251];
    var note = 0;

    mySynth = myStuff.create();

    $("#start").on("click", function() {
        myStuff.play()
    });

    $("#pitch_up").on("click", function() {
        note+=1;
        note = Math.abs(note);
        var freq = mySynth.get("carrier.freq");
        console.log("freq________", freq)
        console.log(note)
        mySynth.set("carrier.freq", major[note%major.length]);
    });

    $("#pitch_down").on("click", function() {
        note-=1;
        note = Math.abs(note);
        var freq = mySynth.get("carrier.freq");
        console.log("freq________", freq)
        console.log(note)
        mySynth.set("carrier.freq", major[note%major.length]);
    });

    $("#shut_up").on("click", function() {
        myStuff.stop()
    });

});
