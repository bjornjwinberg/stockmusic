(function () {

    "use strict";

    fluid.registerNamespace("myStuff");

    var enviro = flock.init();

    myStuff.create = function(instrument) {
        return flock.synth({
            synthDef: instrument
        });
    };
    myStuff.play = function () {
        enviro.start();
    };
    myStuff.stop = function () {
        enviro.stop();
    };
}());
