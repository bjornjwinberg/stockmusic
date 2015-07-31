(function () {

    "use strict";

    fluid.registerNamespace("myStuff");

    var enviro = flock.init();

    myStuff.create = function() {
        return flock.synth({
            synthDef: {
                id: "carrier",
                ugen: "flock.ugen.tri",
                freq: 261.626,
                mul: .3
            }
        });
    }
    myStuff.play = function () {
        enviro.start();
    };
    myStuff.stop = function () {
        enviro.stop();
    };
}());
